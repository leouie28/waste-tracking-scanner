import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Change this depending on your environment
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:4000";
// const BASE_URL = "https://waste-tracking-system.vercel.app"
const API_URL = BASE_URL + "/api/mobile";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add token dynamically (recommended way)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;