import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';

interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export function Header({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftPress}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {leftIcon}
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.side}>
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  title: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  side: {
    width: 40,
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
});
