"use client";

import type { ButtonHTMLAttributes, CSSProperties } from "react";

import { radii, fontWeights } from "../tokens";
import {
  buttonSizing,
  resolveButtonColors,
  type ButtonSize,
  type ButtonVariant,
} from "../variants";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  style?: CSSProperties;
}

/**
 * Web button. Colours and sizing come from the shared variant helpers, so it
 * stays visually in step with `@criation/ui/native`'s Button.
 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const palette = resolveButtonColors(variant);
  const sizing = buttonSizing[size];

  const baseStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: palette.background,
    color: palette.foreground,
    border: `1px solid ${palette.border}`,
    borderRadius: radii.md,
    padding: `${sizing.paddingVertical}px ${sizing.paddingHorizontal}px`,
    fontSize: sizing.fontSize,
    fontWeight: fontWeights.medium,
    lineHeight: 1.2,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? "100%" : undefined,
    transition: "background-color 120ms ease, opacity 120ms ease",
  };

  return <button type="button" disabled={disabled} style={{ ...baseStyle, ...style }} {...rest} />;
}
