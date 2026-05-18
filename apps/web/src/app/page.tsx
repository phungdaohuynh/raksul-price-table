"use client";

import { PAPER_SIZES, type PaperSize, type Price } from "@raksul-price-table/api";
import { usePricesQuery } from "@raksul-price-table/api/react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@raksul-price-table/ui";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [paperSize, setPaperSize] = useState<PaperSize>("A4");
  const pricesQuery = usePricesQuery({ paperSize });
  const table = useMemo(
    () => createPriceTable(pricesQuery.data?.prices),
    [pricesQuery.data?.prices]
  );
  const columnCount = Math.max(table.businessDays.length + 1, 1);
  const isInitialLoading = pricesQuery.isPending && !pricesQuery.data;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <h1 className={styles.title}>Raksul Price Table</h1>
        <div className={styles.toolbar}>
          <div className={styles.paperSizeGroup} aria-label="Paper size">
            {PAPER_SIZES.map((size) => (
              <Button
                aria-pressed={paperSize === size}
                className={paperSize === size ? styles.paperSizeActive : styles.paperSizeButton}
                key={size}
                onClick={() => setPaperSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
          <div
            aria-live="polite"
            className={pricesQuery.isFetching && !isInitialLoading ? styles.syncing : styles.synced}
          >
            Updating...
          </div>
        </div>
        <div className={styles.tableWrap}>
          <Table aria-busy={pricesQuery.isFetching}>
            <TableHeader>
              <TableRow>
                <TableHead>Quantity</TableHead>
                {table.businessDays.map((businessDay) => (
                  <TableHead key={businessDay}>{formatBusinessDay(businessDay)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInitialLoading ? (
                <StatusRow colSpan={columnCount}>Loading prices...</StatusRow>
              ) : pricesQuery.isError ? (
                <StatusRow colSpan={columnCount}>Unable to load prices.</StatusRow>
              ) : table.rows.length === 0 ? (
                <StatusRow colSpan={columnCount}>No prices available.</StatusRow>
              ) : (
                table.rows.map((row) => (
                  <TableRow key={row.quantity}>
                    <TableCell>{row.quantity.toLocaleString()}</TableCell>
                    {table.businessDays.map((businessDay) => (
                      <TableCell key={businessDay}>
                        {formatPrice(row.pricesByBusinessDay.get(businessDay))}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}

type PriceTable = {
  businessDays: number[];
  rows: Array<{
    quantity: number;
    pricesByBusinessDay: Map<number, number>;
  }>;
};

function createPriceTable(priceGroups: Price[][] | undefined): PriceTable {
  const businessDays = new Set<number>();
  const rowsByQuantity = new Map<number, Map<number, number>>();

  for (const group of priceGroups ?? []) {
    for (const price of group) {
      businessDays.add(price.business_day);

      const row = rowsByQuantity.get(price.quantity) ?? new Map<number, number>();
      row.set(price.business_day, price.price);
      rowsByQuantity.set(price.quantity, row);
    }
  }

  return {
    businessDays: [...businessDays].sort((a, b) => a - b),
    rows: [...rowsByQuantity.entries()]
      .sort(([quantityA], [quantityB]) => quantityA - quantityB)
      .map(([quantity, pricesByBusinessDay]) => ({ quantity, pricesByBusinessDay }))
  };
}

function StatusRow({ children, colSpan }: { children: string; colSpan: number }) {
  return (
    <TableRow>
      <TableCell className={styles.statusCell} colSpan={colSpan}>
        {children}
      </TableCell>
    </TableRow>
  );
}

function formatBusinessDay(businessDay: number) {
  return `${businessDay} business ${businessDay === 1 ? "day" : "days"}`;
}

function formatPrice(price: number | undefined) {
  return price === undefined ? "-" : price.toLocaleString();
}
