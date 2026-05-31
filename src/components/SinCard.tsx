import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Sin, SinSourceType } from '../types';
import { theme } from '../constants/theme';
import { formatRelative } from '../utils/date';

interface SinCardProps {
  sin: Sin;
  onPress: () => void;
  onDelete: () => void;
  onToggleNeedsConfession?: () => void;
}

const TYPE_LABELS: Record<SinSourceType, string> = {
  commandment: 'Mandamento',
  capital_sin: 'Pecado capital',
  state_of_life: 'Estado de vida',
  manual: 'Manual',
};

export function SinCard({
  sin,
  onPress,
  onDelete,
  onToggleNeedsConfession,
}: SinCardProps) {
  const sourceLabel = sin.type
    ? TYPE_LABELS[sin.type]
    : sin.commandment
    ? 'Mandamento'
    : sin.category
    ? 'Categoria'
    : 'Manual';

  const sourceTitle = sin.sourceTitle ?? sin.commandment ?? sin.category;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.statusDot} />
          <Text style={styles.title} numberOfLines={2}>
            {sin.title}
          </Text>
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
        <Text style={styles.date}>{formatRelative(sin.date)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{sourceLabel}</Text>
        </View>
        {sourceTitle && (
          <View style={[styles.badge, styles.sourceBadge]}>
            <Text style={[styles.badgeText, styles.sourceBadgeText]} numberOfLines={1}>
              {sourceTitle}
            </Text>
          </View>
        )}
      </View>

      {sin.description && (
        <Text style={styles.description} numberOfLines={2}>
          {sin.description}
        </Text>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.indicator,
            sin.needsConfession && styles.indicatorActive,
          ]}
          onPress={onToggleNeedsConfession}
          activeOpacity={onToggleNeedsConfession ? 0.7 : 1}
          disabled={!onToggleNeedsConfession}
        >
          <Feather
            name={sin.needsConfession ? 'alert-circle' : 'circle'}
            size={12}
            color={sin.needsConfession ? theme.colors.warning : theme.colors.textMuted}
          />
          <Text
            style={[
              styles.indicatorText,
              sin.needsConfession && { color: theme.colors.warning },
            ]}
          >
            {sin.needsConfession ? 'Levar à confissão' : 'Não marcado para confissão'}
          </Text>
        </TouchableOpacity>

        {sin.isRepeated && (
          <View style={styles.indicator}>
            <Feather name="repeat" size={12} color={theme.colors.textMuted} />
            <Text style={styles.indicatorText}>Recorrente</Text>
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
    marginTop: 5,
    marginRight: theme.spacing.sm,
    flexShrink: 0,
    backgroundColor: theme.colors.accent,
  },
  title: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.md + theme.spacing.sm,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginRight: theme.spacing.xs,
    alignSelf: 'center',
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
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    paddingLeft: theme.spacing.md + theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    paddingLeft: theme.spacing.md + theme.spacing.sm,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 3,
  },
  indicatorActive: {
    backgroundColor: theme.colors.warning + '14',
  },
  indicatorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
  },
});
