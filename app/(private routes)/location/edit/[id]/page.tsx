import LocationForm from "@/components/LocationForm/LocationForm";
import { fetchRegions, fetchLocationTypes } from "@/lib/api/categories";
import { fetchLocationByID } from "@/lib/api/locationsApi";

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const [regions, types, location] = await Promise.all([
    fetchRegions(),
    fetchLocationTypes(),
    fetchLocationByID(params.id),
  ]);
    
  return (
    <LocationForm
      id={params.id}
      initialData={location}
      regions={regions}
      locationTypes={types}
    />
  );
}