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
    partners: "Partners",
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
  },
  AR: {
    // Nav
    home: "الرئيسية",
    about: "من نحن",
    products: "المنتجات",
    partners: "شركاؤنا",
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
  }
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
