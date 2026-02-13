import { createContext, useContext, useState, useEffect, useCallback, ReactNode, createElement } from "react";

type Language = "EN" | "AR";

interface AdminLangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { EN: string; AR: string }> = {
  admin_login: { EN: "Admin Login", AR: "تسجيل دخول المدير" },
  sign_in_desc: { EN: "Sign in to manage your site", AR: "سجل دخولك لإدارة موقعك" },
  username: { EN: "Username", AR: "اسم المستخدم" },
  password: { EN: "Password", AR: "كلمة المرور" },
  enter_username: { EN: "Enter username", AR: "أدخل اسم المستخدم" },
  enter_password: { EN: "Enter password", AR: "أدخل كلمة المرور" },
  sign_in: { EN: "Sign In", AR: "تسجيل الدخول" },
  signing_in: { EN: "Signing in...", AR: "جاري تسجيل الدخول..." },
  login_failed: { EN: "Login failed", AR: "فشل تسجيل الدخول" },
  loading: { EN: "Loading...", AR: "جاري التحميل..." },

  the_experts: { EN: "The Experts", AR: "الخبراء" },
  admin_panel: { EN: "Admin Panel", AR: "لوحة الإدارة" },
  dashboard: { EN: "Dashboard", AR: "لوحة التحكم" },
  site_content: { EN: "Site Content", AR: "محتوى الموقع" },
  site_images: { EN: "Site Images", AR: "صور الموقع" },
  categories: { EN: "Categories", AR: "الأقسام" },
  products: { EN: "Products", AR: "المنتجات" },
  our_brands: { EN: "Our Brands", AR: "علاماتنا التجارية" },
  partners: { EN: "Partners", AR: "الشركاء" },
  clients: { EN: "Clients", AR: "العملاء" },
  settings: { EN: "Settings", AR: "الإعدادات" },
  logout: { EN: "Logout", AR: "تسجيل الخروج" },
  logging_out: { EN: "Logging out...", AR: "جاري تسجيل الخروج..." },
  logged_in_as: { EN: "Logged in as", AR: "تم تسجيل الدخول كـ" },
  view_site: { EN: "View Site", AR: "عرض الموقع" },

  desc_overview: { EN: "Overview & sitemap", AR: "نظرة عامة وخريطة الموقع" },
  desc_content: { EN: "Edit text & translations", AR: "تعديل النصوص والترجمات" },
  desc_images: { EN: "Manage hero banners & logo", AR: "إدارة صور البانر والشعار" },
  desc_categories: { EN: "Manage product categories", AR: "إدارة أقسام المنتجات" },
  desc_products: { EN: "Manage products", AR: "إدارة المنتجات" },
  desc_brands: { EN: "Manage brand logos for homepage slider", AR: "إدارة شعارات العلامات التجارية" },
  desc_partners: { EN: "Manage brand partners (Abdeen, Cashmere)", AR: "إدارة شركاء العلامة التجارية" },
  desc_clients: { EN: "Manage hotel brand clients", AR: "إدارة عملاء الفنادق" },
  desc_leadership: { EN: "Manage leadership team members", AR: "إدارة أعضاء فريق القيادة" },
  desc_settings: { EN: "Account settings", AR: "إعدادات الحساب" },

