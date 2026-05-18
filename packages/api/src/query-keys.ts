import { normalizePaperSize } from "./paper-size";
import type { PaperSize } from "./types";

export const priceQueryKeys = {
  all: ["prices"] as const,
  list: (paperSize?: PaperSize | string | null) =>
    [...priceQueryKeys.all, normalizePaperSize(paperSize)] as const
};
