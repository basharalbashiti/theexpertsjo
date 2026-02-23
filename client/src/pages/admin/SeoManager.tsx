import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useAdminLang } from "@/hooks/useAdminLang";

const SEO_DEFAULTS: Record<string, string> = {
  site_title: "The Experts - For Hotel Supplies",
  site_title_ar: "الخبراء - لمستلزمات الفنادق",
  site_description: "Elevating hospitality with premium supplies — where quality meets comfort for every guest experience.",
  site_description_ar: "الارتقاء بالضيافة مع مستلزمات متميزة — حيث تلتقي الجودة بالراحة لكل تجربة ضيف.",
  og_title: "The Experts - For Hotel Supplies",
  og_title_ar: "الخبراء - لمستلزمات الفنادق",
  og_description: "Elevating hospitality with premium supplies — where quality meets comfort for every guest experience.",
  og_description_ar: "الارتقاء بالضيافة مع مستلزمات متميزة — حيث تلتقي الجودة بالراحة لكل تجربة ضيف.",
  twitter_title: "The Experts - For Hotel Supplies",
  twitter_title_ar: "الخبراء - لمستلزمات الفنادق",
  twitter_description: "Elevating hospitality with premium supplies — where quality meets comfort for every guest experience.",
  twitter_description_ar: "الارتقاء بالضيافة مع مستلزمات متميزة — حيث تلتقي الجودة بالراحة لكل تجربة ضيف.",
  org_name: "The Experts",
  org_name_ar: "الخبراء",
  org_url: "https://theexpertsjo.com",
  org_description: "Elevating hospitality with premium supplies — where quality meets comfort for every guest experience.",
  org_description_ar: "الارتقاء بالضيافة مع مستلزمات متميزة — حيث تلتقي الجودة بالراحة لكل تجربة ضيف.",
  org_phone: "+962 79 0484745",
  sitemap_base_url: "https://theexpertsjo.com",
  robots_allow_all: "true",
};

