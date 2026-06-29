import { CMSAdapter } from "./adapter";

export class PayloadAdapter implements CMSAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl || "";
    this.apiKey = apiKey || "";
  }

  private async fetchPayload(endpoint: string) {
    if (!this.apiUrl) return null;
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (this.apiKey) {
        headers["Authorization"] = `users API-Key ${this.apiKey}`;
      }
      const res = await fetch(`${this.apiUrl}/api/${endpoint}`, {
        headers,
        next: { revalidate: 3600 }
      });
      if (res.ok) {
        const json = await res.json();
        return json.docs || json;
      }
      return null;
    } catch (e) {
      console.error(`PayloadAdapter error fetching ${endpoint}:`, e);
      return null;
    }
  }

  async getProfile() {
    const data = await this.fetchPayload("globals/profile");
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
        avatarUrl: data.avatar?.url || "/arjun_photo.jpg",
        coverUrl: data.cover?.url || "",
      };
    }
    return null;
  }

  async getHeroSettings() {
    const data = await this.fetchPayload("globals/hero");
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
    const data = await this.fetchPayload("milestones?sort=orderIndex");
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
    const data = await this.fetchPayload("projects?sort=-createdAt");
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
    const data = await this.fetchPayload("articles?where[draft][equals]=false&sort=-publishedAt");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        slug: item.slug,
        content: item.content,
        tags: [],
        categories: [],
        draft: false,
        publishedAt: new Date(item.publishedAt || item.createdAt),
      }));
    }
    return [];
  }

  async getStatistics() {
    const data = await this.fetchPayload("statistics?sort=orderIndex");
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
    const data = await this.fetchPayload("faqs?sort=orderIndex");
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
