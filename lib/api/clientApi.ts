import axios from "axios";

const clientApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default clientApi;

export const login = (data: { email: string; password: string }) =>
  clientApi.post("/auth/login", data).then((r) => r.data);

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => clientApi.post("/auth/register", data).then((r) => r.data);

export const logout = () => clientApi.post("/auth/logout").then((r) => r.data);

export const getMe = () => clientApi.get("/users/me").then((r) => r.data);

export const getLocations = (params?: {
  page?: number;
  limit?: number;
  region?: string;
  locationType?: string;
  search?: string;
  sort?: string;
}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([, v]) => v !== "" && v !== undefined,
    ),
  );

  return clientApi
    .get("/locations", { params: cleanParams })
    .then((r) => ({ locations: r.data.data, pagination: r.data.pagination }));
};

export const getRegions = () =>
  clientApi.get("/categories/regions").then((r) => r.data.data ?? r.data);

export const getLocationTypes = () =>
  clientApi.get("/categories/types").then((r) => r.data.data ?? r.data);

export const createFeedback = (
  locationId: string,
  data: { rating: number; comment: string; userName: string }
) =>
  clientApi
    .post(`/locations/${locationId}/feedbacks`, {
      rate: data.rating,
      description: data.comment,
      userName: data.userName,
    })
    .then((r) => r.data);

export const createLocation = (data: unknown) =>
  clientApi.post("/locations", data).then((r) => r.data);

export const updateLocation = (id: string, data: unknown) =>
  clientApi.patch(`/locations/${id}`, data).then((r) => r.data);
