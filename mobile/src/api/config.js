// Point this at your backend.
//
// - Web / iOS simulator on same machine as backend: http://localhost:4000
// - Android emulator: http://10.0.2.2:4000
// - Physical device (Expo Go): http://<your-computer-LAN-IP>:4000
//   Find your LAN IP with `ipconfig` (Windows) or `ifconfig` / `ip a` (Mac/Linux).
//   Phone and computer must be on the same Wi-Fi network.

import { Platform } from "react-native";

// Point this at your backend.
//
// - Web / iOS simulator on same machine as backend: http://localhost:4000
// - Android emulator: http://10.0.2.2:4000
// - Physical device (Expo Go): http://<your-computer-LAN-IP>:4000
//   Find your LAN IP with `ipconfig` (Windows) or `ifconfig` / `ip a` (Mac/Linux).
//   Phone and computer must be on the same Wi-Fi network.
//
// Override at runtime without editing code: set EXPO_PUBLIC_API_BASE_URL
// before starting Expo, e.g.
//   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.23:4000 npx expo start --web

const DEFAULT_URL =
  Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_URL;
