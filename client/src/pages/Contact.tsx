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
                    mobile: "00962 79 0484745",
                    email: "sales@theexpertsjo.com",
                    mapUrl: "https://maps.app.goo.gl/q9S4aYVrdxUaR2YX7?g_st=iw"
                  }
                ].map((loc, i) => (
                  <div key={i} className="flex gap-6 group">
                    <a 
                      href={loc.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-neutral-100 flex items-center justify-center group-hover:bg-primary transition-colors flex-shrink-0"
                    >
                      <MapPin size={20} className="group-hover:text-white" />
                    </a>
                    <div>
                      <h4 className="font-serif font-bold text-lg">
                        <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          {loc.city}
                        </a>
                      </h4>
                      <p className="text-neutral-500 text-sm mt-1">{loc.addr}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-primary text-sm font-bold">{loc.mobile}</p>
                        <p className="text-neutral-600 text-sm italic">{loc.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-100">
              <h2 className="text-3xl font-serif font-bold mb-8 text-primary">Key Contacts</h2>
              <div className="grid gap-8">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-xl text-neutral-900">Alaa Abdin</h4>
                  <p className="text-primary text-xs uppercase tracking-widest font-bold">General Manager</p>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p>Tel: 00962 79 5779345</p>
                    <p>Email: alaa@theexpertsjo.com</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-xl text-neutral-900">Rafat Daood</h4>
                  <p className="text-primary text-xs uppercase tracking-widest font-bold">Sales Manager</p>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p>Tel: 00962 79 0484745</p>
                    <p>Email: Sales@theexpertsjo.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
