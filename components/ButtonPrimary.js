import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function ButtonPrimary({ 
  title, 
  onPress, 
  disabled = false,
  loading = false,
  icon = null,
  variant = 'primary', // 'primary' | 'secondary' | 'success'
}) {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'success':
        return GRADIENTS.success;
      case 'secondary':
        return [COLORS.secondary, COLORS.secondaryDark];
      default:
        return GRADIENTS.primary;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity 
        style={[styles.btn, disabled && styles.disabled]} 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator color={COLORS.textInverse} size="small" />
            ) : (
              <>
                {icon && (
                  <Ionicons 
                    name={icon} 
                    size={20} 
                    color={COLORS.textInverse} 
                    style={styles.icon}
                  />
                )}
                <Text style={styles.text}>{title}</Text>
              </>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  gradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { 
    color: COLORS.textInverse, 
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  disabled: { 
    opacity: 0.5,
  },
});
