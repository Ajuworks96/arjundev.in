import { db } from "../src/lib/db";

async function main() {
  const config = await db.cmsConfig.findUnique({
    where: { id: "singleton" }
  });
  console.log("Current DB Config:", JSON.stringify(config, null, 2));
}

main().catch(console.error);
