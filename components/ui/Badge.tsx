import React from "react";
import type { Marketplace } from "@/types";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "amazon"
  | "ebay";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-dark-500 text-gray-300 border-dark-400",
  success: "bg-green-500/20 text-green-400 border-green-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/20 text-red-400 border-red-500/30",
  info: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30",
  amazon: "bg-amazon/20 text-amazon border-amazon/30",
  ebay: "bg-ebay/20 text-ebay border-ebay/30",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-2xs",
  md: "px-2.5 py-1 text-xs",
};

export default function Badge({
  variant = "default",
  size = "md",
  children,
  className = "",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-bold uppercase tracking-wide
        rounded-lg border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "amazon"
              ? "bg-amazon"
              : variant === "ebay"
              ? "bg-ebay"
              : variant === "success"
              ? "bg-green-400"
              : variant === "warning"
              ? "bg-amber-400"
              : variant === "danger"
              ? "bg-red-400"
              : variant === "info"
              ? "bg-accent-cyan"
              : "bg-gray-400"
          }`}
        />
      )}
      {children}
    </span>
  );
}

// Marketplace badge helper
export function MarketplaceBadge({
  marketplace,
  size = "md",
}: {
  marketplace: Marketplace;
  size?: BadgeSize;
}) {
  return (
    <Badge variant={marketplace} size={size} dot>
      {marketplace === "amazon" ? "Amazon" : "eBay"}
    </Badge>
  );
}

// Condition badge helper
export function ConditionBadge({
  condition,
  size = "md",
}: {
  condition: "new" | "used" | "refurbished";
  size?: BadgeSize;
}) {
  const variant =
    condition === "new"
      ? "success"
      : condition === "refurbished"
      ? "info"
      : "warning";
  return (
    <Badge variant={variant} size={size}>
      {condition}
    </Badge>
  );
}
