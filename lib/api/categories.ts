type LocationType = {
  name: string;
};
type Region = {
  name: string;
}

export const fetchRegions = async (): Promise<string[]> => {
  const res = await fetch(
    "https://node-project-group-02.onrender.com/categories/regions"
  );

  const data = await res.json();

  return data.data.map((item: LocationType) => item.name);
};


export const fetchLocationTypes = async (): Promise<string[]> => {
  const res = await fetch(
    "https://node-project-group-02.onrender.com/categories/types"
  );

  const data = await res.json();

  return data.data.map((item: Region) => item.name);
};
