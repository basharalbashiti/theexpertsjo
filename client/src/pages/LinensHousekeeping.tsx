import CategoryTemplate from "@/components/CategoryTemplate";
import { useLanguage } from "@/context/LanguageContext";
import img1 from "@/assets/cat-linens.png";
import img2 from "@/assets/cat-towels.jpg";
import img3 from "@/assets/cat-room-service.png";

export default function LinensHousekeepingPage() {
  const { t } = useLanguage();
  const products = [
    { name: "Premium Bed Linens", desc: "High-thread-count cotton sheets for ultimate guest comfort.", image: img1 },
    { name: "Luxury Towel Sets", desc: "Plush, absorbent towels in various weights and sizes.", image: img2 },
    { name: "Housekeeping Essentials", desc: "Efficient solutions for maintaining pristine guest rooms.", image: img3 }
  ];
  return <CategoryTemplate title={t("cat_linens")} products={products} />;
}
