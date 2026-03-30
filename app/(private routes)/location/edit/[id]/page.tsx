import LocationForm from "@/components/LocationForm/LocationForm";
import { LocationType } from "@/types/locationTypes";
import { Region } from "@/types/region";

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const baseUrl = "http://localhost:3000";

  const [regionsRes, typesRes, locationRes] = await Promise.all([
    fetch(`${baseUrl}/categories/regions`, { cache: "no-store" }),
    fetch(`${baseUrl}/categories/types`, { cache: "no-store" }),
    fetch(`${baseUrl}/locations/${params.id}`, { cache: "no-store" }),
  ]);

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