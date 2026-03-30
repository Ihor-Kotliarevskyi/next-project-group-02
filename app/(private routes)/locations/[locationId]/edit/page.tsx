import LocationForm from "@/components/LocationForm/LocationForm";
import { getRegionsServer, getLocationTypesServer, getLocationByIdServer } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ locationId: string }>;
};

export default async function Page({ params }: Props) {
  const { locationId } = await params;
  const [regions, types, location] = await Promise.all([
    getRegionsServer(),
    getLocationTypesServer(),
    getLocationByIdServer(locationId),
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