import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// Fallback curated feed items with default thumbnails
const DEFAULT_FEED = [
  {
    id: "wp-tutorial",
    title: "How to Build a Custom WordPress Theme (OOP Boilerplate)",
    category: "YouTube",
    date: "May 15, 2026",
    duration: "42:15",
    url: "https://youtube.com",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=640&q=80",
    description: "An in-depth coding guide building a WordPress theme with modern PHP namespaces, separate view scripts, and custom tailwind setups."
  },
  {
    id: "cashier-mindset",
    title: "The Cashier to Developer Transition Mindset",
    category: "Reels",
    date: "Jun 02, 2026",
    duration: "0:58",
    url: "https://instagram.com/arjundev.in",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=640&q=80",
    description: "A short clip on how to manage cognitive fatigue, study effectively after long work shifts, and maintain consistency."
  },
  {
    id: "nextjs-shopify",
    title: "Speed Audits: Building a Headless Shopify Storefront",
    category: "YouTube",
    date: "Apr 29, 2026",
    duration: "28:40",
    url: "https://youtube.com",
    thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=640&q=80",
    description: "Benchmarking standard liquid themes against custom next.js page setups, optimizing images, and syncing cart tokens."
  },
  {
    id: "wp-headless-talk",
    title: "WordPress in the Age of Headless Web & AI Engines",
    category: "Talks",
    date: "Mar 12, 2026",
    duration: "18:22",
    url: "https://youtube.com",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=640&q=80",
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
          { next: { revalidate: 10 } }
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
                thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || "",
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
          { next: { revalidate: 10 } }
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
                thumbnail: item.media_url || "",
                description: item.caption || ""
              }));
              aggregatedFeed.push(...igItems);
            }
          })
          .catch((err) => console.error("Instagram fetch error:", err))
      );
    }

    // 3. LinkedIn RSS Fetch Promise
    if (config.linkedinFeedUrl) {
      promises.push(
        fetch(config.linkedinFeedUrl, { next: { revalidate: 10 } })
          .then((res) => (res.ok ? res.text() : null))
          .then((xmlText) => {
            if (xmlText) {
              const items: any[] = [];
              const itemRegex = /<item>([\s\S]*?)<\/item>/g;
              let match;
              while ((match = itemRegex.exec(xmlText)) !== null) {
                const itemContent = match[1];
                const title = itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "LinkedIn Post";
                const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "https://linkedin.com";
                const desc = itemContent.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
                const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || new Date().toISOString();
                
                const cleanTitle = title.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
                const cleanDesc = desc.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]*>/g, "").trim();

                items.push({
                  id: link,
                  title: cleanTitle.length > 60 ? cleanTitle.slice(0, 60) + "..." : cleanTitle,
                  category: "LinkedIn",
                  date: new Date(pubDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }),
                  duration: "Post",
                  url: link,
                  thumbnail: "https://images.unsplash.com/photo-1579226905180-636b76d96082?auto=format&fit=crop&w=640&q=80", // LinkedIn placeholder background
                  description: cleanDesc.slice(0, 180) + (cleanDesc.length > 180 ? "..." : "")
                });
              }
              aggregatedFeed.push(...items.slice(0, 6));
            }
          })
          .catch((err) => console.error("LinkedIn RSS fetch error:", err))
      );
    }

    // 4. LinkedIn Database Curated Posts Fetch
    promises.push(
      db.linkedinPost.findMany({
        orderBy: { createdAt: "desc" },
        take: 10
      })
        .then((dbPosts) => {
          const formattedDbPosts = dbPosts.map((post) => ({
            id: post.id,
            title: post.title,
            category: "LinkedIn",
            date: post.date,
            duration: "Post",
            url: post.url,
            thumbnail: "https://images.unsplash.com/photo-1579226905180-636b76d96082?auto=format&fit=crop&w=640&q=80",
            description: post.description
          }));
          aggregatedFeed.push(...formattedDbPosts);
        })
        .catch((err) => console.error("Database LinkedIn fetch error:", err))
    );

    // Wait for active API calls to settle (maximum 4s timeout)
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
