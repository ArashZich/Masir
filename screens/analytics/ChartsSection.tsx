import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressChart } from '@/components';

export const ChartsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Progress Charts */}
      <ProgressChart
        type="line"
        title={t("charts.weeklyTrend")}
        period="week"
      />

      <ProgressChart
        type="bar"
        title={t("charts.monthlyProgress")}
        period="month"
      />

      <ProgressChart
        type="pie"
        title={t("charts.moodDistribution")}
        period="month"
      />
    </>
  );
};