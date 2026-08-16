import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import ProductCard from "./ProductCard";
import { colors, spacing } from "../theme/theme";

export default function ProductRow({ title, subtitle, products, loading, onProductPress }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.gradientC} style={{ marginVertical: spacing.lg }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md }}
          renderItem={({ item }) => (
            <ProductCard product={item} variant="horizontal" onPress={() => onProductPress && onProductPress(item)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  headerRow: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
