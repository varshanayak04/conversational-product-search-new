import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import OrbitBackground from "../components/OrbitBackground";
import GlassCard from "../components/GlassCard";
import CategoryPill from "../components/CategoryPill";
import ProductCard from "../components/ProductCard";
import ProductRow from "../components/ProductRow";
import HeroBanner from "../components/HeroBanner";
import SearchHistoryChips from "../components/SearchHistoryChips";

import { searchProducts, getCategories, getProductsByCategory, getTrending, getRecommendations } from "../api/searchApi";
import { getHistory, addToHistory, clearHistory, removeFromHistory } from "../storage/searchHistory";
import { colors, spacing, radius, gradients } from "../theme/theme";

const EXAMPLE_QUERIES = [
  "running shoes under ₹5,000 for beginners",
  "budget smartphones under 15000",
  "noise cancelling headphones",
  "waterproof watches for men",
];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loadingHome, setLoadingHome] = useState(true);

  // view = "home" | "search" | "category"
  const [view, setView] = useState("home");
  const [activeCategory, setActiveCategory] = useState(null);
  const [results, setResults] = useState([]);
  const [resultMeta, setResultMeta] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);

  const loadHome = useCallback(async () => {
    setLoadingHome(true);
    try {
      const [cat, trend, hist] = await Promise.all([getCategories(), getTrending(10), getHistory()]);
      setCategories(cat.categories || []);
      setTrending(trend.results || []);
      setHistory(hist || []);

      const recs = await getRecommendations(hist || [], 10);
      setRecommended(recs.results || []);
    } catch (err) {
      console.warn("Home load failed:", err.message);
    } finally {
      setLoadingHome(false);
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  const runSearch = useCallback(async (text) => {
    const q = (text ?? query).trim();
    if (!q) return;
    setQuery(q);
    setView("search");
    setActiveCategory(null);
    setLoadingResults(true);
    setError(null);
    try {
      const data = await searchProducts(q);
      setResults(data.results || []);
      setResultMeta(data);
      const updatedHistory = await addToHistory(q);
      setHistory(updatedHistory);
      getRecommendations(updatedHistory, 10).then((r) => setRecommended(r.results || []));
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  }, [query]);

  const openCategory = useCallback(async (category) => {
    setView("category");
    setActiveCategory(category);
    setQuery("");
    setLoadingResults(true);
    setError(null);
    try {
      const data = await getProductsByCategory(category.key, 20);
      setResults(data.results || []);
      setResultMeta({ query: category.label });
      const updatedHistory = await addToHistory(category.key);
      setHistory(updatedHistory);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  }, []);

  const goHome = () => {
    setView("home");
    setQuery("");
    setActiveCategory(null);
    setError(null);
  };

  const onClearHistory = async () => {
    const cleared = await clearHistory();
    setHistory(cleared);
  };

  const onRemoveHistoryItem = async (item) => {
    const updated = await removeFromHistory(item);
    setHistory(updated);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <OrbitBackground height={280} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          {view !== "home" ? (
            <TouchableOpacity onPress={goHome} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={styles.greeting}>Hey there 👋</Text>
              <Text style={styles.appName}>ShopSense</Text>
            </View>
          )}
          <View style={styles.cartWrap}>
            <Ionicons name="cart-outline" size={22} color={colors.textPrimary} />
          </View>
        </View>

        <GlassCard style={styles.searchBarCard} radiusSize={radius.pill}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginLeft: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="Search running shoes, phones, watches..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => runSearch()}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={() => runSearch()} style={styles.searchIconBtn}>
              <LinearGradient colors={gradients.primary} style={styles.searchIconGradient}>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>

      {/* HOME VIEW */}
      {view === "home" && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <SearchHistoryChips history={history} onSelect={runSearch} onRemove={onRemoveHistoryItem} onClear={onClearHistory} />

          {!history.length && (
            <View style={styles.examplesWrap}>
              {EXAMPLE_QUERIES.map((ex) => (
                <TouchableOpacity key={ex} style={styles.exampleChip} onPress={() => runSearch(ex)}>
                  <Text style={styles.exampleChipText}>{ex}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <HeroBanner />

          <View style={styles.categoriesWrap}>
            <Text style={styles.sectionTitle}>Shop by category</Text>
            <FlatList
              data={categories}
              keyExtractor={(c) => c.key}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.md, marginTop: spacing.sm }}
              renderItem={({ item }) => (
                <CategoryPill category={item} active={activeCategory?.key === item.key} onPress={() => openCategory(item)} />
              )}
            />
          </View>

          <ProductRow title="Recommended for you" subtitle="Based on what you've searched" products={recommended} loading={loadingHome} />
          <ProductRow title="🔥 Trending now" products={trending} loading={loadingHome} />
        </ScrollView>
      )}

      {/* SEARCH / CATEGORY RESULTS VIEW */}
      {(view === "search" || view === "category") && (
        <View style={styles.flex}>
          {loadingResults && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.gradientC} />
              <Text style={styles.loadingText}>
                {view === "search" ? "Understanding your request..." : "Loading category..."}
              </Text>
            </View>
          )}

          {!loadingResults && error && (
            <View style={styles.centerBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
              <Text style={styles.errorHint}>Make sure the backend is running and reachable (see src/api/config.js).</Text>
            </View>
          )}

          {!loadingResults && !error && (
            <>
              <Text style={styles.resultMeta}>
                {results.length} result{results.length !== 1 ? "s" : ""} for "{resultMeta?.query}"
              </Text>
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: spacing.md }}
                contentContainerStyle={{ paddingBottom: spacing.xl }}
                ListEmptyComponent={
                  <View style={styles.centerBox}>
                    <Text style={styles.emptyText}>No products matched. Try a different search.</Text>
                  </View>
                }
                renderItem={({ item }) => <ProductCard product={item} variant="vertical" />}
              />
            </>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingTop: spacing.xl + 10,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  greeting: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
  appName: { color: colors.textPrimary, fontSize: 26, fontWeight: "900", letterSpacing: 0.3 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  cartWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarCard: { paddingVertical: 2 },
  searchRow: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  searchIconBtn: { padding: 4 },
  searchIconGradient: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  examplesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  exampleChip: {
    backgroundColor: colors.glassFill,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  exampleChipText: { color: colors.textSecondary, fontSize: 12 },
  categoriesWrap: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  loadingText: { color: colors.textPrimary, marginTop: spacing.sm },
  errorText: { color: colors.danger, fontSize: 15, fontWeight: "700", textAlign: "center" },
  errorHint: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs, textAlign: "center" },
  resultMeta: { color: colors.textMuted, fontSize: 12, marginLeft: spacing.md, marginBottom: spacing.sm },
  emptyText: { color: colors.textPrimary, textAlign: "center" },
});
