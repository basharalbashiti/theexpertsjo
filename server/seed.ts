import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { db } from "./db";
import { users, siteContent, partners, brands, siteImages, clients, products, leadership, keyContacts, quickLinks, categories } from "@shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

const SEED_VERSION = "2";

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
  hero4_title: { en: "", ar: "" },
  hero4_subtitle: { en: "", ar: "" },
  hero4_desc: { en: "", ar: "" },
  discover_more: { en: "Discover More", ar: "اكتشف المزيد" },
  all_in_one: { en: "All in One Place", ar: "الكل في مكان واحد" },
  hospitality_solution: { en: "Your All-in-one Hospitality Solution", ar: "حلك المتكامل للضيافة" },
  home_desc1: { en: "At The Experts, we supply premium hospitality products and essential hotel supplies across the Middle East.", ar: "في الخبراء، نقوم بتوريد منتجات الضيافة الفاخرة ومستلزمات الفنادق الأساسية في جميع أنحاء الشرق الأوسط." },
  home_desc2: { en: "Whether you operate a large hotel or a boutique property, our carefully curated offerings deliver consistent quality and a memorable guest experience.", ar: "سواء كنت تدير فندقاً كبيراً أو عقاراً صغيراً، فإن عروضنا المنسقة بعناية توفر جودة متسقة وتجربة ضيوف لا تُنسى." },
  our_categories: { en: "Our Categories", ar: "أقسامنا" },
  stat_offices: { en: "Offices", ar: "مكاتب" },
  stat_warehouses: { en: "Warehouses", ar: "مستودعات" },
  stat_countries: { en: "Countries Served", ar: "دول نخدمها" },
  stat_skus: { en: "SKUs", ar: "وحدة حفظ مخزون" },
  stat_product_lines: { en: "Product Lines", ar: "خطوط الإنتاج" },
  stat_brands: { en: "Brands", ar: "علامة تجارية" },
  stat_projects: { en: "Projects", ar: "مشروع" },
  stat_clients: { en: "Clients", ar: "عميل" },
  footer_desc: { en: "Supplying comfort and quality to your guests. Premium hospitality products across the Middle East.", ar: "توريد الراحة والجودة لضيوفك. منتجات ضيافة متميزة في جميع أنحاء الشرق الأوسط." },
  footer_text: { en: "The Experts For Hotels Supplies Company ", ar: "شركة الخبراء لتوريد مستلزمات الفنادق" },
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
  leader1_name: { en: "Alaa Abdin", ar: "علاء عابدين" },
  leader1_role: { en: "General Manager", ar: "مدير عام" },
  leader2_name: { en: "Rafat Daood", ar: "رأفت داود" },
  leader2_role: { en: "Sales Manager", ar: "مدير المبيعات" },
  leader3_name: { en: "Marwan Abu Sakha", ar: "مروان أبو سخا" },
  leader3_role: { en: "Group Corporate Development Manager", ar: "مدير تطوير المجموعة" },
  leader4_name: { en: "Khaled Ghunaim", ar: "خالد غنيم" },
  leader4_role: { en: "General Manager - Jordan", ar: "مدير عام - الأردن" },
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
  about_hero_desc: { en: "Discover our story, mission, and the values that drive us to deliver excellence in hospitality.", ar: "اكتشف قصتنا ومهمتنا والقيم التي تدفعنا لتقديم التميز في الضيافة." },
  sustainability_hero_desc: { en: "Committed to eco-friendly practices and responsible sourcing for a better future.", ar: "ملتزمون بالممارسات الصديقة للبيئة والتوريد المسؤول من أجل مستقبل أفضل." },
  room_service_hero_desc: { en: "Elevating in-room dining with premium service equipment and elegant presentation.", ar: "الارتقاء بتجربة تناول الطعام داخل الغرف مع معدات خدمة متميزة وتقديم أنيق." },
  category_hero_desc: { en: "Browse our curated selection of premium hospitality products.", ar: "تصفح مجموعتنا المختارة من منتجات الضيافة المتميزة." },
  cat_amenities: { en: "Amenities", ar: "المرافق" },
  cat_banqueting: { en: "Banqueting", ar: "قاعات الاحتفالات" },
  cat_buffet_banqueting: { en: "Buffet & Banqueting", ar: "أستاندات البوفيه والمآدب" },
  cat_food_beverage: { en: "Food & Beverage", ar: "الأغذية والمشروبات" },
  cat_furniture: { en: "Furniture", ar: "الأثاث" },
  cat_housekeeping: { en: "Housekeeping", ar: "التدبير الفندقي" },
  cat_linens: { en: "Linens", ar: "البياضات" },
  cat_minibar: { en: "Mini Bar & Safes", ar: "الميني بار والخزن" },
  cat_room_service: { en: "Room Service", ar: "خدمة الغرف" },
  cat_spa: { en: "Spa", ar: "السبا" },
  cat_towels: { en: "Towels", ar: "المناشف" },
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
  rs_trolley: { en: "Elite Service Trolley", ar: "عربة خدمة النخبة" },
  rs_trolley_desc: { en: "Handcrafted from solid walnut with whisper-quiet, non-marking wheels. Featuring integrated heating compartments and foldable side wings for space efficiency.", ar: "مصنوعة يدوياً من الجوز الصلب مع عجلات هادئة وغير ملوثة. تتميز بحجرات تسخين مدمجة وأجنحة جانبية قابلة للطي لكفاءة المساحة." },
  rs_carafe: { en: "Signature Thermal Carafe", ar: "إبريق حراري مميز" },
  rs_carafe_desc: { en: "Double-walled vacuum insulation keeps beverages at the perfect temperature for up to 12 hours. Ergonomic handle and drip-free pouring spout for effortless service.", ar: "عزل مزدوج الجدار يحافظ على المشروبات في درجة حرارة مثالية لمدة تصل إلى 12 ساعة. مقبض مريح وفوهة صب بدون تنقيط لخدمة سهلة." },
  rs_cloche: { en: "Mirror-Finish Cloche", ar: "غطاء طعام بلمسة مرآة" },
  rs_cloche_desc: { en: "Precision-engineered from 18/10 stainless steel. High-mirror polish adds a touch of theater to the dining experience while maintaining optimal food temperature.", ar: "مصمم بدقة من الفولاذ المقاوم للصدأ 18/10. يضيف التلميع العالي لمسة من الأناقة لتجربة الطعام مع الحفاظ على درجة حرارة الطعام المثالية." },
  spa_robes: { en: "Premium Bathrobes", ar: "أرواب حمام مريحة" },
  spa_robes_desc: { en: "Ultra-soft organic cotton robes with custom embroidery options.", ar: "أرواب من القطن العضوي فائق النعومة مع خيارات تطريز مخصصة." },
  spa_essentials: { en: "Aromatherapy Essentials", ar: "أساسيات العلاج العطري" },
  spa_essentials_desc: { en: "Curated selection of essential oils and candles for relaxation.", ar: "مجموعة مختارة من الزيوت العطرية والشموع للاسترخاء." },
  spa_stones: { en: "Hot Stone Sets", ar: "أطقم الأحجار الساخنة" },
  spa_stones_desc: { en: "Professional basalt stones for premium spa treatments.", ar: "أحجار بازلت احترافية لعلاجات السبا المتميزة." },
  towels_bath: { en: "Luxury Bath Towels", ar: "مناشف حمام فاخرة" },
  towels_bath_desc: { en: "Zero-twist cotton towels with superior absorption.", ar: "مناشف قطنية زيرو تويست بامتصاص فائق." },
  towels_hand: { en: "Jacquard Hand Towels", ar: "مناشف يد جاكار" },
  towels_hand_desc: { en: "Elegant patterned towels with custom monogramming.", ar: "مناشف بأنماط أنيقة مع إمكانية نقش الشعار." },
  towels_pool: { en: "Pool & Beach Towels", ar: "مناشف المسبح والشاطئ" },
  towels_pool_desc: { en: "Oversized cabana-stripe towels in vibrant resort colors.", ar: "مناشف كابانا كبيرة بألوان المنتجعات النابضة بالحياة." },
  minibar_silent: { en: "Silent Absorption Minibars", ar: "ميني بار صامت" },
  minibar_silent_desc: { en: "Zero-decibel thermoelectric cooling with A++ energy rating.", ar: "تبريد كهروحراري بدون صوت مع تصنيف طاقة A++." },
  minibar_safe: { en: "Digital In-Room Safes", ar: "خزائن رقمية للغرف" },
  minibar_safe_desc: { en: "Motorized safes with audit trail and emergency override.", ar: "خزائن بمحرك مع سجل مراجعة وتجاوز طوارئ." },
  housekeeping_cart: { en: "Professional Carts", ar: "عربات احترافية" },
  housekeeping_cart_desc: { en: "Heavy-duty carts with lockable storage and ergonomic design.", ar: "عربات متينة بتخزين قابل للقفل وتصميم مريح." },
  housekeeping_vacuum: { en: "Cordless Vacuums", ar: "مكانس لاسلكية" },
  housekeeping_vacuum_desc: { en: "Ultra-quiet HEPA filtration for occupied-room cleaning.", ar: "تصفية HEPA هادئة للغاية لتنظيف الغرف المشغولة." },
  housekeeping_eco: { en: "Eco-Friendly Kits", ar: "أطقم صديقة للبيئة" },
  housekeeping_eco_desc: { en: "Biodegradable cleaning solutions certified for hospitality.", ar: "حلول تنظيف قابلة للتحلل معتمدة للضيافة." },
  furniture_desk: { en: "Executive Desks", ar: "مكاتب تنفيذية" },
  furniture_desk_desc: { en: "Solid walnut desks with wireless charging and cable management.", ar: "مكاتب من خشب الجوز الصلب مع شحن لاسلكي وإدارة كابلات." },
  furniture_chair: { en: "Lounge Chairs", ar: "كراسي استرخاء" },
  furniture_chair_desc: { en: "Italian-designed chairs with fire-retardant premium upholstery.", ar: "كراسي بتصميم إيطالي بتنجيد فاخر مقاوم للحريق." },
  furniture_table: { en: "Bedside Tables", ar: "طاولات جانبية" },
  furniture_table_desc: { en: "Minimalist tables with touch lighting and USB-C charging.", ar: "طاولات بتصميم بسيط مع إضاءة لمسية وشحن USB-C." },
  banquet_chair: { en: "Stackable Chairs", ar: "كراسي قابلة للتكديس" },
  banquet_chair_desc: { en: "Commercial-grade chairs with lumbar support, stack 10 high.", ar: "كراسي بدرجة تجارية مع دعم قطني، تتكدس 10 كراسي." },
  banquet_table: { en: "Folding Tables", ar: "طاولات قابلة للطي" },
  banquet_table_desc: { en: "Heavy-duty ABS tables with powder-coated steel frames.", ar: "طاولات ABS متينة بإطارات فولاذ مطلية." },
  banquet_stage: { en: "Stage Platforms", ar: "منصات مسرح" },
  banquet_stage_desc: { en: "Modular interlocking platforms for events of any size.", ar: "منصات معيارية متشابكة لفعاليات بأي حجم." },
};

