import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import imgBanner from "@/assets/hero-1.jpg";
import imgMission from "@/assets/hero-2.jpg";
import imgVision from "@/assets/hero-3.jpg";
import imgChairman from "@/assets/cat-furniture.jpg";

const stats = [
  { label: "Product Lines", value: "500+" },
  { label: "Brands", value: "50+" },
  { label: "Projects", value: "200+" },
  { label: "Clients", value: "1000+" },
];

const leadership = [
  { name: "Ahmed Abu Sakha", role: "Chief Executive Officer" },
  { name: "Mohammed Faraz", role: "Chief Financial Officer" },
  { name: "Marwan Abu Sakha", role: "Group Corporate Development Manager" },
  { name: "Khaled Ghunaim", role: "General Manager - Jordan" },
];

export default function About() {
  return (
    <Layout>
      {/* Banner */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgBanner})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-6xl md:text-8xl font-serif font-bold text-white z-10"
        >
          About <span className="text-primary">Us</span>
        </motion.h1>
      </div>

      {/* Stats Bar */}
      <div className="bg-neutral-900 py-12">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-serif text-primary font-bold">{stat.value}</div>
              <div className="text-neutral-400 text-xs uppercase tracking-widest mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-6">Who We Are</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold mb-10 leading-tight">
              Founded in <span className="text-primary italic">Dubai</span> in 2003
            </h3>
            <p className="text-xl text-neutral-600 leading-relaxed">
              The Experts has grown from a regional leader to a global provider of premium amenity solutions for hotels. With roots in the Middle East and a growing international footprint, we deliver high-quality, tailor-made products that elevate guest experiences and strengthen brand identity worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Chairman Message */}
      <section className="py-24 bg-neutral-50 overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold mb-8">Chairman’s <span className="text-primary">Message</span></h2>
            <blockquote className="text-lg text-neutral-600 italic mb-8 border-l-4 border-primary pl-6">
              "Welcome to The Experts. Since our founding in 2003 in the UAE, we have remained dedicated to transforming the hospitality experience by delivering premium, tailor-made solutions that elevate guest satisfaction."
            </blockquote>
            <div className="font-serif">
              <div className="text-xl font-bold">Mohammed Al Ghussein</div>
              <div className="text-primary text-sm uppercase tracking-widest">Chairman</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img src={imgChairman} alt="Chairman" className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-primary -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ y: -10 }}
            className="group relative h-[400px] overflow-hidden"
          >
            <img src={imgMission} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
            <div className="relative h-full flex flex-col justify-end p-12 text-white">
              <h3 className="text-3xl font-serif font-bold mb-4">Our Mission</h3>
              <p className="text-white/80">Streamlining hotel procurement with premium, cost-effective amenities and reliable delivery.</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10 }}
            className="group relative h-[400px] overflow-hidden"
          >
            <img src={imgVision} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
            <div className="relative h-full flex flex-col justify-end p-12 text-white">
              <h3 className="text-3xl font-serif font-bold mb-4">Our Vision</h3>
              <p className="text-white/80">To be the global leader in hotel procurement, delivering innovative, high-quality solutions.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold mb-16 underline decoration-primary underline-offset-8">Our Leadership</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {leadership.map((person, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="aspect-[3/4] bg-neutral-200 mb-6 overflow-hidden relative">
                   <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-serif font-bold text-lg">{person.name}</h4>
                <p className="text-primary text-xs uppercase tracking-widest mt-1">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
