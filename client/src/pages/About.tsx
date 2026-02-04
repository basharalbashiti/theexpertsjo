import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import imgOffice from "@/assets/hero-1.jpg"; // Reusing assets for mockup

export default function About() {
  return (
    <Layout>
      <div className="pt-32 pb-16 bg-neutral-50">
        <div className="container mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold text-center mb-8"
          >
            About <span className="text-primary">Us</span>
          </motion.h1>
          <div className="h-1 w-24 bg-primary mx-auto" />
        </div>
      </div>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src={imgOffice} alt="Office" className="w-full aspect-[4/3] object-cover shadow-xl" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-serif font-bold">Our Story</h2>
              <p className="text-neutral-600 leading-relaxed">
                Established in 2003, Stella Hospitality has grown to become a leading provider of hotel supplies in the Middle East. With a presence in UAE, KSA, Jordan, Bahrain, and Iraq, we bridge the gap between quality manufacturing and luxury hospitality.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Our mission is simple: to enhance the guest experience through superior products and reliable service. We understand the nuances of the hospitality industry and cater to the specific needs of each property.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-neutral-900 text-white">
         <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-serif font-bold mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-12">
               {[
                 { title: "Quality", desc: "We never compromise on the standard of our products." },
                 { title: "Reliability", desc: "Consistent supply chain and delivery you can trust." },
                 { title: "Innovation", desc: "Constantly seeking new solutions for modern hospitality." }
               ].map((val, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.2 }}
                   viewport={{ once: true }}
                   className="p-8 border border-white/10 hover:border-primary transition-colors duration-300"
                 >
                   <h3 className="text-xl font-bold mb-4 text-primary">{val.title}</h3>
                   <p className="text-neutral-400">{val.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>
    </Layout>
  );
}
