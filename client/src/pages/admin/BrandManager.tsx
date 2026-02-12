import { useState } from "react";
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
import type { Brand } from "@shared/schema";

export default function BrandManager() {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch("/api/brands", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      resetForm();
      toast({ title: t("brand_added") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (id: number) => {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch(`/api/brands/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      resetForm();
      toast({ title: t("brand_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setDeleteConfirm(null);
      toast({ title: t("brand_deleted") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingBrand(null);
    setName("");
    setImageFile(null);
  };

  const openAdd = () => {
    setEditingBrand(null);
    setName("");
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateMutation.mutate(editingBrand.id);
    } else {
      createMutation.mutate();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <p className="text-muted-foreground p-4">{t("loading_brands")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("our_brands")} ({brands.length})</h3>
        <Button data-testid="button-add-brand" onClick={openAdd}>
          {t("add_brand")}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            data-testid={`card-brand-${brand.id}`}
            className="border rounded-lg p-3 bg-card flex flex-col items-center gap-2"
          >
            {brand.imageUrl ? (
              <img
                src={brand.imageUrl}
                alt={brand.name}
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-neutral-100 border border-dashed border-neutral-300 rounded flex items-center justify-center text-neutral-400 text-xs text-center px-1">
                {t("no_image")}
              </div>
            )}
            <p className="text-sm font-medium text-center">{brand.name}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                data-testid={`button-edit-brand-${brand.id}`}
                onClick={() => openEdit(brand)}
              >
                {t("edit")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                data-testid={`button-delete-brand-${brand.id}`}
                onClick={() => setDeleteConfirm(brand.id)}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <p className="text-muted-foreground text-center py-8">{t("no_brands")}</p>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? t("edit_brand") : t("add_brand")}</DialogTitle>
            <DialogDescription>
              {editingBrand ? t("update_brand_details") : t("add_brand_desc")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">{t("name")}</Label>
              <Input
                id="brand-name"
                data-testid="input-brand-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-image">{t("logo_image")}</Label>
              <Input
                id="brand-image"
                data-testid="input-brand-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required={!editingBrand}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("cancel")}
              </Button>
              <Button type="submit" data-testid="button-submit-brand" disabled={isPending}>
                {isPending ? t("saving") : editingBrand ? t("update") : t("add")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_brand")}</DialogTitle>
            <DialogDescription>
              {t("delete_brand_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete-brand"
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
