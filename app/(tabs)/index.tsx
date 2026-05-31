import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { useAppStore } from '../../src/store/appStore';
import { useDatabase } from '../../src/hooks/useDatabase';
import { formatRelative } from '../../src/utils/date';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function HomeScreen() {
  const router = useRouter();
  const { lastConfessionDate, activeSinCount, todayExamDone } = useAppStore();
  const { refreshAppState } = useDatabase();

  useEffect(() => {
    refreshAppState();
  }, [refreshAppState]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.subGreeting}>
          Um exame simples, local e reservado para recomeçar com paz.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsRow}>
          <View style={[styles.statCard, styles.statCardHalf]}>
            <Feather
              name="heart"
              size={18}
              color={theme.colors.accent}
              style={styles.statIcon}
            />
            <Text style={styles.statLabel}>Última confissão</Text>
            <Text style={styles.statValue}>
              {lastConfessionDate ? formatRelative(lastConfessionDate) : 'Não registrada'}
            </Text>
          </View>

          <View style={[styles.statCard, styles.statCardHalf]}>
            <Feather
              name="edit-3"
              size={18}
              color={activeSinCount > 0 ? theme.colors.warning : theme.colors.success}
              style={styles.statIcon}
            />
            <Text style={styles.statLabel}>Registros ativos</Text>
            <Text
              style={[
                styles.statValue,
                { color: activeSinCount > 0 ? theme.colors.warning : theme.colors.success },
              ]}
            >
              {activeSinCount}
            </Text>
          </View>
        </View>

        <View style={styles.examCard}>
          <View style={styles.examCardLeft}>
            <Feather
              name={todayExamDone ? 'check-circle' : 'circle'}
              size={20}
              color={todayExamDone ? theme.colors.success : theme.colors.textMuted}
            />
            <View style={styles.examCardText}>
              <Text style={styles.examCardTitle}>Exame de hoje</Text>
              <Text style={styles.examCardSub}>
                {todayExamDone ? 'Concluído' : 'Ainda não realizado'}
              </Text>
            </View>
          </View>
          {!todayExamDone && <View style={styles.examCardDot} />}
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.actionsSectionTitle}>Ações</Text>

          <Button
            title={todayExamDone ? 'Refazer exame de consciência' : 'Começar exame de consciência'}
            variant="primary"
            onPress={() => router.push('/exam')}
            style={styles.actionButton}
          />

          <Button
            title="Anotar pecado"
            variant="secondary"
            onPress={() => router.push('/sins/new')}
            style={styles.actionButton}
          />

          <Button
            title="Preparar confissão"
            variant="secondary"
            onPress={() => router.push('/confession')}
            style={styles.actionButton}
          />

          <Button
            title="Orações"
            variant="ghost"
            onPress={() => router.push('/(tabs)/prayers')}
            style={styles.actionButton}
          />
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "Não vim chamar os justos, mas os pecadores ao arrependimento."
          </Text>
          <Text style={styles.quoteAuthor}>Lucas 5,32</Text>
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
  headerRow: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  greeting: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  subGreeting: {
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
    paddingBottom: theme.spacing.xxl,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  statCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  statCardHalf: {
    flex: 1,
  },
  statIcon: {
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  examCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  examCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  examCardText: {
    flex: 1,
  },
  examCardTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  examCardSub: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  examCardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },
  actionsSection: {
    marginBottom: theme.spacing.lg,
  },
  actionsSectionTitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
  quoteCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
  },
  quoteText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  quoteAuthor: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'right',
  },
});
