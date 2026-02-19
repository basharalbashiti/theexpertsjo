import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteImages } from "@/hooks/useSiteImages";
import type { Leadership } from "@shared/schema";
import imgBannerFallback from "@/assets/hero-1.jpg";
import imgMissionFallback from "@/assets/mission-bg.png";
import imgVisionFallback from "@/assets/vision-bg.png";
import imgChairmanFallback from "@/assets/cat-furniture.jpg";

export default function About() {
  const { t, lang } = useLanguage();
  const { getImage } = useSiteImages();

  const { data: leaders = [] } = useQuery<Leadership[]>({
    queryKey: ["/api/leadership"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const imgBanner = getImage("about_banner", imgBannerFallback);
  const imgMission = getImage("about_mission", imgMissionFallback);
  const imgVision = getImage("about_vision", imgVisionFallback);
  const imgChairman = getImage("about_chairman", imgChairmanFallback);

  const stats = [
    { label: t("stat_product_lines"), value: "500+" },
    { label: t("stat_brands"), value: "50+" },
    { label: t("stat_projects"), value: "200+" },
    { label: t("stat_clients"), value: "1000+" },
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
            {t("about").split(" ")[0]} <span className="text-primary">{t("about").split(" ").slice(1).join(" ")}</span>
          </motion.h1>
          <p className="max-w-2xl mx-auto text-white/80">{t("about_hero_desc")}</p>
        </div>
      </div>

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

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-6">{t("who_we_are")}</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold mb-10 leading-tight">
              {t("founded_in")}
            </h3>
            <p className="text-xl text-neutral-600 leading-relaxed">
              {t("about_desc")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50 overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold mb-8">{t("chairman_msg")}</h2>
            <blockquote className="text-lg text-neutral-600 italic mb-8 border-l-4 border-primary pl-6 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-6">
              "{t("chairman_quote")}"
            </blockquote>
            <div className="font-serif">
              <div className="text-xl font-bold">{t("chairman_name")}</div>
              <div className="text-primary text-sm uppercase tracking-widest">{t("chairman_title")}</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img src={imgChairman} alt="Chairman" className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-primary -z-10 rtl:left-auto rtl:-right-6" />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ y: -10 }}
            className="group relative h-[400px] overflow-hidden"
          >
            <img src={imgMission} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
            <div className="relative h-full flex flex-col justify-end p-12 text-white rtl:items-start">
              <h3 className="text-3xl font-serif font-bold mb-4">{t("our_mission")}</h3>
              <p className="text-white/80">{t("mission_desc")}</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10 }}
            className="group relative h-[400px] overflow-hidden"
          >
            <img src={imgVision} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
            <div className="relative h-full flex flex-col justify-end p-12 text-white rtl:items-start">
              <h3 className="text-3xl font-serif font-bold mb-4">{t("our_vision")}</h3>
              <p className="text-white/80">{t("vision_desc")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold mb-16 underline decoration-primary underline-offset-8">{t("our_leadership")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {leaders.map((person, i) => {
              const name = lang === "AR" && person.nameAr ? person.nameAr : person.nameEn;
              const role = lang === "AR" && person.roleAr ? person.roleAr : person.roleEn;
              const initials = person.nameEn.split(" ").map(w => w[0]).join("").toUpperCase();
              return (
                <motion.div 
                  key={person.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                  data-testid={`card-leader-${person.id}`}
                >
                  <div className="relative mx-auto w-28 h-28 mb-6">
                    {person.imageUrl ? (
                      <img src={person.imageUrl} alt={name} className="w-full h-full rounded-full object-cover border-2 border-neutral-200 transition-all duration-500 group-hover:border-primary" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center transition-all duration-500 group-hover:bg-primary">
                        <span className="text-2xl font-serif font-bold text-white tracking-wider">{initials}</span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-neutral-50 group-hover:bg-neutral-900 transition-colors" />
                  </div>
                  <h4 className="font-serif font-bold text-lg">{name}</h4>
                  <p className="text-primary text-xs uppercase tracking-widest mt-1">{role}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
