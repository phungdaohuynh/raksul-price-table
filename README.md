# Raksul Price Table

A web application for displaying printing prices by paper size. The project is organized as a pnpm monorepo with a Next.js application and shared API/UI packages.

## Tech Stack

- pnpm workspace
- Next.js 16, React 19
- TypeScript
- TanStack Query
- Vitest
- Playwright
- ESLint, Prettier
- GitHub Actions

## Project Structure

```txt
apps/
  web/                 Next.js application
    src/app/           App Router pages and API routes
    src/providers/     React providers
    tests/e2e/         Playwright tests

packages/
  api/                 API client, types, and query hooks
  ui/                  Shared UI components, organized by component folder
```

Important files:

- `apps/web/src/app/page.tsx`: main price table screen.
- `apps/web/src/app/api/prices/route.ts`: API route that proxies requests to the Raksul prices API.
- `packages/api/src/prices.ts`: prices API client.
- `packages/api/src/paper-size.ts`: paper size normalization with `A4` fallback.
- `packages/api/src/react/use-prices-query.ts`: TanStack Query hook for prices.
- `packages/ui/src/*/index.tsx`: shared UI components such as Button, Select, Table, Tooltip, and Typography.
- `.github/workflows/ci.yml`: GitHub Actions workflow for typecheck, lint, and coverage tests.

## Requirements

Install:

- Node.js compatible with Next.js 16
- pnpm `10.26.0`

If pnpm is not installed:

```bash
corepack enable
corepack prepare pnpm@10.26.0 --activate
```

## Installation

Install dependencies from the repository root:

```bash
pnpm install
```

## Environment Variables

The application requires `RAKSUL_PRICES_API_URL` so the Next.js API route knows which upstream endpoint to call.

The repository includes an example file:

```bash
.env.example
```

Current value:

```env
RAKSUL_PRICES_API_URL=https://us-central1-fe-ws-test.cloudfunctions.net/prices
```

For local development, create:

```bash
apps/web/.env.local
```

With:

```env
RAKSUL_PRICES_API_URL=https://us-central1-fe-ws-test.cloudfunctions.net/prices
```

Notes:

- `.env.local` is ignored by git and should not be committed.
- Restart the dev server after changing environment variables.
- If this variable is missing, `/api/prices` returns `Missing RAKSUL_PRICES_API_URL`.

## Development

Start the development server from the repository root:

```bash
pnpm dev
```

The app usually runs at:

```txt
http://localhost:3000
```

If port `3000` is already in use, Next.js may choose another port and print the URL in the terminal.

## API Route Check

After the dev server is running, verify the API route:

```bash
curl "http://localhost:3000/api/prices?paper_size=A4"
```

Expected response shape:

```json
{
  "paper_size": "a4",
  "prices": [
    [
      {
        "business_day": 1,
        "price": 1568,
        "quantity": 10
      }
    ]
  ]
}
```

Supported paper sizes:

- `A4`
- `A5`
- `B4`
- `B5`

Invalid paper size values are normalized to `A4`.

## Scripts

Start the app:

```bash
pnpm dev
```

Build all workspace packages:

```bash
pnpm build
```

Run TypeScript checks:

```bash
pnpm typecheck
```

Run ESLint:

```bash
pnpm lint
```

Format code:

```bash
pnpm format
```

Check formatting:

```bash
pnpm format:check
```

Run Vitest unit tests:

```bash
pnpm test:run
```

Run Vitest tests with coverage:

```bash
pnpm test:coverage
```

Run Playwright E2E tests:

```bash
pnpm test:e2e
```

## Testing

The project includes:

- Unit tests for paper size normalization.
- Unit tests for comma-separated number formatting.
- Unit tests for the prices API client.
- Unit tests for the Next.js `/api/prices` route error handling.
- Playwright E2E tests for:
  - application shell rendering
  - price updates when changing paper size
  - selected price display and Cart visibility
  - selected state reset when changing paper size
  - See more row expansion and table body scrolling
  - hovered cell, row, and column highlighting
  - error state when the API fails

## Implemented Requirements

Task 1-a core functionality:

- Users can view prices in a table where rows are quantities and columns are delivery business days.
- Users can select `A4`, `A5`, `B4`, or `B5` and view the corresponding price table.

Task 1-b add-on functionality:

- Users can click a price cell to select it.
- The selected price cell is highlighted.
- The selected price is displayed in the order summary.
- The initial table shows 5 quantity rows.
- `See more` displays all available quantity rows.
- Hovering over a price highlights the cell and weakly highlights its related row and column.

Task 2 number formatting:

- Prices and quantities are formatted with commas every 3 digits.
- Formatting is implemented by `formatNumberWithCommas`.
- The formatter has unit tests.
- The implementation does not use `toLocaleString()` or `Intl.NumberFormat()`.

Recommended verification before pushing changes:

```bash
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test:coverage
pnpm test:e2e
pnpm build
```

## CI

GitHub Actions runs on pull requests and pushes to `main`.

The CI workflow runs:

```bash
pnpm typecheck
pnpm lint
pnpm test:coverage
```

Workflow file:

```txt
.github/workflows/ci.yml
```

## Data Flow

1. The user selects a paper size on `apps/web/src/app/page.tsx`.
2. `usePricesQuery` requests `/api/prices?paper_size=<size>`.
3. `apps/web/src/app/api/prices/route.ts` reads `RAKSUL_PRICES_API_URL`.
4. `fetchPrices` calls the upstream API and appends the `paper_size` query parameter.
5. The UI groups the response by `quantity`, creates columns from `business_day`, and renders the table.

## UI Behavior

- The table keeps the previous data while a new paper size is loading.
- A lightweight `Updating...` indicator appears during background fetching.
- Initial loading, empty, and error states are rendered inside the table.
- The table wrapper supports horizontal scrolling on smaller screens.
- Changing paper size resets the selected price and collapses expanded rows.
- `Cart` is hidden until a price is selected.

## Troubleshooting

### API returns `Missing RAKSUL_PRICES_API_URL`

Check that `apps/web/.env.local` exists and includes:

```env
RAKSUL_PRICES_API_URL=https://us-central1-fe-ws-test.cloudfunctions.net/prices
```

Then restart:

```bash
pnpm dev
```

### Port 3000 is already in use

Use the alternate URL printed by Next.js, or stop the process using port `3000` and run:

```bash
pnpm dev
```

### Playwright browsers are missing

If `pnpm test:e2e` fails because browsers are not installed, run:

```bash
pnpm exec playwright install
```
