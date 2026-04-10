import type { Metadata } from "next";
import LocationForm from "@/components/LocationForm/LocationForm";
import { getRegionsServer, getLocationTypesServer } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Додати локацію",
  description: "Додайте нове місце для відпочинку на Relax Map",
  robots: { index: false },
};

export default async function Page() {
  const [regions, locationTypes] = await Promise.all([
    getRegionsServer(),
    getLocationTypesServer(),
  ]);

  const sortedRegions = regions.slice().sort((a, b) => a.region.localeCompare(b.region, "uk"));

  return <LocationForm regions={sortedRegions} locationTypes={locationTypes} />;
}
