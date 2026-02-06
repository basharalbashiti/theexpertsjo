import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import imgBanner from "@/assets/category-generic-banner.png";
import imgProduct1 from "@/assets/cat-towels.jpg";
import imgProduct2 from "@/assets/cat-linens.png";
import imgProduct3 from "@/assets/cat-amenities-wide.png";

export default function CategoryPage({ title, products }: { title: string, products: any[] }) {
  const { lang, t } = useLanguage();
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
            {title}
          </motion.h1>
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
            {products.map((product, index) => {
              const isRtl = lang === "AR";
              const shouldReverse = isRtl ? index % 2 === 0 : index % 2 !== 0;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${shouldReverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 md:gap-24`}
                >
                  <div className={`flex-1 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 leading-tight">
                      {product.name}
                    </h3>
                    <div className={`h-1 bg-primary w-20 ${isRtl ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`} />
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
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
