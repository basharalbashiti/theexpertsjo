import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import imgTowels from "@/assets/cat-towels.jpg";
import imgMinibar from "@/assets/cat-minibar.jpg";
import imgAmenities from "@/assets/cat-amenities-wide.png";
import imgFood from "@/assets/cat-food-stands-v2.png";
import imgBanqueting from "@/assets/cat-banqueting.png";
import imgBuffet from "@/assets/cat-buffet.png";
import imgLinens from "@/assets/cat-linens.png";
import imgRoomService from "@/assets/cat-room-service.png";
import imgSpa from "@/assets/cat-spa-simple.png";

export function CategoryGrid({ limit }: { limit?: number }) {
  const { t } = useLanguage();

  const allCategories = [
    { id: 1, title: t("cat_room_service"), image: imgRoomService, href: "/categories" },
    { id: 2, title: t("cat_linens"), image: imgLinens, href: "/categories" },
    { id: 3, title: t("cat_spa"), image: imgSpa, href: "/categories" },
    { id: 4, title: t("cat_amenities"), image: imgAmenities, href: "/categories" },
    { id: 5, title: t("cat_food"), image: imgFood, href: "/categories" },
    { id: 6, title: t("cat_banqueting"), image: imgBanqueting, href: "/categories" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Link key={cat.id} href={cat.href}>
              <a className="group block overflow-hidden relative aspect-[4/5] cursor-pointer">
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
                    <h3 className="text-white text-2xl font-serif font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
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
