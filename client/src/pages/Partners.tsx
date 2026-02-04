import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import imgOffice from "@/assets/hero-1.jpg";

const partners = [
  { name: "Crown Plaza", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-01.jpg" },
  { name: "Ritz Carlton", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-03.png" },
  { name: "Millennium", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-04.png" },
  { name: "Sheraton", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-14.jpg" },
  { name: "Four Seasons", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-15.png" },
  { name: "Double Tree", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-17.jpg" },
  { name: "Kempinski", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-21.png" },
  { name: "Movenpick", logo: "https://stellahospitality.me/wp-content/uploads/2025/03/Client-Logo-26.png" },
];

export default function Partners() {
  return (
    <Layout>
      <div className="pt-32 pb-16 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            Our <span className="text-primary">Partners</span>
          </motion.h1>
          <p className="text-neutral-500 uppercase tracking-[0.2em] text-sm">Trusted by world-class hospitality brands</p>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-video flex items-center justify-center p-8 border border-neutral-100 grayscale hover:grayscale-0 transition-all duration-500 hover:border-primary/30"
              >
                <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold mb-6 italic">Partner with Excellence</h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              We collaborate with the world's most prestigious hotel groups to deliver uncompromised quality and bespoke guest experiences. Join our network of successful partners today.
            </p>
            <button className="bg-primary text-white px-10 py-4 uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all">
              Become a Partner
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px]"
          >
            <img src={imgOffice} className="w-full h-full object-cover" alt="Partnership" />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
