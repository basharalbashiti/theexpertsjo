import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import imgOffice from "@/assets/hero-1.jpg";
import imgBanner from "@/assets/partners-banner-outdoor.png";
import imgFourSeasons from "@/assets/four-seasons-amman.png";

export default function Partners() {
  const { t, lang } = useLanguage();

  const partners = [
    { name: "Four Seasons Hotel Amman", location: "Amman, Jordan", image: imgFourSeasons },
    // We can add more featured partners here later if needed, but starting with the one from the image
  ];

  const otherPartners = [
    { name: "Ritz Carlton", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-03.png" },
    { name: "Millennium", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-04.png" },
    { name: "Sheraton", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-14.jpg" },
    { name: "Crowne Plaza", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-01.jpg" },
    { name: "Double Tree", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-17.jpg" },
    { name: "Kempinski", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-21.png" },
    { name: "Movenpick", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-26.png" },
    { name: "Hyatt", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-10.png" },
    { name: "Marriott", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-08.png" },
    { name: "Hilton", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-07.png" },
    { name: "InterContinental", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-06.png" },
  ];

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
            {t("partners_clients").split(" ")[0]} <span className="text-primary">{t("partners_clients").split(" ").slice(1).join(" ")}</span>
          </motion.h1>
          <p className="text-white/80 uppercase tracking-[0.2em] text-sm">{t("trusted_by")}</p>
        </div>
      </div>

      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: lang === 'AR' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-4 block">
                {t("all_in_one")}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                {t("hospitality_solution")}
              </h2>
              <div className="space-y-6 text-neutral-600 text-lg leading-relaxed max-w-lg">
                <p>{t("partner_desc")}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Decorative Frame Elements */}
              <div className="absolute -top-6 -right-6 w-full h-full border border-neutral-200 z-0" />
              <div className="absolute -bottom-6 -left-6 w-3/4 h-1/2 border border-primary/40 z-0" />
              
              <div className="relative z-10 overflow-hidden shadow-2xl group">
                <img 
                  src={imgFourSeasons} 
                  alt="Four Seasons Hotel Amman" 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-8 left-0 right-0 text-center px-6">
                  <h3 className="text-white text-3xl md:text-4xl font-serif font-bold drop-shadow-lg">
                    Four Seasons Hotel Amman
                  </h3>
                  <p className="text-white/70 mt-2 tracking-widest uppercase text-sm">Amman, Jordan</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">{t("global_presence")}</h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {otherPartners.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 border border-neutral-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:shadow-xl group"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-w-full max-h-[60px] object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: lang === 'AR' ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold mb-6 italic">{t("partner_excellence")}</h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              {t("partner_desc")}
            </p>
            <button className="bg-primary text-white px-10 py-4 uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all">
              {t("become_partner")}
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: lang === 'AR' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px]"
          >
            <img src={imgOffice} className="w-full h-full object-cover" alt="Partnership" />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
