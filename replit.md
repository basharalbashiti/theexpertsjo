# The Experts - Hospitality Supplies Catalog

## Overview
Bilingual (English/Arabic) hospitality supplies catalog website for "The Experts" with a luxury minimalist design. Features a full admin portal for managing site content, translations, partners, clients, product categories, and products.

## Recent Changes
- 2026-02-23: Added email notifications for contact form — when a visitor submits the contact form, an email is sent to alaa@theexpertsjo.com via Resend API with visitor name, email, subject, and message; fire-and-forget (doesn't block form submission); server/email.ts module with HTML template
- 2026-03-01: Added password change feature to admin Settings — current password verification, min 6 char validation, bilingual form
- 2026-03-01: Fixed 404 handling — invalid URLs now show proper bilingual "Page Not Found" page instead of broken category page; CategoryDetail checks API response status
- 2026-03-01: Added favicon and OG image editors to Site Images admin — admin can upload/change browser tab icon and social share image (og:image/twitter:image); both served dynamically in production via server routes
- 2026-02-23: Added SEO Management admin page — manage page title, meta description, Open Graph/Twitter cards, JSON-LD structured data, sitemap base URL, and robots.txt allow/disallow from admin panel; seo_settings table stores all settings; server-side meta tag injection in production builds; dynamic sitemap.xml and robots.txt use admin-configured base URL
- 2026-02-21: Added multi-image gallery for products — each product supports up to 4 additional images via product_images table, admin ProductManager shows gallery editor when editing, CategoryDetail page shows image carousel with navigation arrows and dots
- 2026-02-19: Added contact form message system — messages saved to database, admin Messages page to view/read/delete submissions, contact form wired with success/error feedback
- 2026-02-19: Added dynamic /sitemap.xml and /robots.txt for SEO — auto-generates from static pages + database categories
- 2026-02-12: Separated Key Contacts from Leadership — new key_contacts table and KeyContactManager admin page; Contact page now uses key contacts API; visibility toggle on both Leadership and Key Contacts
- 2026-02-12: Added Leadership Manager — dedicated admin page to manage leadership team (add/edit/delete with bilingual names/roles, photo upload, sort order); About page dynamically displays leaders from database
- 2026-02-12: Added Quick Links manager — admin can add/edit/delete/toggle footer quick links, footer uses dynamic quick links from database
- 2026-02-12: Added Arabic language support to admin panel — independent language toggle (EN/AR), RTL direction support, 170+ translated keys covering all admin pages, localStorage persistence under "admin_lang"
- 2026-02-12: Removed standalone category pages (RoomService, Spa, Amenities, etc.) — all categories now use dynamic CategoryDetail; cleaned up redundant Site Images and Site Content entries
- 2026-02-12: Site Images manager covers page banners (Homepage, Products, Contact, About, Partners) — category banners managed via Categories Manager
- 2026-02-12: Added useSiteImages hook with caching + invalidation for dynamic page images
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
- `server/routes.ts` - API routes (auth, content, site-images, partners, brands, clients, categories, products, quick-links, seo, uploads)
- `server/storage.ts` - Database storage interface
- `server/seed.ts` - Database seeding (admin user + default translations + categories + partners + brands + clients + site images)
- `shared/schema.ts` - Drizzle schema (users, siteContent, siteImages, partners, brands, clients, categories, products, quickLinks)

### Database Tables
- `users` - Admin users (id, username, password)
- `site_content` - Bilingual translations (id, key, value_en, value_ar)
- `site_images` - Configurable site images like hero banners and logo (id, key, image_url, label)
- `partners` - Brand partners like Abdeen, Cashmere (id, name, image_url, sort_order)
- `brands` - Brand logos for homepage slider (id, name, image_url, sort_order)
- `clients` - Hotel brand clients like Four Seasons, Marriott (id, name, image_url, sort_order)
- `categories` - Product categories (id, name_en, name_ar, slug, image_url, sort_order)
- `products` - Products (id, name_en, name_ar, description_en, description_ar, image_url, category_id, sort_order)
- `product_images` - Additional product images, up to 4 per product (id, product_id, image_url, sort_order)
- `leadership` - Leadership team members (id, name_en, name_ar, role_en, role_ar, phone, email, image_url, sort_order, visible)
- `key_contacts` - Key contact persons for contact page (id, name_en, name_ar, role_en, role_ar, phone, email, image_url, sort_order, visible)
- `quick_links` - Footer quick links (id, label_en, label_ar, url, sort_order, visible)
- `seo_settings` - SEO configuration key-value pairs (id, key, value) — keys include site_title, site_description, og_title, og_description, twitter_title, twitter_description, org_name, org_url, org_description, org_phone, sitemap_base_url, robots_allow_all
- `contact_messages` - Contact form submissions (id, name, email, subject, message, read, created_at)

### Admin Portal
- URL: `/admin/login` (login page), `/admin` (dashboard)
- Default credentials: username `admin`, password `admin123`
- Sidebar sections: Dashboard, Site Content, Site Images, Categories, Products, Our Brands, Partners & Clients, Leadership, Key Contacts, Quick Links, Messages, SEO, Settings
- Brands = logos displayed on homepage slider
- Partners & Clients = combined page with tabs; Partners tab for brand partners (Abdeen, Cashmere), Clients tab for hotel brand clients (Four Seasons, Grand Hyatt, Marriott, etc.)
- Admin panel supports bilingual Arabic/English via language toggle

## User Preferences
- Pure white background (no gray flash on slow connections)
- Luxury minimalist design with gold accent color
- "Categories" title in products dropdown, no category arrows in navbar
- 17+ hotel brand client logos
- Clear separation between Partners (brands) and Clients (hotel brands)
