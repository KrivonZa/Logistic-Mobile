import { useSelector } from "react-redux";
import { RootState } from "@/libs/stores";

export const useTrip = () => {
  const { loading, trips, total, tripDetail } = useSelector(
    (state: RootState) => state.manageTrip
  );
  return { loading, trips, total, tripDetail };
};
