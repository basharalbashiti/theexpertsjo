import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import imgBanner from "@/assets/contact-banner-ultra-clear.png";

export default function Contact() {
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
            {t("contact").split(" ")[0]} <span className="text-primary">{t("contact").split(" ").slice(1).join(" ")}</span>
          </motion.h1>
          <p className="text-white/80 uppercase tracking-[0.2em] text-sm">{t("get_in_touch")}</p>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-12">{t("send_message")}</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder={t("full_name")} className="w-full border-b border-neutral-300 py-4 focus:border-primary outline-none transition-colors" />
                <input type="email" placeholder={t("email_addr")} className="w-full border-b border-neutral-300 py-4 focus:border-primary outline-none transition-colors" />
              </div>
              <input type="text" placeholder={t("subject")} className="w-full border-b border-neutral-300 py-4 focus:border-primary outline-none transition-colors" />
              <textarea placeholder={t("message")} rows={4} className="w-full border-b border-neutral-300 py-4 focus:border-primary outline-none transition-colors resize-none" />
              <button className="bg-primary text-white px-12 py-4 uppercase text-xs font-bold tracking-widest hover:bg-black transition-colors mt-8">
                {t("submit")}
              </button>
            </form>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8 text-primary">{t("our_locations")}</h2>
              <div className="space-y-8">
                {[
                  { 
                    city: t("amman"), 
                    addr: "Wahet Ammoun Building, No. 185, 2nd floor, Amman, Jordan", 
                    phone: "Tel: +962-6-5852220",
                    mobile: "Mob: +962-79-0120447",
                    email: "sales@theexpertsjo.com",
                    mapUrl: "https://maps.app.goo.gl/q9S4aYVrdxUaR2YX7?g_st=iw"
                  }
                ].map((loc, i) => (
                  <div key={i} className="flex gap-6 group">
                    <a 
                      href={loc.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-16 h-16 bg-white border-2 border-neutral-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-300 flex-shrink-0 shadow-lg group-hover:shadow-primary/20 rounded-xl relative overflow-hidden"
                    >
                      <MapPin size={24} className="text-primary group-hover:text-white transition-colors relative z-10" />
                      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                      <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-tl-md shadow-sm border border-neutral-100 group-hover:border-white transition-colors">
                        <svg className="w-3 h-3 text-neutral-400 group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </div>
                    </a>
                    <div>
                      <h4 className="font-serif font-bold text-lg">
                        <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          {loc.city}
                        </a>
                      </h4>
                      <p className="text-neutral-500 text-sm mt-1">{loc.addr}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-primary text-sm font-bold">{loc.phone}</p>
                        <p className="text-primary text-sm font-bold">{loc.mobile}</p>
                        <p className="text-neutral-600 text-sm italic">{loc.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
