import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HistoryLineTheme } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: HistoryLineTheme.gold,
        tabBarInactiveTintColor: HistoryLineTheme.parchment,
        tabBarStyle: {
          backgroundColor: HistoryLineTheme.blueRoyal,
          borderTopColor: HistoryLineTheme.navyDark,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Vida',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Historia',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="globe.americas.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
