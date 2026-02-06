import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { useLanguage } from "@/context/LanguageContext";
import imgBanner from "@/assets/products-banner-bedroom.png";

export default function Categories() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgBanner})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white"
          >
            {t("our_products").split(" ")[0]} <span className="text-primary">{t("our_products").split(" ").slice(1).join(" ")}</span>
          </motion.h1>
          <p className="max-w-2xl mx-auto text-white/80">
            {t("explore_range")}
          </p>
        </div>
      </div>

      <CategoryGrid limit={6} />
      
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6">
           <p className="text-neutral-500 mb-8">{t("looking_specific")}</p>
           <a href="/contact" className="inline-block bg-black text-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-primary transition-colors">
             {t("contact_sales")}
           </a>
        </div>
      </section>
    </Layout>
  );
}
