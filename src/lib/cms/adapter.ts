export interface CMSAdapter {
  getProfile(): Promise<any>;
  getHeroSettings(): Promise<any>;
  getJourney(): Promise<any[]>;
  getProjects(): Promise<any[]>;
  getArticles(): Promise<any[]>;
  getStatistics(): Promise<any[]>;
  getFaqs(): Promise<any[]>;
}

export type CMSProvider = "Local" | "WordPress" | "Strapi" | "Payload" | "Sanity" | "Directus";
