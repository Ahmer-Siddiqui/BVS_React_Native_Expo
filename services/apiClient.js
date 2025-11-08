import axios from "axios";
import { BASE_URL } from "../constants/endpoints";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// // optional interceptors
// apiClient.interceptors.response.use(
//   (response) => response.data || response,
//   (error) => {
//     const message =
//       error?.response?.data?.message || error.message || "Network error";
//     const metaData =
//       error?.response?.data?.metaData || error.metaData || "Network error";
//     return Promise.reject(new Error({ message, metaData }));
//   }
// );

export default apiClient;
