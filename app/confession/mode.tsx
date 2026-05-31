import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { VaultLockScreen } from '../../src/components/VaultLockScreen';
import { Sin } from '../../src/types';
import {
  getSins,
  countActiveSins,
  purgeActiveSinsAfterConfession,
} from '../../src/db/queries/sins';
import { createConfession } from '../../src/db/queries/confessions';
import { todayISO } from '../../src/utils/date';
import { useAppStore } from '../../src/store/appStore';
import { useVaultAuth } from '../../src/context/VaultAuthContext';

function getGroupTitle(sin: Sin): string {
  return sin.sourceTitle ?? sin.commandment ?? sin.category ?? 'Outras anotações';
}

export default function ConfessionModeScreen() {
  const router = useRouter();
  const { resetAfterConfession } = useAppStore();
  const { vaultUnlocked, lockVault } = useVaultAuth();
  const [sins, setSins] = useState<Sin[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSins = useCallback(async () => {
    if (!vaultUnlocked) return;
    const activeSins = await getSins('active');
    setSins(activeSins.filter((s) => s.needsConfession));
  }, [vaultUnlocked]);

  useFocusEffect(
    useCallback(() => {
      loadSins();
    }, [loadSins])
  );

  const sinsByGroup = sins.reduce<Record<string, Sin[]>>((acc, sin) => {
    const key = getGroupTitle(sin);
    if (!acc[key]) acc[key] = [];
    acc[key].push(sin);
    return acc;
  }, {});

  const registerConfession = async () => {
    setLoading(true);
    try {
      const today = todayISO();
      const totalActive = await countActiveSins();
      await createConfession(today, totalActive, undefined, false);
      await purgeActiveSinsAfterConfession();
      resetAfterConfession(today);
      lockVault();
      Alert.alert(
        'Confissão registrada',
        'Confissão registrada. Suas anotações foram apagadas.',
        [{ text: 'Amém', onPress: () => router.replace('/(tabs)') }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfessed = () => {
    Alert.alert(
      'Confirmar confissão',
      'Você se confessou hoje?\n\nO app apagará definitivamente todos os registros ativos e manterá apenas a data da confissão.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confessei-me hoje',
          style: 'destructive',
          onPress: registerConfession,
        },
      ]
    );
  };

  if (!vaultUnlocked) {
    return <VaultLockScreen onBack={() => router.back()} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="x" size={22} color={theme.colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modo Confissão</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instruction}>
          Leia com simplicidade. Não é preciso explicar mais do que o necessário.
        </Text>

        {sins.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.cross}>✝</Text>
            <Text style={styles.emptyTitle}>Nenhum registro marcado</Text>
            <Text style={styles.emptyText}>
              Você pode confessar de memória o que não está anotado.
            </Text>
          </View>
        ) : (
          Object.entries(sinsByGroup).map(([group, groupSins]) => (
            <View key={group} style={styles.groupSection}>
              <Text style={styles.groupTitle}>{group}</Text>
              {groupSins.map((sin) => (
                <View key={sin.id} style={styles.sinItem}>
                  <Text style={styles.sinBullet}>—</Text>
                  <View style={styles.sinContent}>
                    <Text style={styles.sinTitle}>{sin.title}</Text>
                    {sin.description && (
                      <Text style={styles.sinDescription}>{sin.description}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ))
        )}

        <View style={styles.divider} />

        <Text style={styles.contritionTitle}>Ato de contrição</Text>
        <Text style={styles.contritionText}>
          Meu Deus, pesa-me muito ter-Vos ofendido,{'\n'}
          porque sois infinitamente bom{'\n'}
          e o pecado Vos desagrada.{'\n\n'}
          Proponho firmemente,{'\n'}
          com o auxílio da vossa graça,{'\n'}
          não Vos ofender mais{'\n'}
          e evitar as ocasiões próximas de pecado.{'\n\n'}
          Senhor, misericórdia. Amém.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confessedButton, loading && styles.confessedButtonDisabled]}
          onPress={handleConfessed}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Feather name="check" size={22} color={theme.colors.background} />
          <Text style={styles.confessedButtonText}>
            {loading ? 'Registrando...' : 'Confessei-me hoje'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  instruction: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  cross: {
    fontSize: 40,
    color: theme.colors.accent,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  groupSection: {
    marginBottom: theme.spacing.lg,
  },
  groupTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
    paddingBottom: theme.spacing.xs,
  },
  sinItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  sinBullet: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.lg,
    marginRight: theme.spacing.sm,
    lineHeight: 22,
  },
  sinContent: { flex: 1 },
  sinTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  sinDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginVertical: theme.spacing.xl,
  },
  contritionTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  contritionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 28,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  confessedButton: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  confessedButtonDisabled: { opacity: 0.5 },
  confessedButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
