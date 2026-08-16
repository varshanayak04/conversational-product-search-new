import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { colors, radius, spacing } from "../theme/theme";

export default function CategoryPill({ category, active, onPress }) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: `https://loremflickr.com/120/120/${category.keyword}?lock=${category.key}` }}
        style={[styles.avatar, active && styles.avatarActive]}
      />
      <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    width: 72,
    marginRight: spacing.sm,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: colors.glassBorder,
    marginBottom: 6,
    backgroundColor: colors.glassFill,
  },
  avatarActive: {
    borderColor: colors.gradientC,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
    textAlign: "center",
  },
  labelActive: {
    color: colors.textPrimary,
  },
});
