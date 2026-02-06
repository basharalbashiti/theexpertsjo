import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Stats } from "@/components/home/Stats";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <Layout>
      <Hero />
      
      <Stats />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-primary uppercase tracking-widest text-xs font-bold mb-4">
              {t("all_in_one")}
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-8 leading-tight">
              {t("hospitality_solution")}
            </h3>
            <p className="text-neutral-600 leading-relaxed mb-6 text-lg">
              {t("home_desc1")}
            </p>
            <div className="w-12 h-0.5 bg-primary/30 mx-auto" />
          </motion.div>
        </div>
      </section>

      <CategoryGrid limit={4} />
      
    </Layout>
  );
}
