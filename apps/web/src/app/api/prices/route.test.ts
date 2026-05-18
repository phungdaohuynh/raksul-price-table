/* @vitest-environment node */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const apiMocks = vi.hoisted(() => ({
  fetchPrices: vi.fn(),
  normalizePaperSize: vi.fn((value: string | null) => value?.toUpperCase() ?? "A4")
}));

vi.mock("@raksul-price-table/api", () => apiMocks);

describe("GET /api/prices", () => {
  const originalPricesApiUrl = process.env.RAKSUL_PRICES_API_URL;

  beforeEach(() => {
    vi.resetModules();
    apiMocks.fetchPrices.mockReset();
    apiMocks.normalizePaperSize.mockClear();
  });

  afterEach(() => {
    if (originalPricesApiUrl === undefined) {
      delete process.env.RAKSUL_PRICES_API_URL;
    } else {
      process.env.RAKSUL_PRICES_API_URL = originalPricesApiUrl;
    }
  });

  it("returns 500 when RAKSUL_PRICES_API_URL is missing", async () => {
    delete process.env.RAKSUL_PRICES_API_URL;
    const { GET } = await import("./route");

    const response = await GET(new Request("http://localhost/api/prices?paper_size=A5"));

    await expect(response.json()).resolves.toEqual({ message: "Missing RAKSUL_PRICES_API_URL" });
    expect(response.status).toBe(500);
    expect(apiMocks.fetchPrices).not.toHaveBeenCalled();
  });

  it("fetches prices with the normalized paper size", async () => {
    process.env.RAKSUL_PRICES_API_URL = "https://example.com/prices";
    apiMocks.normalizePaperSize.mockReturnValue("B4");
    apiMocks.fetchPrices.mockResolvedValue({ paper_size: "b4", prices: [] });
    const { GET } = await import("./route");

    const response = await GET(new Request("http://localhost/api/prices?paper_size=b4"));

    await expect(response.json()).resolves.toEqual({ paper_size: "b4", prices: [] });
    expect(response.status).toBe(200);
    expect(apiMocks.normalizePaperSize).toHaveBeenCalledWith("b4");
    expect(apiMocks.fetchPrices).toHaveBeenCalledWith({
      endpoint: "https://example.com/prices",
      paperSize: "B4"
    });
  });

  it("returns 502 when the upstream prices API fails", async () => {
    process.env.RAKSUL_PRICES_API_URL = "https://example.com/prices";
    apiMocks.normalizePaperSize.mockReturnValue("A4");
    apiMocks.fetchPrices.mockRejectedValue(new Error("upstream failed"));
    const { GET } = await import("./route");

    const response = await GET(new Request("http://localhost/api/prices?paper_size=A4"));

    await expect(response.json()).resolves.toEqual({ message: "Failed to fetch prices" });
    expect(response.status).toBe(502);
  });
});
