import React, { useState } from "react";
import { ProductStatus, type ProductSummary } from "@criation/types";
import { Badge, Button, Card, PriceTag, colors, spacing, radii, fontSizes, fontWeights } from "@criation/ui/native";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { appConfig } from "./src/lib/config";

const sampleProducts: ProductSummary[] = [
  {
    id: "prd_sunflower_keychain",
    name: "Sunflower Joy Crochet Charm",
    slug: "sunflower-joy-crochet-keychain",
    price: 34900,
    currency: "INR",
    status: ProductStatus.Active,
    rating: 4.9,
  },
  {
    id: "prd_designer_brass_diya",
    name: "Royal Peacock Brass Diya",
    slug: "royal-peacock-designer-diya",
    price: 129900,
    currency: "INR",
    status: ProductStatus.Active,
    rating: 4.8,
  },
  {
    id: "prd_pearl_flower_vase",
    name: "Imperial Pearl Flower Urli",
    slug: "imperial-pearl-flower-vase",
    price: 249900,
    currency: "INR",
    status: ProductStatus.Active,
    rating: 5.0,
  },
  {
    id: "prd_laddu_gopal_poshak",
    name: "Vrindavan Zari Laddu Gopal Poshak",
    slug: "vrindavan-zari-poshak",
    price: 89900,
    currency: "INR",
    status: ProductStatus.Active,
    rating: 4.7,
  },
];

const categories = ["All Crafts", "Crochet Charms", "Diya & Decor", "Dropship", "Poshak"];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All Crafts");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"home" | "shop" | "cart" | "account">("home");

  const filteredProducts = sampleProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />

      {/* Top Mobile Brand Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>C</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>
              Criation<Text style={styles.brandDot}>.</Text>
            </Text>
            <Text style={styles.brandSubtitle}>Handcrafted & Dropshipping</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cartIconBadge} activeOpacity={0.8}>
          <Text style={styles.cartIconText}>🛍️</Text>
          {cartCount > 0 && (
            <View style={styles.badgeCircle}>
              <Text style={styles.badgeNumber}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search handcrafted crafts, gifts..."
            placeholderTextColor="#9c9184"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Horizontal Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChips}>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.chip, isSelected && styles.chipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Hero Welcome Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerPill}>
            <Text style={styles.bannerPillText}>✨ Authentic Heritage</Text>
          </View>
          <Text style={styles.bannerHeading}>Direct From Artisans to Your Doorstep</Text>
          <Text style={styles.bannerSubtext}>
            Supporting rural craftswomen across India with fast, pan-India & global delivery.
          </Text>
        </View>

        {/* Product Grid Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Crafts ({filteredProducts.length})</Text>
          <Text style={styles.sectionLink}>View All ›</Text>
        </View>

        <View style={styles.productList}>
          {filteredProducts.map((product) => (
            <Card key={product.id} title={product.name} subtitle={`★ ${product.rating} · Handcrafted`}>
              <View style={styles.productMeta}>
                <Badge
                  tone={product.status === ProductStatus.Active ? "brand" : "neutral"}
                  label={product.status === ProductStatus.Active ? "In Stock" : "Sold Out"}
                />
                <PriceTag amount={product.price} currency={product.currency} />
              </View>

              <Button
                label="Add to Cart"
                variant="primary"
                size="sm"
                fullWidth
                onPress={() => setCartCount((prev) => prev + 1)}
              />
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Mobile Tab Bar */}
      <View style={styles.bottomNav}>
        {[
          { id: "home", label: "Home", icon: "🏠" },
          { id: "shop", label: "Shop", icon: "🛍️" },
          { id: "cart", label: "Cart", icon: "🛒", badge: cartCount },
          { id: "account", label: "Account", icon: "👤" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconWrap}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                {Boolean(tab.badge && tab.badge > 0) && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#faf7f2",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e0d4",
    backgroundColor: "#faf7f2",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: "#c25e3f",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: fontWeights.semibold,
  },
  brandTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: "#241f1c",
  },
  brandDot: {
    color: "#c25e3f",
  },
  brandSubtitle: {
    fontSize: 10,
    color: "#756c63",
  },
  cartIconBadge: {
    position: "relative",
    padding: spacing.xs,
  },
  cartIconText: {
    fontSize: 22,
  },
  badgeCircle: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#c25e3f",
    borderRadius: radii.pill,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeNumber: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: fontWeights.semibold,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 70,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "#e8e0d4",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: "#241f1c",
    paddingVertical: spacing.xs,
  },
  clearSearch: {
    color: "#9c9184",
    fontSize: 14,
    paddingHorizontal: spacing.xs,
  },
  categoryChips: {
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e8e0d4",
  },
  chipActive: {
    backgroundColor: "#c25e3f",
    borderColor: "#c25e3f",
  },
  chipText: {
    fontSize: 12,
    fontWeight: fontWeights.medium,
    color: "#756c63",
  },
  chipTextActive: {
    color: "#ffffff",
    fontWeight: fontWeights.semibold,
  },
  banner: {
    backgroundColor: "#f4efe6",
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "#e8e0d4",
    gap: spacing.xs,
  },
  bannerPill: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#e8e0d4",
  },
  bannerPillText: {
    fontSize: 10,
    fontWeight: fontWeights.semibold,
    color: "#c25e3f",
  },
  bannerHeading: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: "#241f1c",
  },
  bannerSubtext: {
    fontSize: 11,
    color: "#756c63",
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: "#241f1c",
  },
  sectionLink: {
    fontSize: fontSizes.xs,
    color: "#c25e3f",
    fontWeight: fontWeights.semibold,
  },
  productList: {
    gap: spacing.md,
  },
  productMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e8e0d4",
    paddingVertical: spacing.xs,
    paddingBottom: spacing.sm,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
  },
  tabIconWrap: {
    position: "relative",
  },
  tabIcon: {
    fontSize: 18,
  },
  tabBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#c25e3f",
    borderRadius: radii.pill,
    minWidth: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBadgeText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: fontWeights.semibold,
  },
  tabLabel: {
    fontSize: 10,
    color: "#756c63",
    fontWeight: fontWeights.medium,
    marginTop: 2,
  },
  tabLabelActive: {
    color: "#c25e3f",
    fontWeight: fontWeights.semibold,
  },
});
