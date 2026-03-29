export const getLocations = async (params?: {
  page?: number;
  limit?: number;
  region?: string;
  locationType?: string;
  search?: string;
}) => {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.region) query.set("region", params.region);
  if (params?.locationType) query.set("locationType", params.locationType);
  if (params?.search) query.set("search", params.search);

  const res = await fetch(`/locations?${query}`);
  if (!res.ok) throw new Error("Failed to fetch locations");

  const json = await res.json();

  return {
    locations: json.data,
    pagination: json.pagination,
  };
};

export const getRegions = async () => {
  const res = await fetch("/categories/regions");
  if (!res.ok) throw new Error("Failed to fetch regions");

  const json = await res.json();
  return json.data;
};

export const getLocationTypes = async () => {
  const res = await fetch("/categories/types");
  if (!res.ok) throw new Error("Failed to fetch location types");

  const json = await res.json();
  return json.data;
};
