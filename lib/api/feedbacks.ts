import  clientApi  from './clientApi';

export const getFeedbacks = async (locationId: string, page = 1) => {
  const { data } = await clientApi.get(`/feedbacks/${locationId}`, {
    params: { page, limit: 3 },
  });

  return data;
};