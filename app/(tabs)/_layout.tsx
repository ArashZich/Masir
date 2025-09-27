import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
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
                  ? theme.colors.primary
                  : theme.colors.onSurfaceVariant,
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
                focused ? theme.colors.primary : theme.colors.onSurfaceVariant
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
                  ? theme.colors.secondary
                  : theme.colors.onSurfaceVariant,
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
                focused ? theme.colors.secondary : theme.colors.onSurfaceVariant
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
                  ? theme.colors.tertiary
                  : theme.colors.onSurfaceVariant,
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
                focused ? theme.colors.tertiary : theme.colors.onSurfaceVariant
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
