import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  
  return (
    <div className={`min-h-screen flex flex-col ${lang === "AR" ? "rtl" : "ltr"}`} dir={lang === "AR" ? "rtl" : "ltr"}>
      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
