import type { ReactNode } from "react";
import { useId } from "react";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  children: ReactNode;
  label: string;
};

export function Tooltip({ children, label }: TooltipProps) {
  const tooltipId = useId();

  return (
    <span className={styles.root}>
      <span aria-describedby={tooltipId} className={styles.trigger} tabIndex={0}>
        {children}
      </span>
      <span className={styles.content} id={tooltipId} role="tooltip">
        {label}
      </span>
    </span>
  );
}
