import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

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

export default function Catalog() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "AR";
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-neutral-900 text-white py-20 pt-36 text-center">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-4"
            data-testid="text-catalog-title"
          >
            {isRtl ? "الكتالوج الكامل" : "Full Catalog"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg max-w-2xl mx-auto"
          >
            {isRtl
              ? "استعرض مجموعتنا الكاملة من مستلزمات الضيافة الفاخرة"
              : "Browse our complete collection of premium hospitality supplies"}
          </motion.p>
        </div>
      </div>

      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-6 py-3 overflow-x-auto">
          <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
            {categories.map((cat) => {
              const catName = isRtl && cat.nameAr ? cat.nameAr : cat.nameEn;
              return (
                <a
                  key={cat.id}
                  href={`#category-${cat.slug}`}
                  data-testid={`link-catalog-nav-${cat.slug}`}
                  className="whitespace-nowrap px-4 py-2 text-sm font-medium text-neutral-600 hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
                >
                  {catName}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {categories.map((category, catIndex) => {
        const catName = isRtl && category.nameAr ? category.nameAr : category.nameEn;
        const products = productsByCategory[category.id] || [];

        return (
          <section
            key={category.id}
            id={`category-${category.slug}`}
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
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-neutral-900 mb-4" data-testid={`text-catalog-category-${category.slug}`}>
                  {catName}
                </h2>
                <div className={`h-1 bg-primary w-24 ${isRtl ? "mr-0 ml-auto" : "ml-0 mr-auto"}`} />
              </motion.div>

              {products.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">
                  {isRtl ? "لا توجد منتجات في هذه الفئة بعد" : "No products in this category yet."}
                </p>
              ) : (
                <div className="space-y-24">
                  {products.map((product, index) => {
                    const shouldReverse = isRtl ? index % 2 === 0 : index % 2 !== 0;
                    const name = isRtl && product.nameAr ? product.nameAr : product.nameEn;
                    const desc = isRtl && product.descriptionAr ? product.descriptionAr : product.descriptionEn;

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`flex flex-col ${shouldReverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-20`}
                        data-testid={`product-catalog-${product.id}`}
                      >
                        <div className={`flex-1 space-y-5 ${isRtl ? "text-right" : "text-left"}`}>
                          {product.brand && (
                            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-primary">{product.brand}</span>
                          )}
                          <h3 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 leading-tight" data-testid={`text-catalog-product-${product.id}`}>
                            {name}
                          </h3>
                          <div className={`h-0.5 bg-primary w-16 ${isRtl ? "mr-0 ml-auto" : "ml-0 mr-auto"}`} />
                          <p className="text-neutral-600 leading-relaxed max-w-xl">
                            {desc}
                          </p>
                        </div>

                        <div className="flex-1 w-full">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                            <ProductGallery product={product} name={name} />
                          </div>
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

      <section className="py-20 bg-neutral-900 text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <ShoppingBag className="mx-auto mb-6 text-primary" size={44} />
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-5">
            {isRtl ? "هل تريد معرفة المزيد؟" : "Interested in Our Products?"}
          </h2>
          <p className="text-neutral-400 mb-8 text-lg">
            {isRtl
              ? "تواصل مع فريقنا للحصول على عروض مخصصة وطلبات بالجملة"
              : "Get in touch with our team for custom solutions and bulk orders."}
          </p>
          <Link href="/contact" data-testid="link-catalog-contact" className="inline-block bg-primary text-white px-10 py-4 uppercase text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-all">
            {t("contact_sales")}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
