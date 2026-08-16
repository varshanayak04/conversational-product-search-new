import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { colors, radius } from "../theme/theme";

export default function GlassCard({ children, style, intensity = 40, radiusSize = radius.lg, tint = "dark" }) {
  return (
    <View style={[{ borderRadius: radiusSize, overflow: "hidden" }, style]}>
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <View style={[styles.overlay, { borderRadius: radiusSize }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...Platform.select({
      ios: {
        shadowColor: "#7C3AED",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
    }),
  },
});
