import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useSiteImages } from "@/hooks/useSiteImages";
import imgBannerFallback from "@/assets/partners-banner-outdoor.png";
import imgCTAFallback from "@/assets/partnership-bespoke.png";

interface Partner {
  id: number;
  name: string;
  imageUrl: string;
  sortOrder: number;
}

interface Client {
  id: number;
  name: string;
  imageUrl: string;
  sortOrder: number;
}

export default function Partners() {
  const { t, lang } = useLanguage();
  const { getImage } = useSiteImages();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("/api/partners").then(r => r.json()).then(setPartners).catch(() => {});
    fetch("/api/clients").then(r => r.json()).then(setClients).catch(() => {});
  }, []);

  const imgBanner = getImage("partners_banner", imgBannerFallback);
  const imgCTA = getImage("partners_cta", imgCTAFallback);

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
          <p className="max-w-2xl mx-auto text-white/80">{t("trusted_by")}</p>
        </div>
      </div>

      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-neutral-900 mb-4" data-testid="text-clients-heading">Proud to Work With</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              We collaborate with the finest hotels and resorts in the region to deliver exceptional products and services
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8" data-testid="clients-grid">
            {clients.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 bg-neutral-50 p-2 border border-neutral-100 flex items-center justify-center text-center group"
                data-testid={`card-client-${client.id}`}
              >
                {client.imageUrl ? (
                  <img 
                    src={client.imageUrl} 
                    alt={client.name} 
                    className="w-full h-full object-contain p-2 rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <span className="text-lg font-bold text-neutral-600 uppercase tracking-widest">{client.name}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-16" data-testid="text-partners-heading">Our Partners</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24" data-testid="partners-grid">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center justify-center"
                data-testid={`card-partner-${partner.id}`}
              >
                {partner.imageUrl ? (
                  <img src={partner.imageUrl} alt={partner.name} className="h-20 md:h-24 w-[288px] md:w-[384px] object-contain" />
                ) : (
                  <span className="text-2xl md:text-4xl uppercase tracking-widest font-sans font-black text-neutral-600 cursor-default">
                    {partner.name}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-neutral-50 rounded-[3rem] overflow-hidden shadow-2xl border border-neutral-100">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 p-12 md:p-24 space-y-8">
                <h2 className="text-4xl font-serif font-bold text-neutral-900 leading-tight">Become Our Partner</h2>
                <p className="text-neutral-600 text-lg leading-relaxed max-w-xl">
                  We are always looking for new partnerships with premium hotels and resorts. Contact us to learn how we can work together to elevate your guest experience.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <a href="/contact" className="bg-primary text-white px-10 py-4 uppercase text-sm font-bold tracking-widest hover:bg-black transition-all" data-testid="link-contact-sales">
                    {t("contact_sales")}
                  </a>
                  <div className="flex items-center gap-4 text-neutral-400 text-sm font-bold uppercase tracking-widest">
                    <span className="w-8 h-[1px] bg-neutral-300" />
                    Ongoing support
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full h-[400px] md:h-[600px] relative">
                <img src={imgCTA} className="w-full h-full object-cover" alt="Hotel Bedroom" />
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
