import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { PrayerCard } from '../../src/components/PrayerCard';
import { Prayer } from '../../src/types';
import { getPrayers } from '../../src/db/queries/prayers';

export default function PrayerCategoryScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categoryTitle = decodeURIComponent(category ?? '');

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

  const filteredPrayers = useMemo(
    () => prayers.filter((prayer) => prayer.category === categoryTitle),
    [categoryTitle, prayers]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{categoryTitle}</Text>
          <Text style={styles.headerSub}>
            Toque em uma oração para abrir o texto.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredPrayers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Feather name="book-open" size={28} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma oração encontrada.</Text>
          </View>
        ) : (
          filteredPrayers.map((prayer) => (
            <PrayerCard
              key={prayer.id}
              prayer={prayer}
              expanded={expandedId === prayer.id}
              onToggle={() =>
                setExpandedId((current) => (current === prayer.id ? null : prayer.id))
              }
            />
          ))
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  backButton: {
    paddingVertical: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.xl,
    fontWeight: '800',
  },
  headerSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    lineHeight: 18,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
});
