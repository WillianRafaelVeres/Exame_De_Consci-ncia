import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Sin, SinSourceType } from '../types';
import { theme } from '../constants/theme';

interface SinCardProps {
  sin: Sin;
  onPress: () => void;
  onDelete: () => void;
}

const TYPE_LABELS: Record<SinSourceType, string> = {
  commandment: 'Mandamento',
  capital_sin: 'Pecado capital',
  state_of_life: 'Estado de vida',
  manual: 'Manual',
};

export function SinCard({ sin, onPress, onDelete }: SinCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.statusDot} />
          <Text style={styles.text} numberOfLines={4}>
            {sin.text}
          </Text>
          {sin.count > 1 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>x{sin.count}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={16} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.meta}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{TYPE_LABELS[sin.sourceType]}</Text>
        </View>
        <View style={[styles.badge, styles.sourceBadge]}>
          <Text style={[styles.badgeText, styles.sourceBadgeText]} numberOfLines={1}>
            {sin.sourceTitle}
          </Text>
        </View>
        {sin.fromQuestion && (
          <View style={[styles.badge, styles.questionBadge]}>
            <Text style={[styles.badgeText, styles.questionBadgeText]}>
              pergunta marcada
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: theme.spacing.sm,
    flexShrink: 0,
    backgroundColor: theme.colors.accent,
  },
  text: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
  countBadge: {
    marginLeft: theme.spacing.sm,
    minWidth: 34,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  countText: {
    color: theme.colors.black,
    fontSize: theme.fontSize.sm,
    fontWeight: '900',
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    paddingLeft: theme.spacing.md + theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.accentDark + '33',
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    maxWidth: '100%',
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: '500',
  },
  sourceBadge: {
    backgroundColor: theme.colors.textMuted + '22',
    borderColor: theme.colors.textMuted + '44',
    flexShrink: 1,
  },
  sourceBadgeText: {
    color: theme.colors.textSecondary,
  },
  questionBadge: {
    backgroundColor: theme.colors.success + '18',
    borderColor: theme.colors.success + '44',
  },
  questionBadgeText: {
    color: theme.colors.success,
  },
});
