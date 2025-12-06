import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import ButtonPrimary from "../components/ButtonPrimary";
import StepIndicator from "../components/StepIndicator";
import * as ImagePicker from "expo-image-picker";
import { getDeviceId } from "../utils/deviceUtils";
import { useFingerprintAuth } from "../hooks/useFingerprintAuth";
import voterService from "../services/voterService";
import { uploadPicture } from "../redux/voterSlice";
import { useRouter, useLocalSearchParams } from "expo-router";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from "../constants/theme";
import { useAlert } from "../context/AlertContext";

export default function RegisterScreen() {
  const { cnic } = useLocalSearchParams();
  const router = useRouter();
  const { message, success, pictureUrl, error } = useSelector(
    (state) => state.voter
  );
  const dispatch = useDispatch();
  const [cnicImage, setCnicImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const deviceId = getDeviceId();
  const { authenticate } = useFingerprintAuth();
  const { showAlert } = useAlert();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return showAlert({
        title: "Permission Required",
        message: "Camera roll permissions are required.",
        type: "warning"
      });

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      base64: false,
    });
    if (!result.canceled) setCnicImage(result.assets[0]);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showAlert({
        title: "Permission Required",
        message: "Camera permissions are required.",
        type: "warning"
      });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      base64: false,
    });
    if (!result.canceled) setCnicImage(result.assets[0]);
  };
  
  const onRegister = async () => {
    if (!cnic || cnic.length < 15) {
      showAlert({
        title: "Missing Information",
        message: "CNIC is required",
        type: "error"
      });
      return router.push("/");
    }
    if (!cnicImage) return showAlert({
      title: "Missing Image",
      message: "Please add CNIC image",
      type: "error"
    });

    const ok = await authenticate("Place your finger to register");
    if (!ok) return showAlert({
      title: "Authentication Failed",
      message: "Fingerprint authentication failed",
      type: "error"
    });

    try {
      setIsLoading(true);
      // 🧩 1. Upload image first
      if (cnicImage && !pictureUrl)
        return showAlert({
          title: "Please Wait",
          message: "Image is uploading, please wait...",
          type: "info"
        });
      if (!pictureUrl) return showAlert({
        title: "Missing Image",
        message: "Please select picture first",
        type: "error"
      });

      // 🧩 2. Send registration payload
      const payload = {
        cnicNumber: cnic,
        deviceId,
        cnicPicture: pictureUrl,
      };

      const res = await voterService.registerVoter(payload);
      setIsLoading(false);
      router.push(`/`);
    } catch (err) {
      console.error("Registration error:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cnicImage) {
      console.log(cnicImage.uri, "bbbbbbbbbb");
      
      dispatch(
        uploadPicture({
          uri: cnicImage.uri,
          fileDirName: "voter/cnics",
        })
      );
    }
  }, [cnicImage]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F9FAFB', '#EEF2FF']}
        style={styles.gradient}
      >
        <AppHeader title="Register Voter" />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Indicator */}
          <StepIndicator currentStep={2} />
          
          {/* Main Card */}
          <View style={styles.card}>
            {/* CNIC Info */}
            <View style={styles.cnicInfoContainer}>
              <Ionicons name="card" size={20} color={COLORS.primary} />
              <Text style={styles.cnicInfo}>CNIC: {cnic}</Text>
            </View>
            
            {/* Title */}
            <Text style={styles.title}>Upload CNIC Photo</Text>
            <Text style={styles.subtitle}>
              Take a clear photo of your CNIC card or select from gallery
            </Text>
            
            {/* Image Upload Area */}
            <View style={styles.uploadSection}>
              {cnicImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: cnicImage.uri }} style={styles.preview} />
                  <TouchableOpacity 
                    style={styles.changeImageButton}
                    onPress={() => setCnicImage(null)}
                  >
                    <Ionicons name="close-circle" size={32} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="cloud-upload-outline" size={64} color={COLORS.textTertiary} />
                  <Text style={styles.uploadText}>No image selected</Text>
                  <Text style={styles.uploadHint}>Tap buttons below to add photo</Text>
                </View>
              )}
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                onPress={() => takePhoto()} 
                style={styles.actionButton}
              >
                <LinearGradient
                  colors={[COLORS.secondary, COLORS.secondaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButtonGradient}
                >
                  <Ionicons name="camera" size={24} color={COLORS.textInverse} />
                  <Text style={styles.actionButtonText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => pickImage()} 
                style={styles.actionButton}
              >
                <LinearGradient
                  colors={[COLORS.info, '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionButtonGradient}
                >
                  <Ionicons name="images" size={24} color={COLORS.textInverse} />
                  <Text style={styles.actionButtonText}>Select Image</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {/* Register Button */}
            <ButtonPrimary 
              title="Register with Fingerprint" 
              onPress={() => onRegister()}
              icon="finger-print"
              variant="success"
            />
          </View>
          
          {/* Security Footer */}
          <View style={styles.footer}>
            <Ionicons name="lock-closed" size={20} color={COLORS.textSecondary} />
            <Text style={styles.footerText}>
              Fingerprint authentication required
            </Text>
          </View>
        </ScrollView>
        
        {isLoading && <Loader />}
      </LinearGradient>
    </View>
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
  cnicInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  cnicInfo: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.base,
  },
  uploadSection: {
    marginBottom: SPACING.lg,
  },
  uploadPlaceholder: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  uploadText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  uploadHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background, // Add background to see container
  },
  preview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain', // Change to contain to ensure full image is visible
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: '#e1e4e8', // Add background to see image area
  },
  changeImageButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  actionButtonText: {
    color: COLORS.textInverse,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginLeft: SPACING.sm,
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
