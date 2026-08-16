import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/theme";

const { width } = Dimensions.get("window");

/**
 * Decorative animated backdrop: a few softly glowing gradient orbs that
 * slowly orbit / drift and pulse, giving the header a "cosmic glassmorphism"
 * feel. Purely visual — sits behind content with pointerEvents="none".
 */
export default function OrbitBackground({ height = 260 }) {
  const rotateA = useRef(new Animated.Value(0)).current;
  const rotateB = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateA, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(rotateB, {
        toValue: 1,
        duration: 26000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spinA = rotateA.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const spinB = rotateB.interpolate({ inputRange: [0, 1], outputRange: ["360deg", "0deg"] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.85] });

  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      <Animated.View style={[styles.orbitRing, { width: width * 1.1, height: width * 1.1, transform: [{ rotate: spinA }] }]}>
        <LinearGradient colors={[colors.gradientB, "transparent"]} style={styles.orbDotA} />
      </Animated.View>

      <Animated.View style={[styles.orbitRing, { width: width * 0.8, height: width * 0.8, transform: [{ rotate: spinB }] }]}>
        <LinearGradient colors={[colors.gradientC, "transparent"]} style={styles.orbDotB} />
      </Animated.View>

      <Animated.View style={[styles.glowCore, { transform: [{ scale }], opacity }]}>
        <LinearGradient colors={[colors.gradientA, colors.gradientB]} style={styles.glowGradient} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  orbitRing: {
    position: "absolute",
    top: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  orbDotA: {
    position: "absolute",
    top: 0,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  orbDotB: {
    position: "absolute",
    bottom: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  glowCore: {
    position: "absolute",
    top: 60,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 90,
    opacity: 0.35,
  },
});
