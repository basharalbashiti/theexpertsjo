import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  valueEn: text("value_en").notNull().default(""),
  valueAr: text("value_ar").notNull().default(""),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).pick({
  key: true,
  valueEn: true,
  valueAr: true,
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  sortOrder: serial("sort_order"),
});

export const insertPartnerSchema = createInsertSchema(partners).pick({
  name: true,
  imageUrl: true,
});

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull().default(""),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  nameEn: true,
  nameAr: true,
  slug: true,
  imageUrl: true,
  sortOrder: true,
  visible: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  categoryId: integer("category_id").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertProductSchema = createInsertSchema(products).pick({
  nameEn: true,
  nameAr: true,
  descriptionEn: true,
  descriptionAr: true,
  imageUrl: true,
  categoryId: true,
  sortOrder: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  sortOrder: serial("sort_order"),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  imageUrl: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
