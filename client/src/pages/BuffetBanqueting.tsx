import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-buffet.png";
import img2 from "@/assets/cat-banqueting.png";
import img3 from "@/assets/cat-cocktail-accessories.png";

export default function BuffetBanquetingPage() {
  const { t } = useLanguage();
  const products = [
    { name: "Modular Buffet Systems", desc: "Sleek, versatile buffet stands that adapt to any space and style.", image: img1 },
    { name: "Premium Banquet Tables", desc: "Durable and elegant tables designed for high-capacity events.", image: img2 },
    { name: "Luxury Food Presentation", desc: "Elevated risers and platters to showcase culinary excellence.", image: img3 }
  ];
  return <CategoryTemplate title={t("cat_buffet") + " & " + t("cat_banqueting")} products={products} />;
}
