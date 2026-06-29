import { db } from "../db";
import { CMSAdapter } from "./adapter";
import { LocalAdapter } from "./local";
import { WordPressAdapter } from "./wordpress";
import { StrapiAdapter } from "./strapi";
import { PayloadAdapter } from "./payload";
import { SanityAdapter } from "./sanity";
import { DirectusAdapter } from "./directus";

export async function getCMSAdapter(): Promise<CMSAdapter> {
  try {
    // Attempt to read active CMS config from local database
    const config = await db.cmsConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config) {
      return new LocalAdapter();
    }

    switch (config.provider) {
      case "WordPress":
        return new WordPressAdapter(config.apiUrl || "", config.apiKey || "");
      case "Strapi":
        return new StrapiAdapter(config.apiUrl || "", config.apiKey || "");
      case "Payload":
        return new PayloadAdapter(config.apiUrl || "", config.apiKey || "");
      case "Sanity":
        return new SanityAdapter(config.apiUrl || "", config.apiKey || "");
      case "Directus":
        return new DirectusAdapter(config.apiUrl || "", config.apiKey || "");
      case "Local":
      default:
        return new LocalAdapter();
    }
  } catch (e) {
    console.error("Failed to load active CMS configuration, falling back to LocalAdapter:", e);
    return new LocalAdapter();
  }
}
