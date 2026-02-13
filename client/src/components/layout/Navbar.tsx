import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { SiteImage } from "@shared/schema";

import defaultLogo from "@/assets/logo.png";

interface CategoryItem {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  visible: boolean;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, toggleLang, t } = useLanguage();
  const [location] = useLocation();
  const [dbCategories, setDbCategories] = useState<CategoryItem[]>([]);

  const { data: siteImages = [] } = useQuery<SiteImage[]>({
    queryKey: ["/api/site-images"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const logoImg = siteImages.find((i) => i.key === "logo");
  const logo = logoImg?.imageUrl || defaultLogo;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(setDbCategories)
      .catch(() => {});
  }, []);

  const categorySubLinks = dbCategories.map(cat => ({
    name: lang === "AR" && cat.nameAr ? cat.nameAr : cat.nameEn,
    href: `/${cat.slug}`,
  }));

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about-us" },
    { 
      name: t("products"), 
      href: "/categories",
      isDropdown: true,
      subLinks: categorySubLinks,
    },
    { name: t("partners"), href: "/partners" },
    { name: t("contact"), href: "/contact" },
  ];

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/962790484745", "_blank");
  };

  const pagesWithoutHero = ["/contact"];
  const needsDarkNav = pagesWithoutHero.includes(location);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent",
          isScrolled || needsDarkNav ? "bg-white/90 backdrop-blur-md py-4 shadow-sm border-border" : "bg-transparent py-6 text-white"
        )}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center space-x-2 cursor-pointer">
              <img src={logo} alt="The Experts Logo" className={cn("h-14 w-auto transition-all", isScrolled || needsDarkNav ? "brightness-100" : "brightness-0 invert")} />
            </a>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                {link.isDropdown ? (
                  <div className="flex items-center space-x-1 cursor-pointer group py-2">
                    <Link href={link.href}>
                      <a
                        className={cn(
                          "text-sm font-medium tracking-wide transition-colors hover:text-primary relative",
                          (isScrolled || needsDarkNav ? "text-black" : "text-white"),
                          location === link.href ? "text-primary" : ""
                        )}
                      >
                        {link.name}
                      </a>
                    </Link>
                    <ChevronDown size={14} className={cn("transition-transform duration-300 group-hover:rotate-180", isScrolled || needsDarkNav ? "text-black" : "text-white")} />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-0 w-72 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 border border-neutral-100 py-6 z-50 rounded-xl">
                      <div className="flex flex-col px-2">
                        <Link href="/categories">
                          <a className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold text-neutral-400 block border-b border-neutral-100 mb-2 hover:text-neutral-600 transition-colors">
                            {t("categories")}:
                          </a>
                        </Link>
                        {link.subLinks?.map((sub) => (
                          <Link key={sub.href} href={sub.href}>
                            <a className="px-6 py-3 text-[13px] text-neutral-600 hover:text-primary hover:bg-neutral-50/80 transition-all duration-300 font-semibold tracking-wide flex items-center justify-between group/item rounded-lg mb-1">
                              {sub.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-100 px-8">
                        <Link href="/categories">
                          <a className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary hover:text-black transition-colors">
                            {t("discover_more")}
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href={link.href}>
                    <a
                      className={cn(
                        "text-sm font-medium tracking-wide transition-colors hover:text-primary relative py-2 block",
                        (isScrolled || needsDarkNav ? "text-black" : "text-white"),
                        location === link.href ? "text-primary" : ""
                      )}
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                    </a>
                  </Link>
                )}
              </div>
            ))}
            
            {/* Language Switcher */}
            <button 
              onClick={toggleLang}
              className={cn(
                "text-xs font-bold px-2 py-1 border transition-all hover:bg-primary hover:text-white",
                isScrolled || needsDarkNav ? "text-black border-black/20" : "text-white border-white/20"
              )}
            >
              {lang === "EN" ? "AR" : "EN"}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
             <button 
              onClick={toggleLang}
              className={cn("text-xs font-bold px-2 py-1 border", isScrolled || needsDarkNav ? "text-black border-black/20" : "text-white border-white/20")}
            >
              {lang === "EN" ? "AR" : "EN"}
            </button>
             <button
              className={isScrolled || needsDarkNav ? "text-black" : "text-white"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white text-black border-t"
            >
              <div className="flex flex-col p-6 space-y-4">
                {navLinks.map((link) => (
                  <div key={link.href} className="flex flex-col space-y-2">
                    <Link href={link.href}>
                      <a
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-serif hover:text-primary transition-colors font-bold"
                      >
                        {link.name}
                      </a>
                    </Link>
                    {link.isDropdown && (
                      <div className="pl-4 flex flex-col space-y-2 border-l-2 border-primary/20">
                        {link.subLinks?.map((sub) => (
                          <Link key={sub.href} href={sub.href}>
                            <a
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-sm text-neutral-500 hover:text-primary transition-colors"
                            >
                              {sub.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* WhatsApp Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-[60] bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-2 border-white/20"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} fill="currentColor" className="relative z-10" />
        <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity" />
      </motion.button>
    </>
  );
}
