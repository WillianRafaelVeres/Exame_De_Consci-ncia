import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  hasVaultPin as serviceHasVaultPin,
  verifyVaultPin,
  createVaultPin as serviceCreateVaultPin,
  changeVaultPin as serviceChangeVaultPin,
} from '../services/vaultAuth';
import { getSetting, setSetting } from '../db/queries/settings';

export type AutoLockMinutes = 0 | 1 | 5 | 15;

export interface VaultAuthContextValue {
  vaultUnlocked: boolean;
  hasVaultPin: boolean;
  autoLockMinutes: AutoLockMinutes;
  vaultError: string | null;
  vaultBiometricEnabled: boolean;
  biometricAvailable: boolean;
  clearVaultError: () => void;
  unlockVaultWithPin: (pin: string) => Promise<boolean>;
  unlockVaultWithBiometric: () => Promise<boolean>;
  lockVault: () => void;
  createVaultPin: (pin: string) => Promise<{ success: boolean; error?: string }>;
  changeVaultPin: (
    oldPin: string,
    newPin: string
  ) => Promise<{ success: boolean; error?: string }>;
  refreshHasVaultPin: () => Promise<void>;
  refreshBiometricState: () => Promise<void>;
  enableVaultBiometric: () => Promise<{ success: boolean; error?: string }>;
  disableVaultBiometric: () => Promise<void>;
  setAutoLockMinutes: (minutes: AutoLockMinutes) => Promise<void>;
}

const VAULT_BIOMETRIC_SETTING = 'vault_biometric_enabled';

const VaultAuthContext = createContext<VaultAuthContextValue | null>(null);

async function checkBiometricAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const [hasHardware, enrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    return hasHardware && enrolled;
  } catch (error) {
    console.error('Erro ao verificar biometria:', error);
    return false;
  }
}

