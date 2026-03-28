import axios from "axios";

export const clientApi = axios.create({
  baseURL: "/api", // Это заставит axios идти на localhost:3000/api/...
});

export default clientApi;