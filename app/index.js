import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import ButtonPrimary from "../components/ButtonPrimary";
import AppHeader from "../components/AppHeader";
import StepIndicator from "../components/StepIndicator";
import { useDispatch, useSelector } from "react-redux";
import { cnicVerification, resetVoter } from "../redux/voterSlice";
import { getDeviceId } from "../utils/deviceUtils";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from "../constants/theme";
import { useAlert } from "../context/AlertContext";

export default function HomeScreen() {
  const [cnic, setCnic] = useState("");
  const router = useRouter();
  const { voter, success, message, metaData } = useSelector(
    (state) => state.voter
  );
  const [alertShown, setAlertShown] = useState(false);
  const dispatch = useDispatch();
  const deviceId = getDeviceId();
  const { showAlert } = useAlert();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const onCheck = () => {
    if (!isValidCnic(cnic))
      return showAlert({
        title: "Invalid CNIC",
        message: "Please enter a valid CNIC like 42101-0000000-5",
        type: "error"
      });

    setAlertShown(false);  // reset so new result can show alert

    const cnicNumber = cnic;
    dispatch(resetVoter());
    dispatch(cnicVerification({ cnicNumber, deviceId }));
  };

  const formatCnic = (value) => {
    // remove any non-digit
    let digits = value.replace(/\D/g, "");

    // apply formatting: 5 - 7 - 1
    let formatted = digits;

    if (digits.length > 5) {
      formatted = digits.slice(0, 5) + "-" + digits.slice(5);
    }
    if (digits.length > 12) {
      formatted = formatted.slice(0, 13) + "-" + formatted.slice(13);
    }

    return formatted;
  };

  const isValidCnic = (value) => {
    return /^\d{5}-\d{7}-\d{1}$/.test(value);
  };
  
  useEffect(() => {
    dispatch(resetVoter());
  }, []);

  useEffect(() => {
  if (alertShown) return; // Prevent showing alerts multiple times

  // if voter found…
  if (voter?._id) {
    setAlertShown(true);
    router.push(`/candidates?cnic=${cnic}`);
    return;
  }

  // voter NOT found
  if (!metaData && message) {
    setAlertShown(true);
    showAlert({
      title: "Notice",
      message: message,
      type: "info"
    });
    return;
  }

  // new voter registration
  if (metaData && !metaData?.voterVerification?.deviceId) {
    setAlertShown(true);
    showAlert({
      title: "Registration Required",
      message: message,
      type: "info",
      showCancel: true,
      confirmText: "Register",
      onConfirm: () => {
        dispatch(resetVoter());
        router.push(`/register?cnic=${cnic}`);
      }
    });
    return;
  }

  // not eligible
  if (metaData && !metaData?.canVote) {
    setAlertShown(true);
    showAlert({
      title: "Not Eligible",
      message: "You are not eligible to vote. Wait for polling officer approval",
      type: "warning"
    });
    return;
  }

  // already voted
  if (metaData && metaData?.voterVerification?.IsVoted) {
    setAlertShown(true);
    showAlert({
      title: "Already Voted",
      message: message,
      type: "info",
      onConfirm: () => router.push(`/success?message=${message}`)
    });
    return;
  }
}, [voter, success, message, metaData, dispatch, router, cnic, alertShown]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient
        colors={['#F9FAFB', '#EEF2FF']}
        style={styles.gradient}
      >
        <AppHeader title="Voter Verification" />
        
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Indicator */}
          <StepIndicator currentStep={1} />
          
          {/* Main Card */}
          <View style={styles.card}>
            {/* Icon Header */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="finger-print" size={48} color={COLORS.primary} />
              </View>
            </View>
            
            {/* Welcome Text */}
            <Text style={styles.title}>Welcome to Voting</Text>
            <Text style={styles.subtitle}>
              Enter your CNIC number to verify your registration
            </Text>
            
            {/* CNIC Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>CNIC Number</Text>
              <InputField
                value={cnic}
                onChangeText={(text) => setCnic(formatCnic(text))}
                placeholder="e.g. 42101-9999999-0"
                keyboardType="numeric"
                icon="card-outline"
              />
              
              {/* Hint */}
              <View style={styles.hintContainer}>
                <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.hint}>
                  Enter your 13-digit CNIC number
                </Text>
              </View>
            </View>
            
            {/* Action Button */}
            <ButtonPrimary 
              title="Check Registration" 
              onPress={() => onCheck()}
              icon="checkmark-circle"
            />
          </View>
          
          {/* Info Footer */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.textSecondary} />
            <Text style={styles.footerText}>
              Your information is secure and encrypted
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    ...SHADOWS.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.base,
  },
  inputSection: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
  },
  hint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
});

