import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// American flag-inspired color palette
const RED = '#e63946';         // Red Pantone - primary accent
const HONEYDEW = '#f1faee';    // Honeydew - background
const LIGHT_BLUE = '#a8dadc';  // Non-photo blue - secondary accent
const BLUE = '#457b9d';        // Cerulean - text and details
const DARK_BLUE = '#1d3557';   // Berkeley Blue - dark accents

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: RED,
        tabBarInactiveTintColor: BLUE,
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: HONEYDEW,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: DARK_BLUE,
          fontWeight: '600',
          letterSpacing: 1.5,
        },
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 1,
          borderTopColor: LIGHT_BLUE,
          backgroundColor: HONEYDEW,
          paddingTop: 5,
          height: 60,
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" color={color} size={26} />,
          headerTitle: 'HOME',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <MaterialIcons name="search" color={color} size={26} />,
          headerTitle: 'DISCOVER',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({color}) => <MaterialIcons name="add" color={color} size={26} />,
          headerTitle: 'NEW RECIPE',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'My Recipes',
          tabBarIcon: ({color}) => <MaterialIcons name="favorite" color={color} size={26} />,
          headerTitle: 'MY COLLECTION',
          headerTitleAlign: 'center',
        }}
      />
    </Tabs>
  );
}