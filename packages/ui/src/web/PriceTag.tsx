import { formatPrice } from "@criation/utils";
import type { CSSProperties } from "react";

import { colors, fontSizes, fontWeights } from "../tokens";

export interface PriceTagProps {
  /** Price in the smallest currency unit. */
  amount: number;
  currency?: string;
  locale?: string;
  /** Original price, rendered struck through when higher than `amount`. */
  compareAtAmount?: number | null;
  style?: CSSProperties;
}

/** Renders a price using the shared `formatPrice` helper from `@criation/utils`. */
export function PriceTag({ amount, currency, locale, compareAtAmount, style }: PriceTagProps) {
  const showCompare = typeof compareAtAmount === "number" && compareAtAmount > amount;

  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8, ...style }}>
      <span
        style={{
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.semibold,
          color: colors.text,
        }}
      >
        {formatPrice(amount, { currency, locale })}
      </span>
      {showCompare ? (
        <span
          style={{
            fontSize: fontSizes.sm,
            color: colors.textMuted,
            textDecoration: "line-through",
          }}
        >
          {formatPrice(compareAtAmount, { currency, locale })}
        </span>
      ) : null}
    </span>
  );
}
