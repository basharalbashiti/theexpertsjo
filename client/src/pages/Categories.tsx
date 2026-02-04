import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { CategoryGrid } from "@/components/home/CategoryGrid";

export default function Categories() {
  return (
    <Layout>
      <div className="pt-32 pb-16 bg-neutral-50">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            Our <span className="text-primary">Products</span>
          </motion.h1>
          <p className="max-w-2xl mx-auto text-neutral-600">
            Explore our comprehensive range of hotel supplies designed to elevate your guest experience.
          </p>
        </div>
      </div>

      <CategoryGrid />
      
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6">
           <p className="text-neutral-500 mb-8">Looking for something specific?</p>
           <a href="/contact" className="inline-block bg-black text-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-primary transition-colors">
             Contact Sales Team
           </a>
        </div>
      </section>
    </Layout>
  );
}
