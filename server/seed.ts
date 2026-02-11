import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { db } from "./db";
import { users, siteContent } from "@shared/schema";

const defaultTranslations: Record<string, { en: string; ar: string }> = {
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About Us", ar: "من نحن" },
  products: { en: "Products", ar: "المنتجات" },
  partners: { en: "Partners & Clients", ar: "شركاؤنا وعملاؤنا" },
  partners_clients: { en: "Partners & Clients", ar: "شركاؤنا وعملاؤنا" },
  sustainability: { en: "Sustainability", ar: "الاستدامة" },
  contact: { en: "Contact", ar: "اتصل بنا" },
  hero1_title: { en: "Supplying Comfort", ar: "توريد الراحة" },
  hero1_subtitle: { en: "Excellence to Your Guests", ar: "التميز لضيوفك" },
  hero1_desc: { en: "Experience the pinnacle of hospitality supply with our premium collection.", ar: "اختبر قمة توريد مستلزمات الضيافة مع مجموعتنا المميزة." },
  hero2_title: { en: "Bringing Elegance", ar: "إضفاء الأناقة" },
  hero2_subtitle: { en: "Ease to Your Visitors", ar: "السهولة لزوارك" },
  hero2_desc: { en: "Curated amenities that define sophistication and care.", ar: "مرافق مختارة بعناية تحدد الرقي والاهتمام." },
  hero3_title: { en: "Enhancing Every Stay", ar: "تحسين كل إقامة" },
  hero3_subtitle: { en: "Style and Comfort", ar: "الأسلوب والراحة" },
  hero3_desc: { en: "Transforming ordinary stays into extraordinary memories.", ar: "تحويل الإقامات العادية إلى ذكريات استثنائية." },
  discover_more: { en: "Discover More", ar: "اكتشف المزيد" },
  all_in_one: { en: "All in One Place", ar: "الكل في مكان واحد" },
  hospitality_solution: { en: "Your All-in-one Hospitality Solution", ar: "حلك المتكامل للضيافة" },
  home_desc1: { en: "At The Experts, we supply premium hospitality products and essential hotel supplies across the Middle East.", ar: "في الخبراء، نقوم بتوريد منتجات الضيافة الفاخرة ومستلزمات الفنادق الأساسية في جميع أنحاء الشرق الأوسط." },
  home_desc2: { en: "Whether you operate a large hotel or a boutique property, our carefully curated offerings deliver consistent quality and a memorable guest experience.", ar: "سواء كنت تدير فندقاً كبيراً أو عقاراً صغيراً، فإن عروضنا المنسقة بعناية توفر جودة متسقة وتجربة ضيوف لا تُنسى." },
  our_categories: { en: "Our Categories", ar: "أقسامنا" },
  cat_towels: { en: "Towels", ar: "المناشف" },
  cat_minibar: { en: "Mini Bar & Safes", ar: "الميني بار والخزن" },
  cat_amenities: { en: "Amenities", ar: "المرافق" },
  cat_food: { en: "Food & Beverage", ar: "الأغذية والمشروبات" },
  cat_housekeeping: { en: "Housekeeping", ar: "التدبير الفندقي" },
  cat_furniture: { en: "Furniture", ar: "الأثاث" },
  cat_linens: { en: "Linens", ar: "البياضات" },
  cat_buffet: { en: "Buffet Stands", ar: "أستاندات البوفيه" },
  cat_banqueting: { en: "Banqueting", ar: "قاعات الاحتفالات" },
  cat_spa: { en: "Spa", ar: "السبا" },
  cat_room_service: { en: "Room Service", ar: "خدمة الغرف" },
  stat_offices: { en: "Offices", ar: "مكاتب" },
  stat_warehouses: { en: "Warehouses", ar: "مستودعات" },
  stat_countries: { en: "Countries Served", ar: "دول نخدمها" },
  stat_skus: { en: "SKUs", ar: "وحدة حفظ مخزون" },
  stat_product_lines: { en: "Product Lines", ar: "خطوط الإنتاج" },
  stat_brands: { en: "Brands", ar: "علامة تجارية" },
  stat_projects: { en: "Projects", ar: "مشروع" },
  stat_clients: { en: "Clients", ar: "عميل" },
  footer_desc: { en: "Supplying comfort and quality to your guests. Premium hospitality products across the Middle East.", ar: "توريد الراحة والجودة لضيوفك. منتجات ضيافة متميزة في جميع أنحاء الشرق الأوسط." },
  quick_links: { en: "Quick Links", ar: "روابط سريعة" },
  categories: { en: "Categories", ar: "الأقسام" },
  contact_us: { en: "Contact Us", ar: "اتصل بنا" },
  rights_reserved: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  who_we_are: { en: "Who We Are", ar: "من نحن" },
  founded_in: { en: "Founded in Dubai in 2003", ar: "تأسست في دبي عام 2003" },
  about_desc: { en: "The Experts has grown from a regional leader to a global provider of premium amenity solutions for hotels. With roots in the Middle East and a growing international footprint, we deliver high-quality, tailor-made products that elevate guest experiences and strengthen brand identity worldwide.", ar: "نمت شركة الخبراء من رائد إقليمي إلى مزود عالمي لحلول المرافق المتميزة للفنادق. مع جذور في الشرق الأوسط وبصمة دولية متنامية، نقدم منتجات عالية الجودة ومصممة خصيصاً ترفع من تجارب الضيوف وتعزز هوية العلامة التجارية في جميع أنحاء العالم." },
  chairman_msg: { en: "Chairman's Message", ar: "رسالة رئيس مجلس الإدارة" },
  chairman_quote: { en: "Welcome to The Experts. Since our founding in 2003 in the UAE, we have remained dedicated to transforming the hospitality experience by delivering premium, tailor-made solutions that elevate guest satisfaction.", ar: "مرحباً بكم في الخبراء. منذ تأسيسنا في عام 2003 في دولة الإمارات العربية المتحدة، ظللنا مكرسين لتحويل تجربة الضيافة من خلال تقديم حلول متميزة ومصممة خصيصاً ترفع من رضا الضيوف." },
  chairman_name: { en: "Alaa Abdeen", ar: "علاء عابدين" },
  chairman_title: { en: "Chairman", ar: "رئيس مجلس الإدارة" },
  our_mission: { en: "Our Mission", ar: "مهمتنا" },
  mission_desc: { en: "Streamlining hotel procurement with premium, cost-effective amenities and reliable delivery.", ar: "تبسيط شراء مستلزمات الفنادق مع مرافق عالية الجودة وفعالة من حيث التكلفة وتسليم موثوق." },
  our_vision: { en: "Our Vision", ar: "رؤيتنا" },
  vision_desc: { en: "To be the global leader in hotel procurement, delivering innovative, high-quality solutions.", ar: "أن نكون الرائد العالمي في شراء مستلزمات الفنادق، ونقدم حلولاً مبتكرة وعالية الجودة." },
  our_leadership: { en: "Our Leadership", ar: "قيادتنا" },
  sustainability_quote: { en: "Sustainability is transforming the hospitality industry, driving a shift toward eco-friendly practices and responsible sourcing.", ar: "الاستدامة تحول صناعة الضيافة، وتدفع التحول نحو الممارسات الصديقة للبيئة والتوريد المسؤول." },
  our_practices: { en: "Our Practices", ar: "ممارساتنا" },
  harmony: { en: "Harmony of Quality and Nature", ar: "تناغم الجودة والطبيعة" },
  sustain_desc1: { en: "At The Experts, we believe sustainability and quality go hand in hand. That's why we craft high-quality amenities using eco-friendly materials, responsible sourcing, and sustainable production methods.", ar: "في الخبراء، نؤمن بأن الاستدامة والجودة يسيران جنباً إلى جنب. ولهذا السبب نصنع مرافق عالية الجودة باستخدام مواد صديقة للبيئة، وتوريد مسؤول، وأساليب إنتاج مستدامة." },
  sustain_desc2: { en: "From biodegradable essentials to recyclable packaging, every detail is designed to reduce environmental impact without compromising excellence.", ar: "من الأساسيات القابلة للتحلل الحيوي إلى التغليف القابل لإعادة التدوير، تم تصميم كل التفاصيل لتقليل الأثر البيئي دون المساومة على التميز." },
  ecovadis_title: { en: "EcoVadis Certification", ar: "شهادة إيكوفاديس" },
  ecovadis_desc: { en: "We are proud to announce our pursuit of EcoVadis certification, a globally recognized standard for ethical and sustainable business practices. This achievement reflects our dedication to eco-friendly sourcing and responsible manufacturing.", ar: "نحن فخورون بالإعلان عن سعينا للحصول على شهادة إيكوفاديس، وهي معيار معترف به عالمياً لممارسات الأعمال الأخلاقية والمستدامة. يعكس هذا الإنجاز تفانينا في التوريد الصديق للبيئة والتصنيع المسؤول." },
  download_sop: { en: "Download Our SOP", ar: "تحميل إجراءات العمل" },
  employee_handbook: { en: "Employee Handbook", ar: "دليل الموظف" },
  get_in_touch: { en: "Get in touch with our global offices", ar: "تواصل مع مكاتبنا العالمية" },
  send_message: { en: "Send us a message", ar: "أرسل لنا رسالة" },
  full_name: { en: "Full Name", ar: "الاسم الكامل" },
  email_addr: { en: "Email Address", ar: "البريد الإلكتروني" },
  subject: { en: "Subject", ar: "الموضوع" },
  message: { en: "Message", ar: "الرسالة" },
  submit: { en: "Send Message", ar: "إرسال الرسالة" },
  our_locations: { en: "Our Locations", ar: "مواقعنا" },
  dubai: { en: "Dubai, UAE", ar: "دبي، الإمارات" },
  riyadh: { en: "Riyadh, KSA", ar: "الرياض، السعودية" },
  amman: { en: "Amman, Jordan", ar: "عمان، الأردن" },
  trusted_by: { en: "Trusted by world-class hospitality brands", ar: "موثوق به من قبل علامات تجارية عالمية في مجال الضيافة" },
  partner_excellence: { en: "Partner with Excellence", ar: "شراكة مع التميز" },
  partner_desc: { en: "We collaborate with the world's most prestigious hotel groups to deliver uncompromised quality and bespoke guest experiences. Join our network of successful partners today.", ar: "نحن نتعاون مع مجموعات الفنادق المرموقة في العالم لتقديم جودة غير مساومة وتجارب ضيوف مخصصة. انضم إلى شبكة شركائنا الناجحة اليوم." },
  become_partner: { en: "Become a Partner", ar: "كن شريكاً" },
  our_products: { en: "Our Products", ar: "منتجاتنا" },
  explore_range: { en: "Explore our comprehensive range of hotel supplies designed to elevate your guest experience.", ar: "استكشف مجموعتنا الشاملة من مستلزمات الفنادق المصممة لرفع تجربة ضيوفك." },
  looking_specific: { en: "Looking for something specific?", ar: "تبحث عن شيء محدد؟" },
  contact_sales: { en: "Contact Sales Team", ar: "اتصل بفريق المبيعات" },
  back_to_categories: { en: "Back to All Categories", ar: "العودة إلى جميع الأقسام" },
  rs_trolley: { en: "Elite Service Trolley", ar: "عربة خدمة النخبة" },
  rs_trolley_desc: { en: "Handcrafted from solid walnut with whisper-quiet, non-marking wheels. Featuring integrated heating compartments and foldable side wings for space efficiency.", ar: "مصنوعة يدوياً من الجوز الصلب مع عجلات هادئة وغير ملوثة. تتميز بحجرات تسخين مدمجة وأجنحة جانبية قابلة للطي لكفاءة المساحة." },
  rs_carafe: { en: "Signature Thermal Carafe", ar: "إبريق حراري مميز" },
  rs_carafe_desc: { en: "Double-walled vacuum insulation keeps beverages at the perfect temperature for up to 12 hours. Ergonomic handle and drip-free pouring spout for effortless service.", ar: "عزل مزدوج الجدار يحافظ على المشروبات في درجة حرارة مثالية لمدة تصل إلى 12 ساعة. مقبض مريح وفوهة صب بدون تنقيط لخدمة سهلة." },
  rs_cloche: { en: "Mirror-Finish Cloche", ar: "غطاء طعام بلمسة مرآة" },
  rs_cloche_desc: { en: "Precision-engineered from 18/10 stainless steel. High-mirror polish adds a touch of theater to the dining experience while maintaining optimal food temperature.", ar: "مصمم بدقة من الفولاذ المقاوم للصدأ 18/10. يضيف التلميع العالي لمسة من الأناقة لتجربة الطعام مع الحفاظ على درجة حرارة الطعام المثالية." },
  spa_towels: { en: "Premium Cotton Towels", ar: "مناشف قطنية عالية الجودة" },
  spa_towels_desc: { en: "Ultra-absorbent, 800 GSM Egyptian cotton towels for a spa-like feel.", ar: "فائقة الامتصاص، قطن مصري 800 جرام لكل متر مربع لإحساس يشبه السبا." },
  spa_robes: { en: "Premium Bathrobes", ar: "أرواب حمام مريحة" },
  spa_robes_desc: { en: "Soft, breathable waffle-weave robes designed for maximum comfort.", ar: "أرواب ناعمة وقابلة للتنفس مصممة لتوفير أقصى درجات الراحة." },
  spa_essentials: { en: "Aromatherapy Essentials", ar: "أساسيات العلاج العطري" },
  spa_essentials_desc: { en: "Curated selection of essential oils and candles for relaxation.", ar: "مجموعة مختارة من الزيوت العطرية والشموع للاسترخاء." },
  amenities_sig: { en: "Signature Collection", ar: "مجموعة التوقيع" },
  amenities_sig_desc: { en: "Eco-friendly bathroom amenities with botanical extracts.", ar: "مرافق حمام صديقة للبيئة مع خلاصات نباتية." },
  amenities_kits: { en: "Personal Care Kits", ar: "أطقم العناية الشخصية" },
  amenities_kits_desc: { en: "Thoughtfully curated kits for the modern traveler.", ar: "أطقم منسقة بعناية للمسافر العصري." },
  amenities_custom: { en: "Custom Branded Sets", ar: "مجموعات مخصصة" },
  amenities_custom_desc: { en: "High-quality products tailored to your hotel's identity.", ar: "منتجات عالية الجودة مصممة لتناسب هوية فندقك." },
  buffet_modular: { en: "Modular Buffet Systems", ar: "أنظمة بوفيه modular" },
  buffet_modular_desc: { en: "Sleek, versatile buffet stands that adapt to any space and style.", ar: "أستاندات بوفيه أنيقة ومتعددة الاستخدامات تتكيف مع أي مساحة وأسلوب." },
  buffet_tables: { en: "Premium Banquet Tables", ar: "طاولات حفلات عالية الجودة" },
  buffet_tables_desc: { en: "Durable and elegant tables designed for high-capacity events.", ar: "طاولات متينة وأنيقة مصممة للفعاليات ذات السعة العالية." },
  buffet_present: { en: "Elegant Food Presentation", ar: "تقديم طعام أنيق" },
  buffet_present_desc: { en: "Elevated risers and platters to showcase culinary excellence.", ar: "رافعات وأطباق مرتفعة لعرض التميز في الطهي." },
  fb_cocktail: { en: "Cocktail Accessories", ar: "إكسسوارات الكوكتيل" },
  fb_cocktail_desc: { en: "Colorful and stylish stirrers, skewers, and picks for premium bar service.", ar: "أدوات تقليب وأسياخ ملونة وأنيقة لخدمة بار متميزة." },
  fb_glass: { en: "Glassware Collection", ar: "مجموعة الأواني الزجاجية" },
  fb_glass_desc: { en: "Elegant, high-clarity glassware for every beverage type.", ar: "أواني زجاجية أنيقة وعالية الوضوح لكل نوع من المشروبات." },
  fb_bar: { en: "Bar Equipment", ar: "معدات البار" },
  fb_bar_desc: { en: "Professional-grade tools for precision mixology.", ar: "أدوات احترافية لدقة خلط المشروبات." },
  linens_bed: { en: "Premium Bed Linens", ar: "بياضات أسرّة عالية الجودة" },
  linens_bed_desc: { en: "High-thread-count cotton sheets for ultimate guest comfort.", ar: "ملاءات قطنية بعدد خيوط عالٍ لراحة الضيوف القصوى." },
  linens_towels: { en: "Premium Towel Sets", ar: "أطقم مناشف عالية الجودة" },
  linens_towels_desc: { en: "Plush, absorbent towels in various weights and sizes.", ar: "مناشف ناعمة وماصة بأوزان وأحجام مختلفة." },
  linens_housekeeping: { en: "Housekeeping Essentials", ar: "أساسيات التدبير المنزلي" },
  linens_housekeeping_desc: { en: "Efficient solutions for maintaining pristine guest rooms.", ar: "حلول فعالة للحفاظ على غرف الضيوف في حالة مثالية." },
};

