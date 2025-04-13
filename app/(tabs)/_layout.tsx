import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#e63946',
        tabBarInactiveTintColor: '#e63946',
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: '#ffecec', // Modern red header
        },
        headerTitleStyle: {
          letterSpacing: 1.5,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#E63946',
          borderRadius: 10,
        },
        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 1,
          borderTopColor: '#e63946',
          backgroundColor: '#ffecec',
          paddingTop: 5,
          height: 60,
        }
      }}>
      <Tabs.Screen redirect name="index" />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" color={color} size={26} />,
          headerTitle: 'Home',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <MaterialIcons name="search" color={color} size={26} />,
          headerTitle: 'Discover',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({color}) => <MaterialIcons name="add" color={color} size={26} />,
          headerTitle: 'New Recipe',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'My Recipes',
          tabBarIcon: ({color}) => <MaterialIcons name="favorite" color={color} size={26} />,
          headerTitle: 'My Recipes',
          headerTitleAlign: 'center',
        }}
      />
    </Tabs>
  );
}