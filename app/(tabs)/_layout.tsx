import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { MaterialIcons } from '@expo/vector-icons';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0.5,
          borderTopColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" color={color} />,
          headerTitle: 'Home',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <MaterialIcons name="search" color={color} />,
          headerTitle: 'Search',
        }}
      />
      <Tabs.Screen
      name="create"
      options={{
        title: 'New Recipe',
        tabBarIcon: ({color}) => <MaterialIcons name="add" color="{color}"/>,
        headerTitle: 'New Recipe',

      }}
      />
      <Tabs.Screen
      name="favorite"
      options={{
        title: 'My Recipes',
        tabBarIcon: ({color}) => <MaterialIcons name='favorite' color="{color}"/>,
        headerTitle: 'My Recipes',
      }}
      />
    </Tabs>
  );
}
