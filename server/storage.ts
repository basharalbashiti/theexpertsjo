import { users, siteContent, partners, categories, products, productImages, brands, siteImages, clients, leadership, keyContacts, quickLinks, seoSettings, contactMessages, type User, type InsertUser, type SiteContent, type InsertSiteContent, type Partner, type InsertPartner, type Category, type InsertCategory, type Product, type InsertProduct, type ProductImage, type InsertProductImage, type Brand, type InsertBrand, type SiteImage, type InsertSiteImage, type Client, type InsertClient, type Leadership, type InsertLeadership, type KeyContact, type InsertKeyContact, type QuickLink, type InsertQuickLink, type SeoSetting, type InsertSeoSetting, type ContactMessage, type InsertContactMessage } from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc, isNull, isNotNull, lt, and } from "drizzle-orm";

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

  getAllCategories(): Promise<Category[]>;
  getVisibleCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  getAllProducts(): Promise<Product[]>;
  getVisibleProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getVisibleProductsByCategory(categoryId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  getProductImages(productId: number): Promise<ProductImage[]>;
  addProductImage(image: InsertProductImage): Promise<ProductImage>;
  deleteProductImage(id: number): Promise<boolean>;
  deleteProductImagesByProduct(productId: number): Promise<void>;

  getAllBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;

  getAllSiteImages(): Promise<SiteImage[]>;
  getSiteImage(key: string): Promise<SiteImage | undefined>;
  upsertSiteImage(image: InsertSiteImage): Promise<SiteImage>;

  getAllClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  getAllLeadership(): Promise<Leadership[]>;
  getVisibleLeadership(): Promise<Leadership[]>;
  getLeader(id: number): Promise<Leadership | undefined>;
  createLeader(leader: InsertLeadership): Promise<Leadership>;
  updateLeader(id: number, leader: Partial<InsertLeadership>): Promise<Leadership | undefined>;
  deleteLeader(id: number): Promise<boolean>;

  getAllKeyContacts(): Promise<KeyContact[]>;
  getVisibleKeyContacts(): Promise<KeyContact[]>;
  getKeyContact(id: number): Promise<KeyContact | undefined>;
  createKeyContact(contact: InsertKeyContact): Promise<KeyContact>;
  updateKeyContact(id: number, contact: Partial<InsertKeyContact>): Promise<KeyContact | undefined>;
  deleteKeyContact(id: number): Promise<boolean>;

  getAllQuickLinks(): Promise<QuickLink[]>;
  getVisibleQuickLinks(): Promise<QuickLink[]>;
  getQuickLink(id: number): Promise<QuickLink | undefined>;
  createQuickLink(link: InsertQuickLink): Promise<QuickLink>;
  updateQuickLink(id: number, link: Partial<InsertQuickLink>): Promise<QuickLink | undefined>;
  deleteQuickLink(id: number): Promise<boolean>;

  getAllSeoSettings(): Promise<SeoSetting[]>;
  getSeoSetting(key: string): Promise<SeoSetting | undefined>;
  upsertSeoSetting(setting: InsertSeoSetting): Promise<SeoSetting>;
  bulkUpsertSeoSettings(settings: InsertSeoSetting[]): Promise<void>;

  getAllContactMessages(): Promise<ContactMessage[]>;
  getDeletedContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageRead(id: number, read: boolean): Promise<ContactMessage | undefined>;
  softDeleteContactMessage(id: number): Promise<ContactMessage | undefined>;
  restoreContactMessage(id: number): Promise<ContactMessage | undefined>;
  permanentDeleteContactMessage(id: number): Promise<boolean>;
  purgeExpiredMessages(daysOld: number): Promise<number>;
  getUnreadMessageCount(): Promise<number>;
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

  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.sortOrder));
  }

  async getVisibleCategories(): Promise<Category[]> {
    return db.select().from(categories).where(eq(categories.visible, true)).orderBy(asc(categories.sortOrder));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [result] = await db.insert(categories).values(category).returning();
    return result;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [result] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return result || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    await db.delete(products).where(eq(products.categoryId, id));
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(asc(products.sortOrder));
  }

  async getVisibleProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.visible, true)).orderBy(asc(products.sortOrder));
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.categoryId, categoryId)).orderBy(asc(products.sortOrder));
  }

  async getVisibleProductsByCategory(categoryId: number): Promise<Product[]> {
    return db.select().from(products).where(and(eq(products.categoryId, categoryId), eq(products.visible, true))).orderBy(asc(products.sortOrder));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [result] = await db.insert(products).values(product).returning();
    return result;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [result] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    await db.delete(productImages).where(eq(productImages.productId, id));
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async getProductImages(productId: number): Promise<ProductImage[]> {
    return db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(asc(productImages.sortOrder));
  }

  async addProductImage(image: InsertProductImage): Promise<ProductImage> {
    const [result] = await db.insert(productImages).values(image).returning();
    return result;
  }

  async deleteProductImage(id: number): Promise<boolean> {
    const result = await db.delete(productImages).where(eq(productImages.id, id)).returning();
    return result.length > 0;
  }

  async deleteProductImagesByProduct(productId: number): Promise<void> {
    await db.delete(productImages).where(eq(productImages.productId, productId));
  }

  async getAllBrands(): Promise<Brand[]> {
    return db.select().from(brands).orderBy(asc(brands.sortOrder));
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    return brand || undefined;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [result] = await db.insert(brands).values(brand).returning();
    return result;
  }

  async updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    const [result] = await db.update(brands).set(brand).where(eq(brands.id, id)).returning();
    return result || undefined;
  }

  async deleteBrand(id: number): Promise<boolean> {
    const result = await db.delete(brands).where(eq(brands.id, id)).returning();
    return result.length > 0;
  }

  async getAllSiteImages(): Promise<SiteImage[]> {
    return db.select().from(siteImages);
  }

  async getSiteImage(key: string): Promise<SiteImage | undefined> {
    const [image] = await db.select().from(siteImages).where(eq(siteImages.key, key));
    return image || undefined;
  }

  async upsertSiteImage(image: InsertSiteImage): Promise<SiteImage> {
    const [result] = await db
      .insert(siteImages)
      .values(image)
      .onConflictDoUpdate({
        target: siteImages.key,
        set: { imageUrl: image.imageUrl, label: image.label },
      })
      .returning();
    return result;
  }

  async getAllClients(): Promise<Client[]> {
    return db.select().from(clients).orderBy(asc(clients.sortOrder));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [result] = await db.insert(clients).values(client).returning();
    return result;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const [result] = await db.update(clients).set(client).where(eq(clients.id, id)).returning();
    return result || undefined;
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id)).returning();
    return result.length > 0;
  }

  async getAllLeadership(): Promise<Leadership[]> {
    return db.select().from(leadership).orderBy(asc(leadership.sortOrder));
  }

  async getVisibleLeadership(): Promise<Leadership[]> {
    return db.select().from(leadership).where(eq(leadership.visible, true)).orderBy(asc(leadership.sortOrder));
  }

  async getLeader(id: number): Promise<Leadership | undefined> {
    const [leader] = await db.select().from(leadership).where(eq(leadership.id, id));
    return leader || undefined;
  }

  async createLeader(leader: InsertLeadership): Promise<Leadership> {
    const [result] = await db.insert(leadership).values(leader).returning();
    return result;
  }

  async updateLeader(id: number, leader: Partial<InsertLeadership>): Promise<Leadership | undefined> {
    const [result] = await db.update(leadership).set(leader).where(eq(leadership.id, id)).returning();
    return result || undefined;
  }

  async deleteLeader(id: number): Promise<boolean> {
    const result = await db.delete(leadership).where(eq(leadership.id, id)).returning();
    return result.length > 0;
  }

  async getAllKeyContacts(): Promise<KeyContact[]> {
    return db.select().from(keyContacts).orderBy(asc(keyContacts.sortOrder));
  }

  async getVisibleKeyContacts(): Promise<KeyContact[]> {
    return db.select().from(keyContacts).where(eq(keyContacts.visible, true)).orderBy(asc(keyContacts.sortOrder));
  }

  async getKeyContact(id: number): Promise<KeyContact | undefined> {
    const [contact] = await db.select().from(keyContacts).where(eq(keyContacts.id, id));
    return contact || undefined;
  }

  async createKeyContact(contact: InsertKeyContact): Promise<KeyContact> {
    const [result] = await db.insert(keyContacts).values(contact).returning();
    return result;
  }

  async updateKeyContact(id: number, contact: Partial<InsertKeyContact>): Promise<KeyContact | undefined> {
    const [result] = await db.update(keyContacts).set(contact).where(eq(keyContacts.id, id)).returning();
    return result || undefined;
  }

  async deleteKeyContact(id: number): Promise<boolean> {
    const result = await db.delete(keyContacts).where(eq(keyContacts.id, id)).returning();
    return result.length > 0;
  }

  async getAllQuickLinks(): Promise<QuickLink[]> {
    return db.select().from(quickLinks).orderBy(asc(quickLinks.sortOrder));
  }

  async getVisibleQuickLinks(): Promise<QuickLink[]> {
    return db.select().from(quickLinks).where(eq(quickLinks.visible, true)).orderBy(asc(quickLinks.sortOrder));
  }

  async getQuickLink(id: number): Promise<QuickLink | undefined> {
    const [link] = await db.select().from(quickLinks).where(eq(quickLinks.id, id));
    return link || undefined;
  }

  async createQuickLink(link: InsertQuickLink): Promise<QuickLink> {
    const [result] = await db.insert(quickLinks).values(link).returning();
    return result;
  }

  async updateQuickLink(id: number, link: Partial<InsertQuickLink>): Promise<QuickLink | undefined> {
    const [result] = await db.update(quickLinks).set(link).where(eq(quickLinks.id, id)).returning();
    return result || undefined;
  }

  async deleteQuickLink(id: number): Promise<boolean> {
    const result = await db.delete(quickLinks).where(eq(quickLinks.id, id)).returning();
    return result.length > 0;
  }

  async getAllSeoSettings(): Promise<SeoSetting[]> {
    return db.select().from(seoSettings);
  }

  async getSeoSetting(key: string): Promise<SeoSetting | undefined> {
    const [setting] = await db.select().from(seoSettings).where(eq(seoSettings.key, key));
    return setting || undefined;
  }

  async upsertSeoSetting(setting: InsertSeoSetting): Promise<SeoSetting> {
    const [result] = await db
      .insert(seoSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: seoSettings.key,
        set: { value: setting.value },
      })
      .returning();
    return result;
  }

  async bulkUpsertSeoSettings(settings: InsertSeoSetting[]): Promise<void> {
    for (const setting of settings) {
      await this.upsertSeoSetting(setting);
    }
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).where(isNull(contactMessages.deletedAt)).orderBy(desc(contactMessages.createdAt));
  }

  async getDeletedContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).where(isNotNull(contactMessages.deletedAt)).orderBy(desc(contactMessages.deletedAt));
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [msg] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return msg || undefined;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [result] = await db.insert(contactMessages).values(message).returning();
    return result;
  }

  async markContactMessageRead(id: number, read: boolean): Promise<ContactMessage | undefined> {
    const [result] = await db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id)).returning();
    return result || undefined;
  }

  async softDeleteContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [result] = await db.update(contactMessages).set({ deletedAt: new Date() }).where(eq(contactMessages.id, id)).returning();
    return result || undefined;
  }

  async restoreContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [result] = await db.update(contactMessages).set({ deletedAt: null }).where(eq(contactMessages.id, id)).returning();
    return result || undefined;
  }

  async permanentDeleteContactMessage(id: number): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return result.length > 0;
  }

  async purgeExpiredMessages(daysOld: number): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);
    const result = await db.delete(contactMessages).where(
      and(isNotNull(contactMessages.deletedAt), lt(contactMessages.deletedAt, cutoff))
    ).returning();
    return result.length;
  }

  async getUnreadMessageCount(): Promise<number> {
    const result = await db.select().from(contactMessages).where(and(eq(contactMessages.read, false), isNull(contactMessages.deletedAt)));
    return result.length;
  }
}

export const storage = new DatabaseStorage();
