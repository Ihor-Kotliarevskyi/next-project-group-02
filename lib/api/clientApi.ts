import axios from "axios";

export const clientApi = axios.create({
  baseURL: "/api",
  timeout: 35000, // Render cold start can take ~30s
});

export default clientApi;