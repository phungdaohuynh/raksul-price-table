import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className, type = "button", ...props }: ButtonProps) {
  const classes = [styles.button, className].filter(Boolean).join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
