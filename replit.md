# The Experts - Hospitality Supplies Catalog

## Overview
Bilingual (English/Arabic) hospitality supplies catalog website for "The Experts" with a luxury minimalist design. Features a full admin portal for managing site content, translations, partners, clients, product categories, and products.

## Recent Changes
- 2026-02-12: Added Site Images manager — admin can upload/change hero banners and site logo from dashboard
- 2026-02-11: Added "Our Brands" feature — new brands table, admin BrandManager, homepage logo slider uses brands
- 2026-02-11: Improved Site Content editor section grouping (items properly sorted into sections)
- 2026-02-11: Auto-sync category names to site content translations on create/edit
- 2026-02-11: Made category detail pages dynamic — all category slugs use CategoryDetail.tsx which fetches products from the API
- 2026-02-11: Added category visibility toggle (admin can hide/show categories from public site)
- 2026-02-11: Separated Partners (brand partners: Abdeen, Cashmere) from Clients (hotel brands: Four Seasons, Marriott, etc.)
- 2026-02-11: Added admin portal with authentication, content editor, category/product/partner/client/brand managers
- 2026-02-11: Added seed script for default admin user, translations, categories, partners, brands, clients, and products

## Project Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + wouter (routing)
- **Backend**: Express.js with session-based auth
- **Database**: PostgreSQL with Drizzle ORM
- **File Uploads**: Multer, stored in /uploads directory

### Key Directories
- `client/src/pages/` - Public-facing pages (Home, About, Products, Contact, etc.)
- `client/src/pages/admin/` - Admin portal pages (English-only)
- `client/src/components/` - Shared components (Layout, Navbar, Footer, Hero, etc.)
- `client/src/context/LanguageContext.tsx` - Bilingual translation system (loads from DB)
- `server/routes.ts` - API routes (auth, content, site-images, partners, brands, clients, categories, products, uploads)
- `server/storage.ts` - Database storage interface
- `server/seed.ts` - Database seeding (admin user + default translations + categories + partners + brands + clients + site images)
- `shared/schema.ts` - Drizzle schema (users, siteContent, siteImages, partners, brands, clients, categories, products)

### Database Tables
- `users` - Admin users (id, username, password)
- `site_content` - Bilingual translations (id, key, value_en, value_ar)
- `site_images` - Configurable site images like hero banners and logo (id, key, image_url, label)
- `partners` - Brand partners like Abdeen, Cashmere (id, name, image_url, sort_order)
- `brands` - Brand logos for homepage slider (id, name, image_url, sort_order)
- `clients` - Hotel brand clients like Four Seasons, Marriott (id, name, image_url, sort_order)
- `categories` - Product categories (id, name_en, name_ar, slug, image_url, sort_order)
- `products` - Products (id, name_en, name_ar, description_en, description_ar, image_url, category_id, sort_order)

### Admin Portal
- URL: `/admin/login` (login page), `/admin` (dashboard)
- Default credentials: username `admin`, password `admin123`
- Sidebar sections: Dashboard, Site Content, Site Images, Categories, Products, Our Brands, Partners, Clients, Settings
- Brands = logos displayed on homepage slider
- Partners = brand partners (Abdeen, Cashmere)
- Clients = hotel brand clients (Four Seasons, Grand Hyatt, Marriott, etc.)
- Admin pages are English-only, separate from bilingual public site

## User Preferences
- Pure white background (no gray flash on slow connections)
- Luxury minimalist design with gold accent color
- "Categories" title in products dropdown, no category arrows in navbar
- 17+ hotel brand client logos
- Clear separation between Partners (brands) and Clients (hotel brands)
