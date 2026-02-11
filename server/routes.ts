import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
      const contentKey = `cat_${slug.replace(/-/g, "_")}`;
      await storage.upsertContent({
        key: contentKey,
        valueEn: nameEn,
        valueAr: nameAr || "",
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
      if (req.body.visible !== undefined) updates.visible = req.body.visible === "true" || req.body.visible === true;
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
      const category = await storage.updateCategory(id, updates);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      if (category.slug && (updates.nameEn || updates.nameAr)) {
        const contentKey = `cat_${category.slug.replace(/-/g, "_")}`;
        await storage.upsertContent({
          key: contentKey,
          valueEn: category.nameEn,
          valueAr: category.nameAr,
        });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.patch("/api/categories/:id/toggle-visibility", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const updated = await storage.updateCategory(id, { visible: !category.visible });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle visibility" });
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
    if (categoryId) {
      const prods = await storage.getProductsByCategory(categoryId);
      res.json(prods);
    } else {
      const prods = await storage.getAllProducts();
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
      if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;
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

  return httpServer;
}
