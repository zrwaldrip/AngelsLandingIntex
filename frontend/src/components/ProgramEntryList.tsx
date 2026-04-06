import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProgramEntries } from '../lib/programEntryApi';
import { ProgramEntry } from '../types/ProgramEntry';

function ProgramEntryList({
  selectedContainers,
}: {
  selectedContainers: string[];
}) {
  const [entries, setEntries] = useState<ProgramEntry[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getProgramEntries(pageSize, pageNum, selectedContainers);
      setEntries(data.entries);
      setTotalItems(data.totalCount);
    };

    fetchEntries();
  }, [pageSize, pageNum, selectedContainers]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <>
      {entries.map((entry) => (
        <div id="entryCard" className="card" key={entry.rootbeerID}>
          <h2 className="card-title">{entry.rootbeerName}</h2>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Year started:</strong> {entry.firstBrewedYear}
              </li>
              <li className="list-group-item">
                <strong>Partner or provider:</strong> {entry.breweryName}
              </li>
              <li className="list-group-item">
                <strong>Location:</strong> {entry.city}, {entry.state},{' '}
                {entry.country}
              </li>
              <li className="list-group-item">
                <strong>Description:</strong> {entry.description}
              </li>
              <li className="list-group-item">
                <strong>Program investment:</strong> $
                {entry.wholesaleCost.toFixed(2)}
              </li>
              <li className="list-group-item">
                <strong>Suggested contribution:</strong> $
                {entry.currentRetailPrice.toFixed(2)}
              </li>
              <li className="list-group-item">
                <strong>Program area:</strong> {entry.container}
              </li>
            </ul>

            <button
              className="btn btn-secondary"
              onClick={() =>
                navigate(
                  `/product/${entry.rootbeerName}/${entry.rootbeerID}/${entry.currentRetailPrice}`
                )
              }
            >
              View Details
            </button>
          </div>
        </div>
      ))}

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button key={index} onClick={() => setPageNum(index + 1)}>
          {index + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default ProgramEntryList;
