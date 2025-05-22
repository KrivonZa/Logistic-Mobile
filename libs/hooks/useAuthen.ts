import { useSelector } from "react-redux";
import { RootState } from "@/libs/stores";

export const useAuthen = () => {
  const { loading } = useSelector((state: RootState) => state.manageAuthen);
  return { loading };
};
