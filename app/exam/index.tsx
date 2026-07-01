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
  ExamSource,
  fullExamContent,
  gratitudeReflections,
  heavenReflectionIntro,
} from '../../src/data/examContent';
import { upsertExam } from '../../src/db/queries/exams';
import { createSin, decrementSin, getSin } from '../../src/db/queries/sins';
import { Sin } from '../../src/types';
import { todayISO } from '../../src/utils/date';
import { useDatabase } from '../../src/hooks/useDatabase';

type Stage = 'opening' | 'gratitude' | 'content' | 'contrition';

const openingPrayer = `Em nome do Pai, do Filho e do Espírito Santo. Amém.

Meu Senhor e meu Deus, eu creio que estais aqui presente, que me vedes, me ouvis e conheceis tudo o que se passa em minha alma.

Dai-me luz para reconhecer meus pecados, humildade para não me justificar, dor sincera por Vos ter ofendido e força para mudar de vida.

Espírito Santo, iluminai minha consciência.
Nossa Senhora, minha Mãe, ajudai-me a fazer este exame com verdade e confiança.
Santo Anjo da Guarda, ajudai-me a ver minha alma como Deus a vê.

Amém.`;

const contritionPrayer = `Senhor meu Jesus Cristo, Deus e homem verdadeiro, Criador e Redentor meu, por serdes Vós quem sois, sumamente bom e digno de ser amado sobre todas as coisas, pesa-me de todo o coração ter-Vos ofendido.

Pesa-me também por ter perdido o Céu e merecido o inferno, mas sobretudo porque pequei contra Vós, que sois tão bom e digno de todo amor.

Proponho firmemente, com o auxílio da Vossa graça, confessar-me, cumprir a penitência, evitar as ocasiões de pecado e emendar a minha vida.

Recebei, Senhor, o meu arrependimento. Dai-me um coração novo, humilde e fiel. Ajudai-me a combater meus pecados e a caminhar, dia após dia, para a santidade.

Amém.`;

function sourceSection(source: ExamSource): string {
  if (source.type === 'commandment') return 'Dez Mandamentos';
  if (source.type === 'capital_sin') return 'Pecados Capitais';
  return 'Exame diário';
}

function normalizeQuestionText(question: string): string {
  return question.endsWith('?') ? question.slice(0, -1) + '.' : question;
}

