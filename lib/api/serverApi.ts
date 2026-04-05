<<<<<<< HEAD
import { cookies } from 'next/headers';
import { api } from './api';
import type { User } from '@/types/user';
import type { Location } from '@/types/location';
=======
import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";
import type { Location, NewLocation } from "@/types/location";
>>>>>>> 194fcf3c9118cb39ed98878829f351a371b85d32

export const getMeServer = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const getUserByIdServer = async (id: string): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>(`/users/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

interface UserLocationsResponse {
  data: Location[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getUserLocationsServer = async (
  id: string
): Promise<UserLocationsResponse> => {
  const cookieStore = await cookies();
  const { data } = await api.get<UserLocationsResponse>(
    `/users/${id}/locations`,
    {
      headers: { Cookie: cookieStore.toString() },
    }
  );
  return data;
};

export const getLocationByIdServer = async (id: string): Promise<Location> => {
  const { data } = await api.get<Location>(`/locations/${id}`);
  return data;
};

<<<<<<< HEAD
export const getRegionsServer = async (): Promise<{ slug: string; region: string }[]> => {
  const { data } = await api.get('/categories/regions');
=======
export const createLocationServer = async (
  location: NewLocation
): Promise<Location> => {
  const { data } = await api.post<Location>("/locations", location);
  return data;
};

export const getRegionsServer = async (): Promise<
  { slug: string; region: string }[]
> => {
  const { data } = await api.get("/categories/regions");
>>>>>>> 194fcf3c9118cb39ed98878829f351a371b85d32
  return data.data;
};

export const getLocationTypesServer = async (): Promise<
  { slug: string; type: string }[]
> => {
  const { data } = await api.get("/categories/types");
  return data.data;
};
