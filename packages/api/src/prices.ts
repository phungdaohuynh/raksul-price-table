import { normalizePaperSize } from "./paper-size";
import type { PaperSize, PricesResponse } from "./types";

export type FetchPricesOptions = {
  paperSize?: PaperSize | string | null;
  endpoint: string;
  fetcher?: typeof fetch;
};

export async function fetchPrices({
  paperSize,
  endpoint,
  fetcher = fetch
}: FetchPricesOptions): Promise<PricesResponse> {
  const url = createUrl(endpoint);
  url.searchParams.set("paper_size", normalizePaperSize(paperSize));

  const response = await fetcher(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch prices: ${response.status}`);
  }

  return response.json() as Promise<PricesResponse>;
}

function createUrl(endpoint: string) {
  if (endpoint.startsWith("/")) {
    return new URL(endpoint, globalThis.location?.origin ?? "http://localhost");
  }

  return new URL(endpoint);
}
