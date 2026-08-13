import { Text, View, type StyleProp, type ViewStyle } from "react-native";

import { fontSizes, fontWeights, radii } from "../tokens";
import { resolveBadgeColors, type BadgeTone } from "../variants";

export interface BadgeProps {
  tone?: BadgeTone;
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ tone = "neutral", label, style }: BadgeProps) {
  const palette = resolveBadgeColors(tone);

  return (
    <View
      style={[
        {
          alignSelf: "flex-start",
          backgroundColor: palette.background,
          borderRadius: radii.pill,
          paddingVertical: 2,
          paddingHorizontal: 10,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: palette.foreground,
          fontSize: fontSizes.xs,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
