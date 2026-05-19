export const PAPER_SIZES = ["A4", "A5", "B4", "B5"] as const;

export type PaperSize = (typeof PAPER_SIZES)[number];

const DEFAULT_PAPER_SIZE: PaperSize = "A4";

export function normalizePaperSize(value: string | null | undefined): PaperSize {
  const normalized = value?.toUpperCase();

  if (PAPER_SIZES.some((paperSize) => paperSize === normalized)) {
    return normalized as PaperSize;
  }

  return DEFAULT_PAPER_SIZE;
}