export default function ExamScreen() {
  const router = useRouter();
  const { refreshAppState } = useDatabase();
  const [stage, setStage] = useState<Stage>('opening');
  const [sourceIndex, setSourceIndex] = useState(0);
  const [freeText, setFreeText] = useState('');
  const [recordsBySource, setRecordsBySource] = useState<Record<string, Sin[]>>({});
  const [checkedRecords, setCheckedRecords] = useState<Record<string, string>>({});
  const [sessionId] = useState(() => `${todayISO()}_${Date.now()}`);

  const reflection = useMemo(
    () => gratitudeReflections[Math.floor(Math.random() * gratitudeReflections.length)],
    []
  );

  const currentSource = fullExamContent[sourceIndex];
  const totalSteps = fullExamContent.length + 3;
  const currentStep = useMemo(() => {
    if (stage === 'opening') return 1;
    if (stage === 'gratitude') return 2;
    if (stage === 'content') return sourceIndex + 3;
    return totalSteps;
  }, [sourceIndex, stage, totalSteps]);
  const progress = currentStep / totalSteps;
  const currentRecords = currentSource
    ? recordsBySource[currentSource.id] ?? []
    : [];

  const addRecordToState = (sourceId: string, record: Sin) => {
    setRecordsBySource((prev) => ({
      ...prev,
      [sourceId]: [
        ...(prev[sourceId] ?? []).filter((item) => item.id !== record.id),
        record,
      ],
    }));
  };

  const removeRecordFromState = (recordId: string) => {
    setRecordsBySource((prev) => {
      const next: Record<string, Sin[]> = {};
      for (const [sourceId, records] of Object.entries(prev)) {
        next[sourceId] = records.filter((record) => record.id !== recordId);
      }
      return next;
    });
  };

  const handleToggleQuestion = useCallback(
    async (source: ExamSource, question: string, index: number) => {
      const key = `${source.id}:${index}`;
      const existingId = checkedRecords[key];

      if (existingId) {
        await decrementSin(existingId);
        setCheckedRecords((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        removeRecordFromState(existingId);
        await refreshAppState();
        return;
      }

      const generatedId = `auto_${sessionId}_${source.id}_${index}`;
      const id = await createSin({
        id: generatedId,
        date: todayISO(),
        sourceType: source.type,
        sourceId: source.id,
        sourceTitle: source.title,
        text: normalizeQuestionText(question),
        fromQuestion: true,
        needsConfession: true,
      });

      const record = await getSin(id);
      if (record) {
        addRecordToState(source.id, record);
      }
      setCheckedRecords((prev) => ({ ...prev, [key]: id }));
      await refreshAppState();
    },
    [checkedRecords, refreshAppState, sessionId]
  );

  const handleAddFreeNote = async () => {
    const text = freeText.trim();
    if (!currentSource || !text) return;

    const id = await createSin({
      date: todayISO(),
      sourceType: currentSource.type,
      sourceId: currentSource.id,
      sourceTitle: currentSource.title,
      text,
      fromQuestion: false,
      needsConfession: true,
    });

    const record = await getSin(id);
    if (record) {
      addRecordToState(currentSource.id, record);
    }
    setFreeText('');
    await refreshAppState();
  };

  const handleDeleteRecord = async (record: Sin) => {
    await decrementSin(record.id);
    removeRecordFromState(record.id);
    setCheckedRecords((prev) => {
      const next = { ...prev };
      for (const [key, id] of Object.entries(next)) {
        if (id === record.id) delete next[key];
      }
      return next;
    });
    await refreshAppState();
  };

  const handleNext = () => {
    setFreeText('');
    if (sourceIndex < fullExamContent.length - 1) {
      setSourceIndex((prev) => prev + 1);
      return;
    }
    setStage('contrition');
  };

  const handleComplete = async () => {
    await upsertExam(todayISO(), {
      stepReached: totalSteps,
      completed: true,
      notes: null,
    });
    await refreshAppState();
    Alert.alert('Exame concluído', 'Exame de consciência concluído.', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  const handleClose = () => {
    Alert.alert('Sair do exame', 'Deseja sair agora?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.stepSubtitle}>Comece com calma e recolhimento.</Text>
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
              Reconheça a graça recebida e olhe seu dia à luz da eternidade.
            </Text>
            <View style={styles.reflectionCard}>
              <Feather name="sunrise" size={22} color={theme.colors.accent} />
              <Text style={styles.reflectionBody}>{heavenReflectionIntro}</Text>
              <Text style={styles.reflectionText}>{reflection}</Text>
            </View>
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
            <Text style={styles.sourceKind}>{sourceSection(currentSource)}</Text>
            <Text style={styles.stepTitle}>{currentSource.title}</Text>
            <Text style={styles.sourceSubtitle}>{currentSource.subtitle}</Text>
            <Text style={styles.explanation}>{currentSource.explanation}</Text>

            <View style={styles.virtueCard}>
              <Text style={styles.virtueLabel}>Virtude</Text>
              <Text style={styles.virtueText}>{currentSource.virtue}</Text>
            </View>

            <Text style={styles.sectionTitle}>Perguntas</Text>
            {currentSource.questions.map((question, index) => {
              const checked = Boolean(checkedRecords[`${currentSource.id}:${index}`]);
              return (
                <TouchableOpacity
                  key={`${currentSource.id}-${question}`}
                  style={[styles.questionRow, checked && styles.questionRowChecked]}
                  activeOpacity={0.75}
                  onPress={() => handleToggleQuestion(currentSource, question, index)}
                >
                  <View style={[styles.checkBox, checked && styles.checkBoxActive]}>
                    {checked && (
                      <Feather name="check" size={14} color={theme.colors.background} />
                    )}
                  </View>
                  <Text style={[styles.questionText, checked && styles.questionTextChecked]}>
                    {question}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.sectionTitle}>Adicionar anotação</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Escreva aqui sua anotação..."
              placeholderTextColor={theme.colors.textMuted}
              value={freeText}
              onChangeText={setFreeText}
              multiline
              textAlignVertical="top"
            />
            <Button
              title="Adicionar anotação"
              variant="secondary"
              onPress={handleAddFreeNote}
              disabled={!freeText.trim()}
              style={styles.addNoteButton}
            />

            {currentRecords.length > 0 && (
              <View style={styles.currentNotesCard}>
                <Text style={styles.currentNotesTitle}>
                  Anotações deste item
                </Text>
                {currentRecords.map((record) => (
                  <View key={record.id} style={styles.currentNoteRow}>
                    <Text style={styles.currentNoteText}>
                      {record.text}
                      {record.count > 1 ? `  x${record.count}` : ''}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteRecord(record)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Feather name="trash-2" size={16} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <Button
              title={
                sourceIndex < fullExamContent.length - 1
                  ? currentSource.type === 'commandment'
                    ? 'Próximo mandamento'
                    : 'Próximo'
                  : 'Ato de contrição'
              }
              variant="primary"
              onPress={handleNext}
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
  container: { flex: 1, backgroundColor: theme.colors.background },
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
  scroll: { flex: 1 },
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
    lineHeight: 20,
    fontStyle: 'italic',
  },
  prayerText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    lineHeight: 30,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  reflectionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  reflectionText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    lineHeight: 28,
    fontWeight: '600',
  },
  reflectionBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    lineHeight: 24,
  },
  sourceKind: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  sourceSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  explanation: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  virtueCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
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
    fontSize: theme.fontSize.md,
    fontWeight: '700',
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
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
  },
  questionRowChecked: {
    backgroundColor: theme.colors.warning + '12',
    borderColor: theme.colors.warning + '66',
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: theme.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxActive: {
    backgroundColor: theme.colors.warning,
    borderColor: theme.colors.warning,
  },
  questionText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
  questionTextChecked: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  noteInput: {
    minHeight: 86,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    color: theme.colors.textPrimary,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
  addNoteButton: {
    marginTop: theme.spacing.sm,
  },
  currentNotesCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  currentNotesTitle: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.sm,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  currentNoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  currentNoteText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: theme.spacing.lg,
  },
});
