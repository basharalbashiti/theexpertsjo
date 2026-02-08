import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import imgBanner from "@/assets/hero-3.jpg";
import imgPractices from "@/assets/hero-2.jpg";

export default function Sustainability() {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Banner */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgBanner})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <motion.h1 
          initial={{ opacity: 0, letterSpacing: "0em" }}
          animate={{ opacity: 1, letterSpacing: "0.1em" }}
          className="relative text-6xl md:text-8xl font-serif font-bold text-white z-10"
        >
          {t("sustainability")}
        </motion.h1>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-2xl text-neutral-600 font-serif italic leading-relaxed">
            "{t("sustainability_quote")}"
          </p>
        </div>
      </section>

      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-6">{t("our_practices")}</h2>
            <h3 className="text-4xl font-serif font-bold mb-8">{t("harmony")}</h3>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              {t("sustain_desc1")}
            </p>
            <p className="text-neutral-600 leading-relaxed">
              {t("sustain_desc2")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[4/5] bg-neutral-100 overflow-hidden"
          >
            <img src={imgPractices} className="w-full h-full object-cover" alt="Sustainable practices" />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-4xl font-serif font-bold mb-8">{t("ecovadis_title")}</h2>
          <p className="text-neutral-600 mb-12">
            {t("ecovadis_desc")}
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="bg-primary text-white px-8 py-4 uppercase text-xs font-bold tracking-widest hover:bg-black transition-colors">
              {t("download_sop")}
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 uppercase text-xs font-bold tracking-widest hover:bg-primary hover:text-white transition-colors">
              {t("employee_handbook")}
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
