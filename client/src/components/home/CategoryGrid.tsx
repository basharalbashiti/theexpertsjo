import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import imgTowels from "@/assets/cat-towels.jpg";
import imgMinibar from "@/assets/cat-minibar.jpg";
import imgAmenities from "@/assets/cat-amenities.jpg";
import imgFood from "@/assets/cat-food.jpg";
import imgHousekeeping from "@/assets/cat-housekeeping.jpg";
import imgFurniture from "@/assets/cat-furniture.jpg";

import imgBuffet from "@/assets/cat-buffet.png";

export function CategoryGrid({ limit }: { limit?: number }) {
  const { t } = useLanguage();

  const allCategories = [
    { id: 1, title: t("cat_room_service"), image: imgMinibar, href: "/categories" },
    { id: 2, title: t("cat_linens"), image: imgTowels, href: "/categories" },
    { id: 3, title: t("cat_spa"), image: imgAmenities, href: "/categories" },
    { id: 4, title: t("cat_amenities"), image: imgAmenities, href: "/categories" },
    { id: 5, title: t("cat_food"), image: imgFood, href: "/categories" },
    { id: 6, title: t("cat_banqueting"), image: imgFurniture, href: "/categories" },
    { id: 7, title: t("cat_buffet"), image: imgBuffet, href: "/categories" },
  ];

  const categories = limit ? allCategories.slice(0, limit) : allCategories;

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

        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((cat, index) => (
            <Link key={cat.id} href={cat.href}>
              <a className="group block overflow-hidden relative aspect-[4/5] cursor-pointer w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[400px]">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full h-full relative"
                >
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 rtl:items-start">
                    <h3 className="text-white text-2xl font-serif font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {cat.title}
                    </h3>
                    <div className="h-0.5 w-0 bg-primary mt-4 group-hover:w-16 transition-all duration-500" />
                  </div>
                </motion.div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
