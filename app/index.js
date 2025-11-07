import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import ButtonPrimary from "../components/ButtonPrimary";
import AppHeader from "../components/AppHeader";
import { useDispatch, useSelector } from "react-redux";
import { cnicVerification } from "../redux/voterSlice";
import { getDeviceId } from "../utils/deviceUtils";

export default function HomeScreen() {
  const [cnic, setCnic] = useState("");
  const router = useRouter();
  const { voter, success, message } = useSelector((state) => state.voter);
  const dispatch = useDispatch();
  const deviceId = getDeviceId();

  const onCheck = () => {
    // navigate to candidates screen which will call API
    if (!cnic || cnic.length < 15) {
      alert("Please enter a valid 15-digit CNIC number like 11111-1111111-1");
      return;
    }
    const cnicNumber = cnic;
    dispatch(cnicVerification({ cnicNumber, deviceId }));
  };

  useEffect(() => {
    if (!success && message) alert(message);

    if (message?.includes("already") && message?.includes("cast")) {
      alert(`${message}`);
      router.push(`/success?message=${message}`);
      return;
    }
    if (message?.includes("register") && !success) {
      alert(`${message}`);
      router.push(`/register?cnic=${cnic}`);
      return;
    }
    if (voter?._id) router.push(`/candidates?cnic=${cnic}`);
  }, [voter, success, message]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppHeader title="Voter Verification" />
      <View style={styles.body}>
        <Text style={styles.label}>Enter CNIC Number</Text>
        <InputField
          value={cnic}
          onChangeText={setCnic}
          placeholder="e.g. 1234512345671"
          keyboardType="numeric"
        />
        <ButtonPrimary title="Check Registration" onPress={onCheck} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  body: { padding: 20, marginTop: 40 },
  label: { fontSize: 16, marginBottom: 12 },
});
