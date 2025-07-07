import api from "@/libs/hooks/axiosInstance";

export const manageAccount = {
  updateAccount: (formData: FormData) =>
    api.patch(`/account`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
