import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";

import imgTowels from "@/assets/cat-towels.jpg";
import imgMinibar from "@/assets/cat-minibar.jpg";
import imgAmenities from "@/assets/cat-amenities-wide.png";
import imgFood from "@/assets/cat-cocktail-accessories.png";
import imgBanqueting from "@/assets/cat-banqueting.png";
import imgBuffet from "@/assets/cat-buffet.png";
import imgLinens from "@/assets/cat-linens.png";
import imgRoomService from "@/assets/cat-room-service.png";
import imgSpa from "@/assets/cat-spa-simple.png";

interface DbCategory {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
  visible: boolean;
}

const fallbackImages: Record<string, string> = {
  "room-service": imgRoomService,
  "linens": imgLinens,
  "spa": imgSpa,
  "amenities": imgAmenities,
  "food-beverage": imgFood,
  "banqueting": imgBanqueting,
  "buffet-banqueting": imgBuffet,
  "buffet-stands": imgBuffet,
  "towels": imgTowels,
  "mini-bar-safes": imgMinibar,
  "mini-bar--safes": imgMinibar,
  "furniture": imgBanqueting,
  "housekeeping": imgLinens,
};

export function CategoryGrid({ limit, compact, showDiscoverMore }: { limit?: number; compact?: boolean; showDiscoverMore?: boolean }) {
  const { t, lang } = useLanguage();
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(setDbCategories)
      .catch(() => {});
  }, []);

  const categories = dbCategories.map(cat => ({
    id: cat.id,
    title: lang === "AR" && cat.nameAr ? cat.nameAr : cat.nameEn,
    image: cat.imageUrl || fallbackImages[cat.slug] || imgRoomService,
    href: `/${cat.slug}`,
  }));

  const displayCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-serif font-bold mb-4"
          >
            {t("our_categories").split(" ")[0]} <span className="text-primary">{t("our_categories").split(" ").slice(1).join(" ")}</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            className="h-1 bg-primary mx-auto"
          />
        </div>

        <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
          {displayCategories.map((cat, index) => (
            <Link key={cat.id} href={cat.href}>
              <a className={`group block overflow-hidden relative cursor-pointer ${compact ? "aspect-[4/3]" : "aspect-[4/5]"}`} data-testid={`card-category-${cat.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full h-full relative"
                >
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  
                  <div className={`absolute inset-0 flex flex-col justify-end rtl:items-start ${compact ? "p-6" : "p-8"}`}>
                    <h3 className={`text-white font-serif font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${compact ? "text-xl" : "text-2xl"}`}>
                      {cat.title}
                    </h3>
                    <div className="h-0.5 w-0 bg-primary mt-2 group-hover:w-10 transition-all duration-500" />
                  </div>
                </motion.div>
              </a>
            </Link>
          ))}
          {showDiscoverMore && (
            <Link href="/categories">
              <a className={`group block overflow-hidden relative cursor-pointer ${compact ? "aspect-[4/3]" : "aspect-[4/5]"}`} data-testid="link-discover-more">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (displayCategories.length) * 0.05 }}
                  className="w-full h-full relative"
                >
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${imgBanqueting})` }}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:translate-x-1 transition-transform duration-300"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    <span className={`uppercase tracking-widest font-bold text-white group-hover:text-primary transition-colors ${compact ? "text-sm" : "text-sm"}`}>Discover More</span>
                  </div>
                </motion.div>
              </a>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
