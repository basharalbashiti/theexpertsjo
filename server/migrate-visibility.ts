import { db } from "./db";
import { categories, products } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function migrateVisibility() {
  const allCats = await db.select().from(categories);
  for (const cat of allCats) {
    if (cat.visible === false && cat.visibility === "both") {
      await db.update(categories).set({ visibility: "hidden" }).where(eq(categories.id, cat.id));
    }
  }

  const allProds = await db.select().from(products);
  for (const prod of allProds) {
    if (prod.visible === false && prod.visibility === "both") {
      await db.update(products).set({ visibility: "hidden" }).where(eq(products.id, prod.id));
    }
  }
}
