import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AppHeader from "../components/AppHeader";
import ButtonPrimary from "../components/ButtonPrimary";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { resetVoter } from "../redux/voterSlice";

export default function SuccessScreen() {
  const router = useRouter();
  const { message } = useLocalSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetVoter());
  });
  return (
    <View style={styles.container}>
      <AppHeader title="Success" />
      <View style={styles.body}>
        <Text style={styles.title}>
          {message || "Vote Cast Successfully 🎉"}
        </Text>
        <ButtonPrimary title="Back to Home" onPress={() => router.push("/")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  body: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  title: { fontSize: 20, marginBottom: 16 },
});
