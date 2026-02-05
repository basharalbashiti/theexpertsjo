import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import imgOffice from "@/assets/hero-1.jpg";

export default function Partners() {
  const { t } = useLanguage();

  const partners = [
    { name: "Four Seasons Hotel Amman", logo: "https://www.fourseasons.com/alt/img-logo-fs-black.png" },
    { name: "Landmark Hotel", logo: "https://landmarkamman.com/sites/default/files/logo_0.png" },
    { name: "Grand Hyatt Amman", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Hyatt_logo.svg/512px-Hyatt_logo.svg.png" },
    { name: "Kempinski Hotel Amman", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Kempinski_Logo.svg/512px-Kempinski_Logo.svg.png" },
    { name: "Millennium Amman", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Millennium_%26_Copthorne_Hotels_logo.svg/512px-Millennium_%26_Copthorne_Hotels_logo.svg.png" },
    { name: "Le Meridien", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Le_M%C3%A9ridien_logo.svg/512px-Le_M%C3%A9ridien_logo.svg.png" },
    { name: "Crowne Plaza", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Crowne_Plaza_logo.svg/512px-Crowne_Plaza_logo.svg.png" },
    { name: "Ibis Hotel", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Ibis_Hotels_logo.svg/512px-Ibis_Hotels_logo.svg.png" },
    { name: "Movenpick", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/M%C3%B6venpick_Hotels_%26_Resorts_logo.svg/512px-M%C3%B6venpick_Hotels_%26_Resorts_logo.svg.png" },
    { name: "Ritz Carlton", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/The_Ritz-Carlton_Logo.svg/512px-The_Ritz-Carlton_Logo.svg.png" },
    { name: "Sheraton", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Sheraton_Hotels_and_Resorts_logo.svg/512px-Sheraton_Hotels_and_Resorts_logo.svg.png" },
    { name: "DoubleTree", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/DoubleTree_by_Hilton_logo.svg/512px-DoubleTree_by_Hilton_logo.svg.png" },
  ];

  return (
    <Layout>
      <div className="pt-32 pb-16 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            {t("partners").split(" ")[0]} <span className="text-primary">{t("partners").split(" ").slice(1).join(" ")}</span>
          </motion.h1>
          <p className="text-neutral-500 uppercase tracking-[0.2em] text-sm">{t("trusted_by")}</p>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-video flex items-center justify-center p-8 border border-neutral-100 grayscale hover:grayscale-0 transition-all duration-500 hover:border-primary/30"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=f5f5f5&color=999&size=512&bold=true&format=svg`;
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
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
            initial={{ opacity: 0, x: 30 }}
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
