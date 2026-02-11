# The Experts - Hospitality Supplies Catalog

## Overview
Bilingual (English/Arabic) hospitality supplies catalog website for "The Experts" with a luxury minimalist design. Features a full admin portal for managing site content, translations, partners, clients, product categories, and products.

## Recent Changes
- 2026-02-11: Made category detail pages dynamic — all category slugs use CategoryDetail.tsx which fetches products from the API
- 2026-02-11: Added category visibility toggle (admin can hide/show categories from public site)
- 2026-02-11: Added 3 Room Service products (Elite Service Trolley, Signature Thermal Carafe, Mirror-Finish Cloche) to DB and seed
- 2026-02-11: Navbar and CategoryGrid fetch categories dynamically from API
- 2026-02-11: Separated Partners (brand partners: Abdeen, Cashmere) from Clients (hotel brands: Four Seasons, Marriott, etc.)
- 2026-02-11: Added admin portal with authentication, content editor, category/product/partner/client managers
- 2026-02-11: Added seed script for default admin user, translations, categories, partners, clients, and products

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
- `server/routes.ts` - API routes (auth, content, partners, clients, categories, products, uploads)
- `server/storage.ts` - Database storage interface
- `server/seed.ts` - Database seeding (admin user + default translations + categories + partners + clients)
- `shared/schema.ts` - Drizzle schema (users, siteContent, partners, clients, categories, products)

### Database Tables
- `users` - Admin users (id, username, password)
- `site_content` - Bilingual translations (id, key, value_en, value_ar)
- `partners` - Brand partners like Abdeen, Cashmere (id, name, image_url, sort_order)
- `clients` - Hotel brand clients like Four Seasons, Marriott (id, name, image_url, sort_order)
- `categories` - Product categories (id, name_en, name_ar, slug, image_url, sort_order)
- `products` - Products (id, name_en, name_ar, description_en, description_ar, image_url, category_id, sort_order)

### Admin Portal
- URL: `/admin/login` (login page), `/admin` (dashboard)
- Default credentials: username `admin`, password `admin123`
- Sidebar sections: Dashboard, Site Content, Categories, Products, Partners, Clients, Settings
- Partners = brand partners (Abdeen, Cashmere)
- Clients = hotel brand clients (Four Seasons, Grand Hyatt, Marriott, etc.)
- Admin pages are English-only, separate from bilingual public site

## User Preferences
- Pure white background (no gray flash on slow connections)
- Luxury minimalist design with gold accent color
- "Categories" title in products dropdown, no category arrows in navbar
- 17+ hotel brand client logos
- Clear separation between Partners (brands) and Clients (hotel brands)
