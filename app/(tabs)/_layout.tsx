import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useTheme } from '@/context/ThemeContext';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function TabLayout() {

  const { themeColors } = useTheme();
  useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:themeColors.tabIconSelected,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: themeColors.background,
          borderBottomWidth: 0, 
          elevation: 5, 
          borderTopColor: themeColors.primaryLight,
        },
        headerTitleStyle: {
          letterSpacing: 1.5,
          color: themeColors.primaryDark,
          fontFamily: "Poppins_700Bold"
        },
        tabBarStyle: {
          elevation: 5,
          shadowColor: themeColors.primaryDark,
          shadowOpacity: 0.2,
          shadowRadius: 10,
          paddingVertical: 10,
          borderTopColor:themeColors.primaryLight,
          backgroundColor: themeColors.background,     },
        tabBarLabelStyle: {
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen redirect name="index" />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" color={color} size={30} />,
          headerTitle: 'Home',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <MaterialIcons name="search" color={color} size={30} />,
          headerTitle: 'Discover',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({color}) => <MaterialIcons name="add" color={color} size={30} />,
          headerTitle: 'New Recipe',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'My Recipes',
          tabBarIcon: ({color}) => <MaterialIcons name="favorite" color={color} size={30} />,
          headerTitle: 'My Recipes',
          headerTitleAlign: 'center',
        }}
      />
    </Tabs>
  );
}