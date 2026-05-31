import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../constants/theme';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Erro global no app:', error, info);
  }

  private restart = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.reload();
      return;
    }

    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo deu errado ao carregar o app.</Text>
          <TouchableOpacity style={styles.button} onPress={this.restart}>
            <Text style={styles.buttonText}>Reiniciar app</Text>
          </TouchableOpacity>
          {__DEV__ && (
            <Text style={styles.details}>{this.state.error.message}</Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: '700',
  },
  details: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
});
