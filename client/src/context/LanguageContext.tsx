import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "EN" | "AR";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const fallbackTranslations: Record<Language, Record<string, string>> = {
  EN: {
    home: "Home",
    about: "About Us",
    products: "Products",
    partners: "Partners & Clients",
    partners_clients: "Partners & Clients",
    sustainability: "Sustainability",
    contact: "Contact",
    hero1_title: "Supplying Comfort",
    hero1_subtitle: "Excellence to Your Guests",
    hero1_desc: "Experience the pinnacle of hospitality supply with our premium collection.",
    hero2_title: "Bringing Elegance",
    hero2_subtitle: "Ease to Your Visitors",
    hero2_desc: "Curated amenities that define sophistication and care.",
    hero3_title: "Enhancing Every Stay",
    hero3_subtitle: "Style and Comfort",
    hero3_desc: "Transforming ordinary stays into extraordinary memories.",
    discover_more: "Discover More",
    all_in_one: "All in One Place",
    hospitality_solution: "Your All-in-one Hospitality Solution",
    home_desc1: "At The Experts, we supply premium hospitality products and essential hotel supplies across the Middle East.",
    home_desc2: "Whether you operate a large hotel or a boutique property, our carefully curated offerings deliver consistent quality and a memorable guest experience.",
    our_categories: "Our Categories",
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
    stat_offices: "Offices",
    stat_warehouses: "Warehouses",
    stat_countries: "Countries Served",
    stat_skus: "SKUs",
    stat_product_lines: "Product Lines",
    stat_brands: "Brands",
    stat_projects: "Projects",
    stat_clients: "Clients",
    footer_desc: "Supplying comfort and quality to your guests. Premium hospitality products across the Middle East.",
    quick_links: "Quick Links",
    categories: "Categories",
    contact_us: "Contact Us",
    rights_reserved: "All rights reserved.",
    who_we_are: "Who We Are",
    founded_in: "Founded in Dubai in 2003",
    about_desc: "The Experts has grown from a regional leader to a global provider of premium amenity solutions for hotels.",
    chairman_msg: "Chairman's Message",
    chairman_quote: "Welcome to The Experts. Since our founding in 2003 in the UAE, we have remained dedicated to transforming the hospitality experience.",
    chairman_name: "Alaa Abdeen",
    chairman_title: "Chairman",
    our_mission: "Our Mission",
    mission_desc: "Streamlining hotel procurement with premium, cost-effective amenities and reliable delivery.",
    our_vision: "Our Vision",
    vision_desc: "To be the global leader in hotel procurement, delivering innovative, high-quality solutions.",
    our_leadership: "Our Leadership",
    sustainability_quote: "Sustainability is transforming the hospitality industry.",
    our_practices: "Our Practices",
    harmony: "Harmony of Quality and Nature",
    sustain_desc1: "At The Experts, we believe sustainability and quality go hand in hand.",
    sustain_desc2: "From biodegradable essentials to recyclable packaging, every detail is designed to reduce environmental impact.",
    ecovadis_title: "EcoVadis Certification",
    ecovadis_desc: "We are proud to announce our pursuit of EcoVadis certification.",
    download_sop: "Download Our SOP",
    employee_handbook: "Employee Handbook",
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
    trusted_by: "Trusted by world-class hospitality brands",
    partner_excellence: "Partner with Excellence",
    partner_desc: "We collaborate with the world's most prestigious hotel groups.",
    become_partner: "Become a Partner",
    our_products: "Our Products",
    explore_range: "Explore our comprehensive range of hotel supplies.",
    looking_specific: "Looking for something specific?",
    contact_sales: "Contact Sales Team",
    back_to_categories: "Back to All Categories",
    about_hero_desc: "Discover our story, mission, and the values that drive us to deliver excellence in hospitality.",
    sustainability_hero_desc: "Committed to eco-friendly practices and responsible sourcing for a better future.",
    room_service_hero_desc: "Elevating in-room dining with premium service equipment and elegant presentation.",
    category_hero_desc: "Browse our curated selection of premium hospitality products.",
  },
  AR: {},
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");
  const [dbTranslations, setDbTranslations] = useState<Record<Language, Record<string, string>>>({
    EN: {},
    AR: {},
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data: Array<{ key: string; valueEn: string; valueAr: string }>) => {
        const en: Record<string, string> = {};
        const ar: Record<string, string> = {};
        for (const item of data) {
          if (item.valueEn) en[item.key] = item.valueEn;
          if (item.valueAr) ar[item.key] = item.valueAr;
        }
        setDbTranslations({ EN: en, AR: ar });
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "AR" : "EN"));
  };

  const t = (key: string) => {
    return dbTranslations[lang][key] || fallbackTranslations[lang][key] || fallbackTranslations["EN"][key] || key;
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
