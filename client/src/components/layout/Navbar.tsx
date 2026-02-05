import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
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
    { name: t("products"), href: "/categories" },
    { name: t("partners"), href: "/partners" },
    { name: t("sustainability"), href: "/sustainability" },
    { name: t("contact"), href: "/contact" },
  ];

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/97141234567", "_blank");
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
              <Link key={link.href} href={link.href}>
                <a
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors hover:text-primary relative group",
                    (isScrolled ? "text-black" : "text-white"),
                    location === link.href ? "text-primary" : ""
                  )}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              </Link>
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
                  <Link key={link.href} href={link.href}>
                    <a
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-serif hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </Link>
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
        className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={30} fill="currentColor" className="relative z-10" />
        <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity" />
      </motion.button>
    </>
  );
}
