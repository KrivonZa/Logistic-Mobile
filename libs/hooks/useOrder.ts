import { useSelector } from "react-redux";
import { RootState } from "@/libs/stores";

export const useOrder = () => {
  const { loading } = useSelector(
    (state: RootState) => state.manageOrderDelivery
  );
  return { loading };
};
