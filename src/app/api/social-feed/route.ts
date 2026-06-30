import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// Fallback curated feed items if APIs are not configured
const DEFAULT_FEED = [
  {
    id: "wp-tutorial",
    title: "How to Build a Custom WordPress Theme (OOP Boilerplate)",
    category: "YouTube",
    date: "May 15, 2026",
    duration: "42:15",
    url: "https://youtube.com",
    description: "An in-depth coding guide building a WordPress theme with modern PHP namespaces, separate view scripts, and custom tailwind setups."
  },
  {
    id: "cashier-mindset",
    title: "The Cashier to Developer Transition Mindset",
    category: "Reels",
    date: "Jun 02, 2026",
    duration: "0:58",
    url: "https://instagram.com/arjundev.in",
    description: "A short clip on how to manage cognitive fatigue, study effectively after long work shifts, and maintain consistency."
  },
  {
    id: "nextjs-shopify",
    title: "Speed Audits: Building a Headless Shopify Storefront",
    category: "YouTube",
    date: "Apr 29, 2026",
    duration: "28:40",
    url: "https://youtube.com",
    description: "Benchmarking standard liquid themes against custom next.js page setups, optimizing images, and syncing cart tokens."
  },
  {
    id: "wp-headless-talk",
    title: "WordPress in the Age of Headless Web & AI Engines",
    category: "Talks",
    date: "Mar 12, 2026",
    duration: "18:22",
    url: "https://youtube.com",
    description: "A conference talk examining how custom block structures and API layers keep WordPress competitive alongside modern JS frameworks."
  }
];

export async function GET() {
  try {
    const config = await db.cmsConfig.findUnique({
      where: { id: "singleton" }
    });

    if (!config) {
      return NextResponse.json(DEFAULT_FEED);
    }

    const aggregatedFeed: any[] = [];
    const promises: Promise<any>[] = [];

    // 1. YouTube Fetch Promise
    if (config.youtubeChannelId && config.youtubeApiKey) {
      promises.push(
        fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${config.youtubeChannelId}&maxResults=6&order=date&type=video&key=${config.youtubeApiKey}`,
          { next: { revalidate: 10 } } // Cache on server for 10 seconds
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.items) {
              const ytItems = data.items.map((item: any) => ({
                id: item.id?.videoId || item.id,
                title: item.snippet?.title || "YouTube Video",
                category: "YouTube",
                date: new Date(item.snippet?.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }),
                duration: "Video",
                url: `https://youtube.com/watch?v=${item.id?.videoId}`,
                description: item.snippet?.description || ""
              }));
              aggregatedFeed.push(...ytItems);
            }
          })
          .catch((err) => console.error("YouTube fetch error:", err))
      );
    }

    // 2. Instagram Fetch Promise
    if (config.instagramAccessToken) {
      promises.push(
        fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${config.instagramAccessToken}&limit=6`,
          { next: { revalidate: 10 } } // Cache on server for 10 seconds
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.data) {
              const igItems = data.data.map((item: any) => ({
                id: item.id,
                title: item.caption ? item.caption.split("\n")[0] : "Instagram Post",
                category: "Reels",
                date: new Date(item.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }),
                duration: item.media_type === "VIDEO" ? "Reel" : "Post",
                url: item.permalink,
                description: item.caption || ""
              }));
              aggregatedFeed.push(...igItems);
            }
          })
          .catch((err) => console.error("Instagram fetch error:", err))
      );
    }

    // Wait for all active API calls to settle (maximum 4s timeout)
    if (promises.length > 0) {
      await Promise.race([
        Promise.all(promises),
        new Promise((resolve) => setTimeout(resolve, 4000))
      ]);
    }

    // If both API feeds came back empty, fall back to Default seed items
    if (aggregatedFeed.length === 0) {
      return NextResponse.json(DEFAULT_FEED);
    }

    // Sort feed items chronologically (latest date first)
    aggregatedFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(aggregatedFeed);
  } catch (e) {
    console.error("Failed to aggregate dynamic social feed:", e);
    return NextResponse.json(DEFAULT_FEED);
  }
}
