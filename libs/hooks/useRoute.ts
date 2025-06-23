import { useSelector } from "react-redux";
import { RootState } from "@/libs/stores";

export const useRoute = () => {
  const { loading, routes, routeDetail } = useSelector(
    (state: RootState) => state.manageRoute
  );
  return { loading, routes, routeDetail };
};
