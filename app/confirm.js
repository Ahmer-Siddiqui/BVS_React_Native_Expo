import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import ButtonPrimary from "../components/ButtonPrimary";
import Loader from "../components/Loader";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFingerprintAuth } from "../hooks/useFingerprintAuth";
import { resetValue, voteCasting } from "../redux/voterSlice";
import { getDeviceId } from "../utils/deviceUtils";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from "../constants/theme";
import { useAlert } from "../context/AlertContext";

export default function ConfirmScreen() {
  const { cnic, na, pp } = useLocalSearchParams();
  const router = useRouter();
  const deviceId = getDeviceId();
  const { authenticate } = useFingerprintAuth();
  const dispatch = useDispatch();
  const { success, message, error } = useSelector((state) => state.voter);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const { showAlert } = useAlert();

  const onCastVote = async () => {
    const ok = await authenticate("Authenticate to cast your vote");
    setIsAuthenticate(ok);
    if (!ok) return showAlert({
      title: "Authentication Failed",
      message: "Fingerprint failed",
      type: "error"
    });
    // try {
    if (!cnic || cnic.length !== 15) {
      showAlert({
        title: "Missing Information",
        message: "Cnic number is required",
        type: "error"
      });
      router.push("/");
      return;
    }

    const payload = { cnicNumber: cnic, deviceId, candidates: [na, pp] };

    dispatch(voteCasting(payload));
  };

  useEffect(() => {
    dispatch(resetValue());
  }, []);

  useEffect(() => {
    if ((error || !success) && message) return showAlert({
      title: "Error",
      message: message,
      type: "error"
    });
  }, [success, message, error]);

  useEffect(() => {
    if (success && isAuthenticate) {
      router.push("/success");
      return;
    }
  }, [isAuthenticate, success]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F9FAFB', '#EEF2FF']}
        style={styles.gradient}
      >
        <AppHeader title="Confirm Vote" showBack={true} />
        
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={48} color={COLORS.primary} />
            </View>
            
            <Text style={styles.title}>Confirm Your Selection</Text>
            <Text style={styles.subtitle}>
              Please review your choices before casting your vote. This action cannot be undone.
            </Text>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="card-outline" size={20} color={COLORS.textSecondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>CNIC Number</Text>
                <Text style={styles.detailValue}>{cnic}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="person" size={20} color={COLORS.textSecondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>National Assembly (NA)</Text>
                <Text style={styles.detailValue}>Candidate ID: {na}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="person" size={20} color={COLORS.textSecondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Provincial Assembly (PP)</Text>
                <Text style={styles.detailValue}>Candidate ID: {pp}</Text>
              </View>
            </View>
            
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color={COLORS.warning} />
              <Text style={styles.warningText}>
                Biometric authentication is required to submit your vote.
              </Text>
            </View>
            
            <ButtonPrimary 
              title="Authenticate & Cast Vote" 
              onPress={onCastVote}
              icon="finger-print"
              variant="primary"
            />
          </View>
        </ScrollView>
        
        {isLoading && <Loader />}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.base,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    marginLeft: SPACING.sm,
    color: '#B45309', // Dark amber
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});
