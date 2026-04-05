import LocationForm from "@/components/LocationForm/LocationForm";
import { getRegionsServer, getLocationTypesServer } from "@/lib/api/serverApi";

export default async function Page() {
  const [regions, locationTypes] = await Promise.all([
    getRegionsServer(),
    getLocationTypesServer(),
  ]);

  return <LocationForm regions={regions} locationTypes={locationTypes} />;
}
