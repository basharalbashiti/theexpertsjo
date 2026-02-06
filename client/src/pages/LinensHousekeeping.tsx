import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-linens.png";
import img2 from "@/assets/cat-towels.jpg";
import img3 from "@/assets/cat-room-service.png";

export default function LinensHousekeepingPage() {
  const { t } = useLanguage();
  const products = [
    { name: t("linens_bed"), desc: t("linens_bed_desc"), image: img1 },
    { name: t("linens_towels"), desc: t("linens_towels_desc"), image: img2 },
    { name: t("linens_housekeeping"), desc: t("linens_housekeeping_desc"), image: img3 }
  ];
  return <CategoryTemplate title={t("cat_linens")} products={products} />;
}
