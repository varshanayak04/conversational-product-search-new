import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../theme/theme";

export default function SearchHistoryChips({ history, onSelect, onRemove, onClear }) {
  if (!history || !history.length) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recent searches</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {history.map((item) => (
          <View key={item} style={styles.chip}>
            <TouchableOpacity onPress={() => onSelect(item)}>
              <Text style={styles.chipText} numberOfLines={1}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onRemove(item)} style={styles.removeBtn}>
              <Ionicons name="close" size={12} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  title: { fontSize: 13, fontWeight: "700", color: colors.textSecondary },
  clearText: { fontSize: 12, color: colors.gradientC, fontWeight: "600" },
  row: { paddingHorizontal: spacing.md },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.chipBg,
    borderColor: colors.chipBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    marginRight: spacing.xs,
    maxWidth: 200,
  },
  chipText: { color: colors.chipText, fontSize: 12, fontWeight: "600", maxWidth: 150 },
  removeBtn: { marginLeft: 6, padding: 2 },
});
