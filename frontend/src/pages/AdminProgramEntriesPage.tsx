import { FormEvent, useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import {
  createProgramEntry,
  getManagedProgramEntries,
  type ProgramEntryInput,
} from '../lib/programEntryApi';
import type { ProgramEntry } from '../types/ProgramEntry';

const emptyProgramEntry: ProgramEntryInput = {
  rootbeerName: '',
  firstBrewedYear: '',
  breweryName: '',
  city: '',
  state: '',
  country: '',
  description: '',
  wholesaleCost: 0,
  currentRetailPrice: 0,
  container: '',
};

function AdminProgramEntriesPage() {
  const { authSession, isLoading } = useAuth();
  const isAdmin = authSession.roles.includes('Admin');
  const [entries, setEntries] = useState<ProgramEntry[]>([]);
  const [formState, setFormState] =
    useState<ProgramEntryInput>(emptyProgramEntry);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAdmin) {
      void loadEntries();
    }
  }, [isAdmin, isLoading]);

  async function loadEntries() {
    try {
      const data = await getManagedProgramEntries();
      setEntries(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to load admin data.'
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const createdEntry = await createProgramEntry(formState);
      setEntries((current) => [...current, createdEntry]);
      setFormState(emptyProgramEntry);
      setSuccessMessage(`Created ${createdEntry.rootbeerName} entry.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to create record.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof ProgramEntryInput>(
    key: K,
    value: ProgramEntryInput[K]
  ) {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="container mt-4">
      <Header />
      <div className="row">
        <div className="col-lg-5">
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">Admin Operations Tools</h2>
              <p className="text-muted mb-3">
                Manage Angels' Landing operational records using role-protected
                APIs and secure workflows.
              </p>

              {isLoading ? <p>Checking your role...</p> : null}

              {!isLoading && !isAdmin ? (
                <div className="alert alert-danger" role="alert">
                  You must be in the Admin role to manage these records.
                </div>
              ) : null}

              {!isLoading && isAdmin ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Program entry name</label>
                    <input
                      className="form-control"
                      value={formState.rootbeerName}
                      onChange={(event) =>
                        updateField('rootbeerName', event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Partner or provider name</label>
                    <input
                      className="form-control"
                      value={formState.breweryName}
                      onChange={(event) =>
                        updateField('breweryName', event.target.value)
                      }
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Suggested contribution</label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.01"
                        value={formState.currentRetailPrice}
                        onChange={(event) =>
                          updateField(
                            'currentRetailPrice',
                            Number(event.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Program investment</label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.01"
                        value={formState.wholesaleCost}
                        onChange={(event) =>
                          updateField('wholesaleCost', Number(event.target.value))
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Program area</label>
                    <input
                      className="form-control"
                      value={formState.container}
                      onChange={(event) =>
                        updateField('container', event.target.value)
                      }
                    />
                  </div>
                  {errorMessage ? (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  ) : null}
                  {successMessage ? (
                    <div className="alert alert-success" role="alert">
                      {successMessage}
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Add entry'}
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">Managed Operations View</h2>
              <p className="text-muted mb-3">
                Admin users can review current entries and create new records
                for Angels' Landing operations.
              </p>
              <ul className="list-group">
                {entries.map((entry) => (
                  <li
                    key={entry.rootbeerID}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <strong>{entry.rootbeerName}</strong>
                      {entry.breweryName ? ` by ${entry.breweryName}` : ''}
                    </span>
                    <span>
                      {entry.container || 'Unknown program area'} | ${' '}
                      {entry.currentRetailPrice.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProgramEntriesPage;
