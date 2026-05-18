"use client";

import {
  formatNumberWithCommas,
  PAPER_SIZES,
  type PaperSize,
  type Price
} from "@raksul-price-table/api";
import { usePricesQuery } from "@raksul-price-table/api/react";
import {
  Button,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  Typography
} from "@raksul-price-table/ui";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

const INITIAL_ROW_COUNT = 5;

type SelectedPrice = {
  businessDay: number;
  price: number;
  quantity: number;
};

type HoveredCell = {
  businessDay: number;
  quantity: number;
} | null;

export default function Home() {
  const [paperSize, setPaperSize] = useState<PaperSize>("A4");
  const [showAllRows, setShowAllRows] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<SelectedPrice | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HoveredCell>(null);
  const pricesQuery = usePricesQuery({ paperSize });
  const table = useMemo(
    () => createPriceTable(pricesQuery.data?.prices),
    [pricesQuery.data?.prices]
  );
  const visibleRows = showAllRows ? table.rows : table.rows.slice(0, INITIAL_ROW_COUNT);
  const columnCount = Math.max(table.businessDays.length + 1, 1);
  const isInitialLoading = pricesQuery.isPending && !pricesQuery.data;
  const isUpdating = pricesQuery.isFetching && !isInitialLoading;
  const canSeeMore = !showAllRows && table.rows.length > INITIAL_ROW_COUNT;

  function selectPaperSize(size: PaperSize) {
    setPaperSize(size);
    setShowAllRows(false);
    setSelectedPrice(null);
    setHoveredCell(null);
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell} aria-labelledby="page-title">
        <h1 className={styles.title} id="page-title">
          Raksul Price Table
        </h1>
        <div className={styles.contentGrid}>
          <aside className={styles.paperPanel}>
            <Typography className={styles.panelTitle} variant="panelTitle">
              Select paper size
              <Tooltip label="Changing paper size resets the selected price and collapses expanded rows.">
                ?
              </Tooltip>
            </Typography>
            <Select
              aria-label="Paper size"
              className={styles.paperSelect}
              onChange={(event) => selectPaperSize(event.target.value as PaperSize)}
              value={paperSize}
            >
              {PAPER_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </aside>

          <section className={styles.tablePanel} aria-labelledby="price-table-title">
            <div className={styles.tablePanelHeader}>
              <Typography className={styles.panelTitle} id="price-table-title" variant="panelTitle">
                Price table
              </Typography>
              <Typography
                aria-live="polite"
                as="div"
                className={isUpdating ? styles.syncing : styles.synced}
                variant="muted"
              >
                Updating...
              </Typography>
            </div>
            <div className={styles.tableWrap}>
              <Table aria-busy={pricesQuery.isFetching}>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quantity</TableHead>
                    {table.businessDays.map((businessDay) => (
                      <TableHead
                        className={
                          hoveredCell?.businessDay === businessDay
                            ? styles.weakHighlight
                            : undefined
                        }
                        data-highlighted={
                          hoveredCell?.businessDay === businessDay ? "true" : undefined
                        }
                        key={businessDay}
                      >
                        {formatBusinessDay(businessDay)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className={styles.tableBody}>
                  {isInitialLoading ? (
                    <StatusRow colSpan={columnCount}>Loading prices...</StatusRow>
                  ) : pricesQuery.isError ? (
                    <StatusRow colSpan={columnCount}>Unable to load prices.</StatusRow>
                  ) : table.rows.length === 0 ? (
                    <StatusRow colSpan={columnCount}>No prices available.</StatusRow>
                  ) : (
                    visibleRows.map((row) => (
                      <TableRow key={row.quantity}>
                        <TableCell
                          className={
                            hoveredCell?.quantity === row.quantity
                              ? styles.weakHighlight
                              : undefined
                          }
                          data-highlighted={
                            hoveredCell?.quantity === row.quantity ? "true" : undefined
                          }
                        >
                          {formatNumberWithCommas(row.quantity)}
                        </TableCell>
                        {table.businessDays.map((businessDay) => {
                          const price = row.pricesByBusinessDay.get(businessDay);
                          const isSelected =
                            selectedPrice?.quantity === row.quantity &&
                            selectedPrice.businessDay === businessDay;
                          const isHovered =
                            hoveredCell?.quantity === row.quantity &&
                            hoveredCell.businessDay === businessDay;
                          const isWeakHighlighted =
                            !isHovered &&
                            (hoveredCell?.quantity === row.quantity ||
                              hoveredCell?.businessDay === businessDay);

                          return (
                            <TableCell
                              aria-pressed={isSelected}
                              className={getPriceCellClassName({
                                isHovered,
                                isSelected,
                                isWeakHighlighted
                              })}
                              data-highlighted={isWeakHighlighted ? "true" : undefined}
                              data-hovered={isHovered ? "true" : undefined}
                              data-selected={isSelected ? "true" : undefined}
                              key={businessDay}
                              onClick={() => {
                                if (price !== undefined) {
                                  setSelectedPrice({
                                    businessDay,
                                    price,
                                    quantity: row.quantity
                                  });
                                }
                              }}
                              onKeyDown={(event) => {
                                if (
                                  price !== undefined &&
                                  (event.key === "Enter" || event.key === " ")
                                ) {
                                  event.preventDefault();
                                  setSelectedPrice({
                                    businessDay,
                                    price,
                                    quantity: row.quantity
                                  });
                                }
                              }}
                              onMouseEnter={() =>
                                setHoveredCell({ businessDay, quantity: row.quantity })
                              }
                              onMouseLeave={() => setHoveredCell(null)}
                              role="button"
                              tabIndex={0}
                            >
                              {formatPrice(price)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {canSeeMore ? (
              <Button className={styles.seeMoreButton} onClick={() => setShowAllRows(true)}>
                See more
              </Button>
            ) : null}
          </section>
        </div>

        <section className={styles.orderBar} aria-label="Order summary">
          <Typography className={styles.orderText} variant="order">
            {selectedPrice ? (
              <>
                Order price: <span>¥{formatNumberWithCommas(selectedPrice.price)}</span>
              </>
            ) : (
              "Select a price to continue"
            )}
          </Typography>
          {selectedPrice ? <Button className={styles.cartButton}>Cart</Button> : null}
        </section>
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
        <Typography variant="muted">{children}</Typography>
      </TableCell>
    </TableRow>
  );
}

function getPriceCellClassName({
  isHovered,
  isSelected,
  isWeakHighlighted
}: {
  isHovered: boolean;
  isSelected: boolean;
  isWeakHighlighted: boolean;
}) {
  return [
    styles.priceCell,
    isSelected ? styles.selectedCell : undefined,
    isHovered ? styles.hoveredCell : undefined,
    isWeakHighlighted ? styles.weakHighlight : undefined
  ]
    .filter(Boolean)
    .join(" ");
}

function formatBusinessDay(businessDay: number) {
  return `${businessDay} business ${businessDay === 1 ? "day" : "days"}`;
}

function formatPrice(price: number | undefined) {
  return price === undefined ? "-" : formatNumberWithCommas(price);
}
