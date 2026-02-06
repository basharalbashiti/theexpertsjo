import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-towels.jpg";
import img2 from "@/assets/cat-linens.png";
import img3 from "@/assets/cat-amenities-wide.png";

export default function AmenitiesPage() {
  const { t } = useLanguage();
  const products = [
    { name: "Signature Collection", desc: "Eco-friendly bathroom amenities with botanical extracts.", image: img1 },
    { name: "Personal Care Kits", desc: "Thoughtfully curated kits for the modern traveler.", image: img2 },
    { name: "Custom Branded Sets", desc: "High-quality products tailored to your hotel's identity.", image: img3 }
  ];
  return <CategoryTemplate title={t("cat_amenities")} products={products} />;
}
