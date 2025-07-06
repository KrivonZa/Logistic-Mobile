import api from "@/libs/hooks/axiosInstance";
import { Rating } from "@/libs/types/rating";

export const manageRating = {
  createRating: (req: Rating) => api.post(`/rating`, req),
};
