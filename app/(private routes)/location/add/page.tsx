import LocationForm from "@/components/LocationForm/LocationForm";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const regionsRes = await fetch(`${baseUrl}/api/categories/regions`, {
    cache: "no-store",
  });

  const typesRes = await fetch(`${baseUrl}/api/categories/types`, {
    cache: "no-store",
  });

  const regionsData = await regionsRes.json();
  const typesData = await typesRes.json();

  const regions = regionsData.data.map((item: Region) => item.region);
  const locationTypes = typesData.data.map((item: LocationType) => item.type);

  return (
    <LocationForm/>
  );
}