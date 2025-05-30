import api from "@/libs/hooks/axiosInstance";
import { Message } from "@/libs/types/chat";

export const manageChat = {
  conversations: (req: string) => api.get(`/chat/conversation/${req}`),
  messages: (req: string) => api.get(`/chat/${req}`),
};
