import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        solid:
          "bg-primary text-primary-foreground hover:bg-primary-hover hover:scale-105 shadow-lg",
        outline:
          "bg-transparent text-primary border-2 border-primary hover:bg-primary/10 hover:scale-105",
        "outline-dark":
          "bg-card text-primary border-2 border-primary/40 hover:border-primary hover:scale-105",
        ghost:
          "bg-muted hover:bg-accent text-soft-foreground border border-border",
      },
      size: {
        sm: "text-body-sm py-2 px-5",
        md: "text-body py-2.5 px-7",
        lg: "text-subheading py-3 px-9",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, leftIcon, rightIcon, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
