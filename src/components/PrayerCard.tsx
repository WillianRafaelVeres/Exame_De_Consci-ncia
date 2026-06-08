import React from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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

function PrayerIcon({ category }: { category: string }) {
  if (category.includes('Nossa Senhora')) {
    return (
      <MaterialCommunityIcons
        name="hands-pray"
        size={22}
        color={theme.colors.accent}
      />
    );
  }

  if (category.includes('Contrição') || category.includes('Confissão')) {
    return <Feather name="heart" size={21} color={theme.colors.accent} />;
  }

  if (category.includes('Proteção')) {
    return <Feather name="shield" size={21} color={theme.colors.accent} />;
  }

  return <Feather name="book-open" size={21} color={theme.colors.accent} />;
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
        <View style={styles.iconBox}>
          <PrayerIcon category={prayer.category} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{prayer.title}</Text>
          <Text style={styles.category}>{prayer.category}</Text>
        </View>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.prayerText}>{prayer.body}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(231,200,145,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,200,145,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '800',
    lineHeight: 21,
  },
  category: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginTop: 3,
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.cardElevated,
    padding: theme.spacing.md,
  },
  prayerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 28,
  },
});
