import { useState } from "react";
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
  products_banner: defaultProductsBanner,
  contact_banner: defaultContactBanner,
  about_banner: defaultHero1,
  about_mission: defaultHero2,
  about_vision: defaultHero3,
  about_chairman: defaultChairman,
  partners_banner: defaultPartnersBanner,
  partners_cta: defaultPartnersCta,
  category_banner: defaultCategoryBanner,
};

const imageSections = [
  {
    titleKey: "homepage",
    slots: [
      { key: "logo", label: "Site Logo", description: "Main logo displayed in the navbar and footer" },
      { key: "hero1", label: "Hero Banner 1", description: "First hero slide on the homepage" },
      { key: "hero2", label: "Hero Banner 2", description: "Second hero slide on the homepage" },
      { key: "hero3", label: "Hero Banner 3", description: "Third hero slide on the homepage" },
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
              const currentUrl = imageMap[slot.key] || defaultImages[slot.key];
              const isLogo = slot.key === "logo";

              return (
                <div
                  key={slot.key}
                  data-testid={`site-image-${slot.key}`}
                  className="bg-white rounded-xl border overflow-hidden"
                >
                  <div className={`relative ${isLogo ? "h-40 bg-neutral-800 flex items-center justify-center" : "h-48"}`}>
                    {isLogo ? (
                      <img
                        src={currentUrl}
                        alt={slot.label}
                        className="h-20 w-auto object-contain brightness-0 invert"
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
                      <Label className="text-xs font-medium text-neutral-500">Upload New Image</Label>
                      <div className="flex gap-2">
                        <Input
                          data-testid={`input-image-${slot.key}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(slot.key, slot.label, e.target.files?.[0])}
                          disabled={uploadMutation.isPending}
                          className="text-sm"
                        />
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
