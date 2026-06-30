const username = "arjunworks96";

const instances = [
  `https://bridge.su/?action=display&bridge=LinkedIn&u=${username}&format=Mrss`,
  `https://rss-bridge.org/bridge01/?action=display&bridge=LinkedIn&u=${username}&format=Mrss`,
  `https://bridge.scy.dev/?action=display&bridge=LinkedIn&u=${username}&format=Mrss`,
];

async function test() {
  for (const url of instances) {
    console.log(`Testing instance: ${url}`);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      if (res.ok && text.includes("<item>")) {
        console.log("SUCCESS! Found items!");
        console.log(text.slice(0, 1000));
        return;
      } else {
        console.log(`Failed. Output length: ${text.length}. Sample: ${text.slice(0, 200)}`);
      }
    } catch (e) {
      console.error(`Error:`, e);
    }
  }
  console.log("All instances failed.");
}

test();