  welcome_dashboard: { EN: "Welcome to Admin Dashboard", AR: "مرحباً بك في لوحة الإدارة" },
  manage_desc: { EN: "Manage your website content, categories, products, and partners from here.", AR: "قم بإدارة محتوى موقعك والأقسام والمنتجات والشركاء من هنا." },
  content_items: { EN: "Content Items", AR: "عناصر المحتوى" },
  website_sitemap: { EN: "Website Sitemap", AR: "خريطة الموقع" },
  sitemap_desc: { EN: "Overview of all pages on your website. Click any section above to edit its content.", AR: "نظرة عامة على جميع صفحات موقعك. انقر على أي قسم أعلاه لتعديل محتواه." },
  home_page: { EN: "Home Page", AR: "الصفحة الرئيسية" },
  about_us: { EN: "About Us", AR: "من نحن" },
  products_categories: { EN: "Products / Categories", AR: "المنتجات / الأقسام" },
  partners_clients: { EN: "Partners & Clients", AR: "الشركاء والعملاء" },
  sustainability: { EN: "Sustainability", AR: "الاستدامة" },
  contact: { EN: "Contact", AR: "اتصل بنا" },
  room_service: { EN: "Room Service", AR: "خدمة الغرف" },
  linens: { EN: "Linens", AR: "البياضات" },
  spa: { EN: "Spa", AR: "السبا" },
  amenities: { EN: "Amenities", AR: "المرافق" },
  food_beverage: { EN: "Food & Beverage", AR: "الأغذية والمشروبات" },
  buffet_banqueting: { EN: "Buffet & Banqueting", AR: "البوفيه والمآدب" },

  add: { EN: "Add", AR: "إضافة" },
  edit: { EN: "Edit", AR: "تعديل" },
  delete: { EN: "Delete", AR: "حذف" },
  cancel: { EN: "Cancel", AR: "إلغاء" },
  save: { EN: "Save", AR: "حفظ" },
  update: { EN: "Update", AR: "تحديث" },
  saving: { EN: "Saving...", AR: "جاري الحفظ..." },
  deleting: { EN: "Deleting...", AR: "جاري الحذف..." },
  removing: { EN: "Removing...", AR: "جاري الإزالة..." },
  error: { EN: "Error", AR: "خطأ" },
  updated: { EN: "Updated", AR: "تم التحديث" },
  saved: { EN: "Saved", AR: "تم الحفظ" },

  edit_text_translations: { EN: "Edit text and translations for your website", AR: "تعديل النصوص والترجمات لموقعك" },
  save_changes: { EN: "Save Changes", AR: "حفظ التغييرات" },
  content_updated: { EN: "Content updated successfully.", AR: "تم تحديث المحتوى بنجاح." },
  sections: { EN: "Sections", AR: "الأقسام" },
  all: { EN: "All", AR: "الكل" },
  search_placeholder: { EN: "Search by key or value...", AR: "البحث بالمفتاح أو القيمة..." },
  english: { EN: "English", AR: "الإنجليزية" },
  arabic: { EN: "Arabic", AR: "العربية" },
  modified: { EN: "Modified", AR: "تم التعديل" },
  no_items_found: { EN: "No content items found.", AR: "لم يتم العثور على عناصر المحتوى." },
  loading_content: { EN: "Loading content...", AR: "جاري تحميل المحتوى..." },

  sec_hero: { EN: "Hero Banners", AR: "صور البانر الرئيسية" },
  sec_cat: { EN: "Category Names", AR: "أسماء الأقسام" },
  sec_stat: { EN: "Statistics", AR: "الإحصائيات" },
  sec_home: { EN: "Home Page", AR: "الصفحة الرئيسية" },
  sec_about: { EN: "About Page", AR: "صفحة من نحن" },
  sec_chairman: { EN: "Chairman Section", AR: "قسم رئيس مجلس الإدارة" },
  sec_our: { EN: "Section Titles", AR: "عناوين الأقسام" },
  sec_sustain: { EN: "Sustainability", AR: "الاستدامة" },
  sec_ecovadis: { EN: "EcoVadis", AR: "إيكوفاديس" },
  sec_partner: { EN: "Partners Page", AR: "صفحة الشركاء" },
  sec_footer: { EN: "Footer", AR: "التذييل" },
  sec_contact: { EN: "Contact Page", AR: "صفحة الاتصال" },
  sec_rs: { EN: "Room Service Products", AR: "منتجات خدمة الغرف" },
  sec_spa: { EN: "Spa Products", AR: "منتجات السبا" },
  sec_amenities: { EN: "Amenities Products", AR: "منتجات المرافق" },
  sec_buffet: { EN: "Buffet Products", AR: "منتجات البوفيه" },
  sec_fb: { EN: "Food & Beverage Products", AR: "منتجات الأغذية والمشروبات" },
  sec_linens: { EN: "Linens Products", AR: "منتجات البياضات" },
  sec_leader: { EN: "Leadership", AR: "القيادة" },
  sec_general: { EN: "General", AR: "عام" },

