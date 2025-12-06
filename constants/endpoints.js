import { Platform } from "react-native";
export const BASE_URL =
  Platform.OS === "ios" || Platform.OS === "android"
    ? "http://10.84.171.32:8000/api"
    : "http://localhost:8000/api";
