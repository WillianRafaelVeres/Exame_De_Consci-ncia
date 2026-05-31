import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../src/constants/theme';
import { PrayerCard } from '../../src/components/PrayerCard';
import { Prayer } from '../../src/types';
import { getPrayers } from '../../src/db/queries/prayers';

export default function PrayersScreen() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPrayers() {
      const data = await getPrayers();
      if (mounted) setPrayers(data);
    }

    loadPrayers();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = Array.from(new Set(prayers.map((p) => p.category)));

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orações</Text>
        <Text style={styles.headerSub}>Para cada momento da jornada</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => (
          <View key={category} style={styles.section}>
            <Text style={styles.categoryLabel}>{category}</Text>
            {prayers
              .filter((p) => p.category === category)
              .map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  prayer={prayer}
                  expanded={expandedId === prayer.id}
                  onToggle={() => handleToggle(prayer.id)}
                />
              ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            "Orai sem cessar." — 1 Tes 5,17
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  headerSub: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
    fontStyle: 'italic',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  categoryLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingTop: theme.spacing.md,
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
});