  manage_banners_logo: { EN: "Manage hero banners and site images", AR: "إدارة صور البانر الرئيسية وصور الموقع" },
  image_updated: { EN: "Image updated successfully.", AR: "تم تحديث الصورة بنجاح." },
  upload_photo: { EN: "Upload photo", AR: "تحميل صورة" },
  upload_failed: { EN: "Failed to upload", AR: "فشل التحميل" },
  homepage: { EN: "Homepage", AR: "الصفحة الرئيسية" },
  products_page: { EN: "Products Page", AR: "صفحة المنتجات" },
  contact_page: { EN: "Contact Page", AR: "صفحة الاتصال" },
  about_page: { EN: "About Page", AR: "صفحة من نحن" },
  partners_page: { EN: "Partners Page", AR: "صفحة الشركاء" },

  add_category: { EN: "Add Category", AR: "إضافة قسم" },
  edit_category: { EN: "Edit Category", AR: "تعديل القسم" },
  delete_category: { EN: "Delete Category", AR: "حذف القسم" },
  create_category: { EN: "Create a new product category.", AR: "إنشاء قسم منتجات جديد." },
  update_category_details: { EN: "Update category details.", AR: "تحديث تفاصيل القسم." },
  category_added: { EN: "Category added", AR: "تمت إضافة القسم" },
  category_updated: { EN: "Category updated", AR: "تم تحديث القسم" },
  category_deleted: { EN: "Category deleted", AR: "تم حذف القسم" },
  visibility_updated: { EN: "Visibility updated", AR: "تم تحديث الظهور" },
  no_categories: { EN: "No categories yet. Add your first category.", AR: "لا توجد أقسام بعد. أضف أول قسم." },
  delete_cat_confirm: { EN: "Are you sure? This will also delete all products in this category. This action cannot be undone.", AR: "هل أنت متأكد؟ سيتم أيضاً حذف جميع المنتجات في هذا القسم. لا يمكن التراجع عن هذا الإجراء." },
  order: { EN: "Order", AR: "الترتيب" },
  image: { EN: "Image", AR: "الصورة" },
  name_en: { EN: "Name (EN)", AR: "الاسم (إنجليزي)" },
  name_ar: { EN: "Name (AR)", AR: "الاسم (عربي)" },
  name_english: { EN: "Name (English)", AR: "الاسم (الإنجليزية)" },
  name_arabic: { EN: "Name (Arabic)", AR: "الاسم (العربية)" },
  slug: { EN: "Slug", AR: "الرابط" },
  url_slug: { EN: "URL Slug", AR: "رابط URL" },
  visible: { EN: "Visible", AR: "ظاهر" },
  hidden: { EN: "Hidden", AR: "مخفي" },
  actions: { EN: "Actions", AR: "الإجراءات" },
  sort_order: { EN: "Sort Order", AR: "ترتيب العرض" },
  category_image: { EN: "Category Image", AR: "صورة القسم" },
  current_image_kept: { EN: "Current image will be kept if no new file is selected.", AR: "سيتم الاحتفاظ بالصورة الحالية إذا لم يتم اختيار ملف جديد." },
  loading_categories: { EN: "Loading categories...", AR: "جاري تحميل الأقسام..." },
  n_categories: { EN: "categories", AR: "أقسام" },

