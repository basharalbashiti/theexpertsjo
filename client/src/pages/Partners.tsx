import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import imgBanner from "@/assets/partners-banner-outdoor.png";
import partner1 from "@/assets/partner-hotel_1.jpg";
import partner2 from "@/assets/partner-hotel_2.jpg";
import partner3 from "@/assets/partner-hotel_3.jpg";
import partner4 from "@/assets/partner-hotel_4.jpg";
import partner5 from "@/assets/partner-hotel_5.jpg";
import imgCTA from "@/assets/partnership-bespoke.png";

export default function Partners() {
  const { t, lang } = useLanguage();

  const hotelPartners = [
    { type: 'image', src: partner1 },
    { type: 'image', src: partner2 },
    { type: 'image', src: partner3 },
    { type: 'image', src: partner4 },
    { type: 'image', src: partner5 },
    { type: 'text', content: "Five Palm Jumeirah - Dubai" }
  ];
  
  const brands = [
    { name: "ABDEEN", type: "text", style: "font-sans font-black tracking-tighter text-[#4A5568]" },
    { name: "Cashmere", type: "text", style: "font-serif italic text-[#718096]" },
    { 
      type: "custom", 
      content: (
        <div className="flex flex-col items-center justify-center font-serif font-bold cursor-default leading-tight">
           <span className="text-xl md:text-3xl uppercase tracking-wider text-[#0F1E40]">The Experts</span>
           <span className="text-[10px] md:text-sm uppercase tracking-[0.2em] mt-1 text-primary">for Hotels Supplies</span>
        </div>
      )
    }
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-neutral-900 mb-4">Proud to Work With</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              We collaborate with the finest hotels and resorts in the region to deliver exceptional products and services
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {hotelPartners.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 bg-neutral-50 p-2 border border-neutral-100 flex items-center justify-center text-center group"
              >
                {item.type === 'image' ? (
                  <img 
                    src={item.src} 
                    alt="Partner Hotel" 
                    className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 bg-white rounded-xl group-hover:bg-neutral-50 transition-colors">
                    <span className="font-serif font-bold text-neutral-800 text-sm md:text-base leading-tight">
                      {item.content}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-16">Our Brands</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            {brands.map((brand, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center justify-center"
              >
                {brand.type === "image" ? (
                  // @ts-ignore
                  <img src={brand.logo} alt="The Experts Brand" className="h-20 md:h-24 w-[288px] md:w-[384px] object-contain" />
                ) : brand.type === "custom" ? (
                  // @ts-ignore
                  brand.content
                ) : (
                  // @ts-ignore
                  <span className={`text-2xl md:text-4xl uppercase tracking-widest ${brand.style} cursor-default`}>
                    {brand.name}
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
                  <a href="/contact" className="bg-primary text-white px-10 py-4 uppercase text-sm font-bold tracking-widest hover:bg-black transition-all">
                    {t("contact_sales")}
                  </a>
                  <div className="flex items-center gap-4 text-neutral-400 text-sm font-bold uppercase tracking-widest">
                    <span className="w-8 h-[1px] bg-neutral-300" />
                    Ongoing support
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full h-[400px] md:h-[600px] relative">
                <img src={imgCTA} className="w-full h-full object-cover" alt="Luxury Bedroom" />
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
