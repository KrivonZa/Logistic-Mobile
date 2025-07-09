import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
let socketInstance: Socket | null = null;

export const getSocket = async (): Promise<Socket> => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  const accountID = await SecureStore.getItemAsync("accountID");

  if (!accountID) {
    throw new Error("Không tìm thấy accountID");
  }

  socketInstance = io(`${baseURL}/chat`, {
    transports: ["websocket"],
    reconnection: true,
    query: { userID: accountID },
  });

  return new Promise((resolve) => {
    socketInstance?.on("connect", () => {
      resolve(socketInstance!);
    });
  });
};