  add_product: { EN: "Add Product", AR: "إضافة منتج" },
  edit_product: { EN: "Edit Product", AR: "تعديل المنتج" },
  delete_product: { EN: "Delete Product", AR: "حذف المنتج" },
  create_product: { EN: "Create a new product.", AR: "إنشاء منتج جديد." },
  update_product_details: { EN: "Update product details.", AR: "تحديث تفاصيل المنتج." },
  product_added: { EN: "Product added", AR: "تمت إضافة المنتج" },
  product_updated: { EN: "Product updated", AR: "تم تحديث المنتج" },
  product_deleted: { EN: "Product deleted", AR: "تم حذف المنتج" },
  no_products: { EN: "No products yet. Add your first product.", AR: "لا توجد منتجات بعد. أضف أول منتج." },
  delete_product_confirm: { EN: "Are you sure you want to delete this product? This action cannot be undone.", AR: "هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء." },
  search_name: { EN: "Search by name...", AR: "البحث بالاسم..." },
  all_categories: { EN: "All Categories", AR: "جميع الأقسام" },
  all_brands: { EN: "All Brands", AR: "جميع العلامات" },
  brand: { EN: "Brand", AR: "العلامة التجارية" },
  category: { EN: "Category", AR: "القسم" },
  description_en: { EN: "Description (English)", AR: "الوصف (الإنجليزية)" },
  description_ar: { EN: "Description (Arabic)", AR: "الوصف (العربية)" },
  select_category: { EN: "Select category...", AR: "اختر القسم..." },
  loading_products: { EN: "Loading products...", AR: "جاري تحميل المنتجات..." },
  n_products: { EN: "products", AR: "منتجات" },
  in: { EN: "in", AR: "في" },
  unknown: { EN: "Unknown", AR: "غير معروف" },

  add_partner: { EN: "Add Partner", AR: "إضافة شريك" },
  edit_partner: { EN: "Edit Partner", AR: "تعديل الشريك" },
  delete_partner: { EN: "Delete Partner", AR: "حذف الشريك" },
  partner_added: { EN: "Partner added", AR: "تمت إضافة الشريك" },
  partner_updated: { EN: "Partner updated", AR: "تم تحديث الشريك" },
  partner_deleted: { EN: "Partner deleted", AR: "تم حذف الشريك" },
  add_partner_desc: { EN: "Add a new partner to display on the site.", AR: "إضافة شريك جديد لعرضه على الموقع." },
  update_partner_details: { EN: "Update partner details.", AR: "تحديث تفاصيل الشريك." },
  delete_partner_confirm: { EN: "Are you sure you want to delete this partner? This action cannot be undone.", AR: "هل أنت متأكد من حذف هذا الشريك؟ لا يمكن التراجع عن هذا الإجراء." },
  no_partners: { EN: "No partners yet.", AR: "لا يوجد شركاء بعد." },
  loading_partners: { EN: "Loading partners...", AR: "جاري تحميل الشركاء..." },
  name: { EN: "Name", AR: "الاسم" },
  no_image: { EN: "No image", AR: "لا توجد صورة" },

  add_brand: { EN: "Add Brand", AR: "إضافة علامة تجارية" },
  edit_brand: { EN: "Edit Brand", AR: "تعديل العلامة التجارية" },
  delete_brand: { EN: "Delete Brand", AR: "حذف العلامة التجارية" },
  brand_added: { EN: "Brand added", AR: "تمت إضافة العلامة التجارية" },
  brand_updated: { EN: "Brand updated", AR: "تم تحديث العلامة التجارية" },
  brand_deleted: { EN: "Brand deleted", AR: "تم حذف العلامة التجارية" },
  add_brand_desc: { EN: "Add a new brand to display on the homepage slider.", AR: "إضافة علامة تجارية جديدة لعرضها في شريط العلامات." },
  update_brand_details: { EN: "Update brand details.", AR: "تحديث تفاصيل العلامة التجارية." },
  delete_brand_confirm: { EN: "Are you sure you want to delete this brand? This action cannot be undone.", AR: "هل أنت متأكد من حذف هذه العلامة التجارية؟ لا يمكن التراجع عن هذا الإجراء." },
  no_brands: { EN: "No brands yet. Add your first brand to display in the logo slider.", AR: "لا توجد علامات تجارية بعد. أضف أول علامة تجارية لعرضها في شريط الشعارات." },
  loading_brands: { EN: "Loading brands...", AR: "جاري تحميل العلامات التجارية..." },
  logo_image: { EN: "Logo Image", AR: "صورة الشعار" },

