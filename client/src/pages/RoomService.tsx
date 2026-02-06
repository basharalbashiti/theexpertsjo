import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag, ChevronRight } from "lucide-react";
import imgBanner from "@/assets/room-service-banner.png";
import imgItems from "@/assets/room-service-items.png";

export default function RoomService() {
  const { t } = useLanguage();

  const products = [
    { id: 1, name: "Luxury Service Trolley", desc: "Handcrafted wooden trolley with silent wheels." },
    { id: 2, name: "Thermal Carafes", desc: "Double-walled stainless steel for perfect temperature." },
    { id: 3, name: "Silver Cloches", desc: "Mirror-finish stainless steel food covers." },
    { id: 4, name: "Bentwood Trays", desc: "Lightweight, non-slip designer service trays." }
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
            {t("cat_room_service")}
          </motion.h1>
          <p className="text-white/80 uppercase tracking-[0.2em] text-sm">Elevating In-Room Dining</p>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif font-bold mb-6 italic">Excellence Delivered</h2>
              <p className="text-neutral-600 text-lg leading-relaxed mb-8">
                Our room service collection is designed to transform in-room dining into a signature guest experience. From silent-running trolleys to thermal preservation solutions, every piece combines functional innovation with aesthetic elegance.
              </p>
              <div className="space-y-4">
                {products.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 border-l-2 border-primary bg-neutral-50">
                    <div>
                      <h4 className="font-bold text-neutral-900">{item.name}</h4>
                      <p className="text-sm text-neutral-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square"
            >
              <img src={imgItems} className="w-full h-full object-cover shadow-2xl" alt="Room Service Items" />
              <div className="absolute -bottom-6 -left-6 bg-primary p-8 text-white hidden md:block">
                <p className="text-3xl font-serif italic">Premium Quality</p>
                <p className="text-xs uppercase tracking-widest mt-2">Hospitality Standards</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-900 text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <ShoppingBag className="mx-auto mb-8 text-primary" size={48} />
          <h2 className="text-4xl font-serif font-bold mb-6">Inquire About This Collection</h2>
          <p className="text-neutral-400 mb-10 text-lg">
            Looking for bespoke room service solutions for your property? Our experts are ready to assist with custom designs and bulk orders.
          </p>
          <button className="bg-primary text-white px-12 py-5 uppercase text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-all">
            Contact Sales Team
          </button>
        </div>
      </section>
    </Layout>
  );
}
