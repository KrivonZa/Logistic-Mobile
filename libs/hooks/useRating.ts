import { useSelector } from "react-redux";
import { RootState } from "@/libs/stores";

export const useRating = () => {
  const { loading } = useSelector((state: RootState) => state.manageRating);
  return { loading };
};
