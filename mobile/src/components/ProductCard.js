import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "./GlassCard";
import { colors, spacing, radius, gradients } from "../theme/theme";

export default function ProductCard({ product, variant = "vertical", onPress }) {
  const isHorizontal = variant === "horizontal";

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={isHorizontal ? styles.hWrap : styles.vWrap}>
      <GlassCard style={{ flex: 1 }} radiusSize={radius.lg}>
        <View>
          <Image source={{ uri: product.image }} style={isHorizontal ? styles.hImage : styles.vImage} />
          <LinearGradient colors={["transparent", "rgba(11,6,32,0.55)"]} style={styles.imageFade} />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>⭐ {product.rating}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price.toLocaleString("en-IN")}</Text>
            {product.level && product.level !== "n/a" && (
              <View style={styles.levelTag}>
                <Text style={styles.levelTagText}>{product.level}</Text>
              </View>
            )}
          </View>

          {product.matchExplanation ? (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>Why this matches</Text>
              <Text style={styles.explanationText} numberOfLines={3}>{product.matchExplanation}</Text>
            </View>
          ) : null}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  vWrap: {
    width: "47%",
    marginBottom: spacing.md,
  },
  hWrap: {
    width: 190,
    marginRight: spacing.md,
  },
  vImage: {
    width: "100%",
    height: 130,
    backgroundColor: colors.glassFill,
  },
  hImage: {
    width: "100%",
    height: 120,
    backgroundColor: colors.glassFill,
  },
  imageFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(11,6,32,0.65)",
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  ratingBadgeText: {
    color: colors.ratingColor,
    fontSize: 11,
    fontWeight: "700",
  },
  body: {
    padding: spacing.sm,
  },
  brand: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "700",
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 2,
    marginBottom: 6,
    minHeight: 34,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.priceColor,
  },
  levelTag: {
    backgroundColor: colors.chipBg,
    borderColor: colors.chipBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelTagText: {
    fontSize: 9,
    color: colors.chipText,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  explanationBox: {
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    paddingTop: 6,
    marginTop: 2,
  },
  explanationLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.gradientC,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
});
