import LocationForm from "@/components/LocationForm/LocationForm";
import { fetchRegions, fetchLocationTypes } from "@/lib/api/categories";

export default async function Page() {
    
  const regions = await fetchRegions();
  const locationTypes = await fetchLocationTypes();

  return <LocationForm regions={regions} locationTypes={locationTypes}  />;
}