import { getMeServer, getUserLocationsServer } from "@/lib/api/serverApi";
import ProfileInfo from "@/components/ProfileInfo/ProfileInfo";
import ProfilePlaceholder from "@/components/ProfilePlaceholder/ProfilePlaceholder";
import ProfileLocationList from "@/components/ProfileLocationList/ProfileLocationList";
import css from "./ProfilePage.module.css";

export default async function Profile() {
  const user = await getMeServer();

  if (!user) return null;

  const data = await getUserLocationsServer(user._id);
  const locations = data.data || [];
  const hasLocations = locations.length !== 0;

  return (
    <main className={css.mainContent}>
      <div className={css.profile}>
        <ProfileInfo user={user} />

        <div className={css.locations}>
          {hasLocations ? (
            <>
              <h2 className={css.title}>Мої локації</h2>
              <ProfileLocationList
                locations={locations}
                isLoading={false}
                isEditable={true}
              />
            </>
          ) : (
            <ProfilePlaceholder isOwnProfile={true} />
          )}
        </div>
      </div>
    </main>
  );
}
