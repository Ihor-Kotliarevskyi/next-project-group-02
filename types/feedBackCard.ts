export type Feedback = {
  _id: string;
  userName: string;
  description: string;
  rate: number;
  locationType?: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
  };
};