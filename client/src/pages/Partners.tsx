import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import imgOffice from "@/assets/hero-1.jpg";

export default function Partners() {
  const { t } = useLanguage();

  const partners = [
    { name: "Four Seasons", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-15.png" },
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
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const text = document.createElement('span');
                      text.className = 'text-neutral-400 font-serif font-bold text-center';
                      text.innerText = partner.name;
                      target.parentElement.appendChild(text);
                    }
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
