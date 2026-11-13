import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "green" | "red" | "outline";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-secondary text-primary-token border-theme",
    gold: "bg-[#F5C451]/15 text-[#F5C451] border-[#F5C451]/35 font-semibold",
    green: "bg-[#2CE0C9]/15 text-[#2CE0C9] border-[#2CE0C9]/35 font-semibold",
    red: "bg-red-500/15 text-red-300 border-red-400/35 font-semibold",
    outline: "bg-transparent text-secondary-token border-theme",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] leading-none border font-heading font-semibold tracking-[0.03em]",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
