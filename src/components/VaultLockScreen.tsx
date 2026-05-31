import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { PinInput } from './PinInput';
import { Numpad } from './Numpad';
import { Button } from './Button';
import { useVaultAuth } from '../context/VaultAuthContext';

const PIN_LENGTH = 6;
const MAX_ATTEMPTS = 5;

type SetupStep = 'enter' | 'confirm';

interface VaultLockScreenProps {
  onBack?: () => void;
}

export function VaultLockScreen({ onBack }: VaultLockScreenProps) {
  const {
    hasVaultPin,
    vaultError,
    clearVaultError,
    unlockVaultWithPin,
    unlockVaultWithBiometric,
    createVaultPin,
    vaultBiometricEnabled,
    biometricAvailable,
  } = useVaultAuth();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [setupStep, setSetupStep] = useState<SetupStep>('enter');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  const isCreating = !hasVaultPin;
  const blocked = attempts >= MAX_ATTEMPTS;
  const canUseBiometric =
    !isCreating && vaultBiometricEnabled && biometricAvailable;

  const currentFilled = isCreating
    ? setupStep === 'enter'
      ? pin.length
      : confirmPin.length
    : pin.length;

  const handleDigit = (digit: string) => {
    if (blocked || loading) return;
    setError('');
    clearVaultError();
    isCreating ? handleSetupDigit(digit) : handleUnlockDigit(digit);
  };

  const handleDelete = () => {
    if (blocked || loading) return;
    setError('');
    clearVaultError();
    if (isCreating) {
      setupStep === 'enter'
        ? setPin((p) => p.slice(0, -1))
        : setConfirmPin((p) => p.slice(0, -1));
    } else {
      setPin((p) => p.slice(0, -1));
    }
  };

  const handleUnlockDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      setTimeout(() => attemptUnlock(next), 150);
    }
  };

  const handleSetupDigit = (digit: string) => {
    const current = setupStep === 'enter' ? pin : confirmPin;
    if (current.length >= PIN_LENGTH) return;
    const next = current + digit;
    if (setupStep === 'enter') {
      setPin(next);
      if (next.length === PIN_LENGTH) {
        setTimeout(() => setSetupStep('confirm'), 150);
      }
    } else {
      setConfirmPin(next);
      if (next.length === PIN_LENGTH) {
        setTimeout(() => finalizeSetup(next), 150);
      }
    }
  };

  const attemptUnlock = async (value: string) => {
    setLoading(true);
    try {
      const success = await unlockVaultWithPin(value);
      if (!success) {
        const next = attempts + 1;
        setAttempts(next);
        setPin('');
        setError(
          next >= MAX_ATTEMPTS
            ? 'Muitas tentativas incorretas. Feche e reabra o aplicativo para tentar novamente.'
            : `PIN do Cofre incorreto. Tentativa ${next} de ${MAX_ATTEMPTS}.`
        );
      }
    } catch (err) {
      console.error('Erro ao verificar PIN do Cofre:', err);
      setPin('');
      setError('Não foi possível verificar o PIN do Cofre. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const attemptBiometric = async () => {
    setLoading(true);
    setError('');
    clearVaultError();
    try {
      const success = await unlockVaultWithBiometric();
      if (!success) {
        setError('Biometria não reconhecida. Use o PIN do Cofre.');
      }
    } finally {
      setLoading(false);
    }
  };

  const finalizeSetup = async (confirmValue: string) => {
    if (pin !== confirmValue) {
      setError('Os PINs não coincidem. Tente novamente.');
      setSetupStep('enter');
      setPin('');
      setConfirmPin('');
      return;
    }
    setLoading(true);
    try {
      const result = await createVaultPin(pin);
      if (result.success) {
        await unlockVaultWithPin(pin);
      } else {
        setError(result.error ?? 'Erro ao criar o PIN do Cofre.');
        setSetupStep('enter');
        setPin('');
        setConfirmPin('');
      }
    } catch (err) {
      console.error('Erro ao finalizar PIN do Cofre:', err);
      setError('Não foi possível criar o PIN do Cofre. Tente novamente.');
      setSetupStep('enter');
      setPin('');
      setConfirmPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleBackSetup = () => {
    setSetupStep('enter');
    setPin('');
    setConfirmPin('');
    setError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Feather name="lock" size={32} color={theme.colors.accent} />
          </View>
        </View>

        <Text style={styles.title}>Área reservada</Text>

        <Text style={styles.subtitle}>
          {isCreating
            ? setupStep === 'enter'
              ? 'Esta parte guarda suas anotações mais pessoais.\nCrie um PIN do Cofre de 6 dígitos.'
              : 'Confirme o PIN do Cofre para garantir que anotou corretamente.'
            : 'Para ver os registros, digite o PIN do Cofre.'}
        </Text>

        {isCreating && (
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>
              {setupStep === 'enter'
                ? 'Criar PIN do Cofre'
                : 'Confirmar PIN do Cofre'}
            </Text>
          </View>
        )}

        <View style={styles.pinRow}>
          <PinInput length={PIN_LENGTH} filled={currentFilled} />
        </View>

        {(vaultError || error !== '') && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{vaultError ?? error}</Text>
          </View>
        )}

        {loading && <Text style={styles.loadingText}>Verificando...</Text>}

        {canUseBiometric && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={attemptBiometric}
            activeOpacity={0.75}
            disabled={loading}
          >
            <Feather name="unlock" size={18} color={theme.colors.accent} />
            <Text style={styles.biometricButtonText}>Abrir com digital</Text>
          </TouchableOpacity>
        )}

        <View style={styles.pinOnlyRow}>
          <Feather
            name="eye-off"
            size={13}
            color={theme.colors.textMuted}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.pinOnlyText}>
            O Cofre protege apenas Registros e Confissão.
          </Text>
        </View>

        <View style={styles.numpadWrapper}>
          <Numpad
            onPress={handleDigit}
            onDelete={handleDelete}
            disabled={blocked || loading}
          />
        </View>

        <View style={styles.buttonsRow}>
          {isCreating && setupStep === 'confirm' && (
            <Button
              title="Voltar ao início"
              variant="ghost"
              onPress={handleBackSetup}
              style={styles.linkButton}
            />
          )}
          {onBack && (
            <Button
              title="Voltar"
              variant="ghost"
              onPress={onBack}
              style={styles.linkButton}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  iconRow: {
    marginBottom: theme.spacing.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: theme.spacing.lg,
    maxWidth: 300,
  },
  stepBadge: {
    backgroundColor: theme.colors.accent + '1A',
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.accent + '55',
    marginBottom: theme.spacing.md,
  },
  stepBadgeText: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
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
    marginHorizontal: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
  loadingText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.accent + '66',
    backgroundColor: theme.colors.accent + '14',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  biometricButtonText: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
  },
  pinOnlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  pinOnlyText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  numpadWrapper: {
    width: '100%',
  },
  buttonsRow: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  linkButton: {
    marginVertical: theme.spacing.xs,
  },
});
