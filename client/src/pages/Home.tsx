import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Stats } from "@/components/home/Stats";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      <Hero />
      
      <Stats />

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary uppercase tracking-widest text-sm font-bold mb-4">
              All in One Place
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              Your All-in-one <br/> Hospitality Solution
            </h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              At The Experts, we supply premium hospitality products and essential hotel supplies across the Middle East.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Whether you operate a large hotel or a boutique property, our carefully curated offerings deliver consistent quality and a memorable guest experience.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square bg-neutral-100 relative overflow-hidden">
               {/* Decorative elements imitating the abstract shapes in the original site */}
               <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-neutral-200" />
               <div className="absolute bottom-0 left-0 w-3/4 h-3/4 border-2 border-primary z-10" />
               <div className="absolute inset-8 bg-neutral-300 overflow-hidden">
                  <div className="w-full h-full bg-[url('@/assets/hero-2.jpg')] bg-cover bg-center opacity-80" />
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      <CategoryGrid />
      
    </Layout>
  );
}
