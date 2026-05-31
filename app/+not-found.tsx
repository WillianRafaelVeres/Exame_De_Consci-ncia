import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { theme } from '../src/constants/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página não encontrada</Text>
      <Text style={styles.subtitle}>Este caminho não existe no aplicativo.</Text>
      <Link href="/(tabs)" style={styles.link}>
        <Text style={styles.linkText}>Voltar ao início</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  link: {
    marginTop: theme.spacing.md,
  },
  linkText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent,
    textDecorationLine: 'underline',
  },
});
