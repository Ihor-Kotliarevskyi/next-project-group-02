import { cookies } from 'next/headers';
import { api } from './api';
import type { User } from '@/types/user';
import type { Location, NewLocation } from '@/types/location';

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

export const createLocationServer = async (location: NewLocation): Promise<Location> => {
  const { data } = await api.post<Location>('/locations', location);
  return data;
};

export const getRegionsServer = async (): Promise<
  { slug: string; region: string }[]
> => {
  const { data } = await api.get("/categories/regions");
  return data.data;
};

export const getLocationTypesServer = async (): Promise<
  { slug: string; type: string }[]
> => {
  const { data } = await api.get("/categories/types");
  return data.data;
};
