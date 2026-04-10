import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getMeServer,
  getUserByIdServer,
  getUserLocationsServer,
} from "@/lib/api/serverApi";
import ProfileInfo from "@/components/ProfileInfo/ProfileInfo";
import ProfilePlaceholder from "@/components/ProfilePlaceholder/ProfilePlaceholder";
import ProfileLocationList from "@/components/ProfileLocationList/ProfileLocationList";
import css from "./ProfilePage.module.css";

type Props = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  try {
    const user = await getUserByIdServer(userId);
    const ogImages =
      user.avatarUrl
        ? [{ url: user.avatarUrl, alt: user.name }]
        : user.avatar
          ? [{ url: user.avatar, alt: user.name }]
          : [];

    return {
      title: `${user.name} — профіль`,
      description: `Профіль користувача ${user.name} на Relax Map`,
      openGraph: {
        title: `${user.name} — профіль | Relax Map`,
        description: `Профіль користувача ${user.name} на Relax Map`,
        images: ogImages,
      },
    };
  } catch {
    return { title: "Профіль користувача" };
  }
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;

  let user;
  let currentUser;
  let locations = [];

  try {
    const [userData, currentUserData, locationsData] = await Promise.all([
      getUserByIdServer(userId),
      getMeServer().catch(() => null),
      getUserLocationsServer(userId),
    ]);

    user = userData;
    currentUser = currentUserData;
    locations = locationsData.data;
  } catch (error) {
    redirect("/locations");
  }

  const isOwnProfile = currentUser?._id === userId;
  const hasLocations = locations.length > 0;

  return (
    <main className={css.mainContent}>
      <div className={css.profile}>
        <ProfileInfo user={user} isEditable={isOwnProfile} />

        <div className={css.locations}>
          {hasLocations ? (
            <>
              <h2 className={css.title}>
                {isOwnProfile ? "Мої локації" : "Локації"}
              </h2>
              <ProfileLocationList
                locations={locations}
                isEditable={isOwnProfile}
                isLoading={false}
              />
            </>
          ) : (
            <ProfilePlaceholder isOwnProfile={isOwnProfile} />
          )}
        </div>
      </div>
    </main>
  );
}
