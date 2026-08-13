import type { CSSProperties, ReactNode } from "react";

import { colors, fontSizes, fontWeights, radii, spacing } from "../tokens";

export interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Card({ title, subtitle, footer, children, style }: CardProps) {
  return (
    <section
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.lg,
        padding: spacing.xl,
        display: "flex",
        flexDirection: "column",
        gap: spacing.md,
        ...style,
      }}
    >
      {(title ?? subtitle) ? (
        <header style={{ display: "flex", flexDirection: "column", gap: spacing.xs }}>
          {title ? (
            <h3
              style={{
                margin: 0,
                fontSize: fontSizes.lg,
                fontWeight: fontWeights.semibold,
                color: colors.text,
              }}
            >
              {title}
            </h3>
          ) : null}
          {subtitle ? (
            <p style={{ margin: 0, fontSize: fontSizes.sm, color: colors.textMuted }}>{subtitle}</p>
          ) : null}
        </header>
      ) : null}
      {children}
      {footer ? <footer style={{ marginTop: "auto" }}>{footer}</footer> : null}
    </section>
  );
}
