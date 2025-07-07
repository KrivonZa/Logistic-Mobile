import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
let socket: Socket | null = null;

export const createSocket = async (): Promise<Socket> => {
  const accountID = await SecureStore.getItemAsync("accountID");

  if (!accountID) {
    throw new Error("Không tìm thấy accountID");
  }

  socket = io(`${baseURL}/chat`, {
    transports: ["websocket"],
    reconnection: true,
    query: { userID: accountID },
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
  });

  return socket;
};

export { socket };
