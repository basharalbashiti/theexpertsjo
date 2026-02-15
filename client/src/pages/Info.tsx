import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteImages } from "@/hooks/useSiteImages";
import imgBannerFallback from "@/assets/hero-2.jpg";

export default function Info() {
  const { t } = useLanguage();
  const { getImage } = useSiteImages();

  const imgBanner = getImage("info_banner", imgBannerFallback);

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
            {t("info_title") || "Info"}
          </motion.h1>
          <p className="max-w-2xl mx-auto text-white/80">
            {t("info_subtitle") || ""}
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed whitespace-pre-line">
              {t("info_content") || ""}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
