import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../src/constants/theme';

const ROSARY_BEADS = [
  { left: 12, top: 1 },
  { left: 7, top: 4 },
  { left: 4, top: 9 },
  { left: 5, top: 15 },
  { left: 9, top: 20 },
  { left: 15, top: 22 },
  { left: 21, top: 20 },
  { left: 25, top: 15 },
  { left: 26, top: 9 },
  { left: 23, top: 4 },
];

function RosaryTabIcon({ color, size }: { color: string; size: number }) {
  const scale = size / 28;
  const beadSize = Math.max(2.6, 4.1 * scale);

  return (
    <View style={[styles.rosaryIcon, { width: size + 6, height: size + 6 }]}>
      {ROSARY_BEADS.map((bead, index) => (
        <View
          key={`${bead.left}-${bead.top}-${index}`}
          style={[
            styles.rosaryBead,
            {
              width: beadSize,
              height: beadSize,
              borderRadius: beadSize / 2,
              left: bead.left * scale,
              top: bead.top * scale,
              backgroundColor: color,
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.rosaryChain,
          {
            left: 17 * scale,
            top: 20 * scale,
            width: Math.max(1, 1.4 * scale),
            height: 5 * scale,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.rosaryCrossVertical,
          {
            left: 14.8 * scale,
            top: 24 * scale,
            width: 5.4 * scale,
            height: 9.5 * scale,
            borderRadius: 1.5 * scale,
            backgroundColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.rosaryCrossHorizontal,
          {
            left: 11.5 * scale,
            top: 27 * scale,
            width: 12 * scale,
            height: 3.9 * scale,
            borderRadius: 1.5 * scale,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

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
          tabBarIcon: ({ color, size }) => <RosaryTabIcon color={color} size={size} />,
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

const styles = StyleSheet.create({
  rosaryIcon: {
    position: 'relative',
  },
  rosaryBead: {
    position: 'absolute',
  },
  rosaryChain: {
    position: 'absolute',
  },
  rosaryCrossVertical: {
    position: 'absolute',
  },
  rosaryCrossHorizontal: {
    position: 'absolute',
  },
});
