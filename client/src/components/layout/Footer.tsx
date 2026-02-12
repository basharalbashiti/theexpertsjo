import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import defaultLogo from "@/assets/logo.png";
import type { SiteImage } from "@shared/schema";

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
}

export function Footer() {
  const { lang, t } = useLanguage();

  const { data: siteImages = [] } = useQuery<SiteImage[]>({
    queryKey: ["/api/site-images"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const logo = siteImages.find((i) => i.key === "logo")?.imageUrl || defaultLogo;

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <footer className="bg-neutral-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-10">
            <Link href="/">
              <a className="block">
                <img src={logo} alt="The Experts Logo" className="h-16 w-auto brightness-0 invert" />
              </a>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mt-4">
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
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/${cat.slug}`}>
                    <a className="hover:text-primary transition-colors">
                      {lang === "ar" ? cat.nameAr : cat.nameEn}
                    </a>
                  </Link>
                </li>
              ))}
              {categories.length > 4 && (
                <li>
                  <Link href="/categories">
                    <a className="hover:text-primary transition-colors text-primary font-medium">
                      {t("more")} →
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">{t("contact_us")}</h4>
            <div className="space-y-3 text-sm text-neutral-400">
              <p>Amman – Jordan</p>
              <p>sales@theexpertsjo.com</p>
              <p>Mob: +962 79 0484745</p>
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
