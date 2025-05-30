import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
const accountID = SecureStore.getItemAsync("accountID");

export const socket = io(`${baseURL}/chat`, {
  transports: ["websocket"],
  reconnection: true,
  query: { userID: accountID },
});
