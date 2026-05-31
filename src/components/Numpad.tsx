import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface NumpadProps {
  onPress: (digit: string) => void;
  onDelete: () => void;
  disabled?: boolean;
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['blank', '0', 'delete'],
];

export function Numpad({
  onPress,
  onDelete,
  disabled = false,
}: NumpadProps) {
  const handleKey = (key: string) => {
    if (disabled) return;
    if (key === 'delete') {
      onDelete();
    } else {
      onPress(key);
    }
  };

  return (
    <View style={styles.container}>
      {ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            if (key === 'blank') {
              return (
                <View
                  key={key}
                  style={[styles.key, styles.keyInvisible]}
                />
              );
            }

            if (key === 'delete') {
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.key, disabled && styles.keyDisabled]}
                  onPress={() => handleKey(key)}
                  disabled={disabled}
                  activeOpacity={0.6}
                >
                  <Feather name="delete" size={22} color={disabled ? theme.colors.textMuted : theme.colors.textSecondary} />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={key}
                style={[styles.key, disabled && styles.keyDisabled]}
                onPress={() => handleKey(key)}
                disabled={disabled}
                activeOpacity={0.6}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  key: {
    width: 80,
    height: 64,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyInvisible: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  keyDisabled: {
    opacity: 0.35,
  },
  keyText: {
    fontSize: theme.fontSize.xl,
    fontWeight: '300',
    color: theme.colors.textPrimary,
    letterSpacing: 1,
  },
});
