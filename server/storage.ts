import { users, siteContent, partners, type User, type InsertUser, type SiteContent, type InsertSiteContent, type Partner, type InsertPartner } from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllContent(): Promise<SiteContent[]>;
  getContent(key: string): Promise<SiteContent | undefined>;
  upsertContent(content: InsertSiteContent): Promise<SiteContent>;
  bulkUpsertContent(contents: InsertSiteContent[]): Promise<void>;

  getAllPartners(): Promise<Partner[]>;
  getPartner(id: number): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: number, partner: Partial<InsertPartner>): Promise<Partner | undefined>;
  deletePartner(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllContent(): Promise<SiteContent[]> {
    return db.select().from(siteContent);
  }

  async getContent(key: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return content || undefined;
  }

  async upsertContent(content: InsertSiteContent): Promise<SiteContent> {
    const [result] = await db
      .insert(siteContent)
      .values(content)
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { valueEn: content.valueEn, valueAr: content.valueAr },
      })
      .returning();
    return result;
  }

  async bulkUpsertContent(contents: InsertSiteContent[]): Promise<void> {
    for (const content of contents) {
      await this.upsertContent(content);
    }
  }

  async getAllPartners(): Promise<Partner[]> {
    return db.select().from(partners).orderBy(asc(partners.sortOrder));
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || undefined;
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const [result] = await db.insert(partners).values(partner).returning();
    return result;
  }

  async updatePartner(id: number, partner: Partial<InsertPartner>): Promise<Partner | undefined> {
    const [result] = await db.update(partners).set(partner).where(eq(partners.id, id)).returning();
    return result || undefined;
  }

  async deletePartner(id: number): Promise<boolean> {
    const result = await db.delete(partners).where(eq(partners.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
