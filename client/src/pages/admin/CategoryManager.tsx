import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAdminLang } from "@/hooks/useAdminLang";
import type { Category } from "@shared/schema";

export default function CategoryManager() {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const catImageRef = useRef<HTMLInputElement>(null);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories", "all"],
    queryFn: async () => {
      const res = await fetch("/api/categories?all=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: async ({ id, visibility }: { id: number; visibility: string }) => {
      const res = await fetch(`/api/categories/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: t("visibility_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("nameEn", nameEn);
      formData.append("nameAr", nameAr);
      formData.append("slug", slug);
      formData.append("sortOrder", sortOrder);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch("/api/categories", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      resetForm();
      toast({ title: t("category_added") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (id: number) => {
      const formData = new FormData();
      formData.append("nameEn", nameEn);
      formData.append("nameAr", nameAr);
      formData.append("slug", slug);
      formData.append("sortOrder", sortOrder);
      if (imageFile) formData.append("image", imageFile);
      if (removeImage) formData.append("removeImage", "true");
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      resetForm();
      toast({ title: t("category_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setDeleteConfirm(null);
      toast({ title: t("category_deleted") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setNameEn("");
    setNameAr("");
    setSlug("");
    setSortOrder("0");
    setImageFile(null);
    setRemoveImage(false);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setNameEn(category.nameEn);
    setNameAr(category.nameAr);
    setSlug(category.slug);
    setSortOrder(String(category.sortOrder));
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate(editingCategory.id);
    } else {
      createMutation.mutate();
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <p className="text-neutral-500 p-4">{t("loading_categories")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{t("categories")}</h2>
          <p className="text-neutral-500 text-sm">{categories.length} {t("n_categories")}</p>
        </div>
        <Button data-testid="button-add-category" onClick={openAdd}>
          + {t("add_category")}
        </Button>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b bg-neutral-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("order")}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("image")}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("name_en")}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("name_ar")}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("slug")}</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("visibility")}</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} data-testid={`row-category-${cat.id}`} className="border-b last:border-0 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-sm text-neutral-500">{cat.sortOrder}</td>
                <td className="px-4 py-3">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.nameEn} className="w-12 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-neutral-900">{cat.nameEn}</td>
                <td className="px-4 py-3 text-sm text-neutral-600" dir="rtl">{cat.nameAr}</td>
                <td className="px-4 py-3 text-xs font-mono text-neutral-400">/{cat.slug}</td>
                <td className="px-4 py-3 text-center">
                  <select
                    data-testid={`select-visibility-${cat.id}`}
                    value={cat.visibility || "both"}
                    onChange={(e) => visibilityMutation.mutate({ id: cat.id, visibility: e.target.value })}
                    disabled={visibilityMutation.isPending}
                    className={`text-xs font-semibold rounded-full px-3 py-1.5 border cursor-pointer transition-colors ${
                      cat.visibility === "hidden"
                        ? "bg-neutral-100 text-neutral-400 border-neutral-200"
                        : cat.visibility === "both"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : cat.visibility === "products"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <option value="both">{t("visibility_both")}</option>
                    <option value="products">{t("visibility_products")}</option>
                    <option value="catalog">{t("visibility_catalog")}</option>
                    <option value="hidden">{t("visibility_hidden")}</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-category-${cat.id}`}
                      onClick={() => openEdit(cat)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      data-testid={`button-delete-category-${cat.id}`}
                      onClick={() => setDeleteConfirm(cat.id)}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-neutral-500 text-center py-8">{t("no_categories")}</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCategory ? t("edit_category") : t("add_category")}</DialogTitle>
            <DialogDescription>
              {editingCategory ? t("update_category_details") : t("create_category")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name-en">{t("name_english")}</Label>
                <Input
                  id="cat-name-en"
                  data-testid="input-category-name-en"
                  value={nameEn}
                  onChange={(e) => {
                    setNameEn(e.target.value);
                    if (!editingCategory) setSlug(generateSlug(e.target.value));
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-name-ar">{t("name_arabic")}</Label>
                <Input
                  id="cat-name-ar"
                  data-testid="input-category-name-ar"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-slug">{t("url_slug")}</Label>
                <Input
                  id="cat-slug"
                  data-testid="input-category-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="e.g. room-service"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-order">{t("sort_order")}</Label>
                <Input
                  id="cat-order"
                  data-testid="input-category-order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("category_image")}</Label>
              <input
                ref={catImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <button
                type="button"
                data-testid="input-category-image"
                onClick={() => catImageRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-neutral-300 text-sm font-medium text-primary hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                {imageFile ? imageFile.name : t("upload_photo") || "Upload photo"}
              </button>
              {imageFile && (
                <div className="relative inline-block mt-2">
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                  <button type="button" onClick={() => { setImageFile(null); if (catImageRef.current) catImageRef.current.value = ""; }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                </div>
              )}
              {editingCategory?.imageUrl && !imageFile && !removeImage && (
                <div className="relative inline-block mt-2">
                  <img src={editingCategory.imageUrl} alt="Current" className="w-20 h-20 object-cover rounded-lg border" />
                  <button type="button" onClick={() => setRemoveImage(true)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("cancel")}
              </Button>
              <Button type="submit" data-testid="button-submit-category" disabled={isPending}>
                {isPending ? t("saving") : editingCategory ? t("update") : t("add_category")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_category")}</DialogTitle>
            <DialogDescription>
              {t("delete_cat_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>{t("cancel")}</Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete-category"
              disabled={deleteMutation.isPending}
              onClick={() => deleteConfirm !== null && deleteMutation.mutate(deleteConfirm)}
            >
              {deleteMutation.isPending ? t("deleting") : t("delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
