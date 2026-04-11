export type LocationPhoto = {
  _id: string;
  url: string;
  publicId: string;
};

export type Location = {
  _id: string;
  image: string;
  imagePublicId?: string;
  imagePosition?: string;
  name: string;
  locationType: string;
  region: string;
  rate: number;
  description: string;
  ownerId: string;
  feedbacksId: string[];
  photos?: LocationPhoto[];
  createdAt?: string;
  coordinates?: { lat: number; lon: number };
};

export type NewLocation = {
  name: string;
  locationType: string;
  region: string;
  description: string;
  image?: string;
  imagePublicId?: string;
};

export type LocationFormValues = {
  name: string;
  locationType: string;
  region: string;
  description: string;
  imageFile: File | null;
  lat: number;
  lon: number;
};
