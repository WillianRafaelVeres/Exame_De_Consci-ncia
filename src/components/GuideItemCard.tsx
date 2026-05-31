import React, { useState } from 'react';
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
import { GuideItem } from '../types';
import { theme } from '../constants/theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface GuideItemCardProps {
  item: GuideItem;
}

export function GuideItemCard({ item }: GuideItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.8}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.accent}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.explanation}>{item.explanation}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Perguntas para reflexão</Text>
            {item.questions.map((q, i) => (
              <View key={i} style={styles.questionRow}>
                <Text style={styles.questionBullet}>•</Text>
                <Text style={styles.questionText}>{q}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.virtueRow}>
            <View style={styles.virtuePill}>
              <Feather name="arrow-up" size={12} color={theme.colors.success} />
              <Text style={styles.virtueLabel}>Virtude oposta</Text>
            </View>
            <Text style={styles.virtueText}>{item.oppositeVirtue}</Text>
          </View>

          <View style={styles.proposeBox}>
            <Text style={styles.proposeLabel}>Propósito sugerido</Text>
            <Text style={styles.proposeText}>{item.suggestedPropose}</Text>
          </View>
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
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    marginRight: theme.spacing.sm,
    lineHeight: 22,
  },
  body: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  explanation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  questionRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  questionBullet: {
    color: theme.colors.accent,
    marginRight: theme.spacing.sm,
    marginTop: 1,
    fontSize: theme.fontSize.md,
  },
  questionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginVertical: theme.spacing.md,
  },
  virtueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  virtuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.success + '22',
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: theme.colors.success + '44',
  },
  virtueLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.success,
    fontWeight: '600',
  },
  virtueText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  proposeBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
  },
  proposeLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  proposeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
