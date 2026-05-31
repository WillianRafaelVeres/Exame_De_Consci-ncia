import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { PinInput } from './PinInput';
import { Numpad } from './Numpad';

const PIN_LENGTH = 6;
const MAX_ATTEMPTS = 5;

interface VaultPinModalProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onSuccess: () => void;
  onCancel: () => void;
  verifyPin: (pin: string) => Promise<boolean>;
}

/**
 * Modal overlay that requires vault PIN re-entry.
 * Used for sensitive actions (e.g., "Confessei-me hoje") that require
 * re-confirmation even when the vault session is already open.
 * Confirms sensitive vault actions with the vault PIN.
 */
export function VaultPinModal({
  visible,
  title = 'Confirmação de segurança',
  subtitle = 'Digite o PIN do Cofre para confirmar esta ação.',
  onSuccess,
  onCancel,
  verifyPin,
}: VaultPinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  const blocked = attempts >= MAX_ATTEMPTS;

  useEffect(() => {
    if (visible) {
      setPin('');
      setError('');
      setAttempts(0);
      setLoading(false);
    }
  }, [visible]);

  const handleDigit = (digit: string) => {
    if (blocked || loading) return;
    setError('');
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      setTimeout(() => attemptVerify(next), 150);
    }
  };

  const handleDelete = () => {
    if (blocked || loading) return;
    setError('');
    setPin((p) => p.slice(0, -1));
  };

  const attemptVerify = async (value: string) => {
    setLoading(true);
    try {
      const success = await verifyPin(value);
      if (success) {
        onSuccess();
      } else {
        const next = attempts + 1;
        setAttempts(next);
        setPin('');
        setError(
          next >= MAX_ATTEMPTS
            ? 'Muitas tentativas incorretas. Ação cancelada.'
            : `PIN incorreto. Tentativa ${next} de ${MAX_ATTEMPTS}.`
        );
        if (next >= MAX_ATTEMPTS) {
          setTimeout(() => onCancel(), 1500);
        }
      }
    } catch (error) {
      console.error('Erro ao confirmar PIN do Cofre:', error);
      setPin('');
      setError('Nao foi possivel verificar o PIN. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handleBar} />

          <View style={styles.iconRow}>
            <View style={styles.iconCircle}>
              <Feather name="shield" size={24} color={theme.colors.accent} />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.pinRow}>
            <PinInput length={PIN_LENGTH} filled={pin.length} />
          </View>

          {error !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {loading && (
            <Text style={styles.loadingText}>Verificando...</Text>
          )}

          <View style={styles.pinOnlyRow}>
            <Feather
              name="eye-off"
              size={12}
              color={theme.colors.textMuted}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.pinOnlyText}>
              Apenas o PIN do Cofre confirma esta ação.
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.numpadScroll}
            scrollEnabled={false}
          >
            <Numpad
              onPress={handleDigit}
              onDelete={handleDelete}
              disabled={blocked || loading}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderTopWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.textMuted,
    borderRadius: 2,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    opacity: 0.4,
  },
  iconRow: {
    marginBottom: theme.spacing.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.md,
    maxWidth: 280,
  },
  pinRow: {
    marginBottom: theme.spacing.md,
  },
  errorBox: {
    backgroundColor: theme.colors.error + '1A',
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.error + '55',
    alignSelf: 'stretch',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
  },
  loadingText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  pinOnlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  pinOnlyText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  numpadScroll: {
    width: '100%',
  },
  cancelButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  cancelText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
