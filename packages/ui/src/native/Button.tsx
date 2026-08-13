import { Pressable, Text, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { fontWeights, radii } from "../tokens";
import {
  buttonSizing,
  resolveButtonColors,
  type ButtonSize,
  type ButtonVariant,
} from "../variants";

export interface ButtonProps extends Omit<PressableProps, "style" | "children"> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * React Native button sharing colour and sizing logic with the web Button
 * through `resolveButtonColors` / `buttonSizing`.
 */
export function Button({
  label,
  variant = "primary",
  size = "md",
  fullWidth = false,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const palette = resolveButtonColors(variant);
  const sizing = buttonSizing[size];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.background,
          borderColor: palette.border,
          borderWidth: 1,
          borderRadius: radii.md,
          paddingVertical: sizing.paddingVertical,
          paddingHorizontal: sizing.paddingHorizontal,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        style={{
          color: palette.foreground,
          fontSize: sizing.fontSize,
          fontWeight: fontWeights.medium,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
