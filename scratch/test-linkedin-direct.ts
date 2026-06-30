async function test() {
  const url = "https://www.linkedin.com/in/arjunworks96/recent-activity/shares/";
  console.log(`Directly fetching: ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1"
      }
    });

    console.log(`Response Status: ${res.status}`);
    const text = await res.text();
    console.log(`HTML Length: ${text.length}`);
    
    // Look for posts inside the public HTML
    if (text.includes("arjunworks96") || text.includes("activity")) {
      console.log("SUCCESS! Got profile activity page.");
      // check if we have post contents
      const postMatches = text.match(/<p class="[^"]*break-words[^"]*">([\s\S]*?)<\/p>/g);
      if (postMatches) {
        console.log(`Found ${postMatches.length} posts!`);
        console.log("Sample post:", postMatches[0]);
      } else {
        console.log("No posts found in HTML. Inspecting body...");
        console.log(text.slice(0, 1000));
      }
    } else {
      console.log("Failed to load actual page. Might be authwall.");
      console.log(text.slice(0, 1000));
    }
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

test();
