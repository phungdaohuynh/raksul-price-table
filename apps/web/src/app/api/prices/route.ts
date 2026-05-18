import { fetchPrices, normalizePaperSize } from "@raksul-price-table/api";
import { NextResponse } from "next/server";

const pricesApiUrl = process.env.RAKSUL_PRICES_API_URL;

export async function GET(request: Request) {
  if (!pricesApiUrl) {
    return NextResponse.json({ message: "Missing RAKSUL_PRICES_API_URL" }, { status: 500 });
  }

  const url = new URL(request.url);
  const paperSize = normalizePaperSize(url.searchParams.get("paper_size"));

  try {
    const data = await fetchPrices({ paperSize, endpoint: pricesApiUrl });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Failed to fetch prices" }, { status: 502 });
  }
}
