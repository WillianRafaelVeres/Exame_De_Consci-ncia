import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { createSin } from '../../src/db/queries/sins';
import { todayISO } from '../../src/utils/date';
import { useDatabase } from '../../src/hooks/useDatabase';
import { commandments } from '../../src/content/commandments';
import { capitalSins } from '../../src/content/capitalSins';

const COMMANDMENT_OPTIONS = ['', ...commandments.map((c) => c.title)];
const CATEGORY_OPTIONS = ['', ...capitalSins.map((s) => s.title)];

export default function NewSinScreen() {
  const router = useRouter();
  const { refreshAppState } = useDatabase();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [commandment, setCommandment] = useState('');
  const [category, setCategory] = useState('');
  const [nearOccasion, setNearOccasion] = useState('');
  const [isRepeated, setIsRepeated] = useState(false);
  const [needsConfession, setNeedsConfession] = useState(true);
  const [concretePropose, setConcretePropose] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCommandmentPicker, setShowCommandmentPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe o título do pecado.');
      return;
    }

    setSaving(true);
    try {
      const type: 'commandment' | 'capital_sin' | 'manual' = commandment
        ? 'commandment'
        : category
        ? 'capital_sin'
        : 'manual';
      const sourceTitle = commandment || category || 'Anotação manual';
      await createSin({
        date: todayISO(),
        type,
        sourceId: type === 'manual' ? 'manual' : sourceTitle,
        sourceTitle,
        title: title.trim(),
        description: description.trim() || null,
        commandment: commandment || null,
        category: category || null,
        occasion: nearOccasion.trim() || null,
        nearOccasion: nearOccasion.trim() || null,
        isRepeated,
        needsConfession,
        hasRepaired: false,
        concretePropose: concretePropose.trim() || null,
        status: 'active',
      });
      await refreshAppState();
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="x" size={22} color={theme.colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Anotar Pecado</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.field}>
          <Text style={styles.label}>Título <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Descreva brevemente o pecado..."
            placeholderTextColor={theme.colors.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={120}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Mais detalhes (opcional)..."
            placeholderTextColor={theme.colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mandamento</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setShowCommandmentPicker(true);
              setShowCategoryPicker(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={commandment ? styles.selectValue : styles.selectPlaceholder} numberOfLines={1}>
              {commandment || 'Selecionar mandamento...'}
            </Text>
            <Feather name="chevron-down" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
          {showCommandmentPicker && (
            <View style={styles.picker}>
              {COMMANDMENT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pickerItem, commandment === opt && styles.pickerItemActive]}
                  onPress={() => {
                    setCommandment(opt);
                    setShowCommandmentPicker(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, commandment === opt && styles.pickerItemTextActive]} numberOfLines={2}>
                    {opt || '— Nenhum —'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Categoria (Pecado Capital)</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setShowCategoryPicker(true);
              setShowCommandmentPicker(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={category ? styles.selectValue : styles.selectPlaceholder} numberOfLines={1}>
              {category || 'Selecionar categoria...'}
            </Text>
            <Feather name="chevron-down" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
          {showCategoryPicker && (
            <View style={styles.picker}>
              {CATEGORY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.pickerItem, category === opt && styles.pickerItemActive]}
                  onPress={() => {
                    setCategory(opt);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, category === opt && styles.pickerItemTextActive]}>
                    {opt || '— Nenhuma —'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ocasião próxima</Text>
          <TextInput
            style={styles.input}
            placeholder="O que levou a este pecado?..."
            placeholderTextColor={theme.colors.textMuted}
            value={nearOccasion}
            onChangeText={setNearOccasion}
          />
        </View>

        <View style={styles.toggleField}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Pecado recorrente</Text>
            <Text style={styles.toggleSub}>Ocorre com frequência</Text>
          </View>
          <Switch
            value={isRepeated}
            onValueChange={setIsRepeated}
            trackColor={{ false: theme.colors.cardBorder, true: theme.colors.accent + '88' }}
            thumbColor={isRepeated ? theme.colors.accent : theme.colors.textMuted}
          />
        </View>

        <View style={styles.toggleField}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Precisa de confissão</Text>
            <Text style={styles.toggleSub}>Incluir na preparação</Text>
          </View>
          <Switch
            value={needsConfession}
            onValueChange={setNeedsConfession}
            trackColor={{ false: theme.colors.cardBorder, true: theme.colors.accent + '88' }}
            thumbColor={needsConfession ? theme.colors.accent : theme.colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Propósito concreto</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Como evitarei este pecado?..."
            placeholderTextColor={theme.colors.textMuted}
            value={concretePropose}
            onChangeText={setConcretePropose}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <Button
          title="Salvar"
          variant="primary"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />

        <Button
          title="Cancelar"
          variant="ghost"
          onPress={() => router.back()}
          style={styles.cancelButton}
        />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  field: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.3,
  },
  required: {
    color: theme.colors.error,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
  },
  inputMultiline: {
    minHeight: 80,
    lineHeight: 22,
  },
  selectButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  selectValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  selectPlaceholder: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  picker: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginTop: 4,
    maxHeight: 200,
    overflow: 'hidden',
  },
  pickerItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  pickerItemActive: {
    backgroundColor: theme.colors.accent + '22',
  },
  pickerItemText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  pickerItemTextActive: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  toggleField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  toggleSub: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  saveButton: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  cancelButton: {
    marginBottom: theme.spacing.sm,
  },
});
