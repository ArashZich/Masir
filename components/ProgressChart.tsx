import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useHabitStore } from '@/store/habitStore';

interface ProgressChartProps {
  type: 'line' | 'bar' | 'pie';
  title: string;
  period: 'week' | 'month' | 'year';
  habitId?: string; // برای نمایش یک عادت خاص
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  type,
  title,
  period,
  habitId
}) => {
  const { t } = useTranslation();
  const { history, getHabitsForDate } = useHabitStore();

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; // padding 32 از هر طرف

  // تنظیمات مشترک charts
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(103, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#667eea'
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(0,0,0,0.1)',
      strokeWidth: 1
    },
    fillShadowGradient: '#667eea',
    fillShadowGradientOpacity: 0.1,
  };

  // محاسبه داده‌های period
  const generatePeriodData = () => {
    const today = new Date();
    const data: { labels: string[], datasets: { data: number[] }[] } = {
      labels: [],
      datasets: [{ data: [] }]
    };

    if (period === 'week') {
      // 7 روز گذشته
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        data.labels.push(dayName);

        if (habitId) {
          // برای یک عادت خاص
          const dayHabits = getHabitsForDate(dateStr);
          const habitCompleted = dayHabits.find(h => h.id === habitId)?.completed || false;
          data.datasets[0].data.push(habitCompleted ? 1 : 0);
        } else {
          // برای تمام عادت‌ها
          const dayHabits = getHabitsForDate(dateStr);
          const completed = dayHabits.filter(h => h.completed).length;
          const total = dayHabits.length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          data.datasets[0].data.push(percentage);
        }
      }
    } else if (period === 'month') {
      // 30 روز گذشته (هر 5 روز یک نقطه)
      for (let i = 25; i >= 0; i -= 5) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayMonth = date.getDate();

        data.labels.push(dayMonth.toString());

        if (habitId) {
          const dayHabits = getHabitsForDate(dateStr);
          const habitCompleted = dayHabits.find(h => h.id === habitId)?.completed || false;
          data.datasets[0].data.push(habitCompleted ? 1 : 0);
        } else {
          const dayHabits = getHabitsForDate(dateStr);
          const completed = dayHabits.filter(h => h.completed).length;
          const total = dayHabits.length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          data.datasets[0].data.push(percentage);
        }
      }
    }

    return data;
  };

  // داده‌های Pie Chart برای mood distribution
  const generateMoodPieData = () => {
    const moodCounts = { good: 0, ok: 0, bad: 0 };

    Object.values(history).forEach(entry => {
      if (entry?.mood) {
        moodCounts[entry.mood]++;
      }
    });

    const total = moodCounts.good + moodCounts.ok + moodCounts.bad;

    if (total === 0) {
      return [
        { name: t('mood.noData'), population: 1, color: '#e0e0e0', legendFontColor: '#666' }
      ];
    }

    return [
      {
        name: `😊 ${t('mood.good')}`,
        population: moodCounts.good,
        color: '#4CAF50',
        legendFontColor: '#2d3748',
        legendFontSize: 12,
      },
      {
        name: `😐 ${t('mood.ok')}`,
        population: moodCounts.ok,
        color: '#FF9800',
        legendFontColor: '#2d3748',
        legendFontSize: 12,
      },
      {
        name: `😔 ${t('mood.bad')}`,
        population: moodCounts.bad,
        color: '#9C27B0',
        legendFontColor: '#2d3748',
        legendFontSize: 12,
      },
    ].filter(item => item.population > 0);
  };

  const renderChart = () => {
    const data = generatePeriodData();

    if (type === 'line') {
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
          yAxisSuffix={habitId ? '' : '%'}
          segments={4}
        />
      );
    } else if (type === 'bar') {
      return (
        <BarChart
          data={data}
          width={chartWidth}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisSuffix={habitId ? '' : '%'}
          fromZero={true}
          showBarTops={false}
          withInnerLines={false}
          segments={4}
        />
      );
    } else if (type === 'pie') {
      const pieData = generateMoodPieData();
      return (
        <PieChart
          data={pieData}
          width={chartWidth}
          height={200}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
    <Card style={[styles.chartCard, styles.whiteCard]} mode="elevated">
      <Card.Content>
        <Text variant="titleMedium" style={styles.chartTitle}>
          {title}
        </Text>
        <Text variant="bodySmall" style={styles.chartSubtitle}>
          {period === 'week' ? t('charts.last7Days') :
           period === 'month' ? t('charts.last30Days') :
           t('charts.thisYear')}
        </Text>

        <View style={styles.chartContainer}>
          {renderChart()}
        </View>

        {habitId && (
          <Text variant="bodySmall" style={styles.chartNote}>
            💡 {t('charts.habitNote')}
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
  },
  whiteCard: {
    backgroundColor: '#ffffff',
  },
  chartTitle: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    color: '#2d3748',
  },
  chartSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },
  chart: {
    borderRadius: 12,
  },
  chartNote: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default ProgressChart;