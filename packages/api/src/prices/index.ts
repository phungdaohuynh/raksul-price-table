import { normalizePaperSize, type PaperSize } from "@raksul-price-table/shared";
import type { PricesResponse } from "../types";

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
