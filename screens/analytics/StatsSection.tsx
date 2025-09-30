import { ThemedCard } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { analyticsStyles as styles } from "@/styles/analytics.styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Avatar, Chip, ProgressBar, Text } from "react-native-paper";

interface StatsSectionProps {
  totalHabits: number;
  completedToday: number;
  todayProgress: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  totalHabits,
  completedToday,
  todayProgress,
}) => {
  const { t } = useTranslation();
  const { colors, isDark, formatNumber } = useTheme();

  return (
    <ThemedCard elevation={1} style={styles.statsCard}>
      <ThemedCard.Content>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: colors.text.primary }]}
        >
          {t("overview.statistics")}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Avatar.Icon
              size={48}
              icon="target"
              style={[styles.statIcon, { backgroundColor: "#52c41a" }]}
            />
            <Text
              variant="headlineSmall"
              style={[styles.statNumber, { color: colors.text.primary }]}
            >
              {formatNumber(totalHabits)}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.statLabel, { color: colors.text.secondary }]}
            >
              {t("overview.totalHabits")}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Avatar.Icon
              size={48}
              icon="check-circle"
              style={[styles.statIcon, { backgroundColor: "#1890ff" }]}
            />
            <Text
              variant="headlineSmall"
              style={[styles.statNumber, { color: colors.text.primary }]}
            >
              {formatNumber(completedToday)}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.statLabel, { color: colors.text.secondary }]}
            >
              {t("overview.completedToday")}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text
              variant="bodyLarge"
              style={[styles.progressLabel, { color: colors.text.primary }]}
            >
              {t("today.progress")}
            </Text>
            <Chip
              icon="trophy"
              mode="flat"
              style={[
                styles.progressChip,
                {
                  backgroundColor: isDark
                    ? "rgba(82, 196, 26, 0.2)"
                    : "rgba(82, 196, 26, 0.1)",
                },
              ]}
            >
              {formatNumber(Math.round(todayProgress * 100))}%
            </Chip>
          </View>
          <ProgressBar
            progress={todayProgress}
            style={styles.progressBar}
            color={colors.secondary}
          />
        </View>
      </ThemedCard.Content>
    </ThemedCard>
  );
};
