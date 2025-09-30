import { useTheme } from "@/contexts/ThemeContext";
import { useHabitStore } from "@/store/habitStore";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Card, Text } from "react-native-paper";

interface ProgressChartProps {
  type: "line" | "bar" | "pie";
  title: string;
  period: "week" | "month" | "year";
  habitId?: string; // برای نمایش یک عادت خاص
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  type,
  title,
  period,
  habitId,
}) => {
  const { t, i18n } = useTranslation();
  const { colors, isDark, formatNumber } = useTheme();
  const { history, getHabitsForDate } = useHabitStore();
  const currentLanguage = i18n.language;

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 64; // padding 32 از هر طرف

  // تنظیمات مشترک charts
  const chartConfig = {
    backgroundColor: colors.elevation.level1,
    backgroundGradientFrom: colors.elevation.level1,
    backgroundGradientTo: colors.elevation.level1,
    decimalPlaces: 0,
    color: (opacity = 1) =>
      isDark
        ? `rgba(${colors.primary
            .slice(1)
            .match(/.{2}/g)
            ?.map((hex) => parseInt(hex, 16))
            .join(", ")}, ${opacity})`
        : `rgba(103, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) =>
      isDark
        ? `rgba(255, 255, 255, ${opacity * 0.8})`
        : `rgba(45, 55, 72, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      strokeWidth: 1,
    },
    fillShadowGradient: colors.primary,
    fillShadowGradientOpacity: isDark ? 0.2 : 0.1,
    formatYLabel: (value: string) => formatNumber(value),
    formatXLabel: (value: string) => formatNumber(value),
  };

  // محاسبه داده‌های period
  const generatePeriodData = () => {
    const today = new Date();
    const data: { labels: string[]; datasets: { data: number[] }[] } = {
      labels: [],
      datasets: [{ data: [] }],
    };

    if (period === "week") {
      // 7 روز گذشته
      const persianDayNames = ["ی", "د", "س", "چ", "پ", "ج", "ش"]; // یکشنبه تا شنبه

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        let dayName: string;
        if (currentLanguage === "fa") {
          const dayIndex = date.getDay(); // 0 = یکشنبه
          dayName = persianDayNames[dayIndex];
        } else {
          dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        }

        data.labels.push(dayName);

        if (habitId) {
          // برای یک عادت خاص
          const dayHabits = getHabitsForDate(dateStr);
          const habitCompleted =
            dayHabits.find((h) => h.id === habitId)?.completed || false;
          data.datasets[0].data.push(habitCompleted ? 1 : 0);
        } else {
          // برای تمام عادت‌ها
          const dayHabits = getHabitsForDate(dateStr);
          const completed = dayHabits.filter((h) => h.completed).length;
          const total = dayHabits.length;
          const percentage =
            total > 0 ? Math.round((completed / total) * 100) : 0;
          data.datasets[0].data.push(percentage);
        }
      }
    } else if (period === "month") {
      // 30 روز گذشته (هر 5 روز یک نقطه)
      for (let i = 25; i >= 0; i -= 5) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const dayMonth = date.getDate();

        data.labels.push(formatNumber(dayMonth));

        if (habitId) {
          const dayHabits = getHabitsForDate(dateStr);
          const habitCompleted =
            dayHabits.find((h) => h.id === habitId)?.completed || false;
          data.datasets[0].data.push(habitCompleted ? 1 : 0);
        } else {
          const dayHabits = getHabitsForDate(dateStr);
          const completed = dayHabits.filter((h) => h.completed).length;
          const total = dayHabits.length;
          const percentage =
            total > 0 ? Math.round((completed / total) * 100) : 0;
          data.datasets[0].data.push(percentage);
        }
      }
    }

    return data;
  };

  // داده‌های Pie Chart برای mood distribution
  const generateMoodPieData = () => {
    const moodCounts = { good: 0, ok: 0, bad: 0 };

    Object.values(history).forEach((entry) => {
      if (entry?.mood) {
        moodCounts[entry.mood]++;
      }
    });

    return [
      {
        name: "😊",
        population: moodCounts.good,
        color: "#4CAF50",
        legendFontColor: colors.text.primary,
        legendFontSize: 20,
      },
      {
        name: "😐",
        population: moodCounts.ok,
        color: "#FF9800",
        legendFontColor: colors.text.primary,
        legendFontSize: 20,
      },
      {
        name: "😔",
        population: moodCounts.bad,
        color: "#9C27B0",
        legendFontColor: colors.text.primary,
        legendFontSize: 20,
      },
    ].filter((item) => item.population > 0);
  };

  const renderChart = () => {
    const data = generatePeriodData();

    if (type === "line") {
      return (
        <LineChart
          data={data}
          width={chartWidth}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          fromZero={true}
          yAxisSuffix={habitId ? "" : "%"}
          segments={4}
        />
      );
    } else if (type === "bar") {
      return (
        <BarChart
          data={data}
          width={chartWidth}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix={habitId ? "" : "%"}
          fromZero={true}
          showBarTops={false}
          withInnerLines={false}
          segments={4}
        />
      );
    } else if (type === "pie") {
      const pieData = generateMoodPieData().map((item) => ({
        ...item,
        // برای PieChart از name استفاده می‌کنیم که ایموجی هست، پس نیازی به تبدیل نداره
        // ولی اگر بخوایم عدد رو نشون بدیم باید فرمت کنیم
      }));
      return (
        <PieChart
          data={pieData}
          width={chartWidth}
          height={200}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) =>
              isDark
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          style={styles.chart}
          center={[10, 10]}
          hasLegend={true}
          paddingLeft="15"
          absolute
        />
      );
    }

    return null;
  };

  return (
    <Card
      style={[
        styles.chartCard,
        {
          backgroundColor: colors.elevation.level1,
          ...(isDark && {
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 8,
          }),
        },
      ]}
      mode="elevated"
    >
      <Card.Content>
        <Text
          variant="titleMedium"
          style={[styles.chartTitle, { color: colors.text.primary }]}
        >
          {title}
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.chartSubtitle, { color: colors.text.secondary }]}
        >
          {period === "week"
            ? t("charts.last7Days")
            : period === "month"
            ? t("charts.last30Days")
            : t("charts.thisYear")}
        </Text>

        <View style={styles.chartContainer}>{renderChart()}</View>

        {habitId && (
          <Text
            variant="bodySmall"
            style={[styles.chartNote, { color: colors.text.secondary }]}
          >
            💡 {t("charts.habitNote")}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  chartTitle: {
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  chartSubtitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 12,
  },
  chart: {
    borderRadius: 12,
  },
  chartNote: {
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
});

export default ProgressChart;
