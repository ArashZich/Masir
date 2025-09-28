import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";
import { useTheme } from "@/contexts/ThemeContext";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 10,
                color: focused
                  ? colors.primary
                  : colors.text.secondary,
              }}
            >
              {t("navigation.todayPath")}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={28}
              name="compass"
              color={
                focused ? colors.primary : colors.text.secondary
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 10,
                color: focused
                  ? colors.secondary
                  : colors.text.secondary,
              }}
            >
              {t("navigation.overview")}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={28}
              name="stats-chart"
              color={
                focused ? colors.secondary : colors.text.secondary
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 10,
                color: focused
                  ? colors.primary
                  : colors.text.secondary,
              }}
            >
              {t("navigation.settings")}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={28}
              name="cog"
              color={
                focused ? colors.primary : colors.text.secondary
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
