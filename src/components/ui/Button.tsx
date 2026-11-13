import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "neumorphic" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-fredoka font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFB260] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B0A] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer tracking-wide";

    const variantStyles = {
      primary:
        "clay-btn-primary",
      secondary:
        "clay-btn-secondary",
      accent:
        "clay-btn-primary",
      neumorphic:
        "clay-btn-secondary",
      outline:
        "clay-btn-secondary border border-white/20 text-white",
      ghost:
        "rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] active:translate-y-[1px]",
      danger:
        "clay-btn rounded-full bg-gradient-to-b from-red-500 to-red-600 text-white",
    };

    const sizeStyles = {
      sm: "text-xs px-4 py-1.5 gap-1.5",
      md: "text-[13px] sm:text-sm px-5 py-2.5 gap-2",
      lg: "text-sm sm:text-[15px] px-6 py-3 gap-2.5",
      icon: "p-2.5 aspect-square rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
