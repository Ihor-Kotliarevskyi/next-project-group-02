import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMeServer } from "@/lib/api/serverApi";
import styles from "./page.module.css";
import LocationDetailsClient from "./LocationDetailsClient";
import { Feedback } from "@/types/feedBackCard";
import { api } from "@/lib/api/api";

type Owner = {
  _id?: string;
  name?: string;
  avatar?: string;
};

type LocationDetails = {
  _id: string;
  image: string;
  name: string;
  locationType: string | { type: string; slug: string };
  region: string;
  rate: number;
  description: string;
  ownerId?: string | Owner;
  feedbacksId?: string[];
};

type PageProps = {
  params: Promise<{ locationId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locationId } = await params;

  try {
    const { data: location } = await api.get<LocationDetails>(
      `/locations/${locationId}`
    );
    const description = location.description?.slice(0, 160) ?? "";

    return {
      title: location.name,
      description,
      openGraph: {
        title: location.name,
        description,
        images: location.image ? [{ url: location.image }] : [],
        type: "article",
      },
    };
  } catch {
    return { title: "Локація не знайдена" };
  }
}

function normalizeFeedbacks(payload: unknown): Feedback[] {
  if (Array.isArray(payload)) return payload as Feedback[];

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as Feedback[];
    if (Array.isArray(record.feedbacks)) return record.feedbacks as Feedback[];
    if (Array.isArray(record.items)) return record.items as Feedback[];
  }

  return [];
}

function normalizeFeedback(payload: unknown): Feedback | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const candidate =
    (record.data as Feedback | undefined) ??
    (record.feedback as Feedback | undefined) ??
    (record.item as Feedback | undefined) ??
    (payload as Feedback);

  return candidate && typeof candidate === "object" && "_id" in candidate
    ? candidate
    : null;
}

async function getLocationById(id: string): Promise<LocationDetails | null> {
  try {
    const { data } = await api.get<LocationDetails>(`/locations/${id}`);
    return data;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }

    throw error;
  }
}

async function getLocationFeedbacks(
  id: string,
  feedbackIds: string[] = []
): Promise<Feedback[]> {
  try {
    const { data } = await api.get(`/feedbacks/${id}`);
    const reviews = normalizeFeedbacks(data);

    if (reviews.length > 0 || feedbackIds.length === 0) {
      return reviews;
    }

    const fallbackFeedbacks = await Promise.all(
      feedbackIds.map(async (feedbackId) => {
        try {
          const { data: feedbackData } = await api.get(`/feedbacks/${feedbackId}`);
          return normalizeFeedback(feedbackData);
        } catch {
          return null;
        }
      })
    );

    return fallbackFeedbacks.filter(
      (review): review is Feedback => review !== null
    );
  } catch {
    return [];
  }
}

async function getIsAuthorized(): Promise<boolean> {
  try {
    await getMeServer();
    return true;
  } catch {
    return false;
  }
}

export default async function LocationPage({ params }: PageProps) {
  const { locationId } = await params;
  const [location, isAuthorized] = await Promise.all([
    getLocationById(locationId),
    getIsAuthorized(),
  ]);

  if (!location) {
    notFound();
  }

  const initialReviews = await getLocationFeedbacks(
    locationId,
    location.feedbacksId ?? []
  );

  return (
    <main className={styles.page}>
      <LocationDetailsClient
        location={location}
        locationId={locationId}
        isAuthenticated={isAuthorized}
        initialReviews={initialReviews}
      />
    </main>
  );
}
