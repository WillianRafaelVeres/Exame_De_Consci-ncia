import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { PinInput } from '../../src/components/PinInput';
import { Numpad } from '../../src/components/Numpad';
import { Button } from '../../src/components/Button';
import { VaultPinModal } from '../../src/components/VaultPinModal';
import { useVaultAuth, AutoLockMinutes } from '../../src/context/VaultAuthContext';
import { verifyVaultPin } from '../../src/services/vaultAuth';

const AUTO_LOCK_OPTIONS: { value: AutoLockMinutes; label: string }[] = [
  { value: 0, label: 'Ao ir para segundo plano' },
  { value: 1, label: 'Após 1 minuto de inatividade' },
  { value: 5, label: 'Após 5 minutos de inatividade' },
  { value: 15, label: 'Após 15 minutos de inatividade' },
];

const PIN_LENGTH = 6;

type VaultPinFlowMode = 'create' | 'change_old' | 'change_new' | 'change_confirm';

export default function SettingsScreen() {
  const {
    hasVaultPin,
    vaultUnlocked,
    vaultError,
    lockVault,
    autoLockMinutes: vaultAutoLockMinutes,
    setAutoLockMinutes: setVaultAutoLockMinutes,
    createVaultPin,
    changeVaultPin,
    vaultBiometricEnabled,
    biometricAvailable,
    enableVaultBiometric,
    disableVaultBiometric,
  } = useVaultAuth();

  const [showVaultPinFlow, setShowVaultPinFlow] = useState(false);
  const [showBiometricPinModal, setShowBiometricPinModal] = useState(false);
  const [vaultFlowMode, setVaultFlowMode] =
    useState<VaultPinFlowMode>('create');
  const [vaultPin, setVaultPin] = useState('');
  const [vaultOldPin, setVaultOldPin] = useState('');
  const [vaultConfirmPin, setVaultConfirmPin] = useState('');
  const [vaultPinError, setVaultPinError] = useState('');
  const [vaultPinLoading, setVaultPinLoading] = useState(false);

  const currentFlowPin =
    vaultFlowMode === 'change_old'
      ? vaultOldPin
      : vaultFlowMode === 'change_confirm'
      ? vaultConfirmPin
      : vaultPin;

  const resetVaultPinState = () => {
    setVaultPin('');
    setVaultOldPin('');
    setVaultConfirmPin('');
    setVaultPinError('');
    setVaultPinLoading(false);
  };

  const openCreateVaultPin = () => {
    setVaultFlowMode('create');
    resetVaultPinState();
    setShowVaultPinFlow(true);
  };

  const openChangeVaultPin = () => {
    setVaultFlowMode('change_old');
    resetVaultPinState();
    setShowVaultPinFlow(true);
  };

  const handleVaultDigit = (digit: string) => {
    if (vaultPinLoading) return;
    setVaultPinError('');

    const append = (current: string, setter: (v: string) => void) => {
      if (current.length >= PIN_LENGTH) return;
      const next = current + digit;
      setter(next);
      if (next.length === PIN_LENGTH) {
        setTimeout(() => handleVaultPinComplete(next), 150);
      }
    };

    if (vaultFlowMode === 'change_old') {
      append(vaultOldPin, setVaultOldPin);
    } else if (vaultFlowMode === 'change_confirm') {
      append(vaultConfirmPin, setVaultConfirmPin);
    } else {
      append(vaultPin, setVaultPin);
    }
  };

  const handleVaultDelete = () => {
    if (vaultPinLoading) return;
    setVaultPinError('');
    if (vaultFlowMode === 'change_old') {
      setVaultOldPin((p) => p.slice(0, -1));
    } else if (vaultFlowMode === 'change_confirm') {
      setVaultConfirmPin((p) => p.slice(0, -1));
    } else {
      setVaultPin((p) => p.slice(0, -1));
    }
  };

  const handleVaultPinComplete = async (completedPin: string) => {
    setVaultPinLoading(true);
    try {
      if (vaultFlowMode === 'create') {
        const result = await createVaultPin(completedPin);
        if (result.success) {
          setShowVaultPinFlow(false);
          Alert.alert(
            'PIN do Cofre criado',
            'Registros e preparação para confissão agora ficam protegidos pelo PIN do Cofre.'
          );
        } else {
          setVaultPinError(result.error ?? 'Erro ao criar PIN.');
          setVaultPin('');
        }
      } else if (vaultFlowMode === 'change_old') {
        setVaultOldPin(completedPin);
        setVaultFlowMode('change_new');
        setVaultPin('');
      } else if (vaultFlowMode === 'change_new') {
        setVaultPin(completedPin);
        setVaultFlowMode('change_confirm');
        setVaultConfirmPin('');
      } else if (vaultFlowMode === 'change_confirm') {
        if (completedPin !== vaultPin) {
          setVaultPinError('Os PINs não coincidem. Tente novamente.');
          setVaultFlowMode('change_new');
          setVaultPin('');
          setVaultConfirmPin('');
          return;
        }
        const result = await changeVaultPin(vaultOldPin, vaultPin);
        if (result.success) {
          setShowVaultPinFlow(false);
          Alert.alert('PIN do Cofre alterado', 'O novo PIN foi salvo.');
        } else {
          setVaultPinError(result.error ?? 'Erro ao alterar PIN.');
          setVaultFlowMode('change_old');
          setVaultOldPin('');
          setVaultPin('');
          setVaultConfirmPin('');
        }
      }
    } finally {
      setVaultPinLoading(false);
    }
  };

  const handleBiometricChange = async (enabled: boolean) => {
    if (!enabled) {
      await disableVaultBiometric();
      Alert.alert('Digital desativada', 'Os registros abrirão apenas com o PIN do Cofre.');
      return;
    }

    if (!hasVaultPin) {
      Alert.alert('Crie o PIN do Cofre', 'O PIN do Cofre é necessário antes de ativar a digital.');
      return;
    }

    setShowBiometricPinModal(true);
  };

  const handleBiometricPinConfirmed = async () => {
    setShowBiometricPinModal(false);
    const result = await enableVaultBiometric();
    if (result.success) {
      Alert.alert('Digital ativada', 'Você poderá abrir Registros com a digital neste aparelho.');
    } else {
      Alert.alert('Não foi possível ativar', result.error ?? 'Tente novamente.');
    }
  };

  const handleLockVault = () => {
    lockVault();
    Alert.alert('Registros bloqueados', 'O Cofre foi bloqueado.');
  };

  const flowTitle = {
    create: 'Criar PIN do Cofre',
    change_old: 'PIN atual do Cofre',
    change_new: 'Novo PIN do Cofre',
    change_confirm: 'Confirmar novo PIN',
  }[vaultFlowMode];

  const flowSubtitle = {
    create: 'Escolha 6 dígitos para proteger Registros e Confissão.',
    change_old: 'Digite seu PIN do Cofre atual.',
    change_new: 'Escolha o novo PIN do Cofre.',
    change_confirm: 'Confirme o novo PIN do Cofre.',
  }[vaultFlowMode];

  const showBiometricControls = Platform.OS !== 'web' && hasVaultPin;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <VaultPinModal
        visible={showBiometricPinModal}
        title="Confirmar PIN do Cofre"
        subtitle="Digite o PIN do Cofre antes de ativar a digital para Registros."
        verifyPin={verifyVaultPin}
        onSuccess={handleBiometricPinConfirmed}
        onCancel={() => setShowBiometricPinModal(false)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {vaultError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{vaultError}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Privacidade dos Registros</Text>

          <View style={styles.infoCard}>
            <Feather name="shield" size={16} color={theme.colors.accent} />
            <Text style={styles.infoCardText}>
              O app abre direto. Apenas Registros e Preparar Confissão ficam dentro do Cofre.
            </Text>
          </View>

          {!hasVaultPin ? (
            <SettingsRow
              icon="lock"
              label="Criar PIN do Cofre"
              onPress={openCreateVaultPin}
              accent
            />
          ) : (
            <SettingsRow
              icon="refresh-cw"
              label="Alterar PIN do Cofre"
              onPress={openChangeVaultPin}
            />
          )}

          {showBiometricControls && (
            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.switchLabel}>Usar digital para abrir Registros</Text>
                <Text style={styles.switchSub}>
                  {biometricAvailable
                    ? 'Disponível somente neste aparelho.'
                    : 'Biometria indisponível ou não cadastrada no aparelho.'}
                </Text>
              </View>
              <Switch
                value={vaultBiometricEnabled}
                onValueChange={handleBiometricChange}
                disabled={!biometricAvailable}
                trackColor={{
                  false: theme.colors.cardBorder,
                  true: theme.colors.accent + '88',
                }}
                thumbColor={
                  vaultBiometricEnabled ? theme.colors.accent : theme.colors.textMuted
                }
              />
            </View>
          )}

          {hasVaultPin && (
            <SettingsRow
              icon="lock"
              label={vaultUnlocked ? 'Bloquear registros agora' : 'Registros já estão bloqueados'}
              onPress={handleLockVault}
              danger={vaultUnlocked}
            />
          )}

          {hasVaultPin && (
            <>
              <Text style={styles.subSectionLabel}>
                Bloquear o Cofre automaticamente
              </Text>
              {AUTO_LOCK_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={styles.radioRow}
                  onPress={() => setVaultAutoLockMinutes(opt.value)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      vaultAutoLockMinutes === opt.value && styles.radioCircleActive,
                    ]}
                  >
                    {vaultAutoLockMinutes === opt.value && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.radioLabel,
                      vaultAutoLockMinutes === opt.value && styles.radioLabelActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sobre</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>Custódia</Text>
            <Text style={styles.aboutSub}>Versão 1.0.0</Text>
            <Text style={styles.aboutText}>
              100% offline. Sem servidor, sincronização, analytics, SQLite ou SecureStore neste MVP.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showVaultPinFlow}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowVaultPinFlow(false)}
            >
              <Feather name="x" size={22} color={theme.colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.modalIconRow}>
              <View style={styles.iconCircle}>
                <Feather name="lock" size={26} color={theme.colors.accent} />
              </View>
            </View>

            <Text style={styles.modalTitle}>{flowTitle}</Text>
            <Text style={styles.modalSubtitle}>{flowSubtitle}</Text>

            <View style={styles.modalPinRow}>
              <PinInput length={PIN_LENGTH} filled={currentFlowPin.length} />
            </View>

            {vaultPinError !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{vaultPinError}</Text>
              </View>
            )}

            <Numpad
              onPress={handleVaultDigit}
              onDelete={handleVaultDelete}
              disabled={vaultPinLoading}
            />

            <Button
              title="Cancelar"
              variant="ghost"
              onPress={() => setShowVaultPinFlow(false)}
              style={styles.modalCancelBtn}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon,
  label,
  onPress,
  accent,
  danger,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
  accent?: boolean;
  danger?: boolean;
}) {
  const color = danger
    ? theme.colors.error
    : accent
    ? theme.colors.accent
    : theme.colors.textPrimary;
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Feather name={icon} size={18} color={color} />
      <Text style={[styles.rowLabel, { color }]}>{label}</Text>
      <Feather name="chevron-right" size={16} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  section: { marginBottom: theme.spacing.xl },
  sectionLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.accent,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  infoCardText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  rowLabel: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  switchText: {
    flex: 1,
  },
  switchLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '500',
  },
  switchSub: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginTop: 3,
    lineHeight: 16,
  },
  subSectionLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: theme.colors.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
  },
  radioLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  radioLabelActive: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: '300',
    letterSpacing: 3,
  },
  aboutSub: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
    marginBottom: theme.spacing.sm,
  },
  aboutText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderTopWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.textMuted,
    borderRadius: 2,
    marginTop: theme.spacing.sm,
    opacity: 0.4,
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    padding: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  modalIconRow: { marginBottom: theme.spacing.md },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.accent + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  modalSubtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.md,
    maxWidth: 280,
  },
  modalPinRow: { marginBottom: theme.spacing.md },
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
  modalCancelBtn: { marginTop: theme.spacing.md },
});
