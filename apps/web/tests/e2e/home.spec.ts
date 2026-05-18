import { expect, test } from "@playwright/test";

test("loads the application shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Raksul Price Table" })).toBeVisible();
});

test("updates prices when selecting another paper size", async ({ page }) => {
  await page.route("**/api/prices?**", async (route) => {
    const url = new URL(route.request().url());
    const paperSize = url.searchParams.get("paper_size");

    if (paperSize === "A5") {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    await route.fulfill({
      contentType: "application/json",
      json: createPricesResponse(paperSize === "A5" ? "a5" : "a4")
    });
  });

  await page.goto("/");

  await expect(page.getByRole("columnheader", { name: "1 business day" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "1,000" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "10", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "A5" }).click();

  await expect(page.getByText("Updating...")).toBeVisible();
  await expect(page.getByRole("cell", { name: "1,000" })).toBeVisible();

  await expect(page.getByRole("cell", { name: "2,000" })).toBeVisible();
  await expect(page.getByRole("button", { name: "A5" })).toHaveAttribute("aria-pressed", "true");
});

test("shows an error state when the prices API fails", async ({ page }) => {
  await page.route("**/api/prices?**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      json: { message: "Failed to fetch prices" },
      status: 502
    });
  });

  await page.goto("/");

  await expect(page.getByText("Unable to load prices.")).toBeVisible();
});

function createPricesResponse(paperSize: "a4" | "a5") {
  const basePrice = paperSize === "a5" ? 2000 : 1000;

  return {
    paper_size: paperSize,
    prices: [
      [
        { business_day: 1, price: basePrice, quantity: 10 },
        { business_day: 2, price: basePrice + 100, quantity: 10 }
      ],
      [
        { business_day: 1, price: basePrice + 500, quantity: 100 },
        { business_day: 2, price: basePrice + 600, quantity: 100 }
      ]
    ]
  };
}
