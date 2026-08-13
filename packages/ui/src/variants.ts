import { colors } from "./tokens";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "brand";

export interface ResolvedButtonColors {
  background: string;
  foreground: string;
  border: string;
}

/**
 * Maps a button variant to concrete token colours. Both the web and native
 * Button components consume this, so the two platforms cannot drift.
 */
export function resolveButtonColors(variant: ButtonVariant): ResolvedButtonColors {
  switch (variant) {
    case "primary":
      return {
        background: colors.brand,
        foreground: colors.textInverted,
        border: colors.brand,
      };
    case "secondary":
      return {
        background: colors.surface,
        foreground: colors.text,
        border: colors.border,
      };
    case "ghost":
      return {
        background: "transparent",
        foreground: colors.brand,
        border: "transparent",
      };
    case "danger":
      return {
        background: colors.danger,
        foreground: colors.textInverted,
        border: colors.danger,
      };
  }
}

export interface ResolvedBadgeColors {
  background: string;
  foreground: string;
}

export function resolveBadgeColors(tone: BadgeTone): ResolvedBadgeColors {
  switch (tone) {
    case "success":
      return { background: "#dcfce7", foreground: "#14532d" };
    case "warning":
      return { background: "#fef3c7", foreground: "#78350f" };
    case "danger":
      return { background: "#fee2e2", foreground: "#7f1d1d" };
    case "brand":
      return { background: colors.brandSubtle, foreground: colors.brandHover };
    case "neutral":
      return { background: colors.surfaceMuted, foreground: colors.textMuted };
  }
}

/** Vertical/horizontal padding and font size for each button size. */
export const buttonSizing: Record<
  ButtonSize,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number }
> = {
  sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14 },
  md: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 16 },
  lg: { paddingVertical: 14, paddingHorizontal: 22, fontSize: 18 },
};