export function VaultAuthProvider({ children }: { children: React.ReactNode }) {
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [vaultBiometricEnabled, setVaultBiometricEnabledState] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [autoLockMinutes, setAutoLockMinutesState] =
    useState<AutoLockMinutes>(5);
  const autoLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoLockTimer = useCallback(() => {
    if (autoLockTimer.current) {
      clearTimeout(autoLockTimer.current);
      autoLockTimer.current = null;
    }
  }, []);

  const clearVaultError = useCallback(() => {
    setVaultError(null);
  }, []);

  const refreshBiometricState = useCallback(async () => {
    const [available, stored] = await Promise.all([
      checkBiometricAvailable(),
      getSetting(VAULT_BIOMETRIC_SETTING),
    ]);
    setBiometricAvailable(available);
    setVaultBiometricEnabledState(stored === 'true' && available);
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [pinExists, storedAutoLock, available, storedBiometric] =
          await Promise.all([
            serviceHasVaultPin(),
            getSetting('vault_auto_lock_minutes'),
            checkBiometricAvailable(),
            getSetting(VAULT_BIOMETRIC_SETTING),
          ]);

        if (!mounted) return;
        setHasPin(pinExists);
        setVaultUnlocked(false);
        setVaultError(null);
        setBiometricAvailable(available);
        setVaultBiometricEnabledState(storedBiometric === 'true' && available);

        if (storedAutoLock !== null) {
          setAutoLockMinutesState(Number(storedAutoLock) as AutoLockMinutes);
        }
      } catch (error) {
        console.error('Erro ao carregar Cofre:', error);
        if (!mounted) return;
        setVaultUnlocked(false);
        setHasPin(true);
        setVaultError(
          'Nao foi possivel carregar a seguranca do Cofre. O acesso aos registros permanece bloqueado.'
        );
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        clearAutoLockTimer();
        setVaultUnlocked(false);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [clearAutoLockTimer]);

  const startAutoLockTimer = useCallback(
    (minutes: AutoLockMinutes) => {
      clearAutoLockTimer();
      if (minutes === 0) return;
      autoLockTimer.current = setTimeout(() => {
        setVaultUnlocked(false);
      }, minutes * 60 * 1000);
    },
    [clearAutoLockTimer]
  );

  const lockVault = useCallback(() => {
    clearAutoLockTimer();
    setVaultUnlocked(false);
  }, [clearAutoLockTimer]);

  const unlockVaultWithPin = useCallback(
    async (pin: string): Promise<boolean> => {
      try {
        const valid = await verifyVaultPin(pin);
        if (valid) {
          setVaultError(null);
          setVaultUnlocked(true);
          startAutoLockTimer(autoLockMinutes);
        }
        return valid;
      } catch (error) {
        console.error('Erro ao desbloquear Cofre:', error);
        setVaultUnlocked(false);
        setVaultError('Nao foi possivel desbloquear o Cofre. Tente novamente.');
        return false;
      }
    },
    [autoLockMinutes, startAutoLockTimer]
  );

  const unlockVaultWithBiometric = useCallback(async (): Promise<boolean> => {
    if (!vaultBiometricEnabled || !biometricAvailable) return false;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Abrir Cofre',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: true,
      });

      if (result.success) {
        setVaultError(null);
        setVaultUnlocked(true);
        startAutoLockTimer(autoLockMinutes);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao desbloquear com biometria:', error);
      setVaultError('Nao foi possivel usar a digital. Digite o PIN do Cofre.');
      return false;
    }
  }, [
    autoLockMinutes,
    biometricAvailable,
    startAutoLockTimer,
    vaultBiometricEnabled,
  ]);

  const createVaultPin = useCallback(async (pin: string) => {
    const result = await serviceCreateVaultPin(pin);
    if (result.success) {
      setHasPin(true);
      setVaultError(null);
    } else if (result.error) {
      setVaultError(result.error);
    }
    return result;
  }, []);

  const changeVaultPin = useCallback(
    async (oldPin: string, newPin: string) => {
      const result = await serviceChangeVaultPin(oldPin, newPin);
      if (!result.success && result.error) {
        setVaultError(result.error);
      } else {
        setVaultError(null);
      }
      return result;
    },
    []
  );

  const refreshHasVaultPin = useCallback(async () => {
    try {
      const pinExists = await serviceHasVaultPin();
      setHasPin(pinExists);
      setVaultUnlocked(false);
      setVaultError(null);
    } catch (error) {
      console.error('Erro ao atualizar estado do Cofre:', error);
      setHasPin(true);
      setVaultUnlocked(false);
      setVaultError(
        'Nao foi possivel atualizar a seguranca do Cofre. O acesso aos registros permanece bloqueado.'
      );
    }
  }, []);

  const enableVaultBiometric = useCallback(async () => {
    if (!hasPin) {
      return {
        success: false,
        error: 'Crie o PIN do Cofre antes de ativar a digital.',
      };
    }

    const available = await checkBiometricAvailable();
    setBiometricAvailable(available);
    if (!available) {
      const error =
        'A digital nao esta disponivel ou nao esta cadastrada neste aparelho.';
      setVaultError(error);
      return { success: false, error };
    }

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Ativar digital para o Cofre',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: true,
    });

    if (!auth.success) {
      const error = 'A digital nao foi confirmada.';
      setVaultError(error);
      return { success: false, error };
    }

    await setSetting(VAULT_BIOMETRIC_SETTING, 'true');
    setVaultBiometricEnabledState(true);
    setVaultError(null);
    return { success: true };
  }, [hasPin]);

  const disableVaultBiometric = useCallback(async () => {
    await setSetting(VAULT_BIOMETRIC_SETTING, 'false');
    setVaultBiometricEnabledState(false);
    setVaultError(null);
  }, []);

  const setAutoLockMinutes = useCallback(
    async (minutes: AutoLockMinutes) => {
      try {
        setAutoLockMinutesState(minutes);
        await setSetting('vault_auto_lock_minutes', String(minutes));
        if (vaultUnlocked) startAutoLockTimer(minutes);
      } catch (error) {
        console.error('Erro ao salvar bloqueio automatico do Cofre:', error);
        setVaultError(
          'Nao foi possivel salvar essa configuracao. Tente novamente.'
        );
      }
    },
    [vaultUnlocked, startAutoLockTimer]
  );

  return (
    <VaultAuthContext.Provider
      value={{
        vaultUnlocked,
        hasVaultPin: hasPin,
        autoLockMinutes,
        vaultError,
        vaultBiometricEnabled,
        biometricAvailable,
        clearVaultError,
        unlockVaultWithPin,
        unlockVaultWithBiometric,
        lockVault,
        createVaultPin,
        changeVaultPin,
        refreshHasVaultPin,
        refreshBiometricState,
        enableVaultBiometric,
        disableVaultBiometric,
        setAutoLockMinutes,
      }}
    >
      {children}
    </VaultAuthContext.Provider>
  );
}

export function useVaultAuth(): VaultAuthContextValue {
  const ctx = useContext(VaultAuthContext);
  if (!ctx) throw new Error('useVaultAuth must be used within VaultAuthProvider');
  return ctx;
}
