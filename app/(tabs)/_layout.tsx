import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 10,
          height: 66,
          paddingBottom: 9,
          paddingTop: 8,
          borderRadius: 24,
          backgroundColor: 'rgba(24,27,30,0.96)',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: theme.colors.cardBorder,
          elevation: 12,
          shadowColor: theme.colors.black,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.32,
          shadowRadius: 14,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hands-pray" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exam"
        options={{
          title: 'Exame',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cross" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rosary"
        options={{
          title: 'Terco',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cross" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: 'Oracoes',
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuracoes',
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="guide" options={{ href: null }} />
      <Tabs.Screen name="sins" options={{ href: null }} />
    </Tabs>
  );
}
