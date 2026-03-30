import LocationForm from "@/components/LocationForm/LocationForm";
import { fetchRegions, fetchLocationTypes } from "@/lib/api/categories";
import { fetchLocationByID } from "@/lib/api/locationsApi";

type Props = {
  params: Promise<{ locationId: string }>;
};

export default async function Page({ params }: Props) {
  const { locationId } = await params;
  const [regions, types, location] = await Promise.all([
    fetchRegions(),
    fetchLocationTypes(),
    fetchLocationByID(locationId),
  ]);

  return (
    <LocationForm
      id={locationId}
      initialData={location}
      regions={regions}
      locationTypes={types}
    />
  );
}