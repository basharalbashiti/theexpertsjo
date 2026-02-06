import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import imgBanner from "@/assets/room-service-banner.png";
import imgItems from "@/assets/room-service-items.png";
import imgTrolley from "@/assets/rs-trolley.png";
import imgCarafe from "@/assets/rs-carafe.png";
import imgCloche from "@/assets/rs-cloche.png";

export default function RoomService() {
  const { t, lang } = useLanguage();

  const products = [
    { 
      id: 1, 
      name: t("rs_trolley"), 
      desc: t("rs_trolley_desc"),
      image: imgTrolley
    },
    { 
      id: 2, 
      name: t("rs_carafe"), 
      desc: t("rs_carafe_desc"),
      image: imgCarafe
    },
    { 
      id: 3, 
      name: t("rs_cloche"), 
      desc: t("rs_cloche_desc"),
      image: imgCloche
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
            {t("cat_room_service")}
          </motion.h1>
          <p className="text-white/80 uppercase tracking-[0.2em] text-sm">Elevating In-Room Dining</p>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-12 flex ${lang === "AR" ? "justify-end" : "justify-start"}`}
          >
            <Link href="/categories">
              <a className="group flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                {lang === "AR" ? <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />}
                {t("back_to_categories")}
              </a>
            </Link>
          </motion.div>

          <div className="space-y-32">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24`}
              >
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 leading-tight">
                    {product.name}
                  </h3>
                  <div className="h-1 bg-primary w-20" />
                  <p className="text-neutral-600 text-lg leading-relaxed max-w-xl">
                    {product.desc}
                  </p>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
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

