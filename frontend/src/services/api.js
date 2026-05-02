import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // Android emulator: 10.0.2.2 maps to host localhost
  // iOS simulator: use localhost
  // Real device (same WiFi): use your computer's IP, e.g. 192.168.1.5
  baseURL: 'http://192.168.1.13:5000/api',
});

// Automatically attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
