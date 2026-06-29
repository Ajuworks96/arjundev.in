import { CMSAdapter } from "./adapter";

export class StrapiAdapter implements CMSAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl || "";
    this.apiKey = apiKey || "";
  }

  private async fetchStrapi(endpoint: string) {
    if (!this.apiUrl) return null;
    try {
      const res = await fetch(`${this.apiUrl}/api/${endpoint}`, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
        next: { revalidate: 3600 }
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      return null;
    } catch (e) {
      console.error(`StrapiAdapter error fetching ${endpoint}:`, e);
      return null;
    }
  }

  async getProfile() {
    const data = await this.fetchStrapi("profile?populate=*");
    if (data && data.attributes) {
      const attr = data.attributes;
      return {
        name: attr.name || "Arjun",
        tagline: attr.tagline || "",
        about: attr.about || "",
        biography: attr.biography || "",
        journeyIntro: attr.journeyIntro || "",
        mission: attr.mission || "",
        vision: attr.vision || "",
        socialLinks: attr.socialLinks || {},
        availability: attr.availability || "",
        avatarUrl: attr.avatar?.data?.attributes?.url || "/arjun_photo.jpg",
        coverUrl: attr.cover?.data?.attributes?.url || "",
      };
    }
    return null;
  }

  async getHeroSettings() {
    const data = await this.fetchStrapi("hero-setting?populate=*");
    if (data && data.attributes) {
      const attr = data.attributes;
      return {
        headline: attr.headline || "Build Websites.",
        animatedText: attr.animatedText || "",
        subtitle: attr.subtitle || "",
        ctaPrimary: attr.ctaPrimary || "",
        ctaPrimaryUrl: attr.ctaPrimaryUrl || "",
        ctaSecondary: attr.ctaSecondary || "",
        ctaSecondaryUrl: attr.ctaSecondaryUrl || "",
        bgSettings: attr.bgSettings || {},
      };
    }
    return null;
  }

  async getJourney() {
    const data = await this.fetchStrapi("milestones?sort=orderIndex:asc");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        role: item.attributes.role,
        organization: item.attributes.organization || "",
        period: item.attributes.period || "",
        description: item.attributes.description || "",
        lessons: item.attributes.lessons || [],
        achievements: item.attributes.achievements || [],
        technologies: item.attributes.technologies || [],
        mindset: item.attributes.mindset || "",
        orderIndex: item.attributes.orderIndex || 0,
      }));
    }
    return [];
  }

  async getProjects() {
    const data = await this.fetchStrapi("projects?sort=createdAt:desc");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        title: item.attributes.title,
        slug: item.attributes.slug,
        category: item.attributes.category || "",
        client: item.attributes.client || "",
        role: item.attributes.role || "",
        duration: item.attributes.duration || "",
        technologies: item.attributes.technologies || [],
        problem: item.attributes.problem || "",
        result: item.attributes.result || "",
        githubUrl: item.attributes.githubUrl || "",
        liveUrl: item.attributes.liveUrl || "",
        featured: item.attributes.featured || false,
        status: item.attributes.status || "Draft",
      }));
    }
    return [];
  }

  async getArticles() {
    const data = await this.fetchStrapi("articles?filters[draft][$eq]=false&sort=publishedAt:desc");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        title: item.attributes.title,
        slug: item.attributes.slug,
        content: item.attributes.content,
        tags: [],
        categories: [],
        draft: false,
        publishedAt: new Date(item.attributes.publishedAt || item.attributes.createdAt),
      }));
    }
    return [];
  }

  async getStatistics() {
    const data = await this.fetchStrapi("statistics?sort=orderIndex:asc");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        value: item.attributes.value || "",
        label: item.attributes.label || "",
        orderIndex: item.attributes.orderIndex || 0,
      }));
    }
    return [];
  }

  async getFaqs() {
    const data = await this.fetchStrapi("faqs?sort=orderIndex:asc");
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item.id.toString(),
        question: item.attributes.question,
        answer: item.attributes.answer || "",
        category: item.attributes.category || "",
        orderIndex: item.attributes.orderIndex || 0,
      }));
    }
    return [];
  }
}
