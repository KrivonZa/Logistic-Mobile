import { useSelector } from "react-redux";
import { RootState } from "@/libs/stores";

export const usePackage = () => {
  const { loading, packages, packageDetail } = useSelector(
    (state: RootState) => state.managePackage
  );
  return { loading, packages, packageDetail };
};
