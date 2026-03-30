import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL;

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ReviewRecord = {
  _id: string;
  userId?: { name?: string } | string;
  rating: number;
  comment: string;
};

function normalizeReviews(payload: unknown): ReviewRecord[] {
  if (Array.isArray(payload)) return payload as ReviewRecord[];

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as ReviewRecord[];
    if (Array.isArray(record.feedbacks)) return record.feedbacks as ReviewRecord[];
    if (Array.isArray(record.items)) return record.items as ReviewRecord[];
  }

  return [];
}

function normalizeReview(payload: unknown): ReviewRecord | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const candidate =
    (record.data as ReviewRecord | undefined) ??
    (record.feedback as ReviewRecord | undefined) ??
    (record.item as ReviewRecord | undefined) ??
    (payload as ReviewRecord);

  return candidate && typeof candidate === "object" && "_id" in candidate
    ? candidate
    : null;
}

async function fetchReviewsByLocationId(id: string) {
  const res = await fetch(`${API_URL}/locations/${id}/feedbacks`, {
    cache: "no-store",
  });

  const data = await res.text();

  if (!res.ok) {
    return { res, data, reviews: [] as ReviewRecord[] };
  }

  try {
    return { res, data, reviews: normalizeReviews(JSON.parse(data)) };
  } catch {
    return { res, data, reviews: [] as ReviewRecord[] };
  }
}

async function fetchReviewsByFeedbackIds(locationId: string) {
  const locationRes = await fetch(`${API_URL}/locations/${locationId}`, {
    cache: "no-store",
  });

  if (!locationRes.ok) return [];

  const locationJson = await locationRes.json();
  type LocationRecord = {
  feedbacksId?: string[];
  };

  const location: LocationRecord =
  (locationJson?.data as LocationRecord | undefined) ?? locationJson;
  const feedbackIds: string[] = Array.isArray(location?.feedbacksId)
  ? location.feedbacksId
  : [];

  if (feedbackIds.length === 0) return [];

  const reviews = await Promise.all(
    feedbackIds.map(async (feedbackId) => {
      const reviewRes = await fetch(`${API_URL}/feedbacks/${feedbackId}`, {
        cache: "no-store",
      });

      if (!reviewRes.ok) return null;

      try {
        const reviewJson = await reviewRes.json();
        return normalizeReview(reviewJson);
      } catch {
        return null;
      }
    })
  );

  return reviews.filter((review): review is ReviewRecord => review !== null);
}

export async function GET(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { res, data, reviews } = await fetchReviewsByLocationId(id);

  if (reviews.length === 0 && res.ok) {
    const fallbackReviews = await fetchReviewsByFeedbackIds(id);

    return NextResponse.json(fallbackReviews, {
      status: 200,
    });
  }

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await req.text();

  const res = await fetch(`${API_URL}/locations/${id}/feedbacks`, {
    method: "POST",
    headers: {
      "Content-Type": req.headers.get("Content-Type") ?? "application/json",
      Cookie: req.headers.get("cookie") ?? "",
    },
    body,
    cache: "no-store",
  });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  });
}
