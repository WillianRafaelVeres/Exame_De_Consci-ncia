import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.background : theme.colors.accent}
          size="small"
        />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`], isDisabled && styles.disabledText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primary: {
    backgroundColor: theme.colors.accent,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: theme.colors.error,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  primaryText: {
    color: theme.colors.background,
  },
  secondaryText: {
    color: theme.colors.accent,
  },
  ghostText: {
    color: theme.colors.textSecondary,
  },
  dangerText: {
    color: theme.colors.white,
  },
  disabledText: {
    opacity: 0.7,
  },
});
