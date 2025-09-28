import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { MoodIcon } from "../icons/MoodIcon";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

type MoodType = "good" | "ok" | "bad" | null;

export default function MoodSystemScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);

  const moodColors = {
    good: "#4CAF50",
    ok: "#FF9800",
    bad: "#9C27B0",
  };

  const moods = [
    { type: "good" as const, emoji: "😊", label: t("mood.good") },
    { type: "ok" as const, emoji: "😐", label: t("mood.ok") },
    { type: "bad" as const, emoji: "😔", label: t("mood.bad") },
  ];

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    // Reset after 2 seconds for demo
    setTimeout(() => setSelectedMood(null), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Mood Icon */}
      <View style={styles.iconContainer}>
        <MoodIcon size={100} color={colors.onPrimary} />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text
          variant="headlineLarge"
          style={[styles.title, { color: colors.onPrimary }]}
        >
          {t("onboarding.mood.title")}
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, { color: colors.onPrimary }]}
        >
          {t("onboarding.mood.subtitle")}
        </Text>
      </View>

      {/* Interactive Mood Selector */}
      <View style={styles.moodContainer}>
        <Text
          variant="titleMedium"
          style={[styles.tryItText, { color: colors.onPrimary }]}
        >
          {t("onboarding.mood.tryIt")}
        </Text>

        <View style={styles.moodSelector}>
          {moods.map((mood, index) => (
            <MoodButton
              key={mood.type}
              mood={mood}
              isSelected={selectedMood === mood.type}
              onPress={() => handleMoodSelect(mood.type)}
              colors={colors}
              moodColor={moodColors[mood.type]}
            />
          ))}
        </View>

        {selectedMood && (
          <View
            style={[
              styles.feedbackContainer,
              { backgroundColor: `${moodColors[selectedMood]}20` },
            ]}
          >
            <Text
              variant="bodyMedium"
              style={[styles.feedbackText, { color: colors.onPrimary }]}
            >
              {t(`onboarding.mood.feedback.${selectedMood}`)}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text
          variant="bodyMedium"
          style={[styles.description, { color: colors.onPrimary }]}
        >
          {t("onboarding.mood.description")}
        </Text>
      </View>

      {/* Decorative Elements */}
      <View
        style={[
          styles.decorativeHeart,
          { backgroundColor: `${colors.onPrimary}15` },
        ]}
      />
    </View>
  );
}

interface MoodButtonProps {
  mood: { type: MoodType; emoji: string; label: string };
  isSelected: boolean;
  onPress: () => void;
  colors: any;
  moodColor: string;
}

function MoodButton({
  mood,
  isSelected,
  onPress,
  colors,
  moodColor,
}: MoodButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <Surface
        style={[
          styles.moodButton,
          {
            backgroundColor: isSelected ? moodColor : `${colors.onPrimary}20`,
            borderColor: isSelected ? colors.onPrimary : "transparent",
          },
        ]}
        elevation={isSelected ? 5 : 0}
      >
        <Text variant="headlineMedium" style={styles.moodEmoji}>
          {mood.emoji}
        </Text>
        <Text
          variant="labelMedium"
          style={[
            styles.moodLabel,
            { color: isSelected ? colors.onPrimary : colors.onPrimary },
          ]}
        >
          {mood.label}
        </Text>
      </Surface>
    </Pressable>
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
  moodContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  tryItText: {
    marginBottom: 24,
    opacity: 0.9,
  },
  moodSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 16,
  },
  moodButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 20,
    marginHorizontal: 8,
    borderWidth: 2,
  },
  moodEmoji: {
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  feedbackContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
  },
  feedbackText: {
    textAlign: "center",
    opacity: 0.9,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
  },
  description: {
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.85,
  },
  decorativeHeart: {
    position: "absolute",
    top: 120,
    right: 30,
    width: 20,
    height: 20,
    borderRadius: 10,
    transform: [{ rotate: "45deg" }],
  },
});
