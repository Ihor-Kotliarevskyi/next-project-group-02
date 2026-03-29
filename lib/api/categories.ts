export interface LocationType {
  _id: string;
  type: string;
  slug: string;
  shortDescription: string;
}


type Region = {
  _id: string;
  region: string; 
  slug: string;
  level: string;
  note: string;
};

export const fetchRegions = async (): Promise<string[]> => {
  const res = await fetch(
    "https://node-project-group-02.onrender.com/categories/regions"
  );

  const data = await res.json();

  console.log("Fetched regions:", data.data.map((item: Region) => item.region)); 

  return data.data.map((item: Region) => item.region);
};

export const fetchLocationTypes = async (): Promise<string[]> => {
  const res = await fetch(
    "https://node-project-group-02.onrender.com/categories/types"
  );

  const data = await res.json();

  return data.data.map((item: LocationType) => item.type);
};