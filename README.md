# Raksul Price Table

Web application hien thi bang gia in an theo paper size. Project duoc to chuc theo monorepo dung pnpm workspace, gom Next.js app va cac package dung chung cho API client/UI.

## Tech stack

- pnpm workspace
- Next.js 16, React 19
- TypeScript
- TanStack Query
- Vitest
- Playwright
- ESLint, Prettier

## Cau truc project

```txt
apps/
  web/                 Next.js application
    src/app/           App Router pages va API routes
    src/providers/     React providers
    tests/e2e/         Playwright tests

packages/
  api/                 API client, types, query hooks
  ui/                  Shared UI components
```

Mot so file quan trong:

- `apps/web/src/app/page.tsx`: man hinh bang gia chinh.
- `apps/web/src/app/api/prices/route.ts`: API route proxy den Raksul prices API.
- `packages/api/src/prices.ts`: ham fetch prices.
- `packages/api/src/paper-size.ts`: normalize paper size, fallback ve `A4`.
- `packages/api/src/react/use-prices-query.ts`: TanStack Query hook cho prices.
- `packages/ui/src/table.tsx`: shared table components.

## Yeu cau moi truong

Can cai dat:

- Node.js phien ban tuong thich voi Next.js 16
- pnpm `10.26.0`

Neu chua co pnpm:

```bash
corepack enable
corepack prepare pnpm@10.26.0 --activate
```

## Cai dat

Clone project va cai dependencies:

```bash
pnpm install
```

## Cau hinh bien moi truong

Project can bien `RAKSUL_PRICES_API_URL` de Next API route biet endpoint lay gia.

Root repo da co file mau:

```bash
.env.example
```

Noi dung hien tai:

```env
RAKSUL_PRICES_API_URL=https://us-central1-fe-ws-test.cloudfunctions.net/prices
```

Voi Next app trong workspace nay, hay tao file:

```bash
apps/web/.env.local
```

Noi dung:

```env
RAKSUL_PRICES_API_URL=https://us-central1-fe-ws-test.cloudfunctions.net/prices
```

Ghi chu:

- `.env.local` da nam trong `.gitignore`, khong commit file nay.
- Sau khi thay doi env, can restart dev server.
- Neu thieu bien nay, `/api/prices` se tra ve loi `Missing RAKSUL_PRICES_API_URL`.

## Chay development server

Tu root repo:

```bash
pnpm dev
```

Mac dinh app chay tai:

```txt
http://localhost:3000
```

Neu port `3000` dang ban, Next co the chon port khac va in URL trong terminal.

## Kiem tra API route

Sau khi dev server chay, co the test nhanh:

```bash
curl "http://localhost:3000/api/prices?paper_size=A4"
```

Ket qua mong doi la JSON co dang:

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

App ho tro cac paper size:

- `A4`
- `A5`
- `B4`
- `B5`

Gia tri paper size khong hop le se duoc normalize ve `A4`.

## Scripts thuong dung

Chay app:

```bash
pnpm dev
```

Build tat ca workspace packages:

```bash
pnpm build
```

Typecheck:

```bash
pnpm typecheck
```

Lint:

```bash
pnpm lint
```

Format code:

```bash
pnpm format
```

Kiem tra format:

```bash
pnpm format:check
```

Unit/component tests bang Vitest:

```bash
pnpm test:run
```

E2E tests bang Playwright:

```bash
pnpm test:e2e
```

## Workflow phat trien

Quy trinh khuyen nghi truoc khi day code:

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm test:e2e
```

Khi lam viec voi UI:

1. Chay `pnpm dev`.
2. Mo `http://localhost:3000`.
3. Chon paper size tren toolbar.
4. Xac nhan bang gia render dung quantity va business day.
5. Kiem tra loading/error state neu API bi loi hoac env bi thieu.

## Luong du lieu hien tai

1. User chon paper size tren `apps/web/src/app/page.tsx`.
2. `usePricesQuery` goi `/api/prices?paper_size=<size>`.
3. Next route `apps/web/src/app/api/prices/route.ts` doc `RAKSUL_PRICES_API_URL`.
4. `fetchPrices` goi remote API va tu dong gan query param `paper_size`.
5. UI gom du lieu theo `quantity`, tao cot theo `business_day`, roi render bang.

## Troubleshooting

### API tra ve `Missing RAKSUL_PRICES_API_URL`

Kiem tra file `apps/web/.env.local` da ton tai va co dung bien:

```env
RAKSUL_PRICES_API_URL=https://us-central1-fe-ws-test.cloudfunctions.net/prices
```

Sau do restart `pnpm dev`.

### Dev server bao port 3000 dang duoc dung

Co the dung URL port moi ma Next in ra terminal, hoac tat process dang giu port 3000 roi chay lai:

```bash
pnpm dev
```

### `pnpm test:run` bao khong co test file

Hien tai repo co cau hinh Vitest nhung chua co unit test file. Day khong phai loi runtime. Nen them test cho:

- `normalizePaperSize`
- `fetchPrices`
- UI render bang gia

### Playwright chua cai browser

Neu `pnpm test:e2e` loi vi thieu browser, chay:

```bash
pnpm exec playwright install
```
