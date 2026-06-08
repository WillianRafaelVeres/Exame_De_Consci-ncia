import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { VaultLockScreen } from '../../src/components/VaultLockScreen';
import { Sin, SinSourceType } from '../../src/types';
import {
  countActiveSins,
  getSins,
  purgeActiveSinsAfterConfession,
} from '../../src/db/queries/sins';
import { createConfession, getLastConfession } from '../../src/db/queries/confessions';
import { daysBetween, formatRelative, todayISO } from '../../src/utils/date';
import { useAppStore } from '../../src/store/appStore';
import { useVaultAuth } from '../../src/context/VaultAuthContext';

const TYPE_ORDER: SinSourceType[] = [
  'commandment',
  'capital_sin',
  'state_of_life',
  'manual',
];

const TYPE_LABELS: Record<SinSourceType, string> = {
  commandment: 'Mandamentos',
  capital_sin: 'Pecados Capitais',
  state_of_life: 'Estado de Vida',
  manual: 'Outras anotacoes',
};

const QUICK_GUIDE = [
  'Faca o sinal da cruz.',
  'Diga ha quanto tempo foi sua ultima confissao.',
  'Confesse os pecados com clareza, humildade e objetividade.',
  'Nao esconda pecado por vergonha.',
  'Nao conte historias longas sem necessidade.',
  'Escute o conselho do padre.',
  'Reze o ato de contricao quando for pedido.',
  'Receba a absolvição com fe.',
  'Cumpra a penitencia.',
];

const CONTRITION = `Senhor meu Jesus Cristo, Deus e homem verdadeiro, Criador e Redentor meu, por serdes Vos quem sois, sumamente bom e digno de ser amado sobre todas as coisas, pesa-me de todo o coracao ter-Vos ofendido.

Pesa-me tambem por ter perdido o Ceu e merecido o inferno, mas sobretudo porque pequei contra Vos, que sois tao bom e digno de todo amor.

Proponho firmemente, com o auxilio da Vossa graca, confessar-me, cumprir a penitencia, evitar as ocasioes de pecado e emendar a minha vida.

Recebei, Senhor, o meu arrependimento. Dai-me um coracao novo, humilde e fiel. Ajudai-me a combater meus pecados e a caminhar, dia apos dia, para a santidade.

Amem.`;

function groupSins(sins: Sin[]) {
  return sins.reduce<Record<SinSourceType, Record<string, Sin[]>>>((acc, sin) => {
    if (!acc[sin.sourceType]) acc[sin.sourceType] = {};
    if (!acc[sin.sourceType][sin.sourceTitle]) {
      acc[sin.sourceType][sin.sourceTitle] = [];
    }
    acc[sin.sourceType][sin.sourceTitle].push(sin);
    return acc;
  }, {} as Record<SinSourceType, Record<string, Sin[]>>);
}

export default function ConfessionScreen() {
  const router = useRouter();
  const { resetAfterConfession } = useAppStore();
  const { vaultUnlocked, lockVault } = useVaultAuth();
  const [sins, setSins] = useState<Sin[]>([]);
  const [lastConfessionDate, setLastConfessionDate] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  const loadData = useCallback(async () => {
    const [activeSins, last] = await Promise.all([
      getSins('active'),
      getLastConfession(),
    ]);
    setSins(activeSins.filter((sin) => sin.needsConfession));
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

  const grouped = useMemo(() => groupSins(sins), [sins]);
  const daysSince = lastConfessionDate
    ? daysBetween(lastConfessionDate, todayISO())
    : null;

  const registerConfession = async () => {
    setRegistering(true);
    try {
      const today = todayISO();
      const totalActive = await countActiveSins();
      await createConfession(today, totalActive, undefined, false);
      await purgeActiveSinsAfterConfession();
      resetAfterConfession(today);
      lockVault();
      Alert.alert(
        'Confissao registrada',
        'Confissao registrada. Suas anotacoes foram apagadas.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleConfessed = () => {
    Alert.alert(
      'Confirmar confissao',
      'Voce se confessou hoje? O app apagara definitivamente todos os registros ativos e mantera apenas a data da confissao.',
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
          <Feather name="arrow-left" size={22} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preparar Confissao</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Feather name="calendar" size={18} color={theme.colors.accent} />
          <View style={styles.infoCardText}>
            <Text style={styles.infoLabel}>Ultima confissao</Text>
            <Text style={styles.infoValue}>
              {lastConfessionDate
                ? `${formatRelative(lastConfessionDate)}${
                    daysSince !== null ? ` (${daysSince} dias)` : ''
                  }`
                : 'Nao registrada'}
            </Text>
          </View>
        </View>

        <View style={styles.guideCard}>
          <Text style={styles.sectionTitle}>Guia rapido</Text>
          {QUICK_GUIDE.map((item, index) => (
            <View key={item} style={styles.guideRow}>
              <Text style={styles.guideNumber}>{index + 1}</Text>
              <Text style={styles.guideText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.modelCard}>
          <Text style={styles.sectionTitle}>Frase modelo</Text>
          <Text style={styles.modelText}>
            "Padre, abencoai-me, porque pequei. Minha ultima confissao foi ha
            ___ dias/semanas/meses. Estes sao os meus pecados..."
          </Text>
        </View>

        <View style={styles.sinsSection}>
          <Text style={styles.sectionTitle}>Registros para confessar</Text>
          {sins.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="check-circle" size={32} color={theme.colors.success} />
              <Text style={styles.emptyText}>
                Nenhum registro ativo marcado para confissao.
              </Text>
            </View>
          ) : (
            TYPE_ORDER.filter((type) => grouped[type]).map((type) => (
              <View key={type} style={styles.typeBlock}>
                <Text style={styles.typeTitle}>{TYPE_LABELS[type]}</Text>
                {Object.entries(grouped[type]).map(([group, groupSins]) => (
                  <View key={group} style={styles.groupCard}>
                    <Text style={styles.groupTitle}>{group}</Text>
                    {groupSins.map((sin) => (
                      <View key={sin.id} style={styles.sinRow}>
                        <Text style={styles.sinBullet}>-</Text>
                        <Text style={styles.sinText}>
                          {sin.text}
                          {sin.count > 1 ? ` (x${sin.count})` : ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

        <View style={styles.contritionCard}>
          <Text style={styles.sectionTitle}>Ato de contricao</Text>
          <Text style={styles.contritionText}>{CONTRITION}</Text>
        </View>

        <Button
          title="Confessei-me hoje"
          variant="danger"
          onPress={handleConfessed}
          loading={registering}
          style={styles.confessedButton}
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
  guideCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  guideNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.accent + '22',
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 22,
  },
  guideText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
  },
  modelCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  modelText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  sinsSection: {
    marginBottom: theme.spacing.md,
  },
  typeBlock: {
    marginBottom: theme.spacing.sm,
  },
  typeTitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing.sm,
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
    fontWeight: '700',
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
    lineHeight: 21,
  },
  sinText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    lineHeight: 21,
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
    lineHeight: 22,
  },
  contritionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.lg,
  },
  contritionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  confessedButton: {
    marginBottom: theme.spacing.sm,
  },
});
