import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-cocktail-accessories.png";
import img2 from "@/assets/cat-amenities-wide.png";
import img3 from "@/assets/cat-minibar.jpg";

export default function FoodBeveragePage() {
  const { t } = useLanguage();
  const products = [
    { name: "Cocktail Accessories", desc: "Colorful and stylish stirrers, skewers, and picks for premium bar service.", image: img1 },
    { name: "Glassware Collection", desc: "Elegant, high-clarity glassware for every beverage type.", image: img2 },
    { name: "Bar Equipment", desc: "Professional-grade tools for precision mixology.", image: img3 }
  ];
  return <CategoryTemplate title={t("cat_food")} products={products} />;
}
