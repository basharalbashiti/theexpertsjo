import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, MapPin, Mail, Phone } from "lucide-react";
import { Link } from "wouter";
import defaultLogo from "@/assets/logo.png";

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
}

interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  brand: string;
  categoryId: number;
  sortOrder: number;
}

interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  sortOrder: number;
}

function ProductGallery({ product, name }: { product: Product; name: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const allImages: string[] = [];
    if (product.imageUrl) allImages.push(product.imageUrl);
    fetch(`/api/products/${product.id}/images`)
      .then(r => r.json())
      .then((extra: ProductImage[]) => {
        extra.forEach(img => allImages.push(img.imageUrl));
        setImages([...allImages]);
      })
      .catch(() => setImages([...allImages]));
  }, [product.id, product.imageUrl]);

  if (images.length === 0) {
    return (
      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
        <span className="text-neutral-300 text-6xl font-serif">{name.charAt(0)}</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />
    );
  }

  return (
    <div className="relative w-full h-full group">
      <img
        src={images[activeIndex]}
        alt={`${name} ${activeIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
      />
      <button
        onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
      >
        <ChevronRight size={18} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === activeIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function CatalogNav({ logo, categories, activeSlug, isRtl, lang, toggleLang }: {
  logo: string;
  categories: Category[];
  activeSlug: string | null;
  isRtl: boolean;
  lang: string;
  toggleLang: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -200 : 200;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="mx-auto px-8 flex items-center gap-8 max-w-[1400px] py-3">
        {logo && (
          <Link href="/">
            <a className="shrink-0 flex items-center">
              <img src={logo} alt="The Experts" className="h-14 w-auto object-contain" data-testid="img-catalog-logo" />
            </a>
          </Link>
        )}

        <div className="flex-1 flex items-center gap-2 min-w-0">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              data-testid="button-catalog-scroll-left"
              className="shrink-0 w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={14} className="text-neutral-600" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto min-w-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className={`flex gap-1 ${isRtl ? "flex-row-reverse" : ""}`} style={{ width: "max-content", margin: "0 auto" }}>
              {categories.map((cat) => {
                const catName = isRtl && cat.nameAr ? cat.nameAr : cat.nameEn;
                const isActive = activeSlug === cat.slug;
                return (
                  <a
                    key={cat.id}
                    href={`#category-${cat.slug}`}
                    data-testid={`link-catalog-nav-${cat.slug}`}
                    className={`whitespace-nowrap px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-neutral-600 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {catName}
                  </a>
                );
              })}
            </div>
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              data-testid="button-catalog-scroll-right"
              className="shrink-0 w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={14} className="text-neutral-600" />
            </button>
          )}
        </div>

        <button
          onClick={toggleLang}
          data-testid="button-catalog-lang"
          className="shrink-0 text-xs font-bold px-3 py-1.5 border border-neutral-200 text-neutral-700 hover:bg-primary hover:text-white hover:border-primary transition-all rounded"
        >
          {lang === "EN" ? "AR" : "EN"}
        </button>
      </div>
    </nav>
  );
}

export default function Catalog() {
  const { t, lang, toggleLang } = useLanguage();
  const isRtl = lang === "AR";
  const [logo, setLogo] = useState<string>(defaultLogo);

  useEffect(() => {
    fetch("/api/site-images")
      .then(r => r.json())
      .then((imgs: { key: string; imageUrl: string }[]) => {
        const logoImg = imgs.find(i => i.key === "logo");
        if (logoImg && logoImg.imageUrl) setLogo(logoImg.imageUrl);
        else if (logoImg && logoImg.imageUrl === "") setLogo("");
      })
      .catch(() => {});
  }, []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<number, Product[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/catalog/categories").then(r => r.json()),
      fetch("/api/catalog/products").then(r => r.json()),
    ])
      .then(([cats, prods]: [Category[], Product[]]) => {
        const sorted = cats.sort((a, b) => a.sortOrder - b.sortOrder);
        setCategories(sorted);

        const productsMap: Record<number, Product[]> = {};
        for (const cat of sorted) {
          productsMap[cat.id] = prods
            .filter(p => p.categoryId === cat.id)
            .sort((a, b) => a.sortOrder - b.sortOrder);
        }
        setProductsByCategory(productsMap);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute("data-slug");
            if (slug) setActiveSlug(slug);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!observerRef.current || categories.length === 0) return;
    observerRef.current.disconnect();
    categories.forEach((cat) => {
      const el = document.getElementById(`category-${cat.slug}`);
      if (el) observerRef.current!.observe(el);
    });
  }, [categories]);

  if (loading) {
    return (
      <div className={`min-h-screen bg-white ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      <CatalogNav
        logo={logo}
        categories={categories}
        activeSlug={activeSlug}
        isRtl={isRtl}
        lang={lang}
        toggleLang={toggleLang}
      />

      {categories.map((category, catIndex) => {
        const catName = isRtl && category.nameAr ? category.nameAr : category.nameEn;
        const products = productsByCategory[category.id] || [];

        return (
          <section
            key={category.id}
            id={`category-${category.slug}`}
            data-slug={category.slug}
            className={catIndex % 2 === 0 ? "bg-white" : "bg-neutral-50"}
            data-testid={`section-catalog-category-${category.slug}`}
          >
            <div className="container mx-auto px-6 py-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`mb-16 ${isRtl ? "text-right" : "text-left"}`}
              >
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-3" data-testid={`text-catalog-category-${category.slug}`}>
                  {catName}
                </h2>
                <div className={`h-1 bg-primary w-24 ${isRtl ? "mr-0 ml-auto" : "ml-0 mr-auto"}`} />
              </motion.div>

              {products.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">
                  {isRtl ? "لا توجد منتجات في هذه الفئة بعد" : "No products in this category yet."}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product, index) => {
                    const name = isRtl && product.nameAr ? product.nameAr : product.nameEn;
                    const desc = isRtl && product.descriptionAr ? product.descriptionAr : product.descriptionEn;

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                        data-testid={`product-catalog-${product.id}`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-md mb-4">
                          <ProductGallery product={product} name={name} />
                        </div>
                        <div className={isRtl ? "text-right" : "text-left"}>
                          {product.brand && (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">{product.brand}</span>
                          )}
                          <h3 className="text-lg font-serif font-bold text-neutral-900 leading-snug mb-2" data-testid={`text-catalog-product-${product.id}`}>
                            {name}
                          </h3>
                          <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3">
                            {desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );
      })}

      <footer className="bg-neutral-900 text-white">
        <div className="container mx-auto px-10 max-w-7xl">
          <div className="flex flex-col items-center text-center py-16 border-b border-neutral-800">
            <ShoppingBag className="mb-4 text-primary" size={36} />
            <h3 className="text-xl font-serif font-bold mb-3">
              {isRtl ? "هل تريد معرفة المزيد؟" : "Interested in Our Products?"}
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              {isRtl
                ? "تواصل مع فريقنا للحصول على عروض مخصصة"
                : "Get in touch for custom solutions and bulk orders."}
            </p>
            <Link href="/contact" data-testid="link-catalog-contact" className="inline-block bg-primary text-white px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all">
              {t("contact_sales")}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 py-16">
            <div className={isRtl ? "text-right" : "text-left"}>
              {logo && (
                <img src={logo} alt="The Experts" className="h-16 w-auto mb-6 brightness-0 invert" data-testid="img-catalog-footer-logo" />
              )}
              <p className="text-neutral-400 leading-relaxed max-w-sm mb-8">
                {isRtl
                  ? "نوفر الراحة والجودة لضيوفكم. منتجات ضيافة فاخرة في جميع أنحاء الشرق الأوسط."
                  : "Supplying comfort and quality to your guests. Premium hospitality products across the Middle East."}
              </p>
              <div className="border-t border-neutral-700 pt-6">
                <p className="text-neutral-300 text-sm font-medium">
                  {isRtl ? "شركة الخبراء لمستلزمات الفنادق" : "The Experts For Hotels Supplies Company"}
                </p>
              </div>
            </div>

            <div className={`flex flex-col justify-center ${isRtl ? "text-right" : "text-left"}`}>
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-300 mb-8">
                {isRtl ? "تواصل معنا" : "CONTACT US"}
              </h3>
              <div className="space-y-6">
                <div className={`flex items-center gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <MapPin size={20} className="text-primary shrink-0" />
                  <span className="text-neutral-400 text-sm">{isRtl ? "عمّان - الأردن" : "Amman – Jordan"}</span>
                </div>
                <div className={`flex items-center gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <Mail size={20} className="text-primary shrink-0" />
                  <a href="mailto:sales@theexpertsjo.com" className="text-neutral-400 text-sm hover:text-white transition-colors">sales@theexpertsjo.com</a>
                </div>
                <div className={`flex items-center gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <Phone size={20} className="text-primary shrink-0" />
                  <a href="tel:+962790484745" className="text-neutral-400 text-sm hover:text-white transition-colors" dir="ltr">+962 79 0484745</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
