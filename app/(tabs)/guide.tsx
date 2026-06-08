import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import {
  commandmentExam,
  capitalSinExam,
  stateOfLifeExam,
  ExamSource,
} from '../../src/data/examContent';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface GuideDetail {
  id: string;
  title: string;
  subtitle: string;
  explanation: string;
  virtue: string;
  questions: string[];
  howToImprove: string[];
  purpose: string;
}

interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  colors: [string, string];
  items: GuideDetail[];
}

function fromExamSource(source: ExamSource): GuideDetail {
  return {
    id: source.id,
    title: source.title,
    subtitle: source.subtitle,
    explanation: source.explanation,
    virtue: source.virtue,
    questions: source.questions,
    howToImprove: source.howToImprove,
    purpose: source.howToImprove[0] ?? 'Escolher um propósito concreto para amanhã.',
  };
}

const confessionGuide: GuideDetail = {
  id: 'confession-main',
  title: 'Preparar uma boa confissão',
  subtitle: 'Clareza, humildade e confiança',
  explanation:
    'A confissão pede contrição, sinceridade, acusação simples dos pecados e propósito real de emenda.',
  virtue: 'contrição, sinceridade e confiança',
  questions: [
    'Tenho dor de ter ofendido a Deus?',
    'Estou escondendo algo por vergonha?',
    'Quero evitar ocasiões de pecado?',
    'Há algo que devo reparar?',
    'Meu propósito é concreto?',
  ],
  howToImprove: [
    'Fazer o exame com calma.',
    'Confessar os pecados com clareza.',
    'Evitar explicações longas sem necessidade.',
    'Cumprir a penitência logo que possível.',
  ],
  purpose: 'Confessar com simplicidade e cumprir a penitência.',
};

export default function GuideScreen() {
  const params = useLocalSearchParams<{ section?: string }>();
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const sections = useMemo<GuideSection[]>(
    () => [
      {
        id: 'commandments',
        title: 'Dez Mandamentos',
        subtitle: 'A lei de Deus como caminho de conversão.',
        icon: 'list',
        colors: ['#384553', '#1F262D'],
        items: commandmentExam.map(fromExamSource),
      },
      {
        id: 'capital-sins',
        title: 'Pecados Capitais',
        subtitle: 'Raízes interiores e virtudes que as combatem.',
        icon: 'heart',
        colors: ['#4B3548', '#242733'],
        items: capitalSinExam.map(fromExamSource),
      },
      {
        id: 'state-life',
        title: 'Estado de Vida',
        subtitle: 'Deveres concretos da rotina, família e trabalho.',
        icon: 'briefcase',
        colors: ['#2F4A47', '#1D272A'],
        items: stateOfLifeExam.map(fromExamSource),
      },
      {
        id: 'prayer-life',
        title: 'Vida de Oração',
        subtitle: 'Fidelidade concreta ao encontro com Deus.',
        icon: 'sunrise',
        colors: ['#4C4533', '#252722'],
        items: stateOfLifeExam
          .filter((item) => item.id === 'state_prayer')
          .map(fromExamSource),
      },
      {
        id: 'confession-prep',
        title: 'Preparação para Confissão',
        subtitle: 'Contrição, clareza, propósito e confiança.',
        icon: 'shield',
        colors: ['#4B3C32', '#24252A'],
        items: [confessionGuide],
      },
    ],
    []
  );

  useEffect(() => {
    if (params.section && sections.some((section) => section.id === params.section)) {
      setSelectedSectionId(params.section);
      setExpandedItemId(null);
    }
  }, [params.section, sections]);

  const selectedSection =
    sections.find((section) => section.id === selectedSectionId) ?? null;

  const toggleItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItemId((current) => (current === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {selectedSection ? (
          <TouchableOpacity
            onPress={() => {
              setSelectedSectionId(null);
              setExpandedItemId(null);
            }}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="arrow-left" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            {selectedSection ? selectedSection.title : 'Guia Espiritual'}
          </Text>
          <Text style={styles.headerSub}>
            {selectedSection
              ? selectedSection.subtitle
              : 'Estude por tema e abra somente o que deseja ler.'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!selectedSection ? (
          sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              onPress={() => {
                setSelectedSectionId(section.id);
                setExpandedItemId(null);
              }}
              activeOpacity={0.78}
            >
              <LinearGradient
                colors={section.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionCard}
              >
                <View style={styles.sectionIcon}>
                  {section.icon === 'heart' ? (
                    <MaterialCommunityIcons
                      name="heart-outline"
                      size={24}
                      color={theme.colors.accent}
                    />
                  ) : (
                    <Feather name={section.icon} size={22} color={theme.colors.accent} />
                  )}
                </View>
                <View style={styles.sectionText}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionSub}>{section.subtitle}</Text>
                  <Text style={styles.sectionCount}>
                    {section.items.length} {section.items.length === 1 ? 'tema' : 'temas'}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
              </LinearGradient>
            </TouchableOpacity>
          ))
        ) : (
          selectedSection.items.map((item, index) => {
            const expanded = expandedItemId === item.id;
            return (
              <View key={item.id} style={styles.detailCard}>
                <TouchableOpacity
                  style={styles.detailHeader}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.78}
                >
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.detailTitleBlock}>
                    <Text style={styles.detailTitle}>{item.title}</Text>
                    <Text style={styles.detailSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Feather
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.colors.textMuted}
                  />
                </TouchableOpacity>

                {expanded && (
                  <View style={styles.detailBody}>
                    <Text style={styles.detailExplanation}>{item.explanation}</Text>

                    <View style={styles.virtueBox}>
                      <Text style={styles.virtueLabel}>Virtude oposta</Text>
                      <Text style={styles.virtueText}>{item.virtue}</Text>
                    </View>

                    <Text style={styles.detailLabel}>Perguntas de exame</Text>
                    {item.questions.map((question) => (
                      <View key={question} style={styles.questionRow}>
                        <Feather name="circle" size={7} color={theme.colors.accent} />
                        <Text style={styles.questionText}>{question}</Text>
                      </View>
                    ))}

                    <Text style={styles.detailLabel}>Como melhorar</Text>
                    {item.howToImprove.map((step) => (
                      <View key={step} style={styles.questionRow}>
                        <Feather name="check" size={12} color={theme.colors.success} />
                        <Text style={styles.questionText}>{step}</Text>
                      </View>
                    ))}

                    <View style={styles.purposeBox}>
                      <Text style={styles.virtueLabel}>Propósito prático</Text>
                      <Text style={styles.purposeText}>{item.purpose}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })
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
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
  },
  sectionIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: 'rgba(231,200,145,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,200,145,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '800',
  },
  sectionSub: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 19,
    marginTop: 3,
  },
  sectionCount: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '800',
    marginTop: theme.spacing.xs,
  },
  detailCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  numberBadge: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: theme.colors.black,
    fontSize: theme.fontSize.sm,
    fontWeight: '900',
  },
  detailTitleBlock: {
    flex: 1,
  },
  detailTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '800',
    lineHeight: 21,
  },
  detailSubtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    marginTop: 3,
  },
  detailBody: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
  },
  detailExplanation: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 21,
    marginBottom: theme.spacing.md,
  },
  virtueBox: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    backgroundColor: theme.colors.accent + '10',
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  virtueLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  virtueText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.sm,
    fontWeight: '800',
  },
  detailLabel: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  questionText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
  },
  purposeBox: {
    backgroundColor: theme.colors.cardElevated,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  purposeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
  },
});
