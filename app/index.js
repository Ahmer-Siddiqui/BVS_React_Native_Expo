import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import InputField from "../components/InputField";
import ButtonPrimary from "../components/ButtonPrimary";
import AppHeader from "../components/AppHeader";
import { useDispatch, useSelector } from "react-redux";
import { cnicVerification, resetVoter } from "../redux/voterSlice";
import { getDeviceId } from "../utils/deviceUtils";

export default function HomeScreen() {
  const [cnic, setCnic] = useState("");
  const router = useRouter();
  const { voter, success, message, metaData } = useSelector(
    (state) => state.voter
  );
  const dispatch = useDispatch();
  const deviceId = getDeviceId();

  const onCheck = () => {
    if (!isValidCnic(cnic))
      return alert("Please enter a valid CNIC like 42101-000000-5");
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
    if (voter?._id) return router.push(`/candidates?cnic=${cnic}`);

    if (!metaData && message) return alert(message);

    if (metaData && !metaData?.canVote)
      return alert("You are not eligible to vote.");

    if (metaData && !metaData?.voterVerification?.deviceId) {
      Alert.alert("Alert", message, [
        {
          text: "OK",
          onPress: () => {
            router.push(`/register?cnic=${cnic}`);
          },
        },
      ]);
      return;
    }
    if (metaData && metaData?.voterVerification?.IsVoted) {
      alert(`${message}`);
      router.push(`/success?message=${message}`);
      return;
    }
  }, [voter, success, message, metaData, dispatch]);

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
          onChangeText={(text) => setCnic(formatCnic(text))}
          placeholder="e.g. 42101-9999999-0"
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
