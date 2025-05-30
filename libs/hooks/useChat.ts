import { useSelector } from "react-redux";
import { RootState } from "@/libs/stores";

export const useChat = () => {
  const { loading, conversations, messages } = useSelector(
    (state: RootState) => state.manageChat
  );
  return { loading, conversations, messages };
};
