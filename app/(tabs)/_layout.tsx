import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary, // متن active هم همین رنگ
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.todayPath'),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={28}
              name="compass"
              color={focused ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('navigation.overview'),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={28}
              name="stats-chart"
              color={focused ? theme.colors.secondary : theme.colors.onSurfaceVariant}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('navigation.settings'),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={28}
              name="cog"
              color={focused ? theme.colors.tertiary : theme.colors.onSurfaceVariant}
            />
          ),
        }}
      />
    </Tabs>
  );
}
