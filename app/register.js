import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AppHeader from "../components/AppHeader";
import ButtonPrimary from "../components/ButtonPrimary";
import InputField from "../components/InputField";
import * as ImagePicker from "expo-image-picker";
import { getDeviceId } from "../utils/deviceUtils";
import { useFingerprintAuth } from "../hooks/useFingerprintAuth";
import voterService from "../services/voterService";
import { uploadPicture } from "../redux/voterSlice";
import { useRouter, useLocalSearchParams } from "expo-router";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return alert("Camera roll permissions are required.");

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      base64: false,
    });
    if (!result.canceled) setCnicImage(result.assets[0]);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permissions are required.");
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
      alert("CNIC is required");
      return router.push("/");
    }
    if (!cnicImage) return alert("Please add CNIC image");

    const ok = await authenticate("Place your finger to register");
    if (!ok) return alert("Fingerprint authentication failed");

    try {
      setIsLoading(true);
      // 🧩 1. Upload image first
      if (!pictureUrl) return alert("Please select picture first");

      // 🧩 2. Send registration payload
      const payload = {
        cnicNumber: cnic,
        deviceId,
        cnicPicture: pictureUrl,
      };

      const res = await voterService.registerVoter(payload);
      setIsLoading(false);
      alert(res?.message || "Registered successfully");
      router.push(`/candidates?cnic=${cnic}`);
    } catch (err) {
      console.error("Registration error:", err);
      setIsLoading(false);
      alert(err?.message || "Registration failed");
    }
  };

  useEffect(() => {
    if ((error || !success) && message) alert(message);
  }, [error, message]);
  
  useEffect(() => {
    if (cnicImage) {
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
      <AppHeader title="Register Voter" />
      <View style={styles.body}>
        <Text style={styles.info}>CNIC: {cnic}</Text>
        {cnicImage ? (
          <Image source={{ uri: cnicImage.uri }} style={styles.preview} />
        ) : (
          <Text>No CNIC image</Text>
        )}
        <View style={styles.row}>
          <TouchableOpacity onPress={pickImage} style={styles.smallBtn}>
            <Text>Select Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={styles.smallBtn}>
            <Text>Take Photo</Text>
          </TouchableOpacity>
        </View>
        <ButtonPrimary title="Register (Fingerprint)" onPress={onRegister} />
        {isLoading && <Loader />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  body: { padding: 20 },
  info: { marginBottom: 12 },
  preview: { width: 240, height: 160, resizeMode: "cover", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12, marginVertical: 12 },
  smallBtn: { padding: 10, borderWidth: 1, borderRadius: 8, marginRight: 8 },
});
