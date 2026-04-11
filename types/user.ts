export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  avatarUrl?: string;
  articlesAmount: number;
  createdAt?: string;
  updatedAt?: string;
}