export async function seedDatabase() {
  const [versionRecord] = await db.select().from(siteContent).where(eq(siteContent.key, "_seed_version"));
  const currentVersion = versionRecord?.valueEn || "0";
  const needsMigration = currentVersion !== SEED_VERSION;

  const existingAdmin = await storage.getUserByUsername("admin");
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await storage.createUser({ username: "admin", password: hashedPassword });
    console.log("Default admin user created (username: admin, password: admin123)");
  }

  const deprecatedKeys = ["info", "info_title", "info_subtitle", "info_content"];
  for (const key of deprecatedKeys) {
    await db.delete(siteContent).where(eq(siteContent.key, key));
  }

  const existingContent = await storage.getAllContent();
  const existingKeys = new Set(existingContent.map(c => c.key));
  const missingEntries = Object.entries(defaultTranslations)
    .filter(([key]) => !existingKeys.has(key))
    .map(([key, val]) => ({ key, valueEn: val.en, valueAr: val.ar }));
  if (missingEntries.length > 0) {
    await storage.bulkUpsertContent(missingEntries);
    console.log(`Seeded ${missingEntries.length} missing content entries`);
  }

  const existingCategories = await storage.getAllCategories();
  if (existingCategories.length === 0) {
    const defaultCategories = [
      { nameEn: "Room Service", nameAr: "خدمة الغرف", slug: "room-service", imageUrl: "/uploads/cat-room-service.png", sortOrder: 1 },
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
  } else {
    const categoryImageMap: Record<string, string> = {
      "room-service": "/uploads/cat-room-service.png",
    };
    for (const cat of existingCategories) {
      const expectedImage = categoryImageMap[cat.slug];
      if (expectedImage && cat.imageUrl !== expectedImage) {
        await storage.updateCategory(cat.id, { imageUrl: expectedImage });
      }
    }
    console.log("Updated existing category image URLs");
  }

  const defaultPartnerData = [
    { name: "ABDEEN", imageUrl: "/uploads/partner-abdeen-custom.png", sortOrder: 1 },
    { name: "Cashmere", imageUrl: "/uploads/partner-cashmere-custom.png", sortOrder: 2 },
  ];
  const existingPartners = await storage.getAllPartners();
  if (existingPartners.length === 0) {
    for (const partner of defaultPartnerData) {
      await storage.createPartner(partner);
    }
    console.log(`Seeded ${defaultPartnerData.length} partners`);
  } else if (needsMigration) {
    await db.delete(partners);
    for (const partner of defaultPartnerData) {
      await storage.createPartner(partner);
    }
    console.log(`Migrated ${defaultPartnerData.length} partners`);
  }

  const defaultSiteImages = [
    { key: "hero1", imageUrl: "/uploads/hero-custom-1.png", label: "Hero Banner 1" },
    { key: "hero2", imageUrl: "/uploads/hero-custom-2.png", label: "Hero Banner 2" },
    { key: "hero3", imageUrl: "/uploads/hero-custom-3.png", label: "Hero Banner 3" },
    { key: "hero4", imageUrl: "", label: "Hero Banner 4" },
    { key: "logo", imageUrl: "/uploads/site-logo-custom.png", label: "Site Logo" },
    { key: "products_banner", imageUrl: "/uploads/products-banner.png", label: "Products Page Banner" },
    { key: "contact_banner", imageUrl: "/uploads/contact-banner.png", label: "Contact Page Banner" },
    { key: "about_banner", imageUrl: "/uploads/about-banner.jpg", label: "About Page Banner" },
    { key: "about_mission", imageUrl: "/uploads/about-mission.jpg", label: "About Mission Image" },
    { key: "about_vision", imageUrl: "/uploads/about-vision.jpg", label: "About Vision Image" },
    { key: "about_chairman", imageUrl: "/uploads/about-chairman.jpg", label: "About Chairman Image" },
    { key: "partners_banner", imageUrl: "/uploads/partners-banner.png", label: "Partners Page Banner" },
    { key: "partners_cta", imageUrl: "/uploads/partners-cta.png", label: "Partners CTA Image" },
    { key: "category_banner", imageUrl: "/uploads/category-banner.png", label: "Category Detail Banner" },
    { key: "home_section", imageUrl: "/uploads/home-section-image.jpg", label: "Home Section Image" },
  ];
  for (const img of defaultSiteImages) {
    await storage.upsertSiteImage(img);
  }
  console.log(`Upserted ${defaultSiteImages.length} site images`);

  const defaultBrandData = [
    { name: "ABDEEN", imageUrl: "/uploads/partner-abdeen-custom.png" },
    { name: "Cashmere", imageUrl: "/uploads/partner-cashmere-custom.png" },
  ];
  const existingBrands = await storage.getAllBrands();
  if (existingBrands.length === 0) {
    for (const brand of defaultBrandData) {
      await storage.createBrand(brand);
    }
    console.log(`Seeded ${defaultBrandData.length} brands`);
  } else if (needsMigration) {
    await db.delete(brands);
    for (const brand of defaultBrandData) {
      await storage.createBrand(brand);
    }
    console.log(`Migrated ${defaultBrandData.length} brands`);
  }

  const defaultClientData = [
    { name: "Four Seasons", imageUrl: "/uploads/four-seasons-new.png", sortOrder: 1 },
    { name: "Grand Hyatt", imageUrl: "/uploads/grand-hyatt.jpg", sortOrder: 2 },
    { name: "W Hotel", imageUrl: "/uploads/w-hotel.jpg", sortOrder: 3 },
    { name: "Landmark", imageUrl: "/uploads/landmark.jpg", sortOrder: 4 },
    { name: "Coral Baghdad", imageUrl: "/uploads/coral-baghdad.jpg", sortOrder: 5 },
    { name: "The House Hotels", imageUrl: "/uploads/the-house-hotels-logo.webp", sortOrder: 6 },
    { name: "Banyan Tree", imageUrl: "/uploads/banyan-tree.png", sortOrder: 7 },
    { name: "Rosewood", imageUrl: "/uploads/rosewood.jpg", sortOrder: 8 },
    { name: "Mandarin Oriental", imageUrl: "/uploads/mandarin-oriental.png", sortOrder: 10 },
    { name: "Accor", imageUrl: "/uploads/accor.png", sortOrder: 11 },
    { name: "Le Meridien", imageUrl: "/uploads/le-meridien.png", sortOrder: 12 },
    { name: "Crowne Plaza", imageUrl: "/uploads/crowne-plaza.png", sortOrder: 13 },
    { name: "IHG", imageUrl: "/uploads/ihg.jpg", sortOrder: 14 },
    { name: "Marriott", imageUrl: "/uploads/marriott.png", sortOrder: 15 },
    { name: "Millennium", imageUrl: "/uploads/millennium.png", sortOrder: 16 },
    { name: "Hyatt", imageUrl: "/uploads/hyatt.jpg", sortOrder: 17 },
    { name: "WYNDHAM", imageUrl: "/uploads/client-wyndham.webp", sortOrder: 18 },
    { name: "Estate Georgia", imageUrl: "/uploads/client-estate-georgia.png", sortOrder: 19 },
    { name: "FIVE", imageUrl: "/uploads/client-five.jpg", sortOrder: 20 },
    { name: "RAMADA", imageUrl: "/uploads/client-ramada.jpg", sortOrder: 21 },
    { name: "IBIS", imageUrl: "/uploads/client-ibis.jpeg", sortOrder: 22 },
    { name: "Bristol HOTEL", imageUrl: "/uploads/client-bristol.png", sortOrder: 23 },
    { name: "HILTON", imageUrl: "/uploads/client-hilton.svg", sortOrder: 24 },
    { name: "JIN JIANG", imageUrl: "/uploads/client-jin-jiang.jpg", sortOrder: 25 },
    { name: "IL PALAZSO", imageUrl: "/uploads/client-il-palazzo.jpg", sortOrder: 26 },
    { name: "Kempinski", imageUrl: "/uploads/client-kempinski.jpg", sortOrder: 27 },
    { name: "RADISSON Collection", imageUrl: "/uploads/client-radisson.jpg", sortOrder: 28 },
  ];
  const existingClients = await storage.getAllClients();
  if (existingClients.length === 0) {
    for (const client of defaultClientData) {
      await storage.createClient(client);
    }
    console.log(`Seeded ${defaultClientData.length} clients`);
  } else if (needsMigration) {
    await db.delete(clients);
    for (const client of defaultClientData) {
      await storage.createClient(client);
    }
    console.log(`Migrated ${defaultClientData.length} clients`);
  }

  const existingProducts = await storage.getAllProducts();
  if (existingProducts.length === 0) {
    const allCategories = await storage.getAllCategories();
    const catMap: Record<string, number> = {};
    for (const c of allCategories) {
      catMap[c.slug] = c.id;
    }

    const defaultProducts = [
      { nameEn: "Elite Service Trolley", nameAr: "عربة خدمة الغرف الفاخرة", descriptionEn: "Premium stainless steel service trolley with mirror finish, designed for elegant in-room dining presentations.", descriptionAr: "عربة خدمة غرف من الفولاذ المقاوم للصدأ بتشطيب مرآة، مصممة لتقديم الطعام داخل الغرف بأناقة.", imageUrl: "/uploads/rs-trolley.png", slug: "room-service", sortOrder: 1 },
      { nameEn: "Signature Thermal Carafe", nameAr: "دورق حراري مميز", descriptionEn: "Double-walled thermal carafe maintaining beverage temperature for hours, crafted with premium materials.", descriptionAr: "دورق حراري مزدوج الجدران يحافظ على حرارة المشروبات لساعات، مصنوع من مواد فاخرة.", imageUrl: "/uploads/rs-carafe.png", slug: "room-service", sortOrder: 2 },
      { nameEn: "Mirror-Finish Cloche", nameAr: "غطاء طعام بتشطيب مرآة", descriptionEn: "Handcrafted mirror-finish cloche for dramatic tableside reveals, elevating the guest dining experience.", descriptionAr: "غطاء طعام مصنوع يدوياً بتشطيب مرآة لكشف مثير عن الأطباق، يرتقي بتجربة ضيوف المطعم.", imageUrl: "/uploads/rs-cloche.png", slug: "room-service", sortOrder: 3 },

      { nameEn: "Egyptian Cotton Bed Sheet Set", nameAr: "طقم ملاءات قطن مصري", descriptionEn: "Premium 600-thread-count Egyptian cotton bed sheets with sateen weave finish. Available in king, queen, and twin sizes with deep pocket fitted sheets.", descriptionAr: "ملاءات سرير من القطن المصري الفاخر بعدد 600 خيط مع تشطيب ساتان. متوفرة بمقاسات كينج وكوين وتوين.", imageUrl: "/uploads/prod-egyptian-sheets.png", slug: "linens", sortOrder: 1 },
      { nameEn: "Luxury Duvet Cover", nameAr: "غطاء لحاف فاخر", descriptionEn: "Hotel-grade duvet cover crafted from long-staple cotton with elegant hemstitch detailing. Wrinkle-resistant and machine washable for effortless maintenance.", descriptionAr: "غطاء لحاف فندقي مصنوع من القطن طويل التيلة مع تفاصيل خياطة أنيقة. مقاوم للتجاعيد وقابل للغسل في الغسالة.", imageUrl: "/uploads/prod-duvet-cover.png", slug: "linens", sortOrder: 2 },
      { nameEn: "Sateen Pillowcase Collection", nameAr: "مجموعة أكياس وسائد ساتان", descriptionEn: "Silky-smooth sateen pillowcases with envelope closure design. Hypoallergenic and color-fast to maintain pristine appearance through hundreds of washes.", descriptionAr: "أكياس وسائد ساتان ناعمة كالحرير بتصميم إغلاق ظرف. مضادة للحساسية وثابتة اللون.", imageUrl: "/uploads/prod-sateen-pillowcases.png", slug: "linens", sortOrder: 3 },

      { nameEn: "Aromatherapy Essential Oil Diffuser", nameAr: "موزع زيوت عطرية", descriptionEn: "Whisper-quiet ultrasonic diffuser with ambient LED lighting. Programmable timer and mist intensity settings for a customized spa atmosphere.", descriptionAr: "موزع بالموجات فوق الصوتية هادئ للغاية مع إضاءة LED محيطية. مؤقت قابل للبرمجة وإعدادات كثافة الرذاذ.", imageUrl: "/uploads/prod-oil-diffuser.png", slug: "spa", sortOrder: 1 },
      { nameEn: "Heated Massage Stone Set", nameAr: "طقم أحجار تدليك ساخنة", descriptionEn: "Professional-grade basalt hot stones in a premium wooden presentation box. Retains heat for extended therapy sessions with uniform temperature distribution.", descriptionAr: "أحجار بازلت ساخنة بدرجة احترافية في صندوق خشبي فاخر. تحتفظ بالحرارة لجلسات علاج ممتدة.", imageUrl: "/uploads/prod-massage-stones.png", slug: "spa", sortOrder: 2 },
      { nameEn: "Plush Spa Robe", nameAr: "روب سبا فاخر", descriptionEn: "Ultra-soft Turkish cotton spa robe with shawl collar and double-loop terry construction. Embroidery-ready for custom hotel branding.", descriptionAr: "روب سبا من القطن التركي فائق النعومة بياقة شال وبناء تيري مزدوج الحلقات. جاهز للتطريز بشعار الفندق.", imageUrl: "/uploads/prod-spa-robe.png", slug: "spa", sortOrder: 3 },

      { nameEn: "Premium Guest Amenity Kit", nameAr: "طقم مستلزمات الضيوف الفاخر", descriptionEn: "Complete guest amenity set featuring shampoo, conditioner, body wash, and lotion in elegant refillable dispensers. Paraben-free botanical formulations.", descriptionAr: "طقم مستلزمات ضيوف كامل يضم شامبو وبلسم وغسول جسم ولوشن في موزعات أنيقة قابلة لإعادة التعبئة.", imageUrl: "/uploads/prod-amenity-kit.png", slug: "amenities", sortOrder: 1, brand: "ABDEEN" },
      { nameEn: "Vanity Mirror with LED Ring", nameAr: "مرآة تجميل بإضاءة LED", descriptionEn: "Double-sided vanity mirror with 10x magnification and daylight LED ring. Touch-sensitive dimmer with memory function and USB charging port.", descriptionAr: "مرآة تجميل مزدوجة الجوانب بتكبير 10 أضعاف وإضاءة LED نهارية. مفتاح تعتيم لمسي مع ذاكرة ومنفذ شحن USB.", imageUrl: "/uploads/prod-vanity-mirror.png", slug: "amenities", sortOrder: 2 },
      { nameEn: "Leather Guest Directory", nameAr: "دليل الضيوف الجلدي", descriptionEn: "Hand-stitched genuine leather guest directory with gold-foil hotel logo debossing. Includes room service menu, spa guide, and local attractions inserts.", descriptionAr: "دليل ضيوف من الجلد الطبيعي مخيط يدوياً مع شعار الفندق بالذهب. يتضمن قائمة خدمة الغرف ودليل السبا.", imageUrl: "/uploads/prod-guest-directory.png", slug: "amenities", sortOrder: 3 },

      { nameEn: "Crystal Glassware Collection", nameAr: "مجموعة أكواب كريستال", descriptionEn: "Lead-free crystal wine glasses, champagne flutes, and tumblers with laser-cut rims. Dishwasher safe with exceptional clarity and brilliance.", descriptionAr: "أكواب نبيذ وشمبانيا وتمبلر من الكريستال الخالي من الرصاص بحواف مقطوعة بالليزر. آمنة للغسالة.", imageUrl: "/uploads/prod-crystal-glassware.png", slug: "food-beverage", sortOrder: 1 },
      { nameEn: "Professional Chafing Dish", nameAr: "طبق تسخين احترافي", descriptionEn: "Full-size stainless steel chafing dish with hydraulic soft-close lid. Dual fuel holder design maintains consistent temperature for extended service periods.", descriptionAr: "طبق تسخين من الفولاذ المقاوم للصدأ بغطاء هيدروليكي. تصميم حامل وقود مزدوج يحافظ على درجة حرارة ثابتة.", imageUrl: "/uploads/prod-chafing-dish.png", slug: "food-beverage", sortOrder: 2 },
      { nameEn: "Artisan Coffee Service Set", nameAr: "طقم تقديم قهوة حرفي", descriptionEn: "Porcelain coffee pot, sugar bowl, and creamer set with 24K gold trim. Chip-resistant glaze ensures lasting elegance in high-traffic environments.", descriptionAr: "إبريق قهوة وسكرية وإبريق حليب من البورسلين بتشطيب ذهب عيار 24. طلاء مقاوم للكسر.", imageUrl: "/uploads/prod-coffee-set.png", slug: "food-beverage", sortOrder: 3 },

      { nameEn: "Marble-Top Buffet Station", nameAr: "محطة بوفيه بسطح رخامي", descriptionEn: "Modular buffet station with genuine Carrara marble top and brushed gold frame. Integrated sneeze guard and adjustable LED food lighting.", descriptionAr: "محطة بوفيه معيارية بسطح رخام كرارا الأصلي وإطار ذهبي مصقول. حاجز حماية متكامل وإضاءة LED.", imageUrl: "/uploads/prod-buffet-station.png", slug: "buffet-banqueting", sortOrder: 1 },
      { nameEn: "Live Cooking Station", nameAr: "محطة طهي حي", descriptionEn: "Professional live cooking station with built-in induction cooktop and extraction hood. Tempered glass display panel and granite work surface.", descriptionAr: "محطة طهي حي احترافية مع موقد حث مدمج وشفاط. لوحة عرض زجاج مقسى وسطح عمل جرانيت.", imageUrl: "/uploads/prod-cooking-station.png", slug: "buffet-banqueting", sortOrder: 2 },
      { nameEn: "Tiered Display Riser Set", nameAr: "مجموعة رافعات عرض متدرجة", descriptionEn: "Acrylic and brushed steel tiered risers for dramatic food presentation. Modular design allows countless configurations for desserts, appetizers, and more.", descriptionAr: "رافعات متدرجة من الأكريليك والفولاذ المصقول لعرض الطعام. تصميم معياري يسمح بتكوينات لا حصر لها.", imageUrl: "/uploads/prod-display-risers.png", slug: "buffet-banqueting", sortOrder: 3 },

      { nameEn: "Zero-Twist Bath Towel", nameAr: "منشفة حمام زيرو تويست", descriptionEn: "Ultra-absorbent zero-twist cotton bath towel with reinforced dobby border. Exceptionally soft hand feel that improves with every wash cycle.", descriptionAr: "منشفة حمام من القطن زيرو تويست فائقة الامتصاص بحاشية دوبي معززة. ملمس ناعم استثنائي يتحسن مع كل غسلة.", imageUrl: "/uploads/prod-bath-towel.png", slug: "towels", sortOrder: 1 },
      { nameEn: "Jacquard Hand Towel", nameAr: "منشفة يد جاكار", descriptionEn: "Elegant jacquard-woven hand towel with custom hotel monogram option. Quick-dry technology with lasting color vibrancy and shape retention.", descriptionAr: "منشفة يد منسوجة بتقنية الجاكار مع خيار شعار الفندق. تقنية جفاف سريع مع حيوية لون دائمة.", imageUrl: "/uploads/prod-hand-towel.png", slug: "towels", sortOrder: 2 },
      { nameEn: "Pool & Beach Towel", nameAr: "منشفة مسبح وشاطئ", descriptionEn: "Oversized cabana-stripe pool towel in resort-inspired colors. Sand-resistant weave with UV-stable dyes for vibrant outdoor use season after season.", descriptionAr: "منشفة مسبح كبيرة بخطوط كابانا بألوان مستوحاة من المنتجعات. نسيج مقاوم للرمل بأصباغ ثابتة ضد الأشعة فوق البنفسجية.", imageUrl: "/uploads/prod-pool-towel.png", slug: "towels", sortOrder: 3 },

      { nameEn: "Silent Absorption Minibar", nameAr: "ميني بار صامت", descriptionEn: "Thermoelectric cooling minibar with zero-decibel operation. Adjustable shelving, interior LED lighting, and automatic defrost with A++ energy rating.", descriptionAr: "ميني بار بتبريد كهروحراري بدون صوت. أرفف قابلة للتعديل وإضاءة LED داخلية وإزالة الجليد التلقائية.", imageUrl: "/uploads/prod-minibar.png", slug: "minibar", sortOrder: 1 },
      { nameEn: "Digital In-Room Safe", nameAr: "خزنة رقمية للغرف", descriptionEn: "Motorized digital safe with backlit keypad and emergency master override. Laptop-compatible interior with anti-tamper audit trail logging.", descriptionAr: "خزنة رقمية بمحرك مع لوحة مفاتيح مضيئة وتجاوز طوارئ رئيسي. داخل متوافق مع اللابتوب مع سجل مراجعة.", imageUrl: "/uploads/prod-room-safe.png", slug: "minibar", sortOrder: 2 },

      { nameEn: "Professional Housekeeping Cart", nameAr: "عربة تنظيف احترافية", descriptionEn: "Heavy-duty housekeeping cart with lockable cabinet, linen bags, and accessory caddy. Ergonomic push handle with quiet-roll rubber casters.", descriptionAr: "عربة تنظيف متينة بخزانة قابلة للقفل وأكياس مفروشات وحامل إكسسوارات. مقبض دفع مريح بعجلات مطاطية هادئة.", imageUrl: "/uploads/prod-housekeeping-cart.png", slug: "housekeeping", sortOrder: 1 },
      { nameEn: "Cordless Upright Vacuum", nameAr: "مكنسة كهربائية لاسلكية", descriptionEn: "Lightweight cordless vacuum with HEPA filtration and 60-minute runtime. Ultra-quiet motor ideal for occupied-room cleaning without disturbing guests.", descriptionAr: "مكنسة كهربائية لاسلكية خفيفة بفلتر HEPA ووقت تشغيل 60 دقيقة. محرك هادئ للغاية مثالي لتنظيف الغرف المشغولة.", imageUrl: "/uploads/prod-vacuum.png", slug: "housekeeping", sortOrder: 2 },
      { nameEn: "Eco-Friendly Cleaning Kit", nameAr: "طقم تنظيف صديق للبيئة", descriptionEn: "Complete green cleaning kit with biodegradable solutions, microfiber cloths, and color-coded spray bottles. Certified eco-friendly formulations safe for all surfaces.", descriptionAr: "طقم تنظيف أخضر كامل بمحاليل قابلة للتحلل وأقمشة مايكروفايبر وزجاجات رش مرمزة بالألوان.", imageUrl: "/uploads/prod-cleaning-kit.png", slug: "housekeeping", sortOrder: 3 },

      { nameEn: "Executive Writing Desk", nameAr: "مكتب كتابة تنفيذي", descriptionEn: "Solid walnut writing desk with integrated wireless charging pad and concealed cable management. Soft-close drawer with leather-lined interior.", descriptionAr: "مكتب كتابة من خشب الجوز الصلب مع لوحة شحن لاسلكي متكاملة وإدارة كابلات مخفية. درج بإغلاق ناعم.", imageUrl: "/uploads/prod-writing-desk.png", slug: "furniture", sortOrder: 1 },
      { nameEn: "Upholstered Lounge Chair", nameAr: "كرسي استرخاء منجد", descriptionEn: "Italian-designed lounge chair with premium bouclé upholstery and solid oak legs. Fire-retardant fill meets international hospitality safety standards.", descriptionAr: "كرسي استرخاء بتصميم إيطالي بتنجيد بوكليه فاخر وأرجل بلوط صلب. حشوة مقاومة للحريق تلبي المعايير الدولية.", imageUrl: "/uploads/prod-lounge-chair.png", slug: "furniture", sortOrder: 2 },
      { nameEn: "Bedside Console Table", nameAr: "طاولة جانبية للسرير", descriptionEn: "Minimalist bedside table with touch-activated reading light and dual USB-C ports. Scratch-resistant lacquer finish with felt-lined storage compartment.", descriptionAr: "طاولة جانبية بتصميم بسيط مع إضاءة قراءة تعمل باللمس ومنفذي USB-C. تشطيب لاكيه مقاوم للخدش.", imageUrl: "/uploads/prod-bedside-table.png", slug: "furniture", sortOrder: 3 },

      { nameEn: "Stackable Banquet Chair", nameAr: "كرسي مأدبة قابل للتكديس", descriptionEn: "Commercial-grade banquet chair with ergonomic lumbar support and stain-resistant fabric. Stacks 10 high with protective bumpers for efficient storage.", descriptionAr: "كرسي مأدبة بدرجة تجارية مع دعم قطني مريح وقماش مقاوم للبقع. يتكدس 10 كراسي مع واقيات.", imageUrl: "/uploads/prod-banquet-chair.png", slug: "banqueting", sortOrder: 1 },
      { nameEn: "Folding Banquet Table", nameAr: "طاولة مأدبة قابلة للطي", descriptionEn: "Heavy-duty folding banquet table with ABS blow-molded top and powder-coated steel frame. Seats 8 comfortably with gravity-lock folding legs.", descriptionAr: "طاولة مأدبة قابلة للطي متينة بسطح ABS وإطار فولاذ مطلي. تتسع لـ 8 أشخاص بأرجل قابلة للطي.", imageUrl: "/uploads/prod-banquet-table.png", slug: "banqueting", sortOrder: 2 },
      { nameEn: "Portable Stage Platform", nameAr: "منصة مسرح متنقلة", descriptionEn: "Modular stage platform with adjustable height legs and non-slip carpet surface. Interlocking design creates seamless stages of any size for events.", descriptionAr: "منصة مسرح معيارية بأرجل قابلة لتعديل الارتفاع وسطح سجاد مانع للانزلاق. تصميم متشابك ينشئ مسارح بأي حجم.", imageUrl: "/uploads/prod-stage-platform.png", slug: "banqueting", sortOrder: 3 },
    ];

    for (const prod of defaultProducts) {
      const categoryId = catMap[prod.slug];
      if (categoryId) {
        await storage.createProduct({
          nameEn: prod.nameEn,
          nameAr: prod.nameAr,
          descriptionEn: prod.descriptionEn,
          descriptionAr: prod.descriptionAr,
          imageUrl: prod.imageUrl,
          categoryId,
          sortOrder: prod.sortOrder,
        });
      }
    }
    console.log(`Seeded ${defaultProducts.length} products across all categories`);
  }

  const existingLeaders = await storage.getAllLeadership();
  if (existingLeaders.length === 0) {
    const defaultLeaders = [
      { nameEn: "Alaa Abdin", nameAr: "علاء عابدين", roleEn: "General Manager", roleAr: "مدير عام", phone: "+962 79 5779345", email: "alaa@theexpertsjo.com", sortOrder: 1 },
      { nameEn: "Rafat Daood", nameAr: "رأفت داود", roleEn: "Sales Manager", roleAr: "مدير المبيعات", phone: "+962 79 0484745", email: "sales@theexpertsjo.com", sortOrder: 2 },
      { nameEn: "Marwan Abu Sakha", nameAr: "مروان أبو سخا", roleEn: "Group Corporate Development Manager", roleAr: "مدير تطوير المجموعة", sortOrder: 3 },
      { nameEn: "Khaled Ghunaim", nameAr: "خالد غنيم", roleEn: "General Manager - Jordan", roleAr: "مدير عام - الأردن", sortOrder: 4 },
    ];
    for (const leader of defaultLeaders) {
      await storage.createLeader(leader);
    }
    console.log(`Seeded ${defaultLeaders.length} leadership members`);
  }

  const existingKeyContacts = await storage.getAllKeyContacts();
  if (existingKeyContacts.length === 0) {
    const defaultKeyContacts = [
      { nameEn: "Alaa Abdin", nameAr: "علاء عابدين", roleEn: "General Manager", roleAr: "مدير عام", phone: "+962 79 5779345", email: "alaa@theexpertsjo.com", sortOrder: 1 },
      { nameEn: "Rafat Daood", nameAr: "رأفت داود", roleEn: "Sales Manager", roleAr: "مدير المبيعات", phone: "+962 79 0484745", email: "sales@theexpertsjo.com", sortOrder: 2 },
    ];
    for (const contact of defaultKeyContacts) {
      await storage.createKeyContact(contact);
    }
    console.log(`Seeded ${defaultKeyContacts.length} key contacts`);
  }

  const existingQuickLinks = await storage.getAllQuickLinks();
  if (existingQuickLinks.length === 0) {
    const defaultQuickLinks = [
      { labelEn: "Home", labelAr: "الرئيسية", url: "/", sortOrder: 1 },
      { labelEn: "About Us", labelAr: "من نحن", url: "/about-us", sortOrder: 2 },
      { labelEn: "Products", labelAr: "المنتجات", url: "/categories", sortOrder: 3 },
      { labelEn: "Contact", labelAr: "اتصل بنا", url: "/contact", sortOrder: 4 },
    ];
    for (const link of defaultQuickLinks) {
      await storage.createQuickLink(link);
    }
    console.log(`Seeded ${defaultQuickLinks.length} quick links`);
  }

  if (needsMigration) {
    await db.insert(siteContent).values({ key: "_seed_version", valueEn: SEED_VERSION, valueAr: SEED_VERSION })
      .onConflictDoUpdate({ target: siteContent.key, set: { valueEn: SEED_VERSION, valueAr: SEED_VERSION } });
    console.log(`Seed version updated to ${SEED_VERSION}`);
  }

}
