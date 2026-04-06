import { ProgramEntry } from '../types/ProgramEntry';

interface PagedProgramEntryResponse {
  entries: ProgramEntry[];
  totalCount: number;
}

export interface ProgramEntryInput {
  rootbeerName: string;
  firstBrewedYear: string;
  breweryName: string;
  city: string;
  state: string;
  country: string;
  description: string;
  wholesaleCost: number;
  currentRetailPrice: number;
  container: string;
}

const defaultApiBaseUrl =
  'https://angelslanding-backend-bagjg0bvcmgrbybk.centralus-01.azurewebsites.net/';
const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? defaultApiBaseUrl
).replace(/\/+$/, '');

async function readApiError(
  response: Response,
  fallbackMessage: string
): Promise<string> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return fallbackMessage;
  }

  const data = await response.json();

  if (typeof data?.detail === 'string' && data.detail.length > 0) {
    return data.detail;
  }

  if (typeof data?.title === 'string' && data.title.length > 0) {
    return data.title;
  }

  return fallbackMessage;
}

export async function getProgramEntries(
  pageSize: number,
  pageNum: number,
  selectedProgramAreas: string[]
): Promise<PagedProgramEntryResponse> {
  const searchParams = new URLSearchParams({
    pageSize: pageSize.toString(),
    pageNum: pageNum.toString(),
  });

  selectedProgramAreas.forEach((programArea) => {
    searchParams.append('programAreas', programArea);
  });

  const response = await fetch(`${apiBaseUrl}/api/program-entries?${searchParams}`);

  if (!response.ok) {
    throw new Error("Unable to load Angels' Landing entries.");
  }

  return response.json();
}

export async function getProgramAreas(): Promise<string[]> {
  const response = await fetch(`${apiBaseUrl}/api/program-entries/program-areas`);

  if (!response.ok) {
    throw new Error('Unable to load program areas.');
  }

  return response.json();
}

export async function getManagedProgramEntries(): Promise<ProgramEntry[]> {
  const response = await fetch(`${apiBaseUrl}/api/program-entries/admin`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Unable to load admin records.'));
  }

  return response.json();
}

export async function createProgramEntry(
  entry: ProgramEntryInput
): Promise<ProgramEntry> {
  const response = await fetch(`${apiBaseUrl}/api/program-entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, 'Unable to create this record.'));
  }

  return response.json();
}
