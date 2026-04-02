import LocationForm from "@/components/LocationForm/LocationForm";
import { getRegionsServer, getLocationTypesServer, getLocationByIdServer } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const [regions, types, location] = await Promise.all([
    getRegionsServer(),
    getLocationTypesServer(),
    getLocationByIdServer(id),
  ]);

  return (
    <LocationForm
      id={id}
      initialData={location}
      regions={regions}
      locationTypes={types}
    />
  );
}