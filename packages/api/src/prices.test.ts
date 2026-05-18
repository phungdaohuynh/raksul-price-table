import { describe, expect, it, vi } from "vitest";
import { fetchPrices } from "./prices";
import type { PricesResponse } from "./types";

describe("fetchPrices", () => {
  it("appends a normalized paper_size query parameter", async () => {
    const responseBody: PricesResponse = {
      paper_size: "a5",
      prices: []
    };
    const fetcher = vi.fn().mockResolvedValue(createResponse(responseBody));

    await expect(
      fetchPrices({
        endpoint: "https://example.com/prices?foo=bar",
        fetcher,
        paperSize: "a5"
      })
    ).resolves.toEqual(responseBody);

    const [url] = fetcher.mock.calls[0] as [URL];
    expect(url.toString()).toBe("https://example.com/prices?foo=bar&paper_size=A5");
  });

  it("falls back to A4 for invalid paper sizes", async () => {
    const fetcher = vi.fn().mockResolvedValue(createResponse({ paper_size: "a4", prices: [] }));

    await fetchPrices({
      endpoint: "https://example.com/prices",
      fetcher,
      paperSize: "invalid"
    });

    const [url] = fetcher.mock.calls[0] as [URL];
    expect(url.searchParams.get("paper_size")).toBe("A4");
  });

  it("throws when the response is not ok", async () => {
    const fetcher = vi.fn().mockResolvedValue(createResponse({}, { ok: false, status: 503 }));

    await expect(
      fetchPrices({
        endpoint: "https://example.com/prices",
        fetcher,
        paperSize: "A4"
      })
    ).rejects.toThrow("Failed to fetch prices: 503");
  });
});

function createResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: vi.fn().mockResolvedValue(body)
  } as unknown as Response;
}
