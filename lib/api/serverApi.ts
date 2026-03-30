import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import { Location } from '@/types/location';

export const getMeServer = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const getUserByIdServer = async (id: string): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>(`/users/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

interface UserLocationsResponse {
  data: Location[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const getUserLocationsServer = async (id: string): Promise<UserLocationsResponse> => {
  const cookieStore = await cookies();
  const { data } = await api.get<UserLocationsResponse>(`/users/${id}/locations`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  console.log(data);

  return data;
};
