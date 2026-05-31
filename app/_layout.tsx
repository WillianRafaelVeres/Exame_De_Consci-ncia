import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useDatabase } from '../src/hooks/useDatabase';
import { theme } from '../src/constants/theme';
import { VaultAuthProvider } from '../src/context/VaultAuthContext';
import { AppErrorBoundary } from '../src/components/AppErrorBoundary';

function InitializerInner({ children }: { children: React.ReactNode }) {
  const { initializeDatabase } = useDatabase();
  const [initializing, setInitializing] = useState(true);
  const [startupError, setStartupError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      setInitializing(true);
      setStartupError(null);
      try {
        await initializeDatabase();
      } catch (error) {
        console.error('Erro ao inicializar app:', error);
        if (mounted) {
          setStartupError(
            'Não foi possível carregar os dados locais do app. Tente novamente.'
          );
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [initializeDatabase, retryKey]);

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
      </View>
    );
  }

  if (startupError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Algo deu errado ao carregar o app.</Text>
        <Text style={styles.errorMessage}>{startupError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setRetryKey((value) => value + 1)}
          activeOpacity={0.75}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <View style={styles.appActivityContainer}>{children}</View>;
}

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={theme.colors.background} />
        <VaultAuthProvider>
          <InitializerInner>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="exam" />
              <Stack.Screen name="confession" />
              <Stack.Screen
                name="sins/new"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen name="sins/[id]" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </InitializerInner>
        </VaultAuthProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appActivityContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  errorTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
});
