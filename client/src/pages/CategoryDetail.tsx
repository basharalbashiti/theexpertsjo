import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSiteImages } from "@/hooks/useSiteImages";
import imgBannerFallback from "@/assets/category-generic-banner.png";

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  imageUrl: string;
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
        data-testid={`button-gallery-prev-${product.id}`}
        onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        data-testid={`button-gallery-next-${product.id}`}
        onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
      >
        <ChevronRight size={18} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            data-testid={`button-gallery-dot-${product.id}-${i}`}
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

export default function CategoryDetail({ slug }: { slug: string }) {
  const { lang, t } = useLanguage();
  const { getImage } = useSiteImages();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/categories/slug/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((cat: Category) => {
        setCategory(cat);
        return fetch(`/api/products?categoryId=${cat.id}`);
      })
      .then(r => r.json())
      .then((prods: Product[]) => {
        setProducts(prods);
        setLoading(false);
      })
      .catch(() => {
        setCategory(null);
        setLoading(false);
      });
  }, [slug]);

  const title = category
    ? (lang === "AR" && category.nameAr ? category.nameAr : category.nameEn)
    : "";

  const defaultBanner = getImage("category_banner", imgBannerFallback);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-neutral-400">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${category.imageUrl || defaultBanner})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white"
          >
            {title}
          </motion.h1>
          <p className="max-w-2xl mx-auto text-white/80">{t("category_hero_desc")}</p>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 flex"
          >
            <Link href="/categories">
              <a data-testid="link-back-categories" className="group flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                {lang === "AR" ? <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /> : <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />}
                {t("back_to_categories")}
              </a>
            </Link>
          </motion.div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-lg">No products in this category yet.</p>
            </div>
          ) : (
            <div className="space-y-32">
              {products.map((product, index) => {
                const isRtl = lang === "AR";
                const shouldReverse = isRtl ? index % 2 === 0 : index % 2 !== 0;
                const name = isRtl && product.nameAr ? product.nameAr : product.nameEn;
                const desc = isRtl && product.descriptionAr ? product.descriptionAr : product.descriptionEn;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col ${shouldReverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 md:gap-24`}
                    data-testid={`product-${product.id}`}
                  >
                    <div className={`flex-1 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                      {product.brand && (
                        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary">{product.brand}</span>
                      )}
                      <h3 data-testid={`text-product-name-${product.id}`} className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 leading-tight">
                        {name}
                      </h3>
                      <div className={`h-1 bg-primary w-20 ${isRtl ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`} />
                      <p className="text-neutral-600 text-lg leading-relaxed max-w-xl">
                        {desc}
                      </p>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
                        <ProductGallery product={product} name={name} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 flex"
          >
            <Link href="/categories">
              <a className="group flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                {lang === "AR" ? <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /> : <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />}
                {t("back_to_categories")}
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-neutral-900 text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <ShoppingBag className="mx-auto mb-8 text-primary" size={48} />
          <h2 className="text-4xl font-serif font-bold mb-6">{lang === "AR" ? "استفسر عن هذه المجموعة" : "Inquire About This Collection"}</h2>
          <p className="text-neutral-400 mb-10 text-lg">
            {lang === "AR" ? "هل تبحث عن حلول مخصصة لعقارك؟ فريقنا مستعد للمساعدة." : "Looking for bespoke solutions for your property? Our experts are ready to assist with custom designs and bulk orders."}
          </p>
          <Link href="/contact">
            <a data-testid="link-contact-sales" className="inline-block bg-primary text-white px-12 py-5 uppercase text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-all">
              {t("contact_sales")}
            </a>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
