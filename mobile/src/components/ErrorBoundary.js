import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Catches render-time errors anywhere below it so the app shows a readable
// message instead of a silent blank screen. Without this, an uncaught error
// in any child component unmounts the whole tree and the browser/simulator
// just shows white space, with the real error only visible in devtools.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ShopSense crashed:", error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView contentContainerStyle={styles.wrap}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{String(this.state.error?.message || this.state.error)}</Text>
          <Text style={styles.hint}>
            Check that the backend is running (npm start in /backend) and that
            src/api/config.js points at the right URL.
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#0B0620" },
  title: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  message: { color: "#F87171", fontSize: 14, textAlign: "center", marginBottom: 8 },
  hint: { color: "#9CA3AF", fontSize: 12, textAlign: "center" },
});
