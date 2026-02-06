import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { useLanguage } from "@/context/LanguageContext";

export default function Categories() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="pt-32 pb-16 bg-neutral-50">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            {t("our_products").split(" ")[0]} <span className="text-primary">{t("our_products").split(" ").slice(1).join(" ")}</span>
          </motion.h1>
          <p className="max-w-2xl mx-auto text-neutral-600">
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
