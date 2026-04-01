import axios from "axios";
import clientApi from "./clientApi";

export const getFeedbacks = async (locationId: string, page = 1, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const { data } = await clientApi.get(`/locations/${locationId}/feedbacks`, {
        params: { page, limit: 3 },
      });
      return data;
    } catch (err: unknown) {
      const isLast = i === retries;
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;

      if (isLast || (status !== undefined && status !== 404 && status !== 500)) {
        throw err;
      }

      await new Promise((res) => setTimeout(res, 2000));
    }
  }
};