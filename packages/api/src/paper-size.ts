import { PAPER_SIZES, type PaperSize } from "./types";

const DEFAULT_PAPER_SIZE: PaperSize = "A4";

export function normalizePaperSize(value: string | null | undefined): PaperSize {
  const normalized = value?.toUpperCase();

  if (PAPER_SIZES.some((paperSize) => paperSize === normalized)) {
    return normalized as PaperSize;
  }

  return DEFAULT_PAPER_SIZE;
}
