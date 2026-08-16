import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "shopsense.searchHistory";
const MAX_ITEMS = 15;

export async function getHistory() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addToHistory(query) {
  if (!query || !query.trim()) return getHistory();
  try {
    const current = await getHistory();
    const deduped = [query, ...current.filter((q) => q.toLowerCase() !== query.toLowerCase())];
    const trimmed = deduped.slice(0, MAX_ITEMS);
    await AsyncStorage.setItem(KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch {
    return getHistory();
  }
}

export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // no-op
  }
  return [];
}

export async function removeFromHistory(query) {
  try {
    const current = await getHistory();
    const filtered = current.filter((q) => q !== query);
    await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
    return filtered;
  } catch {
    return getHistory();
  }
}
