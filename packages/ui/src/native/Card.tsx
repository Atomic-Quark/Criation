import type { ReactNode } from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, fontSizes, fontWeights, radii, spacing } from "../tokens";

export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ title, subtitle, children, style }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radii.lg,
          padding: spacing.xl,
          gap: spacing.md,
        },
        style,
      ]}
    >
      {title ? (
        <Text
          style={{
            fontSize: fontSizes.lg,
            fontWeight: fontWeights.semibold,
            color: colors.text,
          }}
        >
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text style={{ fontSize: fontSizes.sm, color: colors.textMuted }}>{subtitle}</Text>
      ) : null}
      {children}
    </View>
  );
}
