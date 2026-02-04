import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <div className="pt-32 pb-16 bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            Contact <span className="text-primary">Us</span>
          </motion.h1>
          <p className="text-neutral-500 uppercase tracking-[0.2em] text-sm">Get in touch with our global offices</p>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-12">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Full Name" className="w-full border-b border-neutral-300 py-4 focus:border-primary outline-none transition-colors" />
                <input type="email" placeholder="Email Address" className="w-full border-b border-neutral-300 py-4 focus:border-primary outline-none transition-colors" />
              </div>
              <input type="text" placeholder="Subject" className="w-full border-b border-neutral-300 py-4 focus:border-primary outline-none transition-colors" />
              <textarea placeholder="Message" rows={4} className="w-full border-b border-neutral-300 py-4 focus:border-primary outline-none transition-colors resize-none" />
              <button className="bg-primary text-white px-12 py-4 uppercase text-xs font-bold tracking-widest hover:bg-black transition-colors mt-8">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8 text-primary">Our Locations</h2>
              <div className="space-y-8">
                {[
                  { city: "Dubai, UAE", addr: "Business Bay, Dubai", phone: "+971 4 123 4567" },
                  { city: "Riyadh, KSA", addr: "King Fahd Road, Riyadh", phone: "+966 11 123 4567" },
                  { city: "Amman, Jordan", addr: "Shmeisani, Amman", phone: "+962 6 123 4567" }
                ].map((loc, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <MapPin size={20} className="group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg">{loc.city}</h4>
                      <p className="text-neutral-500 text-sm mt-1">{loc.addr}</p>
                      <p className="text-primary text-sm mt-2 font-bold">{loc.phone}</p>
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
