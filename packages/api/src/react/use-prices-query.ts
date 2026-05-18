"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPrices } from "../prices";
import { priceQueryKeys } from "../query-keys";
import type { PaperSize } from "../types";

export type UsePricesQueryOptions = {
  paperSize?: PaperSize | string | null;
};

export function usePricesQuery({ paperSize }: UsePricesQueryOptions = {}) {
  return useQuery({
    queryKey: priceQueryKeys.list(paperSize),
    queryFn: () => fetchPrices({ paperSize, endpoint: "/api/prices" }),
    placeholderData: keepPreviousData,
    retry: false
  });
}
