import { CMSAdapter } from "./adapter";

export class DirectusAdapter implements CMSAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl || "";
    this.apiKey = apiKey || "";
  }

  private async fetchDirectus(endpoint: string) {
    if (!this.apiUrl) return null;
    try {
      const url = `${this.apiUrl}/items/${endpoint}`;
      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers["Authorization"] = `Bearer ${this.apiKey}`;
      }
      const res = await fetch(url, {
        headers,
        next: { revalidate: 3600 }
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch (e) {
      console.error(`DirectusAdapter error fetching ${endpoint}:`, e);
      return null;
    }
  }

  async getProfile() {
    const data = await this.fetchDirectus("profile");
    if (data) {
      return {
        name: data.name || "Arjun",
        tagline: data.tagline || "",
        about: data.about || "",
        biography: data.biography || "",
        journeyIntro: data.journeyIntro || "",
        mission: data.mission || "",
        vision: data.vision || "",
        socialLinks: data.socialLinks || {},
        availability: data.availability || "",
        avatarUrl: data.avatarUrl || "/arjun_photo.jpg",
        coverUrl: data.coverUrl || "",
      };
    }
    return null;
  }

  async getHeroSettings() {
    const data = await this.fetchDirectus("hero");
    if (data) {
      return {
        headline: data.headline || "Build Websites.",
        animatedText: data.animatedText || "",
        subtitle: data.subtitle || "",
        ctaPrimary: data.ctaPrimary || "",
        ctaPrimaryUrl: data.ctaPrimaryUrl || "",
        ctaSecondary: data.ctaSecondary || "",
        ctaSecondaryUrl: data.ctaSecondaryUrl || "",
        bgSettings: data.bgSettings || {},
      };
    }
    return null;
  }

  async getJourney() {
    const data = await this.fetchDirectus("milestones?sort=orderIndex");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        role: item.role,
        organization: item.organization || "",
        period: item.period || "",
        description: item.description || "",
        lessons: item.lessons || [],
        achievements: item.achievements || [],
        technologies: item.technologies || [],
        mindset: item.mindset || "",
        orderIndex: item.orderIndex || 0,
      }));
    }
    return [];
  }

  async getProjects() {
    const data = await this.fetchDirectus("projects?sort=-createdAt");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        slug: item.slug,
        category: item.category || "",
        client: item.client || "",
        role: item.role || "",
        duration: item.duration || "",
        technologies: item.technologies || [],
        problem: item.problem || "",
        result: item.result || "",
        githubUrl: item.githubUrl || "",
        liveUrl: item.liveUrl || "",
        featured: item.featured || false,
        status: item.status || "Draft",
      }));
    }
    return [];
  }

  async getArticles() {
    const data = await this.fetchDirectus("articles?filter[status][_eq]=published&sort=-publishedAt");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        slug: item.slug,
        content: item.content,
        tags: [],
        categories: [],
        draft: false,
        publishedAt: new Date(item.publishedAt || item.date_created),
      }));
    }
    return [];
  }

  async getStatistics() {
    const data = await this.fetchDirectus("statistics?sort=orderIndex");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        value: item.value || "",
        label: item.label || "",
        orderIndex: item.orderIndex || 0,
      }));
    }
    return [];
  }

  async getFaqs() {
    const data = await this.fetchDirectus("faqs?sort=orderIndex");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        question: item.question,
        answer: item.answer || "",
        category: item.category || "",
        orderIndex: item.orderIndex || 0,
      }));
    }
    return [];
  }
}
