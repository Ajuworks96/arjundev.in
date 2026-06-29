import { CMSAdapter } from "./adapter";

export class WordPressAdapter implements CMSAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl || "";
    this.apiKey = apiKey || "";
  }

  private async fetchWP(endpoint: string) {
    if (!this.apiUrl) return null;
    try {
      const res = await fetch(`${this.apiUrl}/wp-json/wp/v2/${endpoint}`, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
        next: { revalidate: 3600 } // ISR caching helper
      });
      if (res.ok) return await res.json();
      return null;
    } catch (e) {
      console.error(`WordPressAdapter error fetching ${endpoint}:`, e);
      return null;
    }
  }

  async getProfile() {
    const data = await this.fetchWP("pages?slug=profile");
    if (data && data[0]) {
      const acf = data[0].acf || {};
      return {
        name: acf.name || "Arjun",
        tagline: acf.tagline || "",
        about: acf.about || "",
        biography: acf.biography || "",
        journeyIntro: acf.journeyIntro || "",
        mission: acf.mission || "",
        vision: acf.vision || "",
        socialLinks: acf.socialLinks || {},
        availability: acf.availability || "",
        avatarUrl: acf.avatarUrl || "/arjun_photo.jpg",
        coverUrl: acf.coverUrl || "",
      };
    }
    return null;
  }

  async getHeroSettings() {
    const data = await this.fetchWP("pages?slug=hero");
    if (data && data[0]) {
      const acf = data[0].acf || {};
      return {
        headline: acf.headline || "Build Websites.",
        animatedText: acf.animatedText || "",
        subtitle: acf.subtitle || "",
        ctaPrimary: acf.ctaPrimary || "",
        ctaPrimaryUrl: acf.ctaPrimaryUrl || "",
        ctaSecondary: acf.ctaSecondary || "",
        ctaSecondaryUrl: acf.ctaSecondaryUrl || "",
        bgSettings: acf.bgSettings || {},
      };
    }
    return null;
  }

  async getJourney() {
    const data = await this.fetchWP("milestones");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        role: item.title.rendered,
        organization: item.acf?.organization || "",
        period: item.acf?.period || "",
        description: item.acf?.description || "",
        lessons: item.acf?.lessons || [],
        achievements: item.acf?.achievements || [],
        technologies: item.acf?.technologies || [],
        mindset: item.acf?.mindset || "",
        orderIndex: item.acf?.orderIndex || 0,
      }));
    }
    return [];
  }

  async getProjects() {
    const data = await this.fetchWP("projects");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title.rendered,
        slug: item.slug,
        category: item.acf?.category || "",
        client: item.acf?.client || "",
        role: item.acf?.role || "",
        duration: item.acf?.duration || "",
        technologies: item.acf?.technologies || [],
        problem: item.acf?.problem || "",
        result: item.acf?.result || "",
        githubUrl: item.acf?.githubUrl || "",
        liveUrl: item.acf?.liveUrl || "",
        featured: item.acf?.featured || false,
        status: item.status === "publish" ? "Published" : "Draft",
      }));
    }
    return [];
  }

  async getArticles() {
    const data = await this.fetchWP("posts");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title.rendered,
        slug: item.slug,
        content: item.content.rendered,
        tags: [],
        categories: [],
        draft: item.status !== "publish",
        publishedAt: new Date(item.date),
      }));
    }
    return [];
  }

  async getStatistics() {
    const data = await this.fetchWP("statistics");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        value: item.acf?.value || "",
        label: item.acf?.label || "",
        orderIndex: item.acf?.orderIndex || 0,
      }));
    }
    return [];
  }

  async getFaqs() {
    const data = await this.fetchWP("faqs");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        question: item.title.rendered,
        answer: item.acf?.answer || "",
        category: item.acf?.category || "",
        orderIndex: item.acf?.orderIndex || 0,
      }));
    }
    return [];
  }
}