function BilingualInput({ label, enKey, arKey, form, updateField, type = "input", rows = 2, placeholder }: {
  label: string;
  enKey: string;
  arKey: string;
  form: Record<string, string>;
  updateField: (key: string, value: string) => void;
  type?: "input" | "textarea";
  rows?: number;
  placeholder?: string;
}) {
  const inputClass = "w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">EN</span>
          </div>
          {type === "textarea" ? (
            <textarea
              data-testid={`input-${enKey}`}
              value={form[enKey] || ""}
              onChange={(e) => updateField(enKey, e.target.value)}
              rows={rows}
              className={`${inputClass} resize-none`}
              placeholder={placeholder}
            />
          ) : (
            <input
              data-testid={`input-${enKey}`}
              type="text"
              value={form[enKey] || ""}
              onChange={(e) => updateField(enKey, e.target.value)}
              className={inputClass}
              placeholder={placeholder}
            />
          )}
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">AR</span>
          </div>
          {type === "textarea" ? (
            <textarea
              data-testid={`input-${arKey}`}
              value={form[arKey] || ""}
              onChange={(e) => updateField(arKey, e.target.value)}
              rows={rows}
              dir="rtl"
              className={`${inputClass} resize-none text-right`}
              placeholder={placeholder}
            />
          ) : (
            <input
              data-testid={`input-${arKey}`}
              type="text"
              value={form[arKey] || ""}
              onChange={(e) => updateField(arKey, e.target.value)}
              dir="rtl"
              className={`${inputClass} text-right`}
              placeholder={placeholder}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SeoManager() {
  const { t } = useAdminLang();
  const { data: seoData = {}, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/seo"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const merged: Record<string, string> = {};
    for (const key of Object.keys(SEO_DEFAULTS)) {
      merged[key] = seoData[key] !== undefined ? seoData[key] : SEO_DEFAULTS[key];
    }
    for (const key of Object.keys(seoData)) {
      if (!(key in merged)) {
        merged[key] = seoData[key];
      }
    }
    setForm(merged);
  }, [seoData]);

  const saveMutation = useMutation({
    mutationFn: async (settings: { key: string; value: string }[]) => {
      const res = await apiRequest("PUT", "/api/seo/bulk", { settings });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = () => {
    const settings = Object.entries(form).map(([key, value]) => ({ key, value }));
    saveMutation.mutate(settings);
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{t("seo_management")}</h2>
          <p className="text-neutral-500 mt-1">{t("seo_manage_desc")}</p>
        </div>
        <button
          data-testid="button-save-seo"
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
        >
          {saveMutation.isPending ? t("saving") : saved ? t("saved") : t("save_all_changes")}
        </button>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <h3 className="text-lg font-bold text-neutral-900">{t("page_meta_tags")}</h3>
        </div>
        <p className="text-sm text-neutral-500">{t("meta_tags_desc")}</p>

        <BilingualInput label={t("page_title")} enKey="site_title" arKey="site_title_ar" form={form} updateField={updateField} />

        <BilingualInput label={t("meta_description")} enKey="site_description" arKey="site_description_ar" form={form} updateField={updateField} type="textarea" rows={3} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-50 rounded-lg p-4 border border-dashed border-neutral-300">
            <p className="text-xs text-neutral-400 mb-2 font-medium">{t("google_preview_en")}</p>
            <div className="space-y-1">
              <p className="text-[#1a0dab] text-lg leading-snug truncate">{form.site_title || "Page Title"}</p>
              <p className="text-[#006621] text-sm">{form.org_url || "https://theexpertsjo.com"}</p>
              <p className="text-sm text-neutral-600 line-clamp-2">{form.site_description || "Meta description will appear here..."}</p>
            </div>
          </div>
          <div className="bg-neutral-50 rounded-lg p-4 border border-dashed border-neutral-300" dir="rtl">
            <p className="text-xs text-neutral-400 mb-2 font-medium">{t("google_preview_ar")}</p>
            <div className="space-y-1">
              <p className="text-[#1a0dab] text-lg leading-snug truncate">{form.site_title_ar || "عنوان الصفحة"}</p>
              <p className="text-[#006621] text-sm">{form.org_url || "https://theexpertsjo.com"}</p>
              <p className="text-sm text-neutral-600 line-clamp-2">{form.site_description_ar || "وصف الميتا سيظهر هنا..."}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-neutral-400">{(form.site_description || "").length} / 160 {t("characters")} (EN) · {(form.site_description_ar || "").length} / 160 {t("characters")} (AR)</p>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
          <h3 className="text-lg font-bold text-neutral-900">{t("social_sharing")}</h3>
        </div>
        <p className="text-sm text-neutral-500">{t("social_sharing_desc")}</p>

        <div className="space-y-5">
          <h4 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">{t("og_facebook")}</h4>
          <BilingualInput label={t("og_title")} enKey="og_title" arKey="og_title_ar" form={form} updateField={updateField} />
          <BilingualInput label={t("og_description")} enKey="og_description" arKey="og_description_ar" form={form} updateField={updateField} type="textarea" rows={2} />
        </div>

        <div className="border-t pt-5 space-y-5">
          <h4 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">{t("twitter_card")}</h4>
          <BilingualInput label={t("twitter_title")} enKey="twitter_title" arKey="twitter_title_ar" form={form} updateField={updateField} />
          <BilingualInput label={t("twitter_description")} enKey="twitter_description" arKey="twitter_description_ar" form={form} updateField={updateField} type="textarea" rows={2} />
        </div>

        <div className="bg-neutral-50 rounded-lg p-4 border border-dashed border-neutral-300">
          <p className="text-xs text-neutral-400 mb-3 font-medium">{t("social_preview")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="h-28 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-3xl">🔗</span>
              </div>
              <div className="p-3 space-y-1">
                <p className="text-xs text-neutral-400 uppercase">{(form.org_url || "theexpertsjo.com").replace(/https?:\/\//, "")}</p>
                <p className="font-semibold text-sm text-neutral-900 truncate">{form.og_title || "Title"}</p>
                <p className="text-xs text-neutral-500 line-clamp-2">{form.og_description || "Description"}</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm" dir="rtl">
              <div className="h-28 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-3xl">🔗</span>
              </div>
              <div className="p-3 space-y-1">
                <p className="text-xs text-neutral-400 uppercase">{(form.org_url || "theexpertsjo.com").replace(/https?:\/\//, "")}</p>
                <p className="font-semibold text-sm text-neutral-900 truncate">{form.og_title_ar || "العنوان"}</p>
                <p className="text-xs text-neutral-500 line-clamp-2">{form.og_description_ar || "الوصف"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          <h3 className="text-lg font-bold text-neutral-900">{t("structured_data")}</h3>
        </div>
        <p className="text-sm text-neutral-500">{t("structured_data_desc")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">{t("website_url")}</label>
            <input
              data-testid="input-org-url"
              type="text"
              value={form.org_url || ""}
              onChange={(e) => updateField("org_url", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="https://theexpertsjo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">{t("contact_phone")}</label>
            <input
              data-testid="input-org-phone"
              type="text"
              value={form.org_phone || ""}
              onChange={(e) => updateField("org_phone", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="+962 79 0484745"
            />
          </div>
        </div>

        <BilingualInput label={t("org_name")} enKey="org_name" arKey="org_name_ar" form={form} updateField={updateField} />
        <BilingualInput label={t("org_description")} enKey="org_description" arKey="org_description_ar" form={form} updateField={updateField} type="textarea" rows={2} />
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <h3 className="text-lg font-bold text-neutral-900">{t("sitemap_robots")}</h3>
        </div>
        <p className="text-sm text-neutral-500">{t("sitemap_robots_desc")}</p>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">{t("sitemap_base_url")}</label>
          <input
            data-testid="input-sitemap-base-url"
            type="text"
            value={form.sitemap_base_url || ""}
            onChange={(e) => updateField("sitemap_base_url", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="https://theexpertsjo.com"
          />
          <p className="text-xs text-neutral-400 mt-1">{t("sitemap_base_url_desc")}</p>
        </div>

        <div className="flex items-center justify-between gap-4 py-3 px-4 bg-neutral-50 rounded-lg overflow-hidden">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-700">{t("allow_search_engines")}</p>
            <p className="text-xs text-neutral-400">{t("allow_search_engines_desc")}</p>
          </div>
          <div className="flex-shrink-0">
            <button
              data-testid="button-toggle-robots"
              onClick={() => updateField("robots_allow_all", form.robots_allow_all === "true" ? "false" : "true")}
              className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors ${
                form.robots_allow_all === "true" ? "bg-green-500" : "bg-neutral-300"
              }`}
            >
              <span
                className={`inline-block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.robots_allow_all === "true" ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">{t("sitemap_preview")}</p>
            <a
              href="/sitemap.xml"
              target="_blank"
              data-testid="link-view-sitemap"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              {t("view_sitemap")}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            </a>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">{t("robots_preview")}</p>
            <a
              href="/robots.txt"
              target="_blank"
              data-testid="link-view-robots"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              {t("view_robots")}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-end pb-6">
        <button
          data-testid="button-save-seo-bottom"
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
        >
          {saveMutation.isPending ? t("saving") : saved ? t("saved") : t("save_all_changes")}
        </button>
      </div>
    </div>
  );
}
