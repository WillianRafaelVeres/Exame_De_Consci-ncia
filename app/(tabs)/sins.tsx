import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { SinCard } from '../../src/components/SinCard';
import { VaultLockScreen } from '../../src/components/VaultLockScreen';
import { Sin } from '../../src/types';
import { getSins, deleteSin, updateSin } from '../../src/db/queries/sins';
import { useDatabase } from '../../src/hooks/useDatabase';
import { useVaultAuth } from '../../src/context/VaultAuthContext';

type Filter = 'all' | 'commandment' | 'capital_sin' | 'state_of_life' | 'confession';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'commandment', label: 'Mandamentos' },
  { id: 'capital_sin', label: 'Capitais' },
  { id: 'state_of_life', label: 'Estado de vida' },
  { id: 'confession', label: 'Confissão' },
];

export default function SinsScreen() {
  const router = useRouter();
  const { refreshAppState } = useDatabase();
  const { vaultUnlocked } = useVaultAuth();
  const [filter, setFilter] = useState<Filter>('all');
  const [sins, setSins] = useState<Sin[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadSins = useCallback(async () => {
    const data = await getSins('active');
    setSins(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (vaultUnlocked) loadSins();
    }, [loadSins, vaultUnlocked])
  );

  useEffect(() => {
    if (vaultUnlocked) loadSins();
  }, [vaultUnlocked, loadSins]);

  const filteredSins = useMemo(() => {
    if (filter === 'all') return sins;
    if (filter === 'confession') return sins.filter((sin) => sin.needsConfession);
    return sins.filter((sin) => sin.type === filter);
  }, [filter, sins]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSins();
    setRefreshing(false);
  };

  const handleDelete = useCallback(
    (sin: Sin) => {
      Alert.alert('Remover anotação', `Deseja remover "${sin.title}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await deleteSin(sin.id);
            await loadSins();
            await refreshAppState();
          },
        },
      ]);
    },
    [loadSins, refreshAppState]
  );

  const handleToggleNeedsConfession = useCallback(
    async (sin: Sin) => {
      await updateSin(sin.id, { needsConfession: !sin.needsConfession });
      await loadSins();
      await refreshAppState();
    },
    [loadSins, refreshAppState]
  );

  if (!vaultUnlocked) {
    return <VaultLockScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Registros</Text>
        <Text style={styles.headerSub}>
          Registros ativos guardados apenas neste aparelho.
        </Text>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterTab, filter === f.id && styles.filterTabActive]}
              onPress={() => setFilter(f.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f.id && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.accent}
          />
        }
      >
        {filteredSins.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={40} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum registro ativo</Text>
            <Text style={styles.emptyText}>
              Comece o exame de consciência ou anote algo diretamente.
            </Text>
          </View>
        ) : (
          filteredSins.map((sin) => (
            <SinCard
              key={sin.id}
              sin={sin}
              onPress={() => router.push(`/sins/${sin.id}`)}
              onDelete={() => handleDelete(sin)}
              onToggleNeedsConfession={() => handleToggleNeedsConfession(sin)}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/sins/new')}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={26} color={theme.colors.background} />
      </TouchableOpacity>
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
  filterRow: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  filterTab: {
    marginRight: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    minWidth: 96,
  },
  filterTabActive: {
    backgroundColor: theme.colors.accent + '22',
    borderColor: theme.colors.accent,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  filterTextActive: {
    color: theme.colors.accent,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
