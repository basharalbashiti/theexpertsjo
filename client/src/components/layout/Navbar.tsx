import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import logo from "@/assets/logo.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, toggleLang, t } = useLanguage();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about-us" },
    { 
      name: t("products"), 
      href: "/categories",
      isDropdown: true,
      subLinks: [
        { name: t("cat_room_service"), href: "/room-service" },
        { name: t("cat_linens"), href: "/linens" },
        { name: t("cat_spa"), href: "/spa" },
        { name: t("cat_amenities"), href: "/amenities" },
        { name: t("cat_food"), href: "/food-beverage" },
        { name: t("cat_banqueting"), href: "/buffet-banqueting" },
      ]
    },
    { name: t("partners"), href: "/partners" },
    { name: t("sustainability"), href: "/sustainability" },
    { name: t("contact"), href: "/contact" },
  ];

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/962790484745", "_blank");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent",
          isScrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm border-border" : "bg-transparent py-6 text-white"
        )}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center space-x-2 cursor-pointer">
              <img src={logo} alt="The Experts Logo" className={cn("h-14 w-auto transition-all", isScrolled ? "brightness-100" : "brightness-0 invert")} />
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
                          (isScrolled ? "text-black" : "text-white"),
                          location === link.href ? "text-primary" : ""
                        )}
                      >
                        {link.name}
                      </a>
                    </Link>
                    <ChevronDown size={14} className={cn("transition-transform duration-300 group-hover:rotate-180", isScrolled ? "text-black" : "text-white")} />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-0 w-72 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 border border-neutral-100 py-6 z-50 rounded-xl">
                      <div className="flex flex-col px-2">
                        {link.subLinks?.map((sub) => (
                          <Link key={sub.href} href={sub.href}>
                            <a className="px-6 py-3 text-[13px] text-neutral-600 hover:text-primary hover:bg-neutral-50/80 transition-all duration-300 font-semibold tracking-wide flex items-center justify-between group/item rounded-lg mb-1">
                              {sub.name}
                              <ChevronDown size={12} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all transform translate-x-[-10px] group-hover/item:translate-x-0" />
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
                        (isScrolled ? "text-black" : "text-white"),
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
                isScrolled ? "text-black border-black/20" : "text-white border-white/20"
              )}
            >
              {lang === "EN" ? "AR" : "EN"}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
             <button 
              onClick={toggleLang}
              className={cn("text-xs font-bold px-2 py-1 border", isScrolled ? "text-black border-black/20" : "text-white border-white/20")}
            >
              {lang === "EN" ? "AR" : "EN"}
            </button>
             <button
              className={isScrolled ? "text-black" : "text-white"}
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
