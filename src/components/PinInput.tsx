import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';

interface PinInputProps {
  length?: number;
  filled: number;
  onDotPress?: (index: number) => void;
}

export function PinInput({ length = 6, filled, onDotPress }: PinInputProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onDotPress?.(index)}
          activeOpacity={onDotPress ? 0.7 : 1}
          style={[
            styles.dot,
            index < filled ? styles.dotFilled : styles.dotEmpty,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  dotEmpty: {
    borderColor: theme.colors.textMuted,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accent,
  },
});
