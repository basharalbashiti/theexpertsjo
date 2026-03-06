import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { sendContactNotification } from "./email";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import multer from "multer";
import path from "path";
import fs from "fs";

const PgSession = connectPg(session);

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      store: new PgSession({ pool, createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET || "theexperts-admin-secret-key-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
      },
    })
  );

  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadsDir, path.basename(req.path));
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    next();
  });

  app.get("/favicon.png", async (_req, res, next) => {
    try {
      const faviconEntry = await storage.getSiteImage("favicon");
      if (faviconEntry && faviconEntry.imageUrl) {
        const filePath = path.join(process.cwd(), faviconEntry.imageUrl);
        if (fs.existsSync(filePath)) {
          return res.sendFile(filePath);
        }
      }
    } catch (e) {}
    next();
  });

  app.get("/opengraph.png", async (_req, res, next) => {
    try {
      const ogEntry = await storage.getSiteImage("og_image");
      if (ogEntry && ogEntry.imageUrl) {
        const filePath = path.join(process.cwd(), ogEntry.imageUrl);
        if (fs.existsSync(filePath)) {
          return res.sendFile(filePath);
        }
      }
    } catch (e) {}
    next();
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.patch("/api/auth/password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await storage.updateUserPassword(user.id, hashed);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json({ id: user.id, username: user.username });
  });

  app.get("/api/content", async (_req, res) => {
    const content = await storage.getAllContent();
    res.json(content);
  });

  app.put("/api/content", requireAuth, async (req, res) => {
    try {
      const { contents } = req.body;
      if (!Array.isArray(contents)) {
        return res.status(400).json({ message: "Contents must be an array" });
      }
      await storage.bulkUpsertContent(contents);
      const allContent = await storage.getAllContent();
      res.json(allContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  app.put("/api/content/:key", requireAuth, async (req, res) => {
    try {
      const { valueEn, valueAr } = req.body;
      const result = await storage.upsertContent({
        key: req.params.key,
        valueEn: valueEn || "",
        valueAr: valueAr || "",
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  app.get("/api/partners", async (_req, res) => {
    const allPartners = await storage.getAllPartners();
    res.json(allPartners);
  });

  app.post("/api/partners", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      const partner = await storage.createPartner({ name, imageUrl });
      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: "Failed to create partner" });
    }
  });

  app.put("/api/partners/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates: any = {};
      if (req.body.name) updates.name = req.body.name;
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.removeImage === "true") updates.imageUrl = "";
      const partner = await storage.updatePartner(id, updates);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: "Failed to update partner" });
    }
  });

  app.delete("/api/partners/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePartner(id);
      if (!success) {
        return res.status(404).json({ message: "Partner not found" });
      }
      res.json({ message: "Partner deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete partner" });
    }
  });

  app.post("/api/upload", requireAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      res.json({ url: `/uploads/${req.file.filename}` });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.get("/api/catalog/categories", async (_req, res) => {
    const cats = await storage.getCategoriesForCatalog();
    res.json(cats);
  });

  app.get("/api/catalog/products", async (_req, res) => {
    const prods = await storage.getProductsForCatalog();
    res.json(prods);
  });

  app.get("/api/categories", async (req, res) => {
    const showAll = req.query.all === "true";
    if (showAll && req.session.userId) {
      const allCategories = await storage.getAllCategories();
      res.json(allCategories);
    } else {
      const visibleCategories = await storage.getVisibleCategories();
      res.json(visibleCategories);
    }
  });

  app.post("/api/categories", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const { nameEn, nameAr, slug, sortOrder } = req.body;
      if (!nameEn || !slug) {
        return res.status(400).json({ message: "Name and slug are required" });
      }
      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      const category = await storage.createCategory({
        nameEn,
        nameAr: nameAr || "",
        slug,
        imageUrl,
        sortOrder: parseInt(sortOrder) || 0,
      });
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates: any = {};
      if (req.body.nameEn) updates.nameEn = req.body.nameEn;
      if (req.body.nameAr !== undefined) updates.nameAr = req.body.nameAr;
      if (req.body.slug) updates.slug = req.body.slug;
      if (req.body.sortOrder !== undefined) updates.sortOrder = parseInt(req.body.sortOrder) || 0;
      if (req.body.visibility !== undefined) updates.visibility = req.body.visibility;
      if (req.body.visible !== undefined) updates.visible = req.body.visible === "true" || req.body.visible === true;
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.removeImage === "true") updates.imageUrl = "";
      const category = await storage.updateCategory(id, updates);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.patch("/api/categories/:id/visibility", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { visibility } = req.body;
      if (!["both", "products", "catalog", "hidden"].includes(visibility)) {
        return res.status(400).json({ message: "Invalid visibility value" });
      }
      const updated = await storage.updateCategory(id, { visibility, visible: visibility !== "hidden" });
      if (!updated) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update visibility" });
    }
  });

  app.get("/api/categories/slug/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.delete("/api/categories/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  app.get("/api/products", async (req, res) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;
    const all = req.query.all === "true";
    if (categoryId) {
      const prods = all ? await storage.getProductsByCategory(categoryId) : await storage.getVisibleProductsByCategory(categoryId);
      res.json(prods);
    } else {
      const prods = all ? await storage.getAllProducts() : await storage.getVisibleProducts();
      res.json(prods);
    }
  });

  app.post("/api/products", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const { nameEn, nameAr, descriptionEn, descriptionAr, categoryId, sortOrder, brand } = req.body;
      if (!nameEn || !categoryId) {
        return res.status(400).json({ message: "Name and category are required" });
      }
      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      const product = await storage.createProduct({
        nameEn,
        nameAr: nameAr || "",
        descriptionEn: descriptionEn || "",
        descriptionAr: descriptionAr || "",
        imageUrl,
        brand: brand || "",
        categoryId: parseInt(categoryId),
        sortOrder: parseInt(sortOrder) || 0,
      });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates: any = {};
      if (req.body.nameEn) updates.nameEn = req.body.nameEn;
      if (req.body.nameAr !== undefined) updates.nameAr = req.body.nameAr;
      if (req.body.descriptionEn !== undefined) updates.descriptionEn = req.body.descriptionEn;
      if (req.body.descriptionAr !== undefined) updates.descriptionAr = req.body.descriptionAr;
      if (req.body.categoryId) updates.categoryId = parseInt(req.body.categoryId);
      if (req.body.sortOrder !== undefined) updates.sortOrder = parseInt(req.body.sortOrder) || 0;
      if (req.body.brand !== undefined) updates.brand = req.body.brand;
      if (req.body.visibility !== undefined) updates.visibility = req.body.visibility;
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.removeImage === "true") updates.imageUrl = "";
      const product = await storage.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.patch("/api/products/:id/visibility", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { visibility } = req.body;
      if (!["both", "products", "catalog", "hidden"].includes(visibility)) {
        return res.status(400).json({ message: "Invalid visibility value" });
      }
      const updated = await storage.updateProduct(id, { visibility, visible: visibility !== "hidden" });
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update visibility" });
    }
  });

  app.get("/api/products/:id/images", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const images = await storage.getProductImages(id);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product images" });
    }
  });

  app.post("/api/products/:id/images", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const existing = await storage.getProductImages(productId);
      if (existing.length >= 4) {
        return res.status(400).json({ message: "Maximum 4 images per product" });
      }
      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.imageUrl) {
        imageUrl = req.body.imageUrl;
      }
      if (!imageUrl) {
        return res.status(400).json({ message: "Image is required" });
      }
      const sortOrder = req.body.sortOrder ? parseInt(req.body.sortOrder) : existing.length;
      const image = await storage.addProductImage({ productId, imageUrl, sortOrder });
      res.json(image);
    } catch (error) {
      res.status(500).json({ message: "Failed to add product image" });
    }
  });

  app.delete("/api/product-images/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProductImage(id);
      if (!success) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.json({ message: "Image deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // Site images routes
  app.get("/api/site-images", async (_req, res) => {
    const images = await storage.getAllSiteImages();
    res.json(images);
  });

  app.put("/api/site-images/:key", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const allowedKeys = [
        "hero1", "hero2", "hero3", "hero4", "logo", "favicon", "og_image",
        "products_banner", "contact_banner",
        "about_banner", "about_mission", "about_vision", "about_chairman",
        "partners_banner", "partners_cta",
        "sustainability_banner", "sustainability_practices",
        "category_banner",
        "room_service_banner", "room_service_items",
      ];
      const key = req.params.key;
      if (!allowedKeys.includes(key)) {
        return res.status(400).json({ message: "Invalid image key. Allowed: " + allowedKeys.join(", ") });
      }
      let imageUrl = req.body.imageUrl || "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      if (!imageUrl) {
        return res.status(400).json({ message: "Image is required" });
      }
      const result = await storage.upsertSiteImage({
        key,
        imageUrl,
        label: req.body.label || key,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update site image" });
    }
  });

  app.delete("/api/site-images/:key", requireAuth, async (req, res) => {
    try {
      const key = req.params.key;
      await storage.upsertSiteImage({ key, imageUrl: "", label: "" });
      res.json({ message: "Image removed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove image" });
    }
  });

  // Brands routes
  app.get("/api/brands", async (_req, res) => {
    const allBrands = await storage.getAllBrands();
    res.json(allBrands);
  });

  app.post("/api/brands", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      const brand = await storage.createBrand({ name, imageUrl });
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  app.put("/api/brands/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates: any = {};
      if (req.body.name) updates.name = req.body.name;
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.removeImage === "true") updates.imageUrl = "";
      const brand = await storage.updateBrand(id, updates);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to update brand" });
    }
  });

  app.delete("/api/brands/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBrand(id);
      if (!success) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json({ message: "Brand deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  app.get("/api/clients", async (_req, res) => {
    const allClients = await storage.getAllClients();
    res.json(allClients);
  });

  app.post("/api/clients", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      const client = await storage.createClient({ name, imageUrl });
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates: any = {};
      if (req.body.name) updates.name = req.body.name;
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.removeImage === "true") updates.imageUrl = "";
      const client = await storage.updateClient(id, updates);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteClient(id);
      if (!success) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json({ message: "Client deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  app.get("/api/leadership", async (req, res) => {
    const showAll = req.query.all === "true";
    if (showAll && req.session.userId) {
      const leaders = await storage.getAllLeadership();
      res.json(leaders);
    } else {
      const leaders = await storage.getVisibleLeadership();
      res.json(leaders);
    }
  });

  app.post("/api/leadership", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const { nameEn, nameAr, roleEn, roleAr, phone, email, sortOrder } = req.body;
      if (!nameEn || !roleEn) {
        return res.status(400).json({ message: "Name and role are required" });
      }
      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      const leader = await storage.createLeader({
        nameEn,
        nameAr: nameAr || "",
        roleEn,
        roleAr: roleAr || "",
        phone: phone || "",
        email: email || "",
        imageUrl,
        sortOrder: parseInt(sortOrder) || 0,
      });
      res.json(leader);
    } catch (error) {
      res.status(500).json({ message: "Failed to create leader" });
    }
  });

  app.put("/api/leadership/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates: any = {};
      if (req.body.nameEn !== undefined) updates.nameEn = req.body.nameEn;
      if (req.body.nameAr !== undefined) updates.nameAr = req.body.nameAr;
      if (req.body.roleEn !== undefined) updates.roleEn = req.body.roleEn;
      if (req.body.roleAr !== undefined) updates.roleAr = req.body.roleAr;
      if (req.body.phone !== undefined) updates.phone = req.body.phone;
      if (req.body.email !== undefined) updates.email = req.body.email;
      if (req.body.sortOrder !== undefined) updates.sortOrder = parseInt(req.body.sortOrder) || 0;
      if (req.body.visible !== undefined) updates.visible = req.body.visible === "true" || req.body.visible === true;
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.removeImage === "true") updates.imageUrl = "";
      const leader = await storage.updateLeader(id, updates);
      if (!leader) {
        return res.status(404).json({ message: "Leader not found" });
      }
      res.json(leader);
    } catch (error) {
      res.status(500).json({ message: "Failed to update leader" });
    }
  });

  app.delete("/api/leadership/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLeader(id);
      if (!success) {
        return res.status(404).json({ message: "Leader not found" });
      }
      res.json({ message: "Leader deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete leader" });
    }
  });

  // Key Contacts routes
  app.get("/api/key-contacts", async (req, res) => {
    const showAll = req.query.all === "true";
    if (showAll && req.session.userId) {
      const contacts = await storage.getAllKeyContacts();
      res.json(contacts);
    } else {
      const contacts = await storage.getVisibleKeyContacts();
      res.json(contacts);
    }
  });

  app.post("/api/key-contacts", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const { nameEn, nameAr, roleEn, roleAr, phone, email, sortOrder } = req.body;
      if (!nameEn || !roleEn) {
        return res.status(400).json({ message: "Name and role are required" });
      }
      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
      const contact = await storage.createKeyContact({
        nameEn,
        nameAr: nameAr || "",
        roleEn,
        roleAr: roleAr || "",
        phone: phone || "",
        email: email || "",
        imageUrl,
        sortOrder: parseInt(sortOrder) || 0,
      });
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to create key contact" });
    }
  });

  app.put("/api/key-contacts/:id", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates: any = {};
      if (req.body.nameEn !== undefined) updates.nameEn = req.body.nameEn;
      if (req.body.nameAr !== undefined) updates.nameAr = req.body.nameAr;
      if (req.body.roleEn !== undefined) updates.roleEn = req.body.roleEn;
      if (req.body.roleAr !== undefined) updates.roleAr = req.body.roleAr;
      if (req.body.phone !== undefined) updates.phone = req.body.phone;
      if (req.body.email !== undefined) updates.email = req.body.email;
      if (req.body.sortOrder !== undefined) updates.sortOrder = parseInt(req.body.sortOrder) || 0;
      if (req.body.visible !== undefined) updates.visible = req.body.visible === "true" || req.body.visible === true;
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
      else if (req.body.removeImage === "true") updates.imageUrl = "";
      const contact = await storage.updateKeyContact(id, updates);
      if (!contact) {
        return res.status(404).json({ message: "Key contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to update key contact" });
    }
  });

  app.delete("/api/key-contacts/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteKeyContact(id);
      if (!success) {
        return res.status(404).json({ message: "Key contact not found" });
      }
      res.json({ message: "Key contact deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete key contact" });
    }
  });

  // Quick Links routes
  app.get("/api/quick-links", async (req, res) => {
    const showAll = req.query.all === "true";
    if (showAll && req.session.userId) {
      const links = await storage.getAllQuickLinks();
      res.json(links);
    } else {
      const links = await storage.getVisibleQuickLinks();
      res.json(links);
    }
  });

  app.post("/api/quick-links", requireAuth, async (req, res) => {
    try {
      const { labelEn, labelAr, url, sortOrder, visible } = req.body;
      if (!labelEn || !url) {
        return res.status(400).json({ message: "Label and URL are required" });
      }
      const link = await storage.createQuickLink({
        labelEn,
        labelAr: labelAr || "",
        url,
        sortOrder: parseInt(sortOrder) || 0,
        visible: visible !== false,
      });
      res.json(link);
    } catch (error) {
      res.status(500).json({ message: "Failed to create quick link" });
    }
  });

  app.put("/api/quick-links/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates: any = {};
      if (req.body.labelEn !== undefined) updates.labelEn = req.body.labelEn;
      if (req.body.labelAr !== undefined) updates.labelAr = req.body.labelAr;
      if (req.body.url !== undefined) updates.url = req.body.url;
      if (req.body.sortOrder !== undefined) updates.sortOrder = parseInt(req.body.sortOrder) || 0;
      if (req.body.visible !== undefined) updates.visible = req.body.visible === true || req.body.visible === "true";
      const link = await storage.updateQuickLink(id, updates);
      if (!link) {
        return res.status(404).json({ message: "Quick link not found" });
      }
      res.json(link);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quick link" });
    }
  });

  app.patch("/api/quick-links/:id/toggle-visibility", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const link = await storage.getQuickLink(id);
      if (!link) {
        return res.status(404).json({ message: "Quick link not found" });
      }
      const updated = await storage.updateQuickLink(id, { visible: !link.visible });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle visibility" });
    }
  });

  app.delete("/api/quick-links/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteQuickLink(id);
      if (!success) {
        return res.status(404).json({ message: "Quick link not found" });
      }
      res.json({ message: "Quick link deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete quick link" });
    }
  });

  // Contact Messages (public: create only; admin: read/delete)
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const parsed = insertContactMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Name, email, and message are required" });
      }
      const msg = await storage.createContactMessage(parsed.data);
      sendContactNotification({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || "",
        message: parsed.data.message,
      }).catch(() => {});
      res.status(201).json(msg);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/contact-messages", requireAuth, async (_req: Request, res: Response) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/contact-messages/unread-count", requireAuth, async (_req: Request, res: Response) => {
    try {
      const count = await storage.getUnreadMessageCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  app.get("/api/contact-messages/trash", requireAuth, async (_req: Request, res: Response) => {
    try {
      await storage.purgeExpiredMessages(30);
      const messages = await storage.getDeletedContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trash" });
    }
  });

  app.patch("/api/contact-messages/:id/read", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { read } = req.body;
      const msg = await storage.markContactMessageRead(id, read !== false);
      if (!msg) return res.status(404).json({ message: "Message not found" });
      res.json(msg);
    } catch (error) {
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  app.delete("/api/contact-messages/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const msg = await storage.softDeleteContactMessage(id);
      if (!msg) return res.status(404).json({ message: "Message not found" });
      res.json({ message: "Message moved to trash" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  app.patch("/api/contact-messages/:id/restore", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const msg = await storage.restoreContactMessage(id);
      if (!msg) return res.status(404).json({ message: "Message not found" });
      res.json(msg);
    } catch (error) {
      res.status(500).json({ message: "Failed to restore message" });
    }
  });

  app.delete("/api/contact-messages/:id/permanent", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.permanentDeleteContactMessage(id);
      if (!success) return res.status(404).json({ message: "Message not found" });
      res.json({ message: "Message permanently deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to permanently delete message" });
    }
  });

  app.get("/api/seo", async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getAllSeoSettings();
      const map: Record<string, string> = {};
      for (const s of settings) {
        map[s.key] = s.value;
      }
      res.json(map);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SEO settings" });
    }
  });

  app.put("/api/seo", requireAuth, async (req: Request, res: Response) => {
    try {
      const { key, value } = req.body;
      if (!key || typeof key !== "string") {
        return res.status(400).json({ message: "Key is required" });
      }
      const result = await storage.upsertSeoSetting({ key, value: value || "" });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update SEO setting" });
    }
  });

  app.put("/api/seo/bulk", requireAuth, async (req: Request, res: Response) => {
    try {
      const { settings } = req.body;
      if (!Array.isArray(settings)) {
        return res.status(400).json({ message: "Settings array is required" });
      }
      await storage.bulkUpsertSeoSettings(settings);
      const all = await storage.getAllSeoSettings();
      const map: Record<string, string> = {};
      for (const s of all) {
        map[s.key] = s.value;
      }
      res.json(map);
    } catch (error) {
      res.status(500).json({ message: "Failed to update SEO settings" });
    }
  });

  const DEFAULT_SITE_URL = "https://theexpertsjo.com";

  async function getSeoMap(): Promise<Record<string, string>> {
    const settings = await storage.getAllSeoSettings();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  }

  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const seo = await getSeoMap();
      const siteUrl = seo.sitemap_base_url || DEFAULT_SITE_URL;
      const visibleCategories = await storage.getCategoriesForProducts();

      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/about-us", priority: "0.8", changefreq: "monthly" },
        { url: "/categories", priority: "0.9", changefreq: "weekly" },
        { url: "/contact", priority: "0.7", changefreq: "monthly" },
        { url: "/partners", priority: "0.7", changefreq: "monthly" },
        { url: "/sustainability", priority: "0.6", changefreq: "monthly" },
      ];

      const today = new Date().toISOString().split("T")[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const page of staticPages) {
        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}${page.url}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
      }

      for (const cat of visibleCategories) {
        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/categories/${cat.slug}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;

      res.set("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", async (_req: Request, res: Response) => {
    try {
      const seo = await getSeoMap();
      const siteUrl = seo.sitemap_base_url || DEFAULT_SITE_URL;
      const allowAll = seo.robots_allow_all !== "false";
      const directive = allowAll ? "Allow: /" : "Disallow: /";
      const robots = `User-agent: *\n${directive}\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
      res.set("Content-Type", "text/plain");
      res.send(robots);
    } catch (error) {
      res.status(500).send("Error generating robots.txt");
    }
  });

  const trackingRateLimit = new Map<string, number>();
  setInterval(() => trackingRateLimit.clear(), 60000);

  function parseUserAgent(ua: string) {
    let device = "desktop";
    if (/mobile|android|iphone|ipad|ipod/i.test(ua)) {
      device = /ipad|tablet/i.test(ua) ? "tablet" : "mobile";
    }

    let browser = "Other";
    if (/edg\//i.test(ua)) browser = "Edge";
    else if (/opr\//i.test(ua) || /opera/i.test(ua)) browser = "Opera";
    else if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
    else if (/firefox/i.test(ua)) browser = "Firefox";
    else if (/msie|trident/i.test(ua)) browser = "IE";

    let os = "Other";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/mac os|macintosh/i.test(ua)) os = "macOS";
    else if (/linux/i.test(ua) && !/android/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";

    return { device, browser, os };
  }

  app.post("/api/analytics/track", async (req: Request, res: Response) => {
    try {
      const { path: pagePath, referrer, sessionId } = req.body;
      if (!pagePath || !sessionId) {
        return res.status(400).json({ message: "Missing path or sessionId" });
      }

      const ip = req.ip || req.socket.remoteAddress || "unknown";
      const key = `${ip}_${sessionId}`;
      const now = Date.now();
      const lastTrack = trackingRateLimit.get(key) || 0;
      if (now - lastTrack < 1000) {
        return res.status(429).json({ message: "Too many requests" });
      }
      trackingRateLimit.set(key, now);

      const ua = req.headers["user-agent"] || "";
      const { device, browser, os } = parseUserAgent(ua);

      await storage.recordPageView({
        sessionId,
        path: pagePath,
        referrer: referrer || "",
        userAgent: ua,
        device,
        browser,
        os,
      });

      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to track" });
    }
  });

  app.get("/api/analytics/stats", requireAuth, async (req: Request, res: Response) => {
    try {
      const period = (req.query.period as string) || "7d";
      const now = new Date();
      let startDate = new Date();

      switch (period) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "7d":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(now.getDate() - 90);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      const stats = await storage.getAnalyticsStats(startDate, now);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/realtime", requireAuth, async (_req: Request, res: Response) => {
    try {
      const count = await storage.getRealtimeVisitors(5);
      res.json({ visitors: count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch realtime data" });
    }
  });

  return httpServer;
}
