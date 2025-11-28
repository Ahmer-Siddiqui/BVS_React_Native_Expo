import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AppHeader from "../components/AppHeader";
import ButtonPrimary from "../components/ButtonPrimary";
import Loader from "../components/Loader";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFingerprintAuth } from "../hooks/useFingerprintAuth";
import { resetValue, voteCasting } from "../redux/voterSlice";
import { getDeviceId } from "../utils/deviceUtils";
import { useDispatch, useSelector } from "react-redux";

export default function ConfirmScreen() {
  const { cnic, na, pp } = useLocalSearchParams();
  const router = useRouter();
  const deviceId = getDeviceId();
  const { authenticate } = useFingerprintAuth();
  const dispatch = useDispatch();
  const { success, message, error } = useSelector((state) => state.voter);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  const onCastVote = async () => {
    const ok = await authenticate("Authenticate to cast your vote");
    setIsAuthenticate(ok);
    if (!ok) return alert("Fingerprint failed");
    // try {
    if (!cnic || cnic.length !== 15) {
      alert("Cnic number is required");
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
    if ((error || !success) && message) return alert(message);
  }, [success, message, error]);

  useEffect(() => {
    if (success && isAuthenticate) {
      router.push("/success");
      return;
    }
  }, [isAuthenticate, success]);
  return (
    <View style={styles.container}>
      <AppHeader title="Confirm Vote" />
      <View style={styles.body}>
        <Text style={styles.label}>CNIC: {cnic}</Text>
        <Text style={styles.label}>NA Candidate ID: {na}</Text>
        <Text style={styles.label}>PP Candidate ID: {pp}</Text>
        <ButtonPrimary title="Confirm & Authenticate" onPress={onCastVote} />
        {isLoading && <Loader />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  body: { padding: 20 },
  label: { marginVertical: 8 },
});
