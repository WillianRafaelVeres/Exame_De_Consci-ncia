import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Prayer } from '../types';
import { theme } from '../constants/theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface PrayerCardProps {
  prayer: Prayer;
  expanded: boolean;
  onToggle: () => void;
}

export function PrayerCard({ prayer, expanded, onToggle }: PrayerCardProps) {
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <Feather name="feather" size={16} color={theme.colors.accent} style={styles.icon} />
        <Text style={styles.title}>{prayer.title}</Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          <View style={styles.divider} />
          <Text style={styles.prayerText}>{prayer.body}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  body: {
    paddingBottom: theme.spacing.md,
  },
  prayerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 26,
    paddingHorizontal: theme.spacing.md,
    fontStyle: 'italic',
  },
});
