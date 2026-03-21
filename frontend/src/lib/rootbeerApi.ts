import { Rootbeer } from '../types/Rootbeer';

interface PagedRootbeerResponse {
  rootbeers: Rootbeer[];
  totalCount: number;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export async function getRootbeers(
  pageSize: number,
  pageNum: number,
  selectedContainers: string[]
): Promise<PagedRootbeerResponse> {
  const searchParams = new URLSearchParams({
    pageSize: pageSize.toString(),
    pageNum: pageNum.toString(),
  });

  selectedContainers.forEach((container) => {
    searchParams.append('containers', container);
  });

  const response = await fetch(`${apiBaseUrl}/api/rootbeers?${searchParams}`);

  if (!response.ok) {
    throw new Error('Unable to load rootbeers.');
  }

  return response.json();
}

export async function getContainerTypes(): Promise<string[]> {
  const response = await fetch(`${apiBaseUrl}/api/rootbeers/containers`);

  if (!response.ok) {
    throw new Error('Unable to load container types.');
  }

  return response.json();
}
