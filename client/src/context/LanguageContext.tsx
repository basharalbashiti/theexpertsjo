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
    // Stats
    stat_offices: "Offices",
    stat_warehouses: "Warehouses",
    stat_countries: "Countries Served",
    stat_skus: "SKUs",
    // Footer
    footer_desc: "Supplying comfort and luxury to your guests. Premium hospitality products across the Middle East.",
    quick_links: "Quick Links",
    categories: "Categories",
    contact_us: "Contact Us",
    rights_reserved: "All rights reserved.",
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
    // Stats
    stat_offices: "مكاتب",
    stat_warehouses: "مستودعات",
    stat_countries: "دول نخدمها",
    stat_skus: "وحدة حفظ مخزون",
    // Footer
    footer_desc: "توريد الراحة والفخامة لضيوفك. منتجات ضيافة فاخرة في جميع أنحاء الشرق الأوسط.",
    quick_links: "روابط سريعة",
    categories: "الأقسام",
    contact_us: "اتصل بنا",
    rights_reserved: "جميع الحقوق محفوظة.",
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
