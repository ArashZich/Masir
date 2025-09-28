import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useSettingsStore } from "@/store/settingsStore";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import GardenScreen from "./screens/GardenScreen";
import MoodSystemScreen from "./screens/MoodSystemScreen";
import PhilosophyScreen from "./screens/PhilosophyScreen";
import StartJourneyScreen from "./screens/StartJourneyScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const { colors } = useTheme();
  const { setOnboardingCompleted } = useSettingsStore();
  const { t, changeLanguage, getFlexDirection, getDirectionalIcon } =
    useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const totalPages = 5;

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    return () => StatusBar.setBarStyle("default");
  }, []);

  const handleLanguageSelect = async (selectedLanguage: "fa" | "en") => {
    await changeLanguage(selectedLanguage);

    // Next page automatically after language selection
    setTimeout(() => {
      pagerRef.current?.setPage(1);
    }, 500);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  // const handlePrevious = () => {
  //   if (currentPage > 0) {
  //     pagerRef.current?.setPage(currentPage - 1);
  //   }
  // };

  const handleComplete = () => {
    setOnboardingCompleted(true);
    onComplete();
  };

  const handleSkip = () => {
    setOnboardingCompleted(true);
    onComplete();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e: any) => setCurrentPage(e.nativeEvent.position)}
        scrollEnabled={currentPage > 0} // Disable swipe on first page until language is selected
      >
        <View key="welcome">
          <WelcomeScreen onLanguageSelect={handleLanguageSelect} />
        </View>

        <View key="philosophy">
          <PhilosophyScreen />
        </View>

        <View key="mood">
          <MoodSystemScreen />
        </View>

        <View key="garden">
          <GardenScreen />
        </View>

        <View key="start">
          <StartJourneyScreen onComplete={handleComplete} />
        </View>
      </PagerView>

      {/* Navigation Controls */}
      {currentPage > 0 && currentPage < totalPages - 1 && (
        <View
          style={[
            styles.navigationContainer,
            { flexDirection: getFlexDirection() },
          ]}
        >
          {/* Skip Button */}
          <View style={styles.skipButtonContainer}>
            <Button
              mode="text"
              onPress={handleSkip}
              textColor={colors.onPrimary}
              compact
            >
              {t("common.skip")}
            </Button>
          </View>

          {/* Page Indicators */}
          <View style={styles.indicatorContainer}>
            {Array.from({ length: totalPages - 1 }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor:
                      index + 1 === currentPage
                        ? colors.onPrimary
                        : `${colors.onPrimary}40`,
                  },
                ]}
              />
            ))}
          </View>

          {/* Next/Previous Buttons */}
          <View
            style={[
              styles.buttonContainer,
              { flexDirection: getFlexDirection() },
            ]}
          >
            {/* {currentPage > 1 && (
              <Button
                mode="text"
                onPress={handlePrevious}
                textColor={colors.onPrimary}
                icon={getDirectionalIcon("chevron-right", "chevron-left")}
                compact
              >
                {t("common.back")}
              </Button>
            )} */}

            <Button
              mode="contained"
              onPress={handleNext}
              buttonColor={colors.onPrimary}
              textColor={colors.primary}
              icon={getDirectionalIcon("chevron-left", "chevron-right")}
              contentStyle={[
                styles.nextButtonContent,
                { flexDirection: getFlexDirection("row-reverse") },
              ]}
            >
              {t("common.next")}
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  navigationContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  skipButtonContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  nextButtonContent: {
    flexDirection: "row-reverse",
  },
});
