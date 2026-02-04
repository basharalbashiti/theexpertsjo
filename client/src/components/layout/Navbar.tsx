import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Products", href: "/categories" },
    { name: "Partners", href: "/partners" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Contact", href: "/contact" },
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
            <a className="font-serif text-2xl font-bold tracking-widest uppercase cursor-pointer">
              Stella<span className="text-primary">.</span>
            </a>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
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
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
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
                  <Link key={link.name} href={link.href}>
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
        className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} fill="currentColor" />
      </motion.button>
    </>
  );
}
