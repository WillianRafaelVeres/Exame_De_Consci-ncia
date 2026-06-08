import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { Sin, SinSourceType } from '../../src/types';
import { deleteSin, getSin, updateSin } from '../../src/db/queries/sins';
import { useDatabase } from '../../src/hooks/useDatabase';

const TYPE_LABELS: Record<SinSourceType, string> = {
  commandment: 'Mandamento',
  capital_sin: 'Pecado capital',
  state_of_life: 'Estado de vida',
  manual: 'Manual',
};

export default function SinDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshAppState } = useDatabase();

  const [sin, setSin] = useState<Sin | null>(null);
  const [text, setText] = useState('');
  const [needsConfession, setNeedsConfession] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const data = await getSin(id);
      if (data) {
        setSin(data);
        setText(data.text);
        setNeedsConfession(data.needsConfession);
      }
      setLoading(false);
    };

    load();
  }, [id]);

  const handleSave = async () => {
    if (!sin) return;
    const trimmed = text.trim();
    if (!trimmed) {
      Alert.alert('Anotacao vazia', 'Escreva a anotacao antes de salvar.');
      return;
    }

    setSaving(true);
    try {
      await updateSin(sin.id, { text: trimmed, needsConfession });
      await refreshAppState();
      router.back();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!sin) return;
    Alert.alert('Remover anotacao', 'Deseja remover este registro?', [
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
    ]);
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
          <Text style={styles.notFoundText}>Registro nao encontrado.</Text>
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
        <Text style={styles.headerTitle}>Editar registro</Text>
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
        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Origem</Text>
          <Text style={styles.metaValue}>{TYPE_LABELS[sin.sourceType]}</Text>
          <Text style={styles.metaSub}>{sin.sourceTitle}</Text>
          <View style={styles.countRow}>
            <Feather name="repeat" size={14} color={theme.colors.accent} />
            <Text style={styles.countText}>
              Registrado {sin.count} {sin.count === 1 ? 'vez' : 'vezes'}
            </Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Anotacao</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={text}
            onChangeText={setText}
            multiline
            textAlignVertical="top"
            placeholder="Escreva aqui sua anotacao..."
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setNeedsConfession((value) => !value)}
          activeOpacity={0.75}
        >
          <View style={[styles.checkbox, needsConfession && styles.checkboxActive]}>
            {needsConfession && (
              <Feather name="check" size={14} color={theme.colors.background} />
            )}
          </View>
          <View style={styles.checkTextBlock}>
            <Text style={styles.checkLabel}>Levar para confissao</Text>
            <Text style={styles.checkSub}>
              Quando ativo, aparece em Preparar Confissao.
            </Text>
          </View>
        </TouchableOpacity>

        <Button
          title="Salvar alteracoes"
          variant="primary"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />

        <Button title="Cancelar" variant="ghost" onPress={() => router.back()} />
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
    padding: theme.spacing.lg,
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
  metaCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  metaLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  metaValue: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
  metaSub: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginTop: 3,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  countText: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
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
    minHeight: 140,
    lineHeight: 22,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  checkboxActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  checkTextBlock: {
    flex: 1,
  },
  checkLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  checkSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginTop: 2,
    lineHeight: 16,
  },
  saveButton: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
});
