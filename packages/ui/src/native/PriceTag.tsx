import { formatPrice } from "@criation/utils";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, fontSizes, fontWeights, spacing } from "../tokens";

export interface PriceTagProps {
  /** Price in the smallest currency unit. */
  amount: number;
  currency?: string;
  locale?: string;
  compareAtAmount?: number | null;
  style?: StyleProp<ViewStyle>;
}

export function PriceTag({ amount, currency, locale, compareAtAmount, style }: PriceTagProps) {
  const showCompare = typeof compareAtAmount === "number" && compareAtAmount > amount;

  return (
    <View style={[{ flexDirection: "row", alignItems: "baseline", gap: spacing.sm }, style]}>
      <Text
        style={{
          fontSize: fontSizes.lg,
          fontWeight: fontWeights.semibold,
          color: colors.text,
        }}
      >
        {formatPrice(amount, { currency, locale })}
      </Text>
      {showCompare ? (
        <Text
          style={{
            fontSize: fontSizes.sm,
            color: colors.textMuted,
            textDecorationLine: "line-through",
          }}
        >
          {formatPrice(compareAtAmount, { currency, locale })}
        </Text>
      ) : null}
    </View>
  );
}
