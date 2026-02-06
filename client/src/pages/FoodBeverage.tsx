import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-cocktail-accessories.png";
import img2 from "@/assets/cat-amenities-wide.png";
import img3 from "@/assets/cat-minibar.jpg";

export default function FoodBeveragePage() {
  const { t } = useLanguage();
  const products = [
    { name: t("fb_cocktail"), desc: t("fb_cocktail_desc"), image: img1 },
    { name: t("fb_glass"), desc: t("fb_glass_desc"), image: img2 },
    { name: t("fb_bar"), desc: t("fb_bar_desc"), image: img3 }
  ];
  return <CategoryTemplate title={t("cat_food")} products={products} />;
}