  add_client: { EN: "Add Client", AR: "إضافة عميل" },
  edit_client: { EN: "Edit Client", AR: "تعديل العميل" },
  remove_client: { EN: "Remove Client", AR: "إزالة العميل" },
  client_added: { EN: "Client added", AR: "تمت إضافة العميل" },
  client_updated: { EN: "Client updated", AR: "تم تحديث العميل" },
  client_removed: { EN: "Client removed", AR: "تمت إزالة العميل" },
  add_client_desc: { EN: "Add a hotel brand client logo.", AR: "إضافة شعار عميل فندقي." },
  update_client_details: { EN: "Update client details.", AR: "تحديث تفاصيل العميل." },
  delete_client_confirm: { EN: "Are you sure you want to remove this client? This action cannot be undone.", AR: "هل أنت متأكد من إزالة هذا العميل؟ لا يمكن التراجع عن هذا الإجراء." },
  no_clients: { EN: "No clients yet. Add your first hotel brand client.", AR: "لا يوجد عملاء بعد. أضف أول عميل فندقي." },
  loading_clients: { EN: "Loading clients...", AR: "جاري تحميل العملاء..." },
  client_name: { EN: "Client Name", AR: "اسم العميل" },
  hotel_clients_desc: { EN: "hotel brand clients (Four Seasons, Marriott, etc.)", AR: "عملاء الفنادق (فور سيزونز، ماريوت، إلخ.)" },
  current_logo_kept: { EN: "Current logo will be kept if no new file is selected.", AR: "سيتم الاحتفاظ بالشعار الحالي إذا لم يتم اختيار ملف جديد." },
  remove: { EN: "Remove", AR: "إزالة" },

  account_settings: { EN: "Account Settings", AR: "إعدادات الحساب" },
  password_change_soon: { EN: "Password change feature coming soon.", AR: "ميزة تغيير كلمة المرور ستتوفر قريباً." },

  leadership: { EN: "Leadership", AR: "القيادة" },
  add_leader: { EN: "Add Leader", AR: "إضافة قائد" },
  edit_leader: { EN: "Edit Leader", AR: "تعديل القائد" },
  delete_leader: { EN: "Delete Leader", AR: "حذف القائد" },
  leader_added: { EN: "Leader added successfully", AR: "تمت إضافة القائد بنجاح" },
  leader_updated: { EN: "Leader updated successfully", AR: "تم تحديث القائد بنجاح" },
  leader_deleted: { EN: "Leader deleted successfully", AR: "تم حذف القائد بنجاح" },
  add_leader_desc: { EN: "Add a new leadership team member", AR: "إضافة عضو جديد في فريق القيادة" },
  update_leader_details: { EN: "Update leader information", AR: "تحديث معلومات القائد" },
  delete_leader_confirm: { EN: "Are you sure you want to remove this leader? This cannot be undone.", AR: "هل أنت متأكد من حذف هذا القائد؟ لا يمكن التراجع عن هذا." },
  no_leaders: { EN: "No leadership members yet. Add your first leader.", AR: "لا يوجد أعضاء في فريق القيادة بعد. أضف أول قائد." },
  role_en: { EN: "Role (English)", AR: "المنصب (بالإنجليزية)" },
  role_ar: { EN: "Role (Arabic)", AR: "المنصب (بالعربية)" },
  phone: { EN: "Phone", AR: "الهاتف" },
  email_address: { EN: "Email", AR: "البريد الإلكتروني" },
  photo: { EN: "Photo", AR: "الصورة" },
  change_photo: { EN: "Change photo", AR: "تغيير الصورة" },
  photo_updated: { EN: "Photo updated", AR: "تم تحديث الصورة" },
  optional: { EN: "Optional", AR: "اختياري" },

