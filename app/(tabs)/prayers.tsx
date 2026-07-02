import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Prayer } from '../../src/types';
import { getPrayers } from '../../src/db/queries/prayers';

type CategoryMeta = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'] | 'hands-pray' | 'cross';
  colors: [string, string];
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  'Orações Tradicionais': {
    title: 'Orações Tradicionais',
    subtitle: 'Pai-Nosso, Ave-Maria, Credo e mais',
    icon: 'book-open',
    colors: ['#384553', '#1F262D'],
  },
  'Antes do Exame': {
    title: 'Antes do Exame',
    subtitle: 'Pedir luz para olhar a consciência',
    icon: 'sunrise',
    colors: ['#4C4533', '#252722'],
  },
  'Antes da Confissão': {
    title: 'Antes da Confissão',
    subtitle: 'Clareza, coragem e arrependimento',
    icon: 'shield',
    colors: ['#4B3C32', '#24252A'],
  },
  'Ato de Contrição': {
    title: 'Ato de Contrição',
    subtitle: 'Orações de arrependimento',
    icon: 'heart',
    colors: ['#4B3548', '#242733'],
  },
  'Depois da Confissão': {
    title: 'Depois da Confissão',
    subtitle: 'Agradecimento e recomeço',
    icon: 'check-circle',
    colors: ['#2F4A47', '#1D272A'],
  },
  'Oracoes dos Santos': {
    title: 'Oracoes dos Santos',
    subtitle: 'Preces antigas para entrega e perseveranca',
    icon: 'star',
    colors: ['#3E4248', '#20242A'],
  },
  'Virtudes Teologais': {
    title: 'Virtudes Teologais',
    subtitle: 'Atos de fe, esperanca e caridade',
    icon: 'sun',
    colors: ['#404632', '#20261E'],
  },
  'Nossa Senhora': {
    title: 'Nossa Senhora',
    subtitle: 'Orações marianas tradicionais',
    icon: 'hands-pray',
    colors: ['#32384D', '#1E222D'],
  },
  'Espírito Santo': {
    title: 'Espírito Santo',
    subtitle: 'Luz, discernimento e docilidade',
    icon: 'cross',
    colors: ['#4A333A', '#252229'],
  },
  Eucaristia: {
    title: 'Eucaristia',
    subtitle: 'Adoracao, comunhao espiritual e reparacao',
    icon: 'circle',
    colors: ['#4A4432', '#25251F'],
  },
  Proteção: {
    title: 'Proteção',
    subtitle: 'Anjo da Guarda e São Miguel',
    icon: 'lock',
    colors: ['#2E3F4C', '#1D242A'],
  },
  'Perseverança e Pureza': {
    title: 'Perseverança e Pureza',
    subtitle: 'Força para guardar o propósito',
    icon: 'anchor',
    colors: ['#3B4636', '#202720'],
  },
  Latim: {
    title: 'Latim',
    subtitle: 'Orações clássicas da tradição da Igreja',
    icon: 'cross',
    colors: ['#483B59', '#21252E'],
  },
};

export default function PrayersScreen() {
  const router = useRouter();
  const [prayers, setPrayers] = useState<Prayer[]>([]);

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

  const categories = useMemo(() => {
    const counts = prayers.reduce<Record<string, number>>((acc, prayer) => {
      acc[prayer.category] = (acc[prayer.category] ?? 0) + 1;
      return acc;
    }, {});

    return Object.keys(CATEGORY_META)
      .filter((category) => counts[category])
      .map((category) => ({
        category,
        count: counts[category],
        meta: CATEGORY_META[category],
      }));
  }, [prayers]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orações</Text>
        <Text style={styles.headerSub}>
          Escolha a intenção e reze com calma.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.push('/rosary')}
          activeOpacity={0.78}
        >
          <LinearGradient
            colors={['#3A4451', '#252A30']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryCard}
          >
            <View style={styles.iconBox}>
              <MaterialCommunityIcons
                name="cross"
                size={25}
                color={theme.colors.accent}
              />
            </View>
            <View style={styles.categoryText}>
              <Text style={styles.categoryTitle}>Terço</Text>
              <Text style={styles.categorySub}>
                Mistério do dia e ofertas das dezenas
              </Text>
              <Text style={styles.countText}>Orações e intenções</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
          </LinearGradient>
        </TouchableOpacity>

        {categories.map(({ category, count, meta }) => (
          <TouchableOpacity
            key={category}
            onPress={() =>
              router.push({
                pathname: '/prayers/[category]',
                params: { category },
              })
            }
            activeOpacity={0.78}
          >
            <LinearGradient
              colors={meta.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.categoryCard}
            >
              <View style={styles.iconBox}>
                {meta.icon === 'hands-pray' ? (
                  <MaterialCommunityIcons
                    name="hands-pray"
                    size={24}
                    color={theme.colors.accent}
                  />
                ) : meta.icon === 'cross' ? (
                  <MaterialCommunityIcons
                    name="cross"
                    size={24}
                    color={theme.colors.accent}
                  />
                ) : (
                  <Feather name={meta.icon} size={22} color={theme.colors.accent} />
                )}
              </View>
              <View style={styles.categoryText}>
                <Text style={styles.categoryTitle}>{meta.title}</Text>
                <Text style={styles.categorySub}>{meta.subtitle}</Text>
                <Text style={styles.countText}>
                  {count} {count === 1 ? 'oração' : 'orações'}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
            </LinearGradient>
          </TouchableOpacity>
        ))}
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
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 96,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(231,200,145,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,200,145,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    flex: 1,
  },
  categoryTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '800',
  },
  categorySub: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 19,
    marginTop: 3,
  },
  countText: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '800',
    marginTop: theme.spacing.xs,
  },
});