export async function seedDatabase() {
  const existingAdmin = await storage.getUserByUsername("admin");
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await storage.createUser({ username: "admin", password: hashedPassword });
    console.log("Default admin user created (username: admin, password: admin123)");
  }

  const existingContent = await storage.getAllContent();
  if (existingContent.length === 0) {
    const contents = Object.entries(defaultTranslations).map(([key, val]) => ({
      key,
      valueEn: val.en,
      valueAr: val.ar,
    }));
    await storage.bulkUpsertContent(contents);
    console.log(`Seeded ${contents.length} content entries`);
  }

  const existingCategories = await storage.getAllCategories();
  if (existingCategories.length === 0) {
    const defaultCategories = [
      { nameEn: "Room Service", nameAr: "خدمة الغرف", slug: "room-service", imageUrl: "", sortOrder: 1 },
      { nameEn: "Linens", nameAr: "البياضات", slug: "linens", imageUrl: "", sortOrder: 2 },
      { nameEn: "Spa", nameAr: "السبا", slug: "spa", imageUrl: "", sortOrder: 3 },
      { nameEn: "Amenities", nameAr: "المرافق", slug: "amenities", imageUrl: "", sortOrder: 4 },
      { nameEn: "Food & Beverage", nameAr: "الأغذية والمشروبات", slug: "food-beverage", imageUrl: "", sortOrder: 5 },
      { nameEn: "Buffet & Banqueting", nameAr: "البوفيه والمآدب", slug: "buffet-banqueting", imageUrl: "", sortOrder: 6 },
      { nameEn: "Towels", nameAr: "المناشف", slug: "towels", imageUrl: "", sortOrder: 7 },
      { nameEn: "Mini Bar & Safes", nameAr: "الميني بار والخزن", slug: "minibar", imageUrl: "", sortOrder: 8 },
      { nameEn: "Housekeeping", nameAr: "التدبير الفندقي", slug: "housekeeping", imageUrl: "", sortOrder: 9 },
      { nameEn: "Furniture", nameAr: "الأثاث", slug: "furniture", imageUrl: "", sortOrder: 10 },
      { nameEn: "Banqueting", nameAr: "قاعات الاحتفالات", slug: "banqueting", imageUrl: "", sortOrder: 11 },
    ];
    for (const cat of defaultCategories) {
      await storage.createCategory(cat);
    }
    console.log(`Seeded ${defaultCategories.length} categories`);
  }
}
