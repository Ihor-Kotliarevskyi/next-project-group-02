export type Location = {
  _id: string;
  image: string;
  name: string;
  locationType: string;
  region: string;
  rate: number;
  description: string;
  ownerId: string;
  feedbacksId: string[];
};


export type NewLocation = {
  name: string;
  locationType: string;
  region: string;
  description: string;
  image?: string;
};

export type LocationFormValues = {
  name: string;
  locationType: string;
  region: string;
  description: string;
  imageFile: File | null;
};