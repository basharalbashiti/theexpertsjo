import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdminLang } from "@/hooks/useAdminLang";
import type { SiteImage } from "@shared/schema";
import { invalidateSiteImages } from "@/hooks/useSiteImages";

import defaultHero1 from "@/assets/hero-1.jpg";
import defaultHero2 from "@/assets/hero-2.jpg";
import defaultHero3 from "@/assets/hero-3.jpg";
import defaultLogo from "@/assets/logo.png";
import defaultProductsBanner from "@/assets/products-banner-bedroom.png";
import defaultContactBanner from "@/assets/contact-banner-ultra-clear.png";
import defaultPartnersBanner from "@/assets/partners-banner-outdoor.png";
import defaultPartnersCta from "@/assets/partnership-bespoke.png";
import defaultCategoryBanner from "@/assets/category-generic-banner.png";
import defaultChairman from "@/assets/cat-furniture.jpg";

const defaultImages: Record<string, string> = {
  hero1: defaultHero1,
  hero2: defaultHero2,
  hero3: defaultHero3,
  logo: defaultLogo,
  favicon: "/favicon.png",
  og_image: "/opengraph.png",
  products_banner: defaultProductsBanner,
  contact_banner: defaultContactBanner,
  about_banner: defaultHero1,
  about_mission: defaultHero2,
  about_vision: defaultHero3,
  about_chairman: defaultChairman,
  partners_banner: defaultPartnersBanner,
  partners_cta: defaultPartnersCta,
  category_banner: defaultCategoryBanner,
  home_section: defaultHero2,
};

const imageSections = [
  {
    titleKey: "homepage",
    slots: [
      { key: "logo", label: "Site Logo", description: "Main logo displayed in the navbar and footer" },
      { key: "favicon", label: "Favicon", description: "Browser tab icon (recommended: 64×64 or 128×128 PNG)" },
      { key: "og_image", label: "Social Share Image", description: "Image shown when sharing on Facebook, Twitter, WhatsApp, etc. (recommended: 1200×630 PNG)" },
      { key: "hero1", label: "Hero Banner 1", description: "First hero slide on the homepage" },
      { key: "hero2", label: "Hero Banner 2", description: "Second hero slide on the homepage" },
      { key: "hero3", label: "Hero Banner 3", description: "Third hero slide on the homepage" },
      { key: "hero4", label: "Hero Banner 4", description: "Fourth hero slide on the homepage (optional)" },
      { key: "home_section", label: "Home Section Image", description: "Image beside the 'All in One Place' text" },
    ],
  },
  {
    titleKey: "products_page",
    slots: [
      { key: "products_banner", label: "Products Page Banner", description: "Hero banner on the products/categories page" },
      { key: "category_banner", label: "Category Detail Banner", description: "Default banner for category detail pages" },
    ],
  },
  {
    titleKey: "contact_page",
    slots: [
      { key: "contact_banner", label: "Contact Page Banner", description: "Hero banner on the contact page" },
    ],
  },
  {
    titleKey: "about_page",
    slots: [
      { key: "about_banner", label: "About Page Banner", description: "Hero banner on the about page" },
      { key: "about_chairman", label: "Chairman Image", description: "Photo in the chairman's message section" },
      { key: "about_mission", label: "Mission Image", description: "Background image for the mission card" },
      { key: "about_vision", label: "Vision Image", description: "Background image for the vision card" },
    ],
  },
  {
    titleKey: "partners_page",
    slots: [
      { key: "partners_banner", label: "Partners Page Banner", description: "Hero banner on the partners page" },
      { key: "partners_cta", label: "Partnership CTA Image", description: "Image in the 'Become Our Partner' section" },
    ],
  },
];

export default function SiteImageManager() {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const { data: siteImages = [] } = useQuery<SiteImage[]>({
    queryKey: ["/api/site-images"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const imageMap = siteImages.reduce((acc, img) => {
    acc[img.key] = img.imageUrl;
    return acc;
  }, {} as Record<string, string>);

  const uploadMutation = useMutation({
    mutationFn: async ({ key, file, label }: { key: string; file: File; label: string }) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("label", label);
      const res = await fetch(`/api/site-images/${key}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to upload");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-images"] });
      invalidateSiteImages();
      setUploadingKey(null);
      toast({ title: t("updated"), description: t("image_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (key: string) => {
      const res = await fetch(`/api/site-images/${key}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-images"] });
      invalidateSiteImages();
      toast({ title: t("updated"), description: t("image_removed") || "Image removed" });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const handleFileChange = (key: string, label: string, file: File | undefined) => {
    if (!file) return;
    setUploadingKey(key);
    uploadMutation.mutate({ key, file, label });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">{t("site_images")}</h2>
        <p className="text-neutral-500 text-sm">{t("manage_banners_logo")}</p>
      </div>

      {imageSections.map((section) => (
        <div key={section.titleKey} className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-700 border-b pb-2">{t(section.titleKey)}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {section.slots.map((slot) => {
              const dbEntry = siteImages.find(si => si.key === slot.key);
              const isRemoved = dbEntry && dbEntry.imageUrl === "";
              const currentUrl = isRemoved ? "" : (imageMap[slot.key] || defaultImages[slot.key]);
              const hasCustomImage = dbEntry && dbEntry.imageUrl !== "";
              const isLogo = slot.key === "logo";
              const isFavicon = slot.key === "favicon";
              const isOgImage = slot.key === "og_image";

              return (
                <div
                  key={slot.key}
                  data-testid={`site-image-${slot.key}`}
                  className="bg-white rounded-xl border overflow-hidden"
                >
                  <div className={`relative ${isFavicon ? "h-32 bg-neutral-100 flex items-center justify-center" : isLogo ? "h-40 bg-neutral-800 flex items-center justify-center" : isOgImage ? "h-48 bg-neutral-50 flex items-center justify-center" : "h-48"}`}>
                    {isRemoved ? (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                        <div className="text-center text-neutral-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                          <p className="text-xs">{t("no_image") || "No image"}</p>
                        </div>
                      </div>
                    ) : isFavicon ? (
                      <img
                        src={currentUrl}
                        alt={slot.label}
                        className="h-16 w-16 object-contain"
                      />
                    ) : isLogo ? (
                      <img
                        src={currentUrl}
                        alt={slot.label}
                        className="h-20 w-auto object-contain brightness-0 invert"
                      />
                    ) : isOgImage ? (
                      <img
                        src={currentUrl}
                        alt={slot.label}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={currentUrl}
                        alt={slot.label}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {uploadingKey === slot.key && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{slot.label}</h3>
                      <p className="text-xs text-neutral-500">{slot.description}</p>
                    </div>

                    <div className="space-y-1.5">
                      <input id={`file-${slot.key}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(slot.key, slot.label, e.target.files?.[0])} disabled={uploadMutation.isPending} />
                      <div className="flex gap-2">
                        <button type="button" data-testid={`input-image-${slot.key}`} onClick={() => document.getElementById(`file-${slot.key}`)?.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-neutral-300 text-sm font-medium text-primary hover:border-primary hover:bg-primary/5 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                          {t("upload_photo")}
                        </button>
                        {hasCustomImage && (
                          <button type="button" onClick={() => removeMutation.mutate(slot.key)} disabled={removeMutation.isPending} className="px-3 py-2.5 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors" title={t("remove_image") || "Remove"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
