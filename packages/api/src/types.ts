export const PAPER_SIZES = ["A4", "A5", "B4", "B5"] as const;

export type PaperSize = (typeof PAPER_SIZES)[number];

export type Price = {
  business_day: number;
  price: number;
  quantity: number;
};

export type PricesResponse = {
  paper_size: string;
  prices: Price[][];
};
