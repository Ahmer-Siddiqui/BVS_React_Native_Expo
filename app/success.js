import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import ButtonPrimary from "../components/ButtonPrimary";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { resetVoter } from "../redux/voterSlice";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from "../constants/theme";

export default function SuccessScreen() {
  const router = useRouter();
  const { message } = useLocalSearchParams();
  const dispatch = useDispatch();
  const scaleValue = new Animated.Value(0);

  useEffect(() => {
    dispatch(resetVoter());
    
    // Simple pop-in animation for the icon
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleValue }] }]}>
            <Ionicons name="checkmark-circle" size={120} color={COLORS.success} />
          </Animated.View>
          
          <Text style={styles.title}>Vote Cast Successfully!</Text>
          <Text style={styles.message}>
            {message || "Thank you for exercising your right to vote. Your vote has been securely recorded."}
          </Text>
          
          <View style={styles.card}>
            <Ionicons name="information-circle" size={24} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              You can now safely close the app or return to the home screen.
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <ButtonPrimary 
              title="Return to Home" 
              onPress={() => router.push("/")}
              icon="home"
              variant="primary"
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING['3xl'],
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.lg,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING['3xl'],
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  infoIcon: {
    marginRight: SPACING.md,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    width: '100%',
  },
});
