import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { VaultLockScreen } from '../../src/components/VaultLockScreen';
import { Sin } from '../../src/types';
import { getSins } from '../../src/db/queries/sins';
import { getLastConfession } from '../../src/db/queries/confessions';
import { formatRelative, daysBetween, todayISO } from '../../src/utils/date';
import { useVaultAuth } from '../../src/context/VaultAuthContext';

const TYPE_ORDER = ['commandment', 'capital_sin', 'state_of_life', 'manual'];

function getGroupTitle(sin: Sin): string {
  if (sin.sourceTitle) return sin.sourceTitle;
  if (sin.commandment) return sin.commandment;
  if (sin.category) return sin.category;
  return 'Outras anotações';
}

function getTypeLabel(type?: string): string {
  if (type === 'commandment') return 'Dez Mandamentos';
  if (type === 'capital_sin') return 'Pecados Capitais';
  if (type === 'state_of_life') return 'Estado de Vida';
  return 'Anotações Manuais';
}

export default function ConfessionScreen() {
  const router = useRouter();
  const { vaultUnlocked } = useVaultAuth();
  const [sins, setSins] = useState<Sin[]>([]);
  const [lastConfessionDate, setLastConfessionDate] = useState<string | null>(null);
  const [observations, setObservations] = useState('');

  const loadData = useCallback(async () => {
    const activeSins = await getSins('active');
    setSins(activeSins.filter((s) => s.needsConfession));
    const last = await getLastConfession();
    setLastConfessionDate(last?.date ?? null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (vaultUnlocked) loadData();
    }, [vaultUnlocked, loadData])
  );

  useEffect(() => {
    if (vaultUnlocked) loadData();
  }, [vaultUnlocked, loadData]);

  const grouped = sins.reduce<Record<string, Record<string, Sin[]>>>((acc, sin) => {
    const type = sin.type ?? 'manual';
    const group = getGroupTitle(sin);
    if (!acc[type]) acc[type] = {};
    if (!acc[type][group]) acc[type][group] = [];
    acc[type][group].push(sin);
    return acc;
  }, {});

  const daysSince = lastConfessionDate
    ? daysBetween(lastConfessionDate, todayISO())
    : null;

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
          <Feather name="arrow-left" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preparação para a Confissão</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.infoCard}>
          <Feather name="calendar" size={18} color={theme.colors.accent} />
          <View style={styles.infoCardText}>
            <Text style={styles.infoLabel}>Última confissão</Text>
            <Text style={styles.infoValue}>
              {lastConfessionDate
                ? `${formatRelative(lastConfessionDate)}${daysSince !== null ? ` (${daysSince} dias)` : ''}`
                : 'Não registrada'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Feather name="edit-3" size={18} color={theme.colors.warning} />
          <View style={styles.infoCardText}>
            <Text style={styles.infoLabel}>Registros marcados</Text>
            <Text style={[styles.infoValue, { color: theme.colors.warning }]}>
              {sins.length} {sins.length === 1 ? 'anotação' : 'anotações'}
            </Text>
          </View>
        </View>

        {sins.length > 0 ? (
          <View style={styles.sinsSection}>
            <Text style={styles.sectionTitle}>Lista objetiva</Text>
            {TYPE_ORDER.filter((type) => grouped[type]).map((type) => (
              <View key={type}>
                <Text style={styles.typeTitle}>{getTypeLabel(type)}</Text>
                {Object.entries(grouped[type]).map(([group, groupSins]) => (
                  <View key={group} style={styles.groupCard}>
                    <Text style={styles.groupTitle}>{group}</Text>
                    {groupSins.map((sin) => (
                      <View key={sin.id} style={styles.sinRow}>
                        <Text style={styles.sinBullet}>•</Text>
                        <View style={styles.sinTextBlock}>
                          <Text style={styles.sinTitle}>{sin.title}</Text>
                          {sin.description && (
                            <Text style={styles.sinDescription}>{sin.description}</Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={32} color={theme.colors.success} />
            <Text style={styles.emptyText}>
              Nenhum registro marcado para confissão.
            </Text>
          </View>
        )}

        <View style={styles.observationsSection}>
          <Text style={styles.sectionTitle}>Observações finais</Text>
          <TextInput
            style={styles.observationsInput}
            placeholder="Algo mais que deseja mencionar ao confessor..."
            placeholderTextColor={theme.colors.textMuted}
            value={observations}
            onChangeText={setObservations}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.contritionSection}>
          <Text style={styles.sectionTitle}>Ato de contrição</Text>
          <View style={styles.contritionCard}>
            <Text style={styles.contritionText}>
              Meu Deus,{'\n'}
              pesa-me muito ter-Vos ofendido,{'\n'}
              porque sois infinitamente bom{'\n'}
              e o pecado Vos desagrada.{'\n\n'}
              Proponho firmemente,{'\n'}
              com o auxílio da vossa graça,{'\n'}
              não Vos ofender mais{'\n'}
              e evitar as ocasiões próximas de pecado.{'\n\n'}
              Senhor, misericórdia. Amém.
            </Text>
          </View>
        </View>

        <Button
          title="Modo Confissão"
          variant="primary"
          onPress={() => router.push('/confession/mode')}
          style={styles.modeButton}
        />
      </ScrollView>
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
    color: theme.colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  infoCardText: { flex: 1 },
  infoLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  sinsSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  typeTitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  groupCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
  },
  groupTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  sinRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  sinBullet: {
    color: theme.colors.textMuted,
    marginRight: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    lineHeight: 20,
  },
  sinTextBlock: { flex: 1 },
  sinTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  sinDescription: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    lineHeight: 18,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  observationsSection: { marginBottom: theme.spacing.md },
  observationsInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    color: theme.colors.textPrimary,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    minHeight: 100,
    lineHeight: 22,
  },
  contritionSection: { marginBottom: theme.spacing.lg },
  contritionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
  },
  contritionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  modeButton: { marginBottom: theme.spacing.sm },
});
