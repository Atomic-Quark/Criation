import type { CSSProperties, ReactNode } from "react";

import { fontSizes, fontWeights, radii } from "../tokens";
import { resolveBadgeColors, type BadgeTone } from "../variants";

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  style?: CSSProperties;
}

export function Badge({ tone = "neutral", children, style }: BadgeProps) {
  const palette = resolveBadgeColors(tone);

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: palette.background,
        color: palette.foreground,
        borderRadius: radii.pill,
        padding: "2px 10px",
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.semibold,
        letterSpacing: 0.2,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
