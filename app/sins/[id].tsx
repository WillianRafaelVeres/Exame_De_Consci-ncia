import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { Sin } from '../../src/types';
import { getSin, updateSin, deleteSin } from '../../src/db/queries/sins';
import { useDatabase } from '../../src/hooks/useDatabase';
import { commandments } from '../../src/content/commandments';
import { capitalSins } from '../../src/content/capitalSins';

const COMMANDMENT_OPTIONS = ['', ...commandments.map((c) => c.title)];
const CATEGORY_OPTIONS = ['', ...capitalSins.map((s) => s.title)];

export default function SinDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshAppState } = useDatabase();

  const [sin, setSin] = useState<Sin | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [commandment, setCommandment] = useState('');
  const [category, setCategory] = useState('');
  const [nearOccasion, setNearOccasion] = useState('');
  const [isRepeated, setIsRepeated] = useState(false);
  const [needsConfession, setNeedsConfession] = useState(true);
  const [hasRepaired, setHasRepaired] = useState(false);
  const [concretePropose, setConcretePropose] = useState('');
  const [showCommandmentPicker, setShowCommandmentPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const data = await getSin(Number(id));
      if (data) {
        setSin(data);
        setTitle(data.title);
        setDescription(data.description ?? '');
        setCommandment(data.commandment ?? '');
        setCategory(data.category ?? '');
        setNearOccasion(data.occasion ?? data.nearOccasion ?? '');
        setIsRepeated(data.isRepeated);
        setNeedsConfession(data.needsConfession);
        setHasRepaired(data.hasRepaired);
        setConcretePropose(data.concretePropose ?? '');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe o título do pecado.');
      return;
    }
    if (!sin) return;

    setSaving(true);
    try {
      await updateSin(sin.id, {
        title: title.trim(),
        description: description.trim() || null,
        commandment: commandment || null,
        category: category || null,
        sourceTitle: commandment || category || sin.sourceTitle || 'Anotação manual',
        type: commandment ? 'commandment' : category ? 'capital_sin' : sin.type ?? 'manual',
        occasion: nearOccasion.trim() || null,
        nearOccasion: nearOccasion.trim() || null,
        isRepeated,
        needsConfession,
        hasRepaired,
        concretePropose: concretePropose.trim() || null,
      });
      await refreshAppState();
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!sin) return;
    Alert.alert(
      'Remover anotação',
      `Deseja remover "${sin.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await deleteSin(sin.id);
            await refreshAppState();
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!sin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.notFoundText}>Pecado não encontrado.</Text>
          <Button title="Voltar" variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
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
        <Text style={styles.headerTitle}>Editar Anotação</Text>
        <TouchableOpacity
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="trash-2" size={20} color={theme.colors.error} />
        </TouchableOpacity>
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
            value={title}
            onChangeText={setTitle}
            maxLength={120}
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor={theme.colors.textMuted}
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
              {commandment || '— Nenhum —'}
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
          <Text style={styles.label}>Categoria</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setShowCategoryPicker(true);
              setShowCommandmentPicker(false);
            }}
            activeOpacity={0.7}
          >
            <Text style={category ? styles.selectValue : styles.selectPlaceholder} numberOfLines={1}>
              {category || '— Nenhuma —'}
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
            value={nearOccasion}
            onChangeText={setNearOccasion}
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        <View style={styles.toggleField}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Pecado recorrente</Text>
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
          </View>
          <Switch
            value={needsConfession}
            onValueChange={setNeedsConfession}
            trackColor={{ false: theme.colors.cardBorder, true: theme.colors.accent + '88' }}
            thumbColor={needsConfession ? theme.colors.accent : theme.colors.textMuted}
          />
        </View>

        <View style={styles.toggleField}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Reparação feita</Text>
            <Text style={styles.toggleSub}>Se já reparou o dano causado</Text>
          </View>
          <Switch
            value={hasRepaired}
            onValueChange={setHasRepaired}
            trackColor={{ false: theme.colors.cardBorder, true: theme.colors.success + '88' }}
            thumbColor={hasRepaired ? theme.colors.success : theme.colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Propósito concreto</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={concretePropose}
            onChangeText={setConcretePropose}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        <Button
          title="Salvar alterações"
          variant="primary"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />

        <Button
          title="Cancelar"
          variant="ghost"
          onPress={() => router.back()}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
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
});
