import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { SiteImage } from "@shared/schema";

import defaultHero1 from "@/assets/hero-hotel-room.png";
import defaultHero2 from "@/assets/hero-2.jpg";
import defaultHero3 from "@/assets/hero-3.jpg";

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  const { data: siteImages = [] } = useQuery<SiteImage[]>({
    queryKey: ["/api/site-images"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const imageMap = siteImages.reduce((acc, img) => {
    acc[img.key] = img.imageUrl;
    return acc;
  }, {} as Record<string, string>);

  const slides = [
    {
      id: 1,
      image: imageMap["hero1"] || defaultHero1,
      title: t("hero1_title"),
      subtitle: t("hero1_subtitle"),
      description: t("hero1_desc")
    },
    {
      id: 2,
      image: imageMap["hero2"] || defaultHero2,
      title: t("hero2_title"),
      subtitle: t("hero2_subtitle"),
      description: t("hero2_desc")
    },
    {
      id: 3,
      image: imageMap["hero3"] || defaultHero3,
      title: t("hero3_title"),
      subtitle: t("hero3_subtitle"),
      description: t("hero3_desc")
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-start text-white z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl rtl:items-start"
          >
            <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase mb-4 text-primary">
              {slides[currentSlide].title}
            </h2>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              {slides[currentSlide].subtitle}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg font-light">
              {slides[currentSlide].description}
            </p>
            
            <Link href="/categories">
              <a className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-none hover:bg-white hover:text-black transition-colors duration-300 rtl:space-x-reverse">
                <span className="uppercase tracking-widest text-sm font-bold">{t("discover_more")}</span>
                <ArrowRight size={16} />
              </a>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 right-12 rtl:right-auto rtl:left-12 flex space-x-4 rtl:space-x-reverse z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-primary scale-125" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
