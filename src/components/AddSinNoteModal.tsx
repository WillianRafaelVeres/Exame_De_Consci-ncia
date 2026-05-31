import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Button } from './Button';
import { SinSourceType } from '../types';

export interface AddSinNotePayload {
  type: SinSourceType;
  sourceId: string;
  sourceTitle: string;
  title: string;
  description: string | null;
  occasion: string | null;
  needsConfession: boolean;
}

interface AddSinNoteModalProps {
  visible: boolean;
  type: SinSourceType;
  sourceId: string;
  sourceTitle: string;
  onSave: (payload: AddSinNotePayload) => Promise<void> | void;
  onClose: () => void;
}

export function AddSinNoteModal({
  visible,
  type,
  sourceId,
  sourceTitle,
  onSave,
  onClose,
}: AddSinNoteModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [occasion, setOccasion] = useState('');
  const [needsConfession, setNeedsConfession] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle('');
      setDescription('');
      setOccasion('');
      setNeedsConfession(true);
      setSaving(false);
    }
  }, [visible]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Título obrigatório', 'Escreva uma anotação breve.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        type,
        sourceId,
        sourceTitle,
        title: title.trim(),
        description: description.trim() || null,
        occasion: occasion.trim() || null,
        needsConfession,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handleBar} />
          <View style={styles.header}>
            <View style={styles.titleArea}>
              <Text style={styles.modalTitle}>Adicionar anotação</Text>
              <Text style={styles.modalSub} numberOfLines={2}>
                {sourceTitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={22} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.field}>
              <Text style={styles.label}>Título breve</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Escreva exatamente o que deseja lembrar..."
                placeholderTextColor={theme.colors.textMuted}
                maxLength={140}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={description}
                onChangeText={setDescription}
                placeholder="Detalhe opcional, com sobriedade..."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Ocasião próxima</Text>
              <TextInput
                style={styles.input}
                value={occasion}
                onChangeText={setOccasion}
                placeholder="Situação, hábito ou contexto que favoreceu a queda..."
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.switchLabel}>Levar à confissão</Text>
                <Text style={styles.switchSub}>
                  Inclui esta anotação em Preparar Confissão.
                </Text>
              </View>
              <Switch
                value={needsConfession}
                onValueChange={setNeedsConfession}
                trackColor={{
                  false: theme.colors.cardBorder,
                  true: theme.colors.accent + '88',
                }}
                thumbColor={needsConfession ? theme.colors.accent : theme.colors.textMuted}
              />
            </View>

            <Button
              title="Salvar anotação"
              variant="primary"
              onPress={handleSave}
              loading={saving}
              style={styles.saveButton}
            />
            <Button title="Cancelar" variant="ghost" onPress={onClose} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.66)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderTopWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.textMuted,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    opacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  titleArea: {
    flex: 1,
  },
  modalTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  modalSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginTop: 2,
    lineHeight: 18,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  scroll: {
    maxHeight: '100%',
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  field: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
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
    minHeight: 96,
    lineHeight: 22,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  switchText: {
    flex: 1,
  },
  switchLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  switchSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginTop: 2,
  },
  saveButton: {
    marginBottom: theme.spacing.sm,
  },
});
