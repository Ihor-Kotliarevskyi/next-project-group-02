import LocationForm from "@/components/LocationForm/LocationForm";

export default async function Page({ params }: { params: { id: string } }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/locations/${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div>Локацію не знайдено</div>;
  }

  const location = await res.json();

  return (
    <LocationForm
      id={params.id}
      initialData={location}
    />
  );
}