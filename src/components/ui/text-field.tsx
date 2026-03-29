import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement>;

export function TextField({ className, type = "text", ...props }: TextFieldProps) {
  return (
    <input
      type={type}
      className={cn(
        "h-12 w-full rounded-media border border-border bg-surface px-4 text-body-sm text-foreground-strong outline-none transition placeholder:text-placeholder focus:border-accent",
        className,
      )}
      {...props}
    />
  );
}
