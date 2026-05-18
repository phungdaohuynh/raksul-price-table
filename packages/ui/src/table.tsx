import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";
import styles from "./table.module.css";

type TableProps = HTMLAttributes<HTMLTableElement>;
type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;
type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
type TableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement>;
type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Table({ className, ...props }: TableProps) {
  return <table className={cx(styles.table, className)} {...props} />;
}

export function TableHeader({ className, ...props }: TableSectionProps) {
  return <thead className={cx(styles.header, className)} {...props} />;
}

export function TableBody({ className, ...props }: TableSectionProps) {
  return <tbody className={cx(styles.body, className)} {...props} />;
}

export function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={cx(styles.row, className)} {...props} />;
}

export function TableHead({ className, ...props }: TableHeaderCellProps) {
  return <th className={cx(styles.head, className)} scope={props.scope ?? "col"} {...props} />;
}

export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cx(styles.cell, className)} {...props} />;
}
