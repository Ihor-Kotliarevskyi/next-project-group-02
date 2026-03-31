import LocationForm from "@/components/LocationForm/LocationForm";
import { LocationType } from "@/types/locationTypes";
import { Region } from "@/types/region";

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [regionsRes, typesRes, locationRes] = await Promise.all([
    fetch(baseUrl + "/api/categories/regions", { cache: "no-store" }),
    fetch(baseUrl + "/api/categories/types", { cache: "no-store" }),
    fetch(baseUrl + "/api/locations/" + params.id, { cache: "no-store" }),
  ]);

  if (!regionsRes.ok || !typesRes.ok || !locationRes.ok) {
    throw new Error("Failed to fetch required data");
  }

  const regionsData = await regionsRes.json();
  const typesData = await typesRes.json();
  const location = await locationRes.json();

  const regions = regionsData.data.map((item: Region) => item.region);
  const locationTypes = typesData.data.map((item: LocationType) => item.type);

  return (
    <LocationForm
      id={params.id}
      initialData={location}
      regions={regions}
      locationTypes={locationTypes}
    />
  );
}