import React, { useEffect } from 'react';
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
import { useAppStore } from '../../src/store/appStore';
import { useDatabase } from '../../src/hooks/useDatabase';
import { formatRelative } from '../../src/utils/date';

export default function HomeScreen() {
  const router = useRouter();
  const { activeSinCount, lastConfessionDate, todayExamDone } = useAppStore();
  const { refreshAppState } = useDatabase();

  useEffect(() => {
    refreshAppState();
  }, [refreshAppState]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Exame de</Text>
            <Text style={styles.brand}>Consciência</Text>
          </View>
          <TouchableOpacity
            style={styles.lockButton}
            onPress={() => router.push('/(tabs)/sins')}
            activeOpacity={0.75}
          >
            <Feather name="lock" size={19} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[theme.colors.purple, theme.colors.purpleSoft, '#B9A7C5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.primaryCard, styles.shadow]}
        >
          <TouchableOpacity
            style={styles.primaryPress}
            onPress={() => router.push('/exam')}
            activeOpacity={0.84}
          >
            <View style={styles.primaryContent}>
              <Text style={styles.primaryTitle}>Iniciar</Text>
              <Text style={styles.primaryTitle}>Novo Exame</Text>
              <Text style={styles.primarySub}>
                {todayExamDone ? 'Exame de hoje já feito' : 'O exame espiritual de hoje'}
              </Text>
            </View>
            <View style={styles.primaryIcon}>
              <MaterialCommunityIcons
                name="cross"
                size={30}
                color={theme.colors.textPrimary}
              />
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.grid}>
          <HomeCard
            title="Preparar Confissão"
            subtitle={
              lastConfessionDate
                ? `Última: ${formatRelative(lastConfessionDate)}`
                : 'Guia direto para o confessionário'
            }
            colors={['#28323A', '#1C2228']}
            onPress={() => router.push('/confession')}
            icon={
              <View style={styles.paperIcon}>
                <MaterialCommunityIcons
                  name="cross"
                  size={26}
                  color={theme.colors.black}
                />
              </View>
            }
          />

          <HomeCard
            title="Devocional e Orações"
            subtitle="Orações por intenção e momento"
            colors={['#3B3247', '#232731']}
            onPress={() => router.push('/(tabs)/prayers')}
            icon={
              <View style={styles.iconPlate}>
                <MaterialCommunityIcons
                  name="hands-pray"
                  size={38}
                  color={theme.colors.accent}
                />
              </View>
            }
          />
        </View>

        <LinearGradient
          colors={['#303942', '#20262C', '#4C4A46']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.vaultCard, styles.shadow]}
        >
          <View style={styles.vaultHeader}>
            <View>
              <Text style={styles.vaultTitle}>Lista de Pecados</Text>
              <Text style={styles.vaultTitle}>Anotados</Text>
            </View>
            <View style={styles.vaultIcon}>
              <Feather name="shield" size={26} color={theme.colors.accent} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.vaultPill}
            onPress={() => router.push('/(tabs)/sins')}
            activeOpacity={0.82}
          >
            <Feather name="key" size={15} color={theme.colors.black} />
            <Text style={styles.vaultPillText}>Desbloquear Cofre Privado</Text>
          </TouchableOpacity>

          <Text style={styles.vaultSub}>
            {activeSinCount} {activeSinCount === 1 ? 'anotação protegida' : 'anotações protegidas'}
          </Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeCard({
  title,
  subtitle,
  icon,
  colors,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  colors: [string, string];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.cardWrapper} onPress={onPress} activeOpacity={0.78}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.homeCard, styles.shadow]}
      >
        <View style={styles.cardImageArea}>{icon}</View>
        <View style={styles.cardTextArea}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{subtitle}</Text>
        </View>
      </LinearGradient>
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  brand: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '800',
  },
  lockButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  shadow: {
    elevation: 8,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
  },
  primaryCard: {
    minHeight: 178,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginBottom: theme.spacing.sm,
  },
  primaryPress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  primaryContent: {
    flex: 1,
  },
  primaryTitle: {
    color: theme.colors.textPrimary,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '800',
  },
  primarySub: {
    color: 'rgba(237,225,206,0.84)',
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.sm,
  },
  primaryIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  cardWrapper: {
    flex: 1,
  },
  homeCard: {
    minHeight: 174,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  cardImageArea: {
    height: 70,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cardTextArea: {
    minHeight: 72,
    justifyContent: 'flex-end',
  },
  paperIcon: {
    width: 54,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-4deg' }],
  },
  iconPlate: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(231,200,145,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,200,145,0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    lineHeight: 22,
    fontWeight: '800',
  },
  cardSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    marginTop: theme.spacing.xs,
  },
  vaultCard: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    minHeight: 156,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  vaultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  vaultTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    lineHeight: 23,
    fontWeight: '800',
  },
  vaultIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(231,200,145,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,200,145,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaultPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.accent,
    borderRadius: 22,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  vaultPillText: {
    color: theme.colors.black,
    fontSize: theme.fontSize.sm,
    fontWeight: '800',
  },
  vaultSub: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});
