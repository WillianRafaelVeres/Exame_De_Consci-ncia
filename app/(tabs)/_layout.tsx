import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.cardBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: '#8B7355',
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Guia',
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: 'Orações',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hands-pray" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sins"
        options={{
          title: 'Registros',
          tabBarIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
