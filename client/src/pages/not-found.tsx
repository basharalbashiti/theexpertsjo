import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "wouter";

export default function NotFound() {
  const { lang } = useLanguage();
  const isAr = lang === "AR";

  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4" dir={isAr ? "rtl" : "ltr"}>
        <h1 className="text-8xl font-bold text-primary/20 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {isAr ? "الصفحة غير موجودة" : "Page Not Found"}
        </h2>
        <p className="text-neutral-500 mb-8 max-w-md">
          {isAr
            ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
            : "Sorry, the page you're looking for doesn't exist or has been moved."}
        </p>
        <Link href="/">
          <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium" data-testid="link-home-404">
            {isAr ? "العودة للرئيسية" : "Back to Homepage"}
          </a>
        </Link>
      </div>
    </Layout>
  );
}
