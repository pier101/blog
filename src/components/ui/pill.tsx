import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type PillTone = "neutral" | "accent" | "solid";
type PillSize = "sm" | "md";

type SharedProps = {
  children: ReactNode;
  className?: string;
  tone?: PillTone;
  size?: PillSize;
};

type PillSpanProps = SharedProps &
  HTMLAttributes<HTMLSpanElement> & {
    as?: "span";
  };

type PillButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as: "button";
  };

type PillProps = PillSpanProps | PillButtonProps;

const toneClasses = {
  neutral: "border border-panel-border bg-surface-soft text-foreground",
  accent: "border border-accent bg-accent-soft text-foreground-strong",
  solid: "border border-accent bg-accent text-white",
};

const sizeClasses = {
  sm: "px-2.5 py-1 text-label-xs sm:px-3 sm:text-label-sm",
  md: "min-h-10 px-4 py-2 text-body-xs",
};

export function Pill({
  as = "span",
  className,
  tone = "neutral",
  size = "sm",
  children,
  ...props
}: PillProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "inline-flex items-center gap-2 rounded-pill font-medium transition",
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
