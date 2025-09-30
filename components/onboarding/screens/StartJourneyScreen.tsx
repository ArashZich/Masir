import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { StartJourneyIcon } from "../icons/StartJourneyIcon";

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StartJourneyScreenProps {
  onComplete: () => void;
}

export default function StartJourneyScreen({
  onComplete,
}: StartJourneyScreenProps) {
  const { colors, formatNumber } = useTheme();
  const { t, isRTL } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Start Journey Icon */}
      <View style={styles.iconContainer}>
        <StartJourneyIcon size={120} color={colors.onPrimary} />
      </View>

      {/* Welcome Title */}
      <View style={styles.titleContainer}>
        <Text
          variant="headlineLarge"
          style={[styles.title, { color: colors.onPrimary }]}
        >
          {t("onboarding.start.title")}
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, { color: colors.onPrimary }]}
        >
          {t("onboarding.start.subtitle")}
        </Text>
      </View>

      {/* Journey Steps */}
      <View style={styles.stepsContainer}>
        <Text
          variant="titleMedium"
          style={[styles.stepsTitle, { color: colors.onPrimary }]}
        >
          {t("onboarding.start.stepsTitle")}
        </Text>

        <View style={styles.steps}>
          <StepItem
            step={formatNumber("1")}
            text={t("onboarding.start.step1")}
            colors={colors}
            isRTL={isRTL}
          />
          <StepItem
            step={formatNumber("2")}
            text={t("onboarding.start.step2")}
            colors={colors}
            isRTL={isRTL}
          />
          <StepItem
            step={formatNumber("3")}
            text={t("onboarding.start.step3")}
            colors={colors}
            isRTL={isRTL}
          />
        </View>
      </View>

      {/* Encouragement */}
      <View style={styles.encouragementContainer}>
        <Text
          variant="bodyMedium"
          style={[styles.encouragement, { color: colors.onPrimary }]}
        >
          {t("onboarding.start.encouragement")}
        </Text>
      </View>

      {/* Start Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={onComplete}
          buttonColor={colors.onPrimary}
          textColor={colors.primary}
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
          labelStyle={styles.startButtonLabel}
          icon="rocket-launch"
        >
          {t("onboarding.start.button")}
        </Button>
      </View>

      {/* Decorative Stars */}
      <View
        style={[
          styles.decorativeStar1,
          { backgroundColor: `${colors.onPrimary}20` },
        ]}
      />
      <View
        style={[
          styles.decorativeStar2,
          { backgroundColor: `${colors.onPrimary}15` },
        ]}
      />
      <View
        style={[
          styles.decorativeStar3,
          { backgroundColor: `${colors.onPrimary}25` },
        ]}
      />
    </View>
  );
}

interface StepItemProps {
  step: string;
  text: string;
  colors: any;
  isRTL: boolean;
}

function StepItem({ step, text, colors, isRTL }: StepItemProps) {
  return (
    <View
      style={[
        styles.stepItem,
        { flexDirection: isRTL ? "row" : "row-reverse" },
      ]}
    >
      <View style={[styles.stepNumber, { backgroundColor: colors.onPrimary }]}>
        <Text
          variant="labelLarge"
          style={[styles.stepNumberText, { color: colors.primary }]}
        >
          {step}
        </Text>
      </View>
      <Text
        variant="bodyMedium"
        style={[styles.stepText, { color: colors.onPrimary }]}
      >
        {text}
      </Text>
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
    marginBottom: 32,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.9,
  },
  stepsContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  stepsTitle: {
    marginBottom: 24,
    opacity: 0.9,
  },
  steps: {
    width: "100%",
  },
  stepItem: {
    alignItems: "center",
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  stepNumberText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    lineHeight: 20,
    opacity: 0.9,
  },
  encouragementContainer: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  encouragement: {
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.85,
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  startButton: {
    borderRadius: 16,
    elevation: 4,
  },
  startButtonContent: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  startButtonLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  decorativeStar1: {
    position: "absolute",
    top: 80,
    right: 40,
    width: 8,
    height: 8,
    borderRadius: 4,
    transform: [{ rotate: "45deg" }],
  },
  decorativeStar2: {
    position: "absolute",
    top: 150,
    left: 30,
    width: 6,
    height: 6,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
  },
  decorativeStar3: {
    position: "absolute",
    bottom: 150,
    right: 60,
    width: 10,
    height: 10,
    borderRadius: 5,
    transform: [{ rotate: "45deg" }],
  },
});
