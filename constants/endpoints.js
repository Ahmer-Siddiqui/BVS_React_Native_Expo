import { Platform } from "react-native";
export const BASE_URL =
  Platform.OS === "ios" || Platform.OS === "android"
    ? "http://192.168.100.23:8000/api"
    : "http://localhost:8000/api";
