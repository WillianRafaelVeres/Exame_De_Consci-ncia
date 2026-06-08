import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';

export default function ExamTabScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Exame</Text>
        <Text style={styles.subtitle}>Recolha-se e siga o roteiro com calma.</Text>

        <LinearGradient
          colors={[theme.colors.purple, theme.colors.purpleSoft, '#B8B8BE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryCard}
        >
          <Text style={styles.primaryTitle}>Iniciar Novo Exame</Text>
          <Text style={styles.primaryText}>
            Oracao inicial, mandamentos, pecados capitais, estado de vida e ato
            de contricao.
          </Text>
          <TouchableOpacity
            style={styles.primaryPill}
            onPress={() => router.push('/exam')}
            activeOpacity={0.82}
          >
            <Feather name="play" size={16} color={theme.colors.black} />
            <Text style={styles.primaryPillText}>Comecar agora</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.grid}>
          <ExamInfoCard
            icon="list"
            title="Mandamentos"
            subtitle="Estudar os 10 mandamentos"
            onPress={() => router.push('/(tabs)/guide?section=commandments')}
          />
          <ExamInfoCard
            icon="heart"
            title="Capitais"
            subtitle="Pecados e virtudes"
            onPress={() => router.push('/(tabs)/guide?section=capital-sins')}
          />
          <ExamInfoCard
            icon="briefcase"
            title="Estado de Vida"
            subtitle="Deveres concretos"
            onPress={() => router.push('/(tabs)/guide?section=state-life')}
          />
          <ExamInfoCard
            icon="book-open"
            title="Guia Espiritual"
            subtitle="Conteúdo completo"
            onPress={() => router.push('/(tabs)/guide')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ExamInfoCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.infoCard} onPress={onPress} activeOpacity={0.76}>
      {icon === 'heart' ? (
        <MaterialCommunityIcons
          name="heart-outline"
          size={22}
          color={theme.colors.accent}
        />
      ) : (
        <Feather name={icon} size={22} color={theme.colors.accent} />
      )}
      <View>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoSub}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.xxl,
    fontWeight: '800',
    marginTop: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  primaryCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    minHeight: 210,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginBottom: theme.spacing.md,
  },
  primaryTitle: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '800',
  },
  primaryText: {
    color: 'rgba(237,225,206,0.86)',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  primaryPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.accent,
    borderRadius: 22,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  primaryPillText: {
    color: theme.colors.black,
    fontSize: theme.fontSize.sm,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  infoCard: {
    width: '48.5%',
    minHeight: 124,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  infoTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '800',
  },
  infoSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    marginTop: 4,
  },
});
