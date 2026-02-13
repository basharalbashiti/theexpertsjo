import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import defaultLogo from "@/assets/logo.png";
import { MapPin, Mail, Phone, ChevronRight, ArrowUpRight } from "lucide-react";
import type { SiteImage, QuickLink } from "@shared/schema";

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
  const logoImg = siteImages.find((i) => i.key === "logo");
  const logoRemoved = logoImg && logoImg.imageUrl === "";
  const logo = logoRemoved ? "" : (logoImg?.imageUrl || defaultLogo);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: quickLinks = [] } = useQuery<QuickLink[]>({
    queryKey: ["/api/quick-links"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link href="/">
              <a className="block mb-6">
                {logo ? (
                  <img src={logo} alt="The Experts Logo" className="h-14 w-auto brightness-0 invert" />
                ) : (
                  <span className="text-xl font-serif font-bold tracking-wider text-white">THE EXPERTS</span>
                )}
              </a>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed">
              {t("footer_desc")}
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300 mb-6">{t("quick_links")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.url}>
                    <a className="text-sm text-neutral-500 hover:text-primary transition-colors inline-flex items-center gap-1.5 group">
                      <ChevronRight size={12} className="text-primary/50 group-hover:text-primary transition-colors" />
                      {lang === "ar" ? (link.labelAr || link.labelEn) : link.labelEn}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300 mb-6">{t("categories")}</h4>
            <ul className="space-y-3">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/${cat.slug}`}>
                    <a className="text-sm text-neutral-500 hover:text-primary transition-colors inline-flex items-center gap-1.5 group">
                      <ChevronRight size={12} className="text-primary/50 group-hover:text-primary transition-colors" />
                      {lang === "ar" ? cat.nameAr : cat.nameEn}
                    </a>
                  </Link>
                </li>
              ))}
              {categories.length > 4 && (
                <li className="pt-1">
                  <Link href="/categories">
                    <a className="text-xs text-primary/70 hover:text-primary transition-colors inline-flex items-center gap-1 font-medium uppercase tracking-wider">
                      {t("more")}
                      <ArrowUpRight size={11} />
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300 mb-6">{t("contact_us")}</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-primary/60 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-500">Amman – Jordan</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={14} className="text-primary/60 mt-0.5 flex-shrink-0" />
                <a href="mailto:sales@theexpertsjo.com" className="text-sm text-neutral-500 hover:text-primary transition-colors">
                  sales@theexpertsjo.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={14} className="text-primary/60 mt-0.5 flex-shrink-0" />
                <a href="tel:+962790484745" className="text-sm text-neutral-500 hover:text-primary transition-colors">
                  +962 79 0484745
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800/60">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} The Experts. {t("rights_reserved")}
          </p>
          <p className="text-xs text-neutral-700">
            Hospitality Supplies
          </p>
        </div>
      </div>
    </footer>
  );
}
