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
import type { Partner } from "@shared/schema";

export default function PartnerManager() {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch("/api/partners", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      resetForm();
      toast({ title: t("partner_added") });
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
      if (removeImage) formData.append("removeImage", "true");
      const res = await fetch(`/api/partners/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      resetForm();
      toast({ title: t("partner_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/partners/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      setDeleteConfirm(null);
      toast({ title: t("partner_deleted") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingPartner(null);
    setName("");
    setImageFile(null);
    setRemoveImage(false);
  };

  const openAdd = () => {
    setEditingPartner(null);
    setName("");
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setName(partner.name);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPartner) {
      updateMutation.mutate(editingPartner.id);
    } else {
      createMutation.mutate();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <p className="text-muted-foreground p-4">{t("loading_partners")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("partners")} ({partners.length})</h3>
        <Button data-testid="button-add-partner" onClick={openAdd}>
          {t("add_partner")}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            data-testid={`card-partner-${partner.id}`}
            className="border rounded-lg p-3 bg-card flex flex-col items-center gap-2"
          >
            {partner.imageUrl ? (
              <img
                src={partner.imageUrl}
                alt={partner.name}
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-neutral-100 border border-dashed border-neutral-300 rounded flex items-center justify-center text-neutral-400 text-xs text-center px-1">
                {t("no_image")}
              </div>
            )}
            <p className="text-sm font-medium text-center">{partner.name}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                data-testid={`button-edit-partner-${partner.id}`}
                onClick={() => openEdit(partner)}
              >
                {t("edit")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                data-testid={`button-delete-partner-${partner.id}`}
                onClick={() => setDeleteConfirm(partner.id)}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <p className="text-muted-foreground text-center py-8">{t("no_partners")}</p>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPartner ? t("edit_partner") : t("add_partner")}</DialogTitle>
            <DialogDescription>
              {editingPartner ? t("update_partner_details") : t("add_partner_desc")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partner-name">{t("name")}</Label>
              <Input
                id="partner-name"
                data-testid="input-partner-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t("image")}</Label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              <button type="button" data-testid="input-partner-image" onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-neutral-300 text-sm font-medium text-primary hover:border-primary hover:bg-primary/5 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                {imageFile ? imageFile.name : t("upload_photo")}
              </button>
              {imageFile && (
                <div className="relative inline-block mt-2">
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
                  <button type="button" onClick={() => { setImageFile(null); if (fileRef.current) fileRef.current.value = ""; }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                </div>
              )}
              {editingPartner?.imageUrl && !imageFile && !removeImage && (
                <div className="relative inline-block mt-2">
                  <img src={editingPartner.imageUrl} alt="Current" className="w-16 h-16 object-cover rounded-lg border" />
                  <button type="button" onClick={() => setRemoveImage(true)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("cancel")}
              </Button>
              <Button type="submit" data-testid="button-submit-partner" disabled={isPending}>
                {isPending ? t("saving") : editingPartner ? t("update") : t("add")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_partner")}</DialogTitle>
            <DialogDescription>
              {t("delete_partner_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete"
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
