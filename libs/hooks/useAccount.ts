import { useSelector } from "react-redux";
import { RootState } from "@/libs/stores";

export const useAccount = () => {
  const { loading } = useSelector((state: RootState) => state.manageAccount);
  return { loading };
};
