import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-buffet.png";
import img2 from "@/assets/cat-banqueting.png";
import img3 from "@/assets/cat-cocktail-accessories.png";

export default function BuffetBanquetingPage() {
  const { t } = useLanguage();
  const products = [
    { name: t("buffet_modular"), desc: t("buffet_modular_desc"), image: img1 },
    { name: t("buffet_tables"), desc: t("buffet_tables_desc"), image: img2 },
    { name: t("buffet_present"), desc: t("buffet_present_desc"), image: img3 }
  ];
  return <CategoryTemplate title={t("cat_buffet") + " & " + t("cat_banqueting")} products={products} />;
}
