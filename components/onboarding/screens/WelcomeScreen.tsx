import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { WelcomeIcon } from "../icons/WelcomeIcon";

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Welcome Icon */}
      <View style={styles.iconContainer}>
        <WelcomeIcon size={120} color={colors.onPrimary} />
      </View>

      {/* App Name */}
      <View style={styles.textContainer}>
        <Text
          variant="displayLarge"
          style={[styles.title, { color: colors.onPrimary }]}
        >
          🗺️ مسیر
        </Text>
        <Text
          variant="displayLarge"
          style={[styles.title, { color: colors.onPrimary }]}
        >
          Masir
        </Text>
      </View>

      {/* Decorative Elements */}
      <View
        style={[
          styles.decorativeCircle1,
          { backgroundColor: `${colors.onPrimary}15` },
        ]}
      />
      <View
        style={[
          styles.decorativeCircle2,
          { backgroundColor: `${colors.onPrimary}10` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 4,
  },
  subtitle: {
    opacity: 0.9,
    textAlign: "center",
    marginTop: 16,
    fontWeight: "300",
  },
  decorativeCircle1: {
    position: "absolute",
    top: 100,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: 100,
    left: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
});
