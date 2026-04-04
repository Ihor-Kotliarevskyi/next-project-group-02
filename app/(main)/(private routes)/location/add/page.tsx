import LocationForm from "@/components/LocationForm/LocationForm";
import { getRegionsServer, getLocationTypesServer } from "@/lib/api/serverApi";

export default async function Page() {

  const regions = await getRegionsServer();
  const locationTypes = await getLocationTypesServer();

  return <LocationForm regions={regions} locationTypes={locationTypes}  />;
}