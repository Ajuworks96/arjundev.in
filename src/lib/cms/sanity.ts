import { CMSAdapter } from "./adapter";

export class SanityAdapter implements CMSAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl || ""; // This is typically projectID.api.sanity.io
    this.apiKey = apiKey || "";
  }

  private async querySanity(groqQuery: string) {
    if (!this.apiUrl) return null;
    try {
      const url = `${this.apiUrl}/v2021-03-25/data/query/production?query=${encodeURIComponent(groqQuery)}`;
      const res = await fetch(url, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
        next: { revalidate: 3600 }
      });
      if (res.ok) {
        const json = await res.json();
        return json.result;
      }
      return null;
    } catch (e) {
      console.error("SanityAdapter error running query:", e);
      return null;
    }
  }

  async getProfile() {
    const data = await this.querySanity(`*[_type == "profile"][0]`);
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
    const data = await this.querySanity(`*[_type == "heroSettings"][0]`);
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
    const data = await this.querySanity(`*[_type == "milestone"] | order(orderIndex asc)`);
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item._id,
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
    const data = await this.querySanity(`*[_type == "project"] | order(createdAt desc)`);
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item._id,
        title: item.title,
        slug: item.slug?.current || item.slug,
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
    const data = await this.querySanity(`*[_type == "article" && draft == false] | order(publishedAt desc)`);
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item._id,
        title: item.title,
        slug: item.slug?.current || item.slug,
        content: item.content || "",
        tags: [],
        categories: [],
        draft: false,
        publishedAt: new Date(item.publishedAt || item._createdAt),
      }));
    }
    return [];
  }

  async getStatistics() {
    const data = await this.querySanity(`*[_type == "statistic"] | order(orderIndex asc)`);
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item._id,
        value: item.value || "",
        label: item.label || "",
        orderIndex: item.orderIndex || 0,
      }));
    }
    return [];
  }

  async getFaqs() {
    const data = await this.querySanity(`*[_type == "faq"] | order(orderIndex asc)`);
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: item._id,
        question: item.question,
        answer: item.answer || "",
        category: item.category || "",
        orderIndex: item.orderIndex || 0,
      }));
    }
    return [];
  }
}
