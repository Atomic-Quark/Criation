/**
 * Design tokens are plain data with no platform imports, so the web and
 * React Native entrypoints can both build their styles from the same source.
 */

export const colors = {
  brand: "#4f46e5",
  brandHover: "#4338ca",
  brandSubtle: "#eef2ff",
  surface: "#ffffff",
  surfaceMuted: "#f4f4f5",
  border: "#e4e4e7",
  text: "#18181b",
  textMuted: "#71717a",
  textInverted: "#ffffff",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
} as const;

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
