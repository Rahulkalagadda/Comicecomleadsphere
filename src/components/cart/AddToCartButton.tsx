"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { CartFolioItem, addToCart, getCartItems } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  item: CartFolioItem;
  size?: "sm" | "md" | "lg";
  compact?: boolean;
  className?: string;
}

export function AddToCartButton({
  item,
  size = "sm",
  compact = false,
  className,
}: AddToCartButtonProps) {
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const sync = () => {
      const items = getCartItems();
      setInCart(items.some((c) => c.id === item.id));
    };
    sync();
    window.addEventListener("leadsphere-cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("leadsphere-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [item.id]);

  const sizeClasses =
    size === "lg"
      ? "px-5 py-3 text-sm rounded-xl"
      : size === "md"
        ? "px-4 py-2 text-xs rounded-lg"
        : "px-2.5 py-1.5 text-xs rounded-md";

  if (inCart) {
    return (
      <Link
        href="/checkout"
        aria-label={`View ${item.title} in Cart`}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 font-heading font-semibold bg-[#2CE0C9]/15 text-[#2CE0C9] border border-[#2CE0C9]/45 hover:bg-[#2CE0C9] hover:text-[#07100D] transition-all whitespace-nowrap",
          sizeClasses,
          className
        )}
      >
        <Check className="w-3.5 h-3.5 shrink-0" />
        <span>{compact ? "In Cart" : "In Cart • Checkout"}</span>
      </Link>
    );
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    setInCart(true);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${item.title} to cart`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-heading font-semibold bg-surface-secondary hover:bg-[#F5C451]/15 text-[#F5C451] border border-[#F5C451]/35 hover:border-[#F5C451] transition-all cursor-pointer whitespace-nowrap",
        sizeClasses,
        className
      )}
    >
      <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
      <span>{compact ? "Add" : "Add to Cart"}</span>
    </button>
  );
}

