import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import {
  getRosaryMysteryForDate,
  getRosarySuggestionGroupForDay,
  getWeekdayForDate,
  weekdayOptions,
} from '../../src/content/rosary';
import {
  getRosaryIntentions,
  RosaryIntentionsByDay,
  saveRosaryIntentions,
} from '../../src/db/queries/rosaryIntentions';

type RosaryMode = 'today' | 'intentions';

const EMPTY_INTENTIONS = ['', '', '', '', ''];

export default function RosaryScreen() {
  const today = useMemo(() => new Date(), []);
  const todayWeekday = useMemo(() => getWeekdayForDate(today), [today]);
  const todayMystery = useMemo(() => getRosaryMysteryForDate(today), [today]);
  const [mode, setMode] = useState<RosaryMode>('today');
  const [selectedDayId, setSelectedDayId] = useState(todayWeekday.id);
  const [activeDecadeIndex, setActiveDecadeIndex] = useState(0);
  const [intentions, setIntentions] = useState<RosaryIntentionsByDay>({});
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadIntentions() {
      const savedIntentions = await getRosaryIntentions();
      if (mounted) setIntentions(savedIntentions);
    }

    loadIntentions();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedDay =
    weekdayOptions.find((day) => day.id === selectedDayId) ?? todayWeekday;
  const todayIntentions = intentions[todayWeekday.id] ?? EMPTY_INTENTIONS;
  const selectedIntentions = intentions[selectedDayId] ?? EMPTY_INTENTIONS;
  const selectedSuggestionGroup = getRosarySuggestionGroupForDay(selectedDayId);

  const updateIntention = (
    dayId: string,
    decadeIndex: number,
    text: string
  ) => {
    setSavedMessage('');
    setIntentions((current) => {
      const dayIntentions = current[dayId] ?? EMPTY_INTENTIONS;
      return {
        ...current,
        [dayId]: dayIntentions.map((value, index) =>
          index === decadeIndex ? text : value
        ),
      };
    });
  };

  const applySuggestion = (suggestion: string) => {
    updateIntention(selectedDayId, activeDecadeIndex, suggestion);
  };

  const handleSave = async () => {
    await saveRosaryIntentions(intentions);
    setSavedMessage('Intencoes salvas.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="cross"
              size={24}
              color={theme.colors.accent}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Terco</Text>
            <Text style={styles.headerSub}>
              Misterio do dia, leitura biblica e ofertas das dezenas.
            </Text>
          </View>
        </View>

        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              mode === 'today' && styles.segmentButtonActive,
            ]}
            onPress={() => setMode('today')}
            activeOpacity={0.76}
          >
            <MaterialCommunityIcons
              name="cross"
              size={17}
              color={
                mode === 'today'
                  ? theme.colors.black
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentText,
                mode === 'today' && styles.segmentTextActive,
              ]}
            >
              Hoje
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              mode === 'intentions' && styles.segmentButtonActive,
            ]}
            onPress={() => setMode('intentions')}
            activeOpacity={0.76}
          >
            <Feather
              name="edit-3"
              size={16}
              color={
                mode === 'intentions'
                  ? theme.colors.black
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentText,
                mode === 'intentions' && styles.segmentTextActive,
              ]}
            >
              Intencoes
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {mode === 'today' ? (
            <View>
              <LinearGradient
                colors={['#3A4451', '#252A30']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.todayCard}
              >
                <View style={styles.mysteryIcon}>
                  <MaterialCommunityIcons
                    name="cross"
                    size={30}
                    color={theme.colors.accent}
                  />
                </View>
                <Text style={styles.todayLabel}>Hoje, {todayWeekday.label}</Text>
                <Text style={styles.mysteryTitle}>{todayMystery.title}</Text>
                <Text style={styles.mysteryDays}>{todayMystery.days}</Text>
                <Text style={styles.sourceNote}>{todayMystery.sourceNote}</Text>
              </LinearGradient>

              {todayMystery.decades.map((decade, index) => {
                const intention = todayIntentions[index]?.trim();
                return (
                  <View key={decade.title} style={styles.decadeCard}>
                    <View style={styles.decadeHeader}>
                      <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.decadeTitleBlock}>
                        <Text style={styles.decadeTitle}>{decade.title}</Text>
                        <Text style={styles.reference}>{decade.reference}</Text>
                      </View>
                    </View>

                    <View style={styles.scriptureBlock}>
                      <Text style={styles.blockLabel}>Leitura biblica</Text>
                      <Text style={styles.scriptureText}>{decade.scripture}</Text>
                    </View>

                    <Text style={styles.meditation}>{decade.meditation}</Text>

                    {intention ? (
                      <View style={styles.intentionLine}>
                        <Feather
                          name="heart"
                          size={15}
                          color={theme.colors.accent}
                        />
                        <Text style={styles.intentionText}>{intention}</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}

              <Button
                title="Configurar intencoes"
                variant="secondary"
                onPress={() => setMode('intentions')}
                style={styles.actionButton}
              />
            </View>
          ) : (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daySelector}
              >
                {weekdayOptions.map((day) => {
                  const selected = selectedDayId === day.id;
                  return (
                    <TouchableOpacity
                      key={day.id}
                      style={[styles.dayChip, selected && styles.dayChipActive]}
                      onPress={() => {
                        setSelectedDayId(day.id);
                        setActiveDecadeIndex(0);
                        setSavedMessage('');
                      }}
                      activeOpacity={0.76}
                    >
                      <Text
                        style={[
                          styles.dayChipText,
                          selected && styles.dayChipTextActive,
                        ]}
                      >
                        {day.shortLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.intentionsHeaderCard}>
                <Text style={styles.intentionsTitle}>{selectedDay.label}</Text>
                <Text style={styles.intentionsSub}>
                  {selectedSuggestionGroup.theme}
                </Text>
              </View>

              {selectedIntentions.map((value, index) => (
                <View key={`${selectedDayId}-${index}`} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{index + 1}a dezena</Text>
                  <TextInput
                    value={value}
                    onChangeText={(text) =>
                      updateIntention(selectedDayId, index, text)
                    }
                    onFocus={() => setActiveDecadeIndex(index)}
                    placeholder="Pela intencao..."
                    placeholderTextColor={theme.colors.textMuted}
                    style={[
                      styles.intentionInput,
                      activeDecadeIndex === index && styles.intentionInputActive,
                    ]}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              ))}

              <Text style={styles.suggestionsTitle}>
                Sugestoes para {selectedDay.label}
              </Text>
              <Text style={styles.suggestionsSub}>
                Toque em uma sugestao para preencher a dezena ativa.
              </Text>
              <View style={styles.suggestionsWrap}>
                {selectedSuggestionGroup.suggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={styles.suggestionChip}
                    onPress={() => applySuggestion(suggestion)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {savedMessage ? (
                <Text style={styles.savedMessage}>{savedMessage}</Text>
              ) : null}

              <Button
                title="Salvar intencoes"
                variant="primary"
                onPress={handleSave}
                style={styles.actionButton}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(231,200,145,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,200,145,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.xl,
    fontWeight: '800',
  },
  headerSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    lineHeight: 18,
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: 4,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  segmentButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: theme.radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.accent,
  },
  segmentText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '800',
  },
  segmentTextActive: {
    color: theme.colors.black,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 112,
  },
  todayCard: {
    minHeight: 206,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  mysteryIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(231,200,145,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,200,145,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  todayLabel: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '900',
    marginBottom: theme.spacing.xs,
  },
  mysteryTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.xl,
    lineHeight: 31,
    fontWeight: '900',
  },
  mysteryDays: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    marginTop: theme.spacing.xs,
    fontWeight: '700',
  },
  sourceNote: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    lineHeight: 17,
    marginTop: theme.spacing.sm,
  },
  decadeCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  decadeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
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
  decadeTitleBlock: {
    flex: 1,
  },
  decadeTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '800',
    lineHeight: 21,
  },
  reference: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginTop: 3,
  },
  scriptureBlock: {
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(231,200,145,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(231,200,145,0.18)',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  blockLabel: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
  },
  scriptureText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 21,
  },
  meditation: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 21,
  },
  intentionLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  intentionText: {
    flex: 1,
    color: theme.colors.accentSoft,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    fontWeight: '700',
  },
  actionButton: {
    marginTop: theme.spacing.md,
  },
  daySelector: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  dayChip: {
    minWidth: 48,
    minHeight: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  dayChipActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  dayChipText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '800',
  },
  dayChipTextActive: {
    color: theme.colors.black,
  },
  intentionsHeaderCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  intentionsTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: '900',
    lineHeight: 26,
  },
  intentionsSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    lineHeight: 19,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: theme.spacing.sm,
  },
  inputLabel: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
  },
  intentionInput: {
    minHeight: 70,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    color: theme.colors.textPrimary,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
  intentionInputActive: {
    borderColor: theme.colors.accent,
  },
  suggestionsTitle: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.xs,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  suggestionsSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    lineHeight: 17,
    marginBottom: theme.spacing.sm,
  },
  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  suggestionChip: {
    maxWidth: '100%',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  suggestionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 19,
    fontWeight: '700',
  },
  savedMessage: {
    color: theme.colors.success,
    fontSize: theme.fontSize.sm,
    fontWeight: '800',
    marginTop: theme.spacing.md,
  },
});
