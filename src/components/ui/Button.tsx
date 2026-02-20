import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        solid:
          "bg-sky-400 text-white hover:bg-sky-500 hover:scale-105 shadow-lg",
        outline:
          "bg-transparent text-sky-400 border-2 border-sky-400 hover:bg-sky-400/10 hover:scale-105",
        "outline-dark":
          "bg-slate-800 text-sky-400 border-2 border-sky-400/40 hover:border-sky-400 hover:scale-105",
      },
      size: {
        sm: "text-sm py-2 px-5",
        md: "text-base py-2.5 px-7",
        lg: "text-lg py-3 px-9",
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
