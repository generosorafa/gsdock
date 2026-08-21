import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold outline-none transition-[background-color,color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--brand-strong)] text-white shadow-[0_1px_2px_rgba(8,47,47,0.18)] hover:bg-[var(--brand-deep)]",
        secondary:
          "bg-white text-[var(--ink)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-muted)]",
        ghost: "text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]",
        danger: "bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[#fee2e2]",
      },
      size: {
        default: "h-10",
        sm: "h-9 min-h-9 rounded-lg px-3 text-xs",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode;
  };

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} type={type} {...props} />
  );
}
