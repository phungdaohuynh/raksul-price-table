import { expect, type Page, test } from "@playwright/test";

test("loads the price table layout", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Select paper size" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Price table" })).toBeVisible();
  await expect(page.getByText("Select a price to continue")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cart" })).toHaveCount(0);
});

test("updates another paper size immediately and keeps the current table while updating", async ({
  page
}) => {
  await mockPricesApi(page);

  await page.goto("/");

  await expect(page.getByRole("columnheader", { name: "1 business day" })).toBeVisible();
  await expect(page.getByRole("button", { name: "1,000" })).toBeVisible();

  await page.getByLabel("Paper size").selectOption("A5");

  await expect(page.getByText("Updating...")).toBeVisible();
  await expect(page.getByRole("button", { name: "1,000" })).toBeVisible();

  await expect(page.getByRole("button", { name: "2,000" })).toBeVisible();
});

test("resets selection and collapsed rows when changing paper size", async ({ page }) => {
  await mockPricesApi(page);

  await page.goto("/");
  await page.getByRole("button", { name: "See more" }).click();
  await page.getByRole("button", { name: "1,000" }).click();

  await expect(page.getByRole("cell", { name: "600", exact: true })).toBeVisible();
  await expect(page.getByText("Order price: ¥1,000")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cart" })).toBeVisible();

  await page.getByLabel("Paper size").selectOption("A5");

  await expect(page.getByRole("button", { name: "2,000" })).toBeVisible();
  await expect(page.getByText("Select a price to continue")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cart" })).toHaveCount(0);
  await expect(page.getByRole("cell", { name: "600", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "See more" })).toBeVisible();
});

test("selects a price cell and displays the order price", async ({ page }) => {
  await mockPricesApi(page);

  await page.goto("/");
  await page.getByRole("button", { name: "1,000" }).click();

  await expect(page.getByRole("button", { name: "1,000" })).toHaveAttribute(
    "data-selected",
    "true"
  );
  await expect(page.getByText("Order price: ¥1,000")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cart" })).toBeVisible();
});

test("shows more quantity rows when clicking see more", async ({ page }) => {
  await mockPricesApi(page);

  await page.goto("/");

  await expect(page.getByRole("cell", { name: "600", exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "See more" }).click();

  await expect(page.getByRole("cell", { name: "600", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "See more" })).toHaveCount(0);
  await expect
    .poll(() => page.locator("tbody").evaluate((tbody) => tbody.scrollHeight > tbody.clientHeight))
    .toBe(true);
});

test("keeps the mobile layout usable with a scrollable table body", async ({ page }) => {
  await mockPricesApi(page);
  await page.setViewportSize({ height: 568, width: 320 });

  await page.goto("/");
  await page.getByRole("button", { name: "See more" }).click();

  await expect(page.getByRole("button", { name: "See more" })).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const documentElement = document.documentElement;
        const tableBody = document.querySelector("tbody");

        return {
          hasHorizontalOverflow: documentElement.scrollWidth > documentElement.clientWidth,
          hasTableBodyScroll: tableBody ? tableBody.scrollHeight > tableBody.clientHeight : false
        };
      })
    )
    .toEqual({
      hasHorizontalOverflow: false,
      hasTableBodyScroll: true
    });
});

test("highlights the hovered price cell and related row and column", async ({ page }) => {
  await mockPricesApi(page);

  await page.goto("/");

  const priceCell = page.getByRole("button", { name: "1,000" });
  await priceCell.hover();

  await expect(priceCell).toHaveAttribute("data-hovered", "true");
  await expect(page.getByRole("columnheader", { name: "1 business day" })).toHaveAttribute(
    "data-highlighted",
    "true"
  );
  await expect(page.getByRole("cell", { name: "10", exact: true })).toHaveAttribute(
    "data-highlighted",
    "true"
  );
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

async function mockPricesApi(page: Page) {
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
}

function createPricesResponse(paperSize: "a4" | "a5") {
  const basePrice = paperSize === "a5" ? 2000 : 1000;

  return {
    paper_size: paperSize,
    prices: Array.from({ length: 10 }, (_, index) => {
      const quantity = index === 0 ? 10 : index * 100;
      const rowBasePrice = basePrice + index * 100;

      return [
        { business_day: 1, price: rowBasePrice, quantity },
        { business_day: 2, price: rowBasePrice + 10, quantity },
        { business_day: 3, price: rowBasePrice + 20, quantity }
      ];
    })
  };
}
