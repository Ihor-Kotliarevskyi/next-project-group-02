import LocationForm from "@/components/LocationForm/LocationForm";
import { LocationType } from "@/types/locationTypes";
import { Region } from "@/types/region";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [regionsRes, typesRes] = await Promise.all([
    fetch(baseUrl + "/api/categories/regions", { cache: "no-store" }),
    fetch(baseUrl + "/api/categories/types", { cache: "no-store" }),
  ]);

  if (!regionsRes.ok || !typesRes.ok) {
    throw new Error("Failed to fetch location categories");
  }

  const regionsData = await regionsRes.json();
  const typesData = await typesRes.json();

  const regions = regionsData.data.map((item: Region) => item.region);
  const locationTypes = typesData.data.map((item: LocationType) => item.type);

  return (
    <LocationForm
      regions={regions}
      locationTypes={locationTypes}
    />
  );
}