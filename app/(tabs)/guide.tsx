import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import {
  commandmentExam,
  capitalSinExam,
  stateOfLifeExam,
  ExamSource,
} from '../../src/data/examContent';

interface GuideDetail {
  id: string;
  title: string;
  explanation: string;
  virtue: string;
  questions: string[];
  purpose: string;
}

interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  items: GuideDetail[];
}

function fromExamSource(source: ExamSource): GuideDetail {
  return {
    id: source.id,
    title: source.title,
    explanation: source.explanation,
    virtue: source.virtue,
    questions: source.questions,
    purpose: source.examples.slice(0, 3).join('; '),
  };
}

const extraSections: GuideSection[] = [
  {
    id: 'beatitudes',
    title: 'Bem-aventuranças',
    subtitle: 'O coração de Cristo como medida da vida cristã.',
    items: [
      {
        id: 'beatitudes-main',
        title: 'Bem-aventuranças',
        explanation:
          'Elas mostram a pobreza de espírito, mansidão, misericórdia, pureza e sede de justiça que moldam o discípulo.',
        virtue: 'Humildade, mansidão e misericórdia',
        questions: [
          'Fui humilde diante de Deus e das pessoas?',
          'Fui manso quando contrariado?',
          'Tive misericórdia de quem caiu?',
          'Busquei a paz ou aumentei divisões?',
        ],
        purpose: 'Escolher uma bem-aventurança para praticar amanhã.',
      },
    ],
  },
  {
    id: 'prayer-life',
    title: 'Vida de Oração',
    subtitle: 'Fidelidade concreta ao encontro com Deus.',
    items: stateOfLifeExam
      .filter((item) => item.id === 'state-prayer')
      .map(fromExamSource),
  },
  {
    id: 'family-engagement',
    title: 'Família e Noivado',
    subtitle: 'Caridade, verdade, pureza e responsabilidade nos vínculos.',
    items: stateOfLifeExam
      .filter((item) => item.id === 'state-family')
      .map(fromExamSource),
  },
  {
    id: 'state-duties',
    title: 'Estado de Vida e Deveres',
    subtitle: 'Trabalho, estudo, vocação e obrigações assumidas.',
    items: stateOfLifeExam
      .filter((item) => item.id === 'state-work')
      .map(fromExamSource),
  },
  {
    id: 'purity',
    title: 'Pureza e Domínio de Si',
    subtitle: 'Guarda do coração, do olhar, dos afetos e do corpo.',
    items: [
      ...commandmentExam
        .filter((item) => ['cmd-6', 'cmd-9'].includes(item.id))
        .map(fromExamSource),
      ...capitalSinExam
        .filter((item) => item.id === 'capital-lust')
        .map(fromExamSource),
    ],
  },
  {
    id: 'charity-justice-truth',
    title: 'Caridade, Justiça e Verdade',
    subtitle: 'Amor concreto ao próximo em palavras, bens e atitudes.',
    items: [
      ...commandmentExam
        .filter((item) => ['cmd-5', 'cmd-7', 'cmd-8', 'cmd-10'].includes(item.id))
        .map(fromExamSource),
      ...stateOfLifeExam
        .filter((item) => item.id === 'state-charity')
        .map(fromExamSource),
    ],
  },
  {
    id: 'confession-prep',
    title: 'Preparação para Confissão',
    subtitle: 'Contrição, clareza, propósito e confiança na misericórdia.',
    items: [
      {
        id: 'confession-main',
        title: 'Preparar uma boa confissão',
        explanation:
          'Procure confessar com simplicidade, sem esconder o pecado e sem alongar detalhes desnecessários.',
        virtue: 'Contrição, sinceridade e propósito de emenda',
        questions: [
          'Tenho arrependimento por ter ofendido a Deus?',
          'Quero evitar ocasiões próximas de pecado?',
          'Há reparação possível que preciso iniciar?',
          'Estou disposto a dizer os pecados com clareza e humildade?',
        ],
        purpose: 'Escolher um propósito concreto e possível para depois da confissão.',
      },
    ],
  },
];

export default function GuideScreen() {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const sections = useMemo<GuideSection[]>(
    () => [
      {
        id: 'commandments',
        title: 'Dez Mandamentos',
        subtitle: 'A lei de Deus como caminho de amor e conversão.',
        items: commandmentExam.map(fromExamSource),
      },
      {
        id: 'capital-sins',
        title: 'Pecados Capitais',
        subtitle: 'Raízes interiores que alimentam muitas quedas.',
        items: capitalSinExam.map(fromExamSource),
      },
      ...extraSections,
    ],
    []
  );

  const selectedSection =
    sections.find((section) => section.id === selectedSectionId) ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {selectedSection ? (
          <TouchableOpacity
            onPress={() => setSelectedSectionId(null)}
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
              : 'Conteúdo organizado para exame e propósito.'}
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
              style={styles.sectionCard}
              onPress={() => setSelectedSectionId(section.id)}
              activeOpacity={0.75}
            >
              <View style={styles.sectionIcon}>
                <Feather name="book-open" size={18} color={theme.colors.accent} />
              </View>
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionSub}>{section.subtitle}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ))
        ) : (
          selectedSection.items.map((item) => (
            <View key={item.id} style={styles.detailCard}>
              <Text style={styles.detailTitle}>{item.title}</Text>
              <Text style={styles.detailExplanation}>{item.explanation}</Text>

              <View style={styles.virtueBox}>
                <Text style={styles.virtueLabel}>Virtude oposta</Text>
                <Text style={styles.virtueText}>{item.virtue}</Text>
              </View>

              <Text style={styles.detailLabel}>Perguntas</Text>
              {item.questions.map((question) => (
                <View key={question} style={styles.questionRow}>
                  <Feather name="circle" size={7} color={theme.colors.accent} />
                  <Text style={styles.questionText}>{question}</Text>
                </View>
              ))}

              <Text style={styles.detailLabel}>Propósito sugerido</Text>
              <Text style={styles.purposeText}>{item.purpose}</Text>
            </View>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
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
    fontWeight: '600',
  },
  headerSub: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
  },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.accent + '14',
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
  sectionSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    lineHeight: 18,
    marginTop: 2,
  },
  detailCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.md,
  },
  detailTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    lineHeight: 26,
  },
  detailExplanation: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 21,
    marginBottom: theme.spacing.md,
  },
  virtueBox: {
    borderRadius: theme.radius.sm,
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
    marginBottom: 2,
  },
  virtueText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
  },
  detailLabel: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '800',
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
  purposeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
