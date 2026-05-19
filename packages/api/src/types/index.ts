export type Price = {
  business_day: number;
  price: number;
  quantity: number;
};

export type PricesResponse = {
  paper_size: string;
  prices: Price[][];
};
