import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import {
  AddSinNoteModal,
  AddSinNotePayload,
} from '../../src/components/AddSinNoteModal';
import { fullExamContent, ExamSource } from '../../src/data/examContent';
import { upsertExam } from '../../src/db/queries/exams';
import { createSin } from '../../src/db/queries/sins';
import { todayISO } from '../../src/utils/date';
import { useDatabase } from '../../src/hooks/useDatabase';

type Stage = 'opening' | 'gratitude' | 'content' | 'final_notes' | 'contrition';

const openingPrayer = `Vinde, Espírito Santo.
Iluminai minha memória, meu entendimento e minha vontade.
Dai-me a graça de ver a verdade com humildade,
sem desespero e sem desculpas,
confiando sempre na misericórdia de Deus. Amém.`;

const contritionPrayer = `Meu Deus,
pesa-me muito ter-Vos ofendido,
porque sois infinitamente bom
e o pecado Vos desagrada.

Proponho firmemente,
com o auxílio da vossa graça,
não Vos ofender mais
e evitar as ocasiões próximas de pecado.

Senhor, misericórdia. Amém.`;

export default function ExamScreen() {
  const router = useRouter();
  const { refreshAppState } = useDatabase();
  const [stage, setStage] = useState<Stage>('opening');
  const [sourceIndex, setSourceIndex] = useState(0);
  const [gratitude, setGratitude] = useState('');
  const [finalNotes, setFinalNotes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [modalSource, setModalSource] = useState<ExamSource | null>(null);
  const [notesBySource, setNotesBySource] = useState<Record<string, string[]>>({});

  const currentSource = fullExamContent[sourceIndex];
  const totalSteps = fullExamContent.length + 4;
  const currentStep = useMemo(() => {
    if (stage === 'opening') return 1;
    if (stage === 'gratitude') return 2;
    if (stage === 'content') return sourceIndex + 3;
    if (stage === 'final_notes') return fullExamContent.length + 3;
    return totalSteps;
  }, [sourceIndex, stage, totalSteps]);
  const progress = currentStep / totalSteps;

  const handleSaveNote = useCallback(
    async (payload: AddSinNotePayload) => {
      await createSin({
        date: todayISO(),
        type: payload.type,
        sourceId: payload.sourceId,
        sourceTitle: payload.sourceTitle,
        title: payload.title,
        description: payload.description,
        occasion: payload.occasion,
        commandment:
          payload.type === 'commandment' ? payload.sourceTitle : null,
        category:
          payload.type === 'capital_sin' || payload.type === 'state_of_life'
            ? payload.sourceTitle
            : null,
        nearOccasion: payload.occasion,
        isRepeated: false,
        needsConfession: payload.needsConfession,
        hasRepaired: false,
        concretePropose: null,
        status: 'active',
      });

      setNotesBySource((prev) => ({
        ...prev,
        [payload.sourceId]: [...(prev[payload.sourceId] ?? []), payload.title],
      }));
      await refreshAppState();
    },
    [refreshAppState]
  );

  const handleNextSource = async () => {
    if (sourceIndex < fullExamContent.length - 1) {
      setSourceIndex((prev) => prev + 1);
      return;
    }

    setStage('final_notes');
  };

  const handleComplete = async () => {
    await upsertExam(todayISO(), {
      stepReached: totalSteps,
      completed: true,
      notes: [gratitude, finalNotes].filter(Boolean).join('\n\n') || null,
    });
    await refreshAppState();
    setCompleted(true);
  };

  const handleClose = () => {
    Alert.alert('Sair do exame', 'Deseja sair agora?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => router.back() },
    ]);
  };

  if (completed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedCross}>✝</Text>
          <Text style={styles.completedTitle}>Exame concluído</Text>
          <Text style={styles.completedText}>
            Recomece com confiança. A misericórdia de Deus é maior que toda queda.
          </Text>
          <Button
            title="Voltar ao início"
            variant="primary"
            onPress={() => router.replace('/(tabs)')}
            style={styles.completedButton}
          />
          <Button
            title="Preparar confissão"
            variant="secondary"
            onPress={() => router.replace('/confession')}
            style={styles.completedButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AddSinNoteModal
        visible={!!modalSource}
        type={modalSource?.type ?? 'manual'}
        sourceId={modalSource?.id ?? 'manual'}
        sourceTitle={modalSource?.title ?? 'Anotação'}
        onSave={handleSaveNote}
        onClose={() => setModalSource(null)}
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="x" size={22} color={theme.colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.stepCounter}>
          {currentStep} / {totalSteps}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {stage === 'opening' && (
          <View>
            <Text style={styles.stepTitle}>Oração inicial</Text>
            <Text style={styles.stepSubtitle}>
              Comece sem pressa, pedindo luz e confiança.
            </Text>
            <Text style={styles.prayerText}>{openingPrayer}</Text>
            <Button
              title="Começar"
              variant="primary"
              onPress={() => setStage('gratitude')}
              style={styles.actionButton}
            />
          </View>
        )}

        {stage === 'gratitude' && (
          <View>
            <Text style={styles.stepTitle}>Gratidão do dia</Text>
            <Text style={styles.stepSubtitle}>
              Antes de olhar as faltas, reconheça os dons recebidos.
            </Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Por quais graças, pessoas ou pequenos bens você agradece hoje?"
              placeholderTextColor={theme.colors.textMuted}
              value={gratitude}
              onChangeText={setGratitude}
              multiline
              textAlignVertical="top"
            />
            <Button
              title="Continuar"
              variant="primary"
              onPress={() => setStage('content')}
              style={styles.actionButton}
            />
          </View>
        )}

        {stage === 'content' && currentSource && (
          <View>
            <Text style={styles.sourceKind}>
              {currentSource.type === 'commandment'
                ? 'Dez Mandamentos'
                : currentSource.type === 'capital_sin'
                ? 'Pecados Capitais'
                : 'Estado de vida'}
            </Text>
            <Text style={styles.stepTitle}>{currentSource.title}</Text>
            <Text style={styles.explanation}>{currentSource.explanation}</Text>

            <View style={styles.virtueCard}>
              <Text style={styles.virtueLabel}>Virtude oposta</Text>
              <Text style={styles.virtueText}>{currentSource.virtue}</Text>
            </View>

            <Text style={styles.sectionTitle}>Perguntas para examinar</Text>
            {currentSource.questions.map((question) => (
              <View key={question} style={styles.questionRow}>
                <Feather name="circle" size={8} color={theme.colors.accent} />
                <Text style={styles.questionText}>{question}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Exemplos possíveis</Text>
            <View style={styles.examplesWrap}>
              {currentSource.examples.map((example) => (
                <View key={example} style={styles.examplePill}>
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              ))}
            </View>

            <Button
              title="Adicionar anotação"
              variant="secondary"
              onPress={() => setModalSource(currentSource)}
              style={styles.actionButton}
            />

            {(notesBySource[currentSource.id] ?? []).length > 0 && (
              <View style={styles.currentNotesCard}>
                <Text style={styles.currentNotesTitle}>Anotações neste item</Text>
                {(notesBySource[currentSource.id] ?? []).map((note, index) => (
                  <Text key={`${note}-${index}`} style={styles.currentNoteText}>
                    • {note}
                  </Text>
                ))}
              </View>
            )}

            <Button
              title={
                sourceIndex < fullExamContent.length - 1
                  ? 'Próximo'
                  : 'Ir para anotações finais'
              }
              variant="primary"
              onPress={handleNextSource}
              style={styles.actionButton}
            />
          </View>
        )}

        {stage === 'final_notes' && (
          <View>
            <Text style={styles.stepTitle}>Anotações finais</Text>
            <Text style={styles.stepSubtitle}>
              Registre um propósito concreto ou algo que deseja levar à oração.
            </Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Propósito, reparação, ocasião a evitar..."
              placeholderTextColor={theme.colors.textMuted}
              value={finalNotes}
              onChangeText={setFinalNotes}
              multiline
              textAlignVertical="top"
            />
            <Button
              title="Ato de contrição"
              variant="primary"
              onPress={() => setStage('contrition')}
              style={styles.actionButton}
            />
          </View>
        )}

        {stage === 'contrition' && (
          <View>
            <Text style={styles.stepTitle}>Ato de contrição</Text>
            <Text style={styles.prayerText}>{contritionPrayer}</Text>
            <Button
              title="Concluir exame"
              variant="primary"
              onPress={handleComplete}
              style={styles.actionButton}
            />
          </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  stepCounter: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: theme.colors.cardBorder,
    marginHorizontal: theme.spacing.md,
    borderRadius: 2,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  stepTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    lineHeight: 32,
  },
  stepSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  sourceKind: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  explanation: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  prayerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  virtueCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    marginBottom: theme.spacing.lg,
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
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  questionText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
  },
  examplesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  examplePill: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  exampleText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xs,
  },
  currentNotesCard: {
    backgroundColor: theme.colors.warning + '12',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.warning + '44',
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  currentNotesTitle: {
    color: theme.colors.warning,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  currentNoteText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
  },
  notesInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    color: theme.colors.textPrimary,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    minHeight: 180,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: theme.spacing.md,
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  completedCross: {
    fontSize: 56,
    color: theme.colors.accent,
    marginBottom: theme.spacing.lg,
  },
  completedTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  completedText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xxl,
    fontStyle: 'italic',
  },
  completedButton: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
});
