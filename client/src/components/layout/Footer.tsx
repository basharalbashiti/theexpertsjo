import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-neutral-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/">
              <a className="block">
                <img src={logo} alt="The Experts Logo" className="h-16 w-auto brightness-0 invert" />
              </a>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {t("footer_desc")}
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6">{t("quick_links")}</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/"><a className="hover:text-primary transition-colors">{t("home")}</a></Link></li>
              <li><Link href="/about-us"><a className="hover:text-primary transition-colors">{t("about")}</a></Link></li>
              <li><Link href="/categories"><a className="hover:text-primary transition-colors">{t("products")}</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-primary transition-colors">{t("contact")}</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">{t("categories")}</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="/categories"><a className="hover:text-primary transition-colors">{t("cat_amenities")}</a></Link></li>
              <li><Link href="/categories"><a className="hover:text-primary transition-colors">{t("cat_linens")}</a></Link></li>
              <li><Link href="/categories"><a className="hover:text-primary transition-colors">{t("cat_furniture")}</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">{t("contact_us")}</h4>
            <div className="space-y-3 text-sm text-neutral-400">
              <p>Amman – Jordan</p>
              <p>sales@theexpertsjo.com</p>
              <p>Tel: +962-6-5852220</p>
              <p>Mob: +962-79-0120447</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} The Experts. {t("rights_reserved")}
        </div>
      </div>
    </footer>
  );
}
