import type { Metadata } from "next";
import LocationForm from "@/components/LocationForm/LocationForm";
import { getRegionsServer, getLocationTypesServer } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Додати локацію",
  description: "Додайте нове місце для відпочинку на Relax Map",
};

export default async function Page() {
  const [regions, locationTypes] = await Promise.all([
    getRegionsServer(),
    getLocationTypesServer(),
  ]);

  return <LocationForm regions={regions} locationTypes={locationTypes} />;
}
