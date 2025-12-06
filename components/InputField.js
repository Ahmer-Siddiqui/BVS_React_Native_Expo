import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function InputField({ 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  icon = null,
  iconPosition = 'left',
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused,
    ]}>
      {icon && iconPosition === 'left' && (
        <Ionicons 
          name={icon} 
          size={20} 
          color={isFocused ? COLORS.primary : COLORS.textSecondary} 
          style={styles.iconLeft}
        />
      )}
      
      <TextInput
        style={[
          styles.input,
          icon && iconPosition === 'left' && styles.inputWithIconLeft,
          icon && iconPosition === 'right' && styles.inputWithIconRight,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={COLORS.textTertiary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {icon && iconPosition === 'right' && (
        <Ionicons 
          name={icon} 
          size={20} 
          color={isFocused ? COLORS.primary : COLORS.textSecondary} 
          style={styles.iconRight}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  containerFocused: {
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  input: {
    flex: 1,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  inputWithIconLeft: {
    paddingLeft: SPACING.xs,
  },
  inputWithIconRight: {
    paddingRight: SPACING.xs,
  },
  iconLeft: {
    marginLeft: SPACING.md,
  },
  iconRight: {
    marginRight: SPACING.md,
  },
});
