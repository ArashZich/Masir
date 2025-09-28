import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useCallback } from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export const CustomSplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
}) => {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const fadeOpacity = useSharedValue(1);

  const finishSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const startAnimation = async () => {
      // Keep native splash screen visible
      await SplashScreen.preventAutoHideAsync();

      // Start logo animation
      logoScale.value = withSpring(1, { damping: 15, stiffness: 200 });
      logoOpacity.value = withTiming(1, { duration: 800 });

      // Show text after logo
      setTimeout(() => {
        textOpacity.value = withTiming(1, { duration: 600 });
      }, 500);

      // Fade out and finish
      setTimeout(() => {
        fadeOpacity.value = withTiming(0, { duration: 500 });
        // Use regular setTimeout to call finishSplash
        setTimeout(finishSplash, 500);
      }, 2500);
    };

    startAnimation();
  }, [logoScale, logoOpacity, textOpacity, fadeOpacity, finishSplash]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));


  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LinearGradient
        colors={["#1A237E", "#3949AB", "#5C6BC0"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Text style={styles.masirText}>Masir</Text>
          </Animated.View>

          {/* Loading Indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar}>
              <LinearGradient
                colors={["#ffffff40", "#ffffff80", "#ffffff40"]}
                style={styles.loadingProgress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  masirText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 2,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    width: width * 0.6,
  },
  loadingBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    width: "100%",
  },
});
