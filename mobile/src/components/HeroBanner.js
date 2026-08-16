import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, spacing, gradients } from "../theme/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - spacing.md * 2;

const BANNERS = [
  {
    id: "b1",
    title: "Big Style Sale",
    subtitle: "Up to 40% off on running shoes",
    image: "https://loremflickr.com/700/300/sneakers,sale?lock=101",
  },
  {
    id: "b2",
    title: "New Arrivals",
    subtitle: "Latest smartphones just dropped",
    image: "https://loremflickr.com/700/300/smartphone,new?lock=102",
  },
  {
    id: "b3",
    title: "Gear Up",
    subtitle: "Premium headphones & audio",
    image: "https://loremflickr.com/700/300/headphones,studio?lock=103",
  },
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % BANNERS.length;
        ref.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={ref}
        data={BANNERS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + spacing.md}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: CARD_WIDTH }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <LinearGradient colors={["rgba(11,6,32,0.1)", "rgba(11,6,32,0.85)"]} style={StyleSheet.absoluteFill} />
            <View style={styles.textWrap}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.dots}>
        {BANNERS.map((b, i) => (
          <View key={b.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  card: {
    height: 150,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  image: { width: "100%", height: "100%", position: "absolute" },
  textWrap: { position: "absolute", bottom: 14, left: 16, right: 16 },
  title: { color: "#fff", fontSize: 19, fontWeight: "800" },
  subtitle: { color: "#E5E0FF", fontSize: 12, marginTop: 2, fontWeight: "500" },
  dots: { flexDirection: "row", justifyContent: "center", marginTop: spacing.sm },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.glassBorder,
    marginHorizontal: 3,
  },
  dotActive: { backgroundColor: colors.gradientC, width: 16 },
});
