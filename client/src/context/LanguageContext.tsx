import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "EN" | "AR";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Nav
    home: "Home",
    about: "About Us",
    products: "Products",
    partners: "Partners & Clients",
    partners_clients: "Partners & Clients",
    sustainability: "Sustainability",
    contact: "Contact",
    // Hero
    hero1_title: "Supplying Comfort",
    hero1_subtitle: "Luxury to Your Guests",
    hero1_desc: "Experience the pinnacle of hospitality supply with our premium collection.",
    hero2_title: "Bringing Elegance",
    hero2_subtitle: "Ease to Your Visitors",
    hero2_desc: "Curated amenities that define sophistication and care.",
    hero3_title: "Enhancing Every Stay",
    hero3_subtitle: "Style and Comfort",
    hero3_desc: "Transforming ordinary stays into extraordinary memories.",
    discover_more: "Discover More",
    // Home
    all_in_one: "All in One Place",
    hospitality_solution: "Your All-in-one Hospitality Solution",
    home_desc1: "At The Experts, we supply premium hospitality products and essential hotel supplies across the Middle East.",
    home_desc2: "Whether you operate a large hotel or a boutique property, our carefully curated offerings deliver consistent quality and a memorable guest experience.",
    our_categories: "Our Categories",
    // Categories
    cat_towels: "Towels",
    cat_minibar: "Mini Bar & Safes",
    cat_amenities: "Amenities",
    cat_food: "Food & Beverage",
    cat_housekeeping: "Housekeeping",
    cat_furniture: "Furniture",
    cat_linens: "Linens",
    cat_buffet: "Buffet Stands",
    cat_banqueting: "Banqueting",
    cat_spa: "Spa",
    cat_room_service: "Room Service",
    // Stats
    stat_offices: "Offices",
    stat_warehouses: "Warehouses",
    stat_countries: "Countries Served",
    stat_skus: "SKUs",
    stat_product_lines: "Product Lines",
    stat_brands: "Brands",
    stat_projects: "Projects",
    stat_clients: "Clients",
    // Footer
    footer_desc: "Supplying comfort and luxury to your guests. Premium hospitality products across the Middle East.",
    quick_links: "Quick Links",
    categories: "Categories",
    contact_us: "Contact Us",
    rights_reserved: "All rights reserved.",
    // About
    who_we_are: "Who We Are",
    founded_in: "Founded in Dubai in 2003",
    about_desc: "The Experts has grown from a regional leader to a global provider of premium amenity solutions for hotels. With roots in the Middle East and a growing international footprint, we deliver high-quality, tailor-made products that elevate guest experiences and strengthen brand identity worldwide.",
    chairman_msg: "Chairman’s Message",
    chairman_quote: "Welcome to The Experts. Since our founding in 2003 in the UAE, we have remained dedicated to transforming the hospitality experience by delivering premium, tailor-made solutions that elevate guest satisfaction.",
    chairman_name: "Alaa Abdeen",
    chairman_title: "Chairman",
    our_mission: "Our Mission",
    mission_desc: "Streamlining hotel procurement with premium, cost-effective amenities and reliable delivery.",
    our_vision: "Our Vision",
    vision_desc: "To be the global leader in hotel procurement, delivering innovative, high-quality solutions.",
    our_leadership: "Our Leadership",
    // Sustainability
    sustainability_quote: "Sustainability is transforming the hospitality industry, driving a shift toward eco-friendly practices and responsible sourcing.",
    our_practices: "Our Practices",
    harmony: "Harmony of Luxury and Nature",
    sustain_desc1: "At The Experts, we believe sustainability and luxury go hand in hand. That’s why we craft high-quality amenities using eco-friendly materials, responsible sourcing, and sustainable production methods.",
    sustain_desc2: "From biodegradable essentials to recyclable packaging, every detail is designed to reduce environmental impact without compromising excellence.",
    ecovadis_title: "EcoVadis Certification",
    ecovadis_desc: "We are proud to announce our pursuit of EcoVadis certification, a globally recognized standard for ethical and sustainable business practices. This achievement reflects our dedication to eco-friendly sourcing and responsible manufacturing.",
    download_sop: "Download Our SOP",
    employee_handbook: "Employee Handbook",
    // Contact
    get_in_touch: "Get in touch with our global offices",
    send_message: "Send us a message",
    full_name: "Full Name",
    email_addr: "Email Address",
    subject: "Subject",
    message: "Message",
    submit: "Send Message",
    our_locations: "Our Locations",
    dubai: "Dubai, UAE",
    riyadh: "Riyadh, KSA",
    amman: "Amman, Jordan",
    // Partners
    trusted_by: "Trusted by world-class hospitality brands",
    partner_excellence: "Partner with Excellence",
    partner_desc: "We collaborate with the world's most prestigious hotel groups to deliver uncompromised quality and bespoke guest experiences. Join our network of successful partners today.",
    become_partner: "Become a Partner",
    // Product Page
    our_products: "Our Products",
    explore_range: "Explore our comprehensive range of hotel supplies designed to elevate your guest experience.",
    looking_specific: "Looking for something specific?",
    contact_sales: "Contact Sales Team",
    // Category Products
    rs_trolley: "Elite Service Trolley",
    rs_trolley_desc: "Handcrafted from solid walnut with whisper-quiet, non-marking wheels. Featuring integrated heating compartments and foldable side wings for space efficiency.",
    rs_carafe: "Signature Thermal Carafe",
    rs_carafe_desc: "Double-walled vacuum insulation keeps beverages at the perfect temperature for up to 12 hours. Ergonomic handle and drip-free pouring spout for effortless service.",
    rs_cloche: "Mirror-Finish Cloche",
    rs_cloche_desc: "Precision-engineered from 18/10 stainless steel. High-mirror polish adds a touch of theater to the dining experience while maintaining optimal food temperature.",
    spa_towels: "Premium Cotton Towels",
    spa_towels_desc: "Ultra-absorbent, 800 GSM Egyptian cotton towels for a spa-like feel.",
    spa_robes: "Luxury Bathrobes",
    spa_robes_desc: "Soft, breathable waffle-weave robes designed for maximum comfort.",
    spa_essentials: "Aromatherapy Essentials",
    spa_essentials_desc: "Curated selection of essential oils and candles for relaxation.",
    amenities_sig: "Signature Collection",
    amenities_sig_desc: "Eco-friendly bathroom amenities with botanical extracts.",
    amenities_kits: "Personal Care Kits",
    amenities_kits_desc: "Thoughtfully curated kits for the modern traveler.",
    amenities_custom: "Custom Branded Sets",
    amenities_custom_desc: "High-quality products tailored to your hotel's identity.",
    buffet_modular: "Modular Buffet Systems",
    buffet_modular_desc: "Sleek, versatile buffet stands that adapt to any space and style.",
    buffet_tables: "Premium Banquet Tables",
    buffet_tables_desc: "Durable and elegant tables designed for high-capacity events.",
    buffet_present: "Luxury Food Presentation",
    buffet_present_desc: "Elevated risers and platters to showcase culinary excellence.",
    fb_cocktail: "Cocktail Accessories",
    fb_cocktail_desc: "Colorful and stylish stirrers, skewers, and picks for premium bar service.",
    fb_glass: "Glassware Collection",
    fb_glass_desc: "Elegant, high-clarity glassware for every beverage type.",
    fb_bar: "Bar Equipment",
    fb_bar_desc: "Professional-grade tools for precision mixology.",
    linens_bed: "Premium Bed Linens",
    linens_bed_desc: "High-thread-count cotton sheets for ultimate guest comfort.",
    linens_towels: "Luxury Towel Sets",
    linens_towels_desc: "Plush, absorbent towels in various weights and sizes.",
    linens_housekeeping: "Housekeeping Essentials",
    linens_housekeeping_desc: "Efficient solutions for maintaining pristine guest rooms.",
  },
  AR: {
    // Nav
    home: "الرئيسية",
    about: "من نحن",
    products: "المنتجات",
    partners: "شركاؤنا وعملاؤنا",
    partners_clients: "شركاؤنا وعملاؤنا",
    sustainability: "الاستدامة",
    contact: "اتصل بنا",
    // Hero
    hero1_title: "توريد الراحة",
    hero1_subtitle: "الفخامة لضيوفك",
    hero1_desc: "اختبر قمة توريد مستلزمات الضيافة مع مجموعتنا المميزة.",
    hero2_title: "إضفاء الأناقة",
    hero2_subtitle: "السهولة لزوارك",
    hero2_desc: "مرافق مختارة بعناية تحدد الرقي والاهتمام.",
    hero3_title: "تحسين كل إقامة",
    hero3_subtitle: "الأسلوب والراحة",
    hero3_desc: "تحويل الإقامات العادية إلى ذكريات استثنائية.",
    discover_more: "اكتشف المزيد",
    // Home
    all_in_one: "الكل في مكان واحد",
    hospitality_solution: "حلك المتكامل للضيافة",
    home_desc1: "في الخبراء، نقوم بتوريد منتجات الضيافة الفاخرة ومستلزمات الفنادق الأساسية في جميع أنحاء الشرق الأوسط.",
    home_desc2: "سواء كنت تدير فندقاً كبيراً أو عقاراً صغيراً، فإن عروضنا المنسقة بعناية توفر جودة متسقة وتجربة ضيوف لا تُنسى.",
    our_categories: "أقسامنا",
    // Categories
    cat_towels: "المناشف",
    cat_minibar: "الميني بار والخزن",
    cat_amenities: "المرافق",
    cat_food: "الأغذية والمشروبات",
    cat_housekeeping: "التدبير الفندقي",
    cat_furniture: "الأثاث",
    cat_linens: "البياضات",
    cat_buffet: "أستاندات البوفيه",
    cat_banqueting: "قاعات الاحتفالات",
    cat_spa: "السبا",
    cat_room_service: "خدمة الغرف",
    // Stats
    stat_offices: "مكاتب",
    stat_warehouses: "مستودعات",
    stat_countries: "دول نخدمها",
    stat_skus: "وحدة حفظ مخزون",
    stat_product_lines: "خطوط الإنتاج",
    stat_brands: "علامة تجارية",
    stat_projects: "مشروع",
    stat_clients: "عميل",
    // Footer
    footer_desc: "توريد الراحة والفخامة لضيوفك. منتجات ضيافة فاخرة في جميع أنحاء الشرق الأوسط.",
    quick_links: "روابط سريعة",
    categories: "الأقسام",
    contact_us: "اتصل بنا",
    rights_reserved: "جميع الحقوق محفوظة.",
    // About
    who_we_are: "من نحن",
    founded_in: "تأسست في دبي عام 2003",
    about_desc: "نمت شركة الخبراء من رائد إقليمي إلى مزود عالمي لحلول المرافق الفاخرة للفنادق. مع جذور في الشرق الأوسط وبصمة دولية متنامية، نقدم منتجات عالية الجودة ومصممة خصيصاً ترفع من تجارب الضيوف وتعزز هوية العلامة التجارية في جميع أنحاء العالم.",
    chairman_msg: "رسالة رئيس مجلس الإدارة",
    chairman_quote: "مرحباً بكم في الخبراء. منذ تأسيسنا في عام 2003 في دولة الإمارات العربية المتحدة، ظللنا مكرسين لتحويل تجربة الضيافة من خلال تقديم حلول فاخرة ومصممة خصيصاً ترفع من رضا الضيوف.",
    chairman_name: "علاء عابدين",
    chairman_title: "رئيس مجلس الإدارة",
    our_mission: "مهمتنا",
    mission_desc: "تبسيط شراء مستلزمات الفنادق مع مرافق فاخرة وفعالة من حيث التكلفة وتسليم موثوق.",
    our_vision: "رؤيتنا",
    vision_desc: "أن نكون الرائد العالمي في شراء مستلزمات الفنادق، ونقدم حلولاً مبتكرة وعالية الجودة.",
    our_leadership: "قيادتنا",
    // Sustainability
    sustainability_quote: "الاستدامة تحول صناعة الضيافة، وتدفع التحول نحو الممارسات الصديقة للبيئة والتوريد المسؤول.",
    our_practices: "ممارساتنا",
    harmony: "تناغم الفخامة والطبيعة",
    sustain_desc1: "في الخبراء، نؤمن بأن الاستدامة والفخامة يسيران جنباً إلى جنب. ولهذا السبب نصنع مرافق عالية الجودة باستخدام مواد صديقة للبيئة، وتوريد مسؤول، وأساليب إنتاج مستدامة.",
    sustain_desc2: "من الأساسيات القابلة للتحلل الحيوي إلى التغليف القابل لإعادة التدوير، تم تصميم كل التفاصيل لتقليل الأثر البيئي دون المساومة على التميز.",
    ecovadis_title: "شهادة إيكوفاديس",
    ecovadis_desc: "نحن فخورون بالإعلان عن سعينا للحصول على شهادة إيكوفاديس، وهي معيار معترف به عالمياً لممارسات الأعمال الأخلاقية والمستدامة. يعكس هذا الإنجاز تفانينا في التوريد الصديق للبيئة والتصنيع المسؤول.",
    download_sop: "تحميل إجراءات العمل",
    employee_handbook: "دليل الموظف",
    // Contact
    get_in_touch: "تواصل مع مكاتبنا العالمية",
    send_message: "أرسل لنا رسالة",
    full_name: "الاسم الكامل",
    email_addr: "البريد الإلكتروني",
    subject: "الموضوع",
    message: "الرسالة",
    submit: "إرسال الرسالة",
    our_locations: "مواقعنا",
    dubai: "دبي، الإمارات",
    riyadh: "الرياض، السعودية",
    amman: "عمان، الأردن",
    // Partners
    trusted_by: "موثوق به من قبل علامات تجارية عالمية في مجال الضيافة",
    partner_excellence: "شراكة مع التميز",
    partner_desc: "نحن نتعاون مع مجموعات الفنادق المرموقة في العالم لتقديم جودة غير مساومة وتجارب ضيوف مخصصة. انضم إلى شبكة شركائنا الناجحة اليوم.",
    become_partner: "كن شريكاً",
    // Product Page
    our_products: "منتجاتنا",
    explore_range: "استكشف مجموعتنا الشاملة من مستلزمات الفنادق المصممة لرفع تجربة ضيوفك.",
    looking_specific: "تبحث عن شيء محدد؟",
    contact_sales: "اتصل بفريق المبيعات",
    // Category Products (Arabic)
    rs_trolley: "عربة خدمة النخبة",
    rs_trolley_desc: "مصنوعة يدوياً من الجوز الصلب مع عجلات هادئة وغير ملوثة. تتميز بحجرات تسخين مدمجة وأجنحة جانبية قابلة للطي لكفاءة المساحة.",
    rs_carafe: "إبريق حراري مميز",
    rs_carafe_desc: "عزل مزدوج الجدار يحافظ على المشروبات في درجة حرارة مثالية لمدة تصل إلى 12 ساعة. مقبض مريح وفوهة صب بدون تنقيط لخدمة سهلة.",
    rs_cloche: "غطاء طعام بلمسة مرآة",
    rs_cloche_desc: "مصمم بدقة من الفولاذ المقاوم للصدأ 18/10. يضيف التلميع العالي لمسة من الفخامة لتجربة الطعام مع الحفاظ على درجة حرارة الطعام المثالية.",
    spa_towels: "مناشف قطنية فاخرة",
    spa_towels_desc: "فائقة الامتصاص، قطن مصري 800 جرام لكل متر مربع لإحساس يشبه السبا.",
    spa_robes: "أرواب حمام فاخرة",
    spa_robes_desc: "أرواب ناعمة وقابلة للتنفس مصممة لتوفير أقصى درجات الراحة.",
    spa_essentials: "أساسيات العلاج العطري",
    spa_essentials_desc: "مجموعة مختارة من الزيوت العطرية والشموع للاسترخاء.",
    amenities_sig: "مجموعة التوقيع",
    amenities_sig_desc: "مرافق حمام صديقة للبيئة مع خلاصات نباتية.",
    amenities_kits: "أطقم العناية الشخصية",
    amenities_kits_desc: "أطقم منسقة بعناية للمسافر العصري.",
    amenities_custom: "مجموعات مخصصة",
    amenities_custom_desc: "منتجات عالية الجودة مصممة لتناسب هوية فندقك.",
    buffet_modular: "أنظمة بوفيه modular",
    buffet_modular_desc: "أستاندات بوفيه أنيقة ومتعددة الاستخدامات تتكيف مع أي مساحة وأسلوب.",
    buffet_tables: "طاولات حفلات فاخرة",
    buffet_tables_desc: "طاولات متينة وأنيقة مصممة للفعاليات ذات السعة العالية.",
    buffet_present: "تقديم طعام فاخر",
    buffet_present_desc: "رافعات وأطباق مرتفعة لعرض التميز في الطهي.",
    fb_cocktail: "إكسسوارات الكوكتيل",
    fb_cocktail_desc: "أدوات تقليب وأسياخ ملونة وأنيقة لخدمة بار متميزة.",
    fb_glass: "مجموعة الأواني الزجاجية",
    fb_glass_desc: "أواني زجاجية أنيقة وعالية الوضوح لكل نوع من المشروبات.",
    fb_bar: "معدات البار",
    fb_bar_desc: "أدوات احترافية لدقة خلط المشروبات.",
    linens_bed: "بياضات أسرّة فاخرة",
    linens_bed_desc: "ملاءات قطنية بعدد خيوط عالٍ لراحة الضيوف القصوى.",
    linens_towels: "أطقم مناشف فاخرة",
    linens_towels_desc: "مناشف ناعمة وماصة بأوزان وأحجام مختلفة.",
    linens_housekeeping: "أساسيات التدبير المنزلي",
    linens_housekeeping_desc: "حلول فعالة للحفاظ على غرف الضيوف في حالة مثالية.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");

  useEffect(() => {
    document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "AR" : "EN"));
  };

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
