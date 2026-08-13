import { ProductStatus, type ProductSummary } from "@criation/types";
import { Badge, Card, PriceTag, colors, spacing } from "@criation/ui/native";
import { titleCase } from "@criation/utils";
import { productFiltersSchema } from "@criation/validation";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { appConfig } from "./src/lib/config";

// Sample data stands in for `api.products.list()`; the types are the same ones
// the web app and the backend use.
const featured: ProductSummary[] = [
  {
    id: "prd_linen_shirt",
    name: "Linen Shirt",
    slug: "linen-shirt",
    price: 249900,
    currency: "INR",
    status: ProductStatus.Active,
    rating: 4.6,
  },
  {
    id: "prd_canvas_tote",
    name: "Canvas Tote",
    slug: "canvas-tote",
    price: 129900,
    currency: "INR",
    status: ProductStatus.Active,
    rating: 4.8,
  },
];

// Proves `@criation/validation` runs under Metro too.
const defaultFilters = productFiltersSchema.parse({});

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Badge tone="brand" label="Mobile" />
          <Text style={styles.title}>{appConfig.appName}</Text>
          <Text style={styles.subtitle}>
            {titleCase(appConfig.environment)} · {appConfig.apiUrl} · page {defaultFilters.page} of{" "}
            {defaultFilters.pageSize} per page
          </Text>
        </View>

        {featured.map((product) => (
          <Card key={product.id} title={product.name} subtitle={`/${product.slug}`}>
            <Badge
              tone={product.status === ProductStatus.Active ? "success" : "neutral"}
              label={product.status}
            />
            <PriceTag amount={product.price} currency={product.currency} />
          </Card>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
