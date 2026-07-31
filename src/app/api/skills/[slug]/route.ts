import { env } from "~/env";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

type ClawHubDetailResponse = {
  owner?: {
    handle?: string;
  };
  skill?: {
    description?: string | null;
  };
};

type AmbiguousSkillResponse = {
  code?: string;
  matches?: Array<{
    ownerHandle?: string;
    url?: string;
  }>;
};

const CACHE_SECONDS = 3600;

function fetchClawHub(url: URL, slug: string) {
  return fetch(url, {
    headers: {
      Accept: "application/json",
      ...(env.CLAWHUB_API_TOKEN
        ? { Authorization: `Bearer ${env.CLAWHUB_API_TOKEN}` }
        : {}),
    },
    next: {
      revalidate: CACHE_SECONDS,
      tags: [`clawhub-skill:${slug}`],
    },
  });
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const detailUrl = new URL(
    `https://clawhub.ai/api/v1/skills/${encodeURIComponent(slug)}`,
  );
  let clawHubUrl: string | undefined;

  try {
    let response = await fetchClawHub(detailUrl, slug);

    if (response.status === 409) {
      const ambiguous = (await response.json()) as AmbiguousSkillResponse;
      const match = ambiguous.matches?.[0];

      if (ambiguous.code !== "AMBIGUOUS_SKILL_SLUG" || !match?.ownerHandle) {
        throw new Error("ClawHub skill owner unavailable");
      }

      detailUrl.searchParams.set("owner", match.ownerHandle);
      clawHubUrl = match.url;
      response = await fetchClawHub(detailUrl, slug);
    }

    if (!response.ok) {
      throw new Error(`ClawHub detail returned ${response.status}`);
    }

    const detail = (await response.json()) as ClawHubDetailResponse;
    const ownerHandle = detail.owner?.handle;

    if (!ownerHandle) {
      throw new Error("ClawHub skill owner unavailable");
    }

    return Response.json(
      {
        slug,
        ownerHandle,
        description: detail.skill?.description ?? undefined,
        clawHubUrl:
          clawHubUrl ??
          `https://clawhub.ai/${ownerHandle}/skills/${encodeURIComponent(slug)}`,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
        },
      },
    );
  } catch {
    return Response.json(
      { error: "暂时无法获取 Skill 详情" },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