  quick_links: { EN: "Quick Links", AR: "روابط سريعة" },
  quick_links_desc: { EN: "Manage footer quick links displayed on the website.", AR: "إدارة الروابط السريعة المعروضة في تذييل الموقع." },
  desc_quick_links: { EN: "Manage footer navigation links", AR: "إدارة روابط التنقل في التذييل" },
  add_link: { EN: "Add Link", AR: "إضافة رابط" },
  edit_link: { EN: "Edit Link", AR: "تعديل الرابط" },
  delete_link: { EN: "Delete Link", AR: "حذف الرابط" },
  add_link_desc: { EN: "Add a new quick link to the footer.", AR: "إضافة رابط سريع جديد إلى التذييل." },
  update_link_details: { EN: "Update link details.", AR: "تحديث تفاصيل الرابط." },
  link_added: { EN: "Link added", AR: "تمت إضافة الرابط" },
  link_updated: { EN: "Link updated", AR: "تم تحديث الرابط" },
  link_deleted: { EN: "Link deleted", AR: "تم حذف الرابط" },
  delete_link_confirm: { EN: "Are you sure you want to delete this link? This action cannot be undone.", AR: "هل أنت متأكد من حذف هذا الرابط؟ لا يمكن التراجع عن هذا الإجراء." },
  no_quick_links: { EN: "No quick links yet. Add your first link.", AR: "لا توجد روابط سريعة بعد. أضف أول رابط." },

  key_contacts: { EN: "Key Contacts", AR: "جهات الاتصال الرئيسية" },
  desc_key_contacts: { EN: "Manage key contact persons for contact page", AR: "إدارة جهات الاتصال الرئيسية لصفحة الاتصال" },
  add_contact: { EN: "Add Contact", AR: "إضافة جهة اتصال" },
  edit_contact: { EN: "Edit Contact", AR: "تعديل جهة الاتصال" },
  delete_contact: { EN: "Delete Contact", AR: "حذف جهة الاتصال" },
  contact_added: { EN: "Contact added successfully", AR: "تمت إضافة جهة الاتصال بنجاح" },
  contact_updated: { EN: "Contact updated successfully", AR: "تم تحديث جهة الاتصال بنجاح" },
  contact_deleted: { EN: "Contact deleted successfully", AR: "تم حذف جهة الاتصال بنجاح" },
  add_contact_desc: { EN: "Add a new key contact person", AR: "إضافة جهة اتصال رئيسية جديدة" },
  update_contact_details: { EN: "Update contact information", AR: "تحديث معلومات جهة الاتصال" },
  delete_contact_confirm: { EN: "Are you sure you want to remove this contact? This cannot be undone.", AR: "هل أنت متأكد من حذف جهة الاتصال هذه؟ لا يمكن التراجع عن هذا." },
  no_contacts: { EN: "No key contacts yet. Add your first contact.", AR: "لا توجد جهات اتصال رئيسية بعد. أضف أول جهة اتصال." },
  hide: { EN: "Hide", AR: "إخفاء" },
  show: { EN: "Show", AR: "إظهار" },

};

const STORAGE_KEY = "admin_lang";

const AdminLangContext = createContext<AdminLangContextType | undefined>(undefined);

export function AdminLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "AR" || stored === "EN") return stored;
    } catch {}
    return "EN";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] || entry.EN || key;
    },
    [lang]
  );

  return createElement(
    AdminLangContext.Provider,
    { value: { lang, setLang, t } },
    children
  );
}

export function useAdminLang(): AdminLangContextType {
  const context = useContext(AdminLangContext);
  if (!context) {
    throw new Error("useAdminLang must be used within an AdminLangProvider");
  }
  return context;
}
