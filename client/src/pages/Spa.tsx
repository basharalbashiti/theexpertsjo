import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-towels.jpg";
import img2 from "@/assets/cat-linens.png";
import img3 from "@/assets/cat-spa-simple.png";

export default function SpaPage() {
  const { t } = useLanguage();
  const products = [
    { name: "Premium Cotton Towels", desc: "Ultra-absorbent, 800 GSM Egyptian cotton towels for a spa-like feel.", image: img1 },
    { name: "Luxury Bathrobes", desc: "Soft, breathable waffle-weave robes designed for maximum comfort.", image: img2 },
    { name: "Aromatherapy Essentials", desc: "Curated selection of essential oils and candles for relaxation.", image: img3 }
  ];
  return <CategoryTemplate title={t("cat_spa")} products={products} />;
}
