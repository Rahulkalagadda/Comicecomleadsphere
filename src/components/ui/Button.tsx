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
      "inline-flex items-center justify-center font-heading font-semibold rounded-xl transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CE0C9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07100D] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer tracking-[0.005em]";

    const variantStyles = {
      primary:
        "bg-brand text-[#07100D] shadow-sm border-t border-white/25 hover:brightness-105 active:translate-y-[1px] active:shadow-inner",
      secondary:
        "bg-surface-secondary text-primary-token hover:bg-surface-tertiary border border-theme shadow-xs active:translate-y-[1px]",
      accent:
        "bg-accent-gold text-[#07100D] shadow-sm border-t border-white/25 hover:brightness-105 active:translate-y-[1px]",
      neumorphic:
        "nm-button text-primary-token font-semibold",
      outline:
        "border border-theme text-primary-token bg-transparent hover:bg-surface-secondary active:translate-y-[1px]",
      ghost:
        "text-secondary-token hover:text-primary-token hover:bg-surface-secondary/70",
      danger:
        "bg-red-600 text-white shadow-sm hover:bg-red-700 active:translate-y-[1px]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-[13px] sm:text-sm px-4 py-2 gap-2",
      lg: "text-sm sm:text-[15px] px-6 py-2.5 gap-2.5",
      icon: "p-2 aspect-square",
    };

    const computedStyle: React.CSSProperties = {
      ...(variant === "primary"
        ? { backgroundColor: "var(--brand-primary)", color: "var(--brand-primary-foreground)" }
        : variant === "accent"
        ? { backgroundColor: "var(--accent-premium)", color: "var(--accent-premium-foreground)" }
        : {}),
      ...props.style,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={computedStyle}
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
