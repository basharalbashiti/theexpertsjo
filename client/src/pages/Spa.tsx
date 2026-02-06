import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-towels.jpg";
import img2 from "@/assets/cat-linens.png";
import img3 from "@/assets/cat-spa-simple.png";

export default function SpaPage() {
  const { t } = useLanguage();
  const products = [
    { name: t("spa_towels"), desc: t("spa_towels_desc"), image: img1 },
    { name: t("spa_robes"), desc: t("spa_robes_desc"), image: img2 },
    { name: t("spa_essentials"), desc: t("spa_essentials_desc"), image: img3 }
  ];
  return <CategoryTemplate title={t("cat_spa")} products={products} />;
}
