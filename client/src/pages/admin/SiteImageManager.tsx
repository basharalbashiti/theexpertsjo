import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { SiteImage } from "@shared/schema";

import defaultHero1 from "@/assets/hero-1.jpg";
import defaultHero2 from "@/assets/hero-2.jpg";
import defaultHero3 from "@/assets/hero-3.jpg";
import defaultLogo from "@/assets/logo.png";

const defaultImages: Record<string, string> = {
  hero1: defaultHero1,
  hero2: defaultHero2,
  hero3: defaultHero3,
  logo: defaultLogo,
};

const imageSlots = [
  { key: "logo", label: "Site Logo", description: "Main logo displayed in the navbar and footer" },
  { key: "hero1", label: "Hero Banner 1", description: "First hero slide on the homepage" },
  { key: "hero2", label: "Hero Banner 2", description: "Second hero slide on the homepage" },
  { key: "hero3", label: "Hero Banner 3", description: "Third hero slide on the homepage" },
];

export default function SiteImageManager() {
  const { toast } = useToast();
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
    mutationFn: async ({ key, file }: { key: string; file: File }) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("label", imageSlots.find((s) => s.key === key)?.label || key);
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
      setUploadingKey(null);
      toast({ title: "Updated", description: "Image updated successfully." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleFileChange = (key: string, file: File | undefined) => {
    if (!file) return;
    setUploadingKey(key);
    uploadMutation.mutate({ key, file });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Site Images</h2>
        <p className="text-neutral-500 text-sm">Manage your hero banners and site logo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {imageSlots.map((slot) => {
          const currentUrl = imageMap[slot.key] || defaultImages[slot.key];
          const isLogo = slot.key === "logo";

          return (
            <div
              key={slot.key}
              data-testid={`site-image-${slot.key}`}
              className="bg-white rounded-xl border overflow-hidden"
            >
              <div className={`relative ${isLogo ? "h-40 bg-neutral-800 flex items-center justify-center" : "h-56"}`}>
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
                      onChange={(e) => handleFileChange(slot.key, e.target.files?.[0])}
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
  );
}
