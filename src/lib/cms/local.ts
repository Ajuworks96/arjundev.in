import { db } from "../db";
import { CMSAdapter } from "./adapter";

export class LocalAdapter implements CMSAdapter {
  async getProfile() {
    try {
      const profile = await db.profile.findUnique({ where: { id: "singleton" } });
      return profile || null;
    } catch (e) {
      console.error("LocalAdapter error fetching profile:", e);
      return null;
    }
  }

  async getHeroSettings() {
    try {
      const hero = await db.heroSettings.findUnique({ where: { id: "singleton" } });
      return hero || null;
    } catch (e) {
      console.error("LocalAdapter error fetching hero settings:", e);
      return null;
    }
  }

  async getJourney() {
    try {
      return await db.milestone.findMany({
        orderBy: { orderIndex: "asc" },
      });
    } catch (e) {
      console.error("LocalAdapter error fetching journey:", e);
      return [];
    }
  }

  async getProjects() {
    try {
      return await db.project.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.error("LocalAdapter error fetching projects:", e);
      return [];
    }
  }

  async getArticles() {
    try {
      return await db.article.findMany({
        where: { draft: false },
        orderBy: { publishedAt: "desc" },
      });
    } catch (e) {
      console.error("LocalAdapter error fetching articles:", e);
      return [];
    }
  }

  async getStatistics() {
    try {
      return await db.statistic.findMany({
        orderBy: { orderIndex: "asc" },
      });
    } catch (e) {
      console.error("LocalAdapter error fetching statistics:", e);
      return [];
    }
  }

  async getFaqs() {
    try {
      return await db.faq.findMany({
        orderBy: { orderIndex: "asc" },
      });
    } catch (e) {
      console.error("LocalAdapter error fetching FAQs:", e);
      return [];
    }
  }
}
