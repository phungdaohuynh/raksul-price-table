import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./typography.module.css";

type TypographyVariant = "body" | "muted" | "order" | "panelTitle";

type TypographyProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  variant?: TypographyVariant;
};

const defaultElementByVariant: Record<TypographyVariant, ElementType> = {
  body: "p",
  muted: "p",
  order: "p",
  panelTitle: "h2"
};

export function Typography({
  as,
  children,
  className,
  variant = "body",
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElementByVariant[variant];
  const classes = [styles.root, styles[variant], className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

export type { TypographyProps, TypographyVariant };
