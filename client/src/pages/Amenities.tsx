import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-towels.jpg";
import img2 from "@/assets/cat-linens.png";
import img3 from "@/assets/cat-amenities-wide.png";

export default function AmenitiesPage() {
  const { t } = useLanguage();
  const products = [
    { name: t("amenities_sig"), desc: t("amenities_sig_desc"), image: img1 },
    { name: t("amenities_kits"), desc: t("amenities_kits_desc"), image: img2 },
    { name: t("amenities_custom"), desc: t("amenities_custom_desc"), image: img3 }
  ];
  return <CategoryTemplate title={t("cat_amenities")} products={products} />;
}
