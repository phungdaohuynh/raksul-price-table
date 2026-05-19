import { normalizePaperSize, type PaperSize } from "@raksul-price-table/shared";

export const priceQueryKeys = {
  all: ["prices"] as const,
  list: (paperSize?: PaperSize | string | null) =>
    [...priceQueryKeys.all, normalizePaperSize(paperSize)] as const
};
