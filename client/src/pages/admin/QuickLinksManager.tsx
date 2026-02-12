import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
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
import type { QuickLink } from "@shared/schema";

export default function QuickLinksManager() {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [labelEn, setLabelEn] = useState("");
  const [labelAr, setLabelAr] = useState("");
  const [url, setUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const { data: links = [], isLoading } = useQuery<QuickLink[]>({
    queryKey: ["/api/quick-links?all=true"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/quick-links", {
        labelEn,
        labelAr,
        url,
        sortOrder: parseInt(sortOrder) || 0,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quick-links?all=true"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quick-links"] });
      resetForm();
      toast({ title: t("link_added") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/quick-links/${id}`, {
        labelEn,
        labelAr,
        url,
        sortOrder: parseInt(sortOrder) || 0,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quick-links?all=true"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quick-links"] });
      resetForm();
      toast({ title: t("link_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/quick-links/${id}/toggle-visibility`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quick-links?all=true"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quick-links"] });
      toast({ title: t("visibility_updated") });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/quick-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quick-links?all=true"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quick-links"] });
      setDeleteConfirm(null);
      toast({ title: t("link_deleted") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingLink(null);
    setLabelEn("");
    setLabelAr("");
    setUrl("");
    setSortOrder("0");
  };

  const openAdd = () => {
    setEditingLink(null);
    setLabelEn("");
    setLabelAr("");
    setUrl("");
    setSortOrder("0");
    setDialogOpen(true);
  };

  const openEdit = (link: QuickLink) => {
    setEditingLink(link);
    setLabelEn(link.labelEn);
    setLabelAr(link.labelAr);
    setUrl(link.url);
    setSortOrder(String(link.sortOrder));
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLink) {
      updateMutation.mutate(editingLink.id);
    } else {
      createMutation.mutate();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <p className="text-muted-foreground p-4">{t("loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("quick_links")} ({links.length})</h3>
          <p className="text-sm text-muted-foreground">{t("quick_links_desc")}</p>
        </div>
        <Button data-testid="button-add-quick-link" onClick={openAdd}>
          {t("add_link")}
        </Button>
      </div>

      <div className="bg-white rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-neutral-50 text-neutral-500">
              <th className="py-3 px-4 text-left font-medium">{t("order")}</th>
              <th className="py-3 px-4 text-left font-medium">{t("name_en")}</th>
              <th className="py-3 px-4 text-left font-medium">{t("name_ar")}</th>
              <th className="py-3 px-4 text-left font-medium">URL</th>
              <th className="py-3 px-4 text-center font-medium">{t("visible")}</th>
              <th className="py-3 px-4 text-right font-medium">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} data-testid={`row-quick-link-${link.id}`} className="border-b last:border-0 hover:bg-neutral-50">
                <td className="py-3 px-4 text-neutral-400">{link.sortOrder}</td>
                <td className="py-3 px-4 font-medium">{link.labelEn}</td>
                <td className="py-3 px-4 text-neutral-600" dir="rtl">{link.labelAr}</td>
                <td className="py-3 px-4 text-neutral-500 font-mono text-xs">{link.url}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    data-testid={`button-toggle-link-${link.id}`}
                    onClick={() => toggleMutation.mutate(link.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      link.visible
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                    }`}
                  >
                    {link.visible ? `✓ ${t("visible")}` : t("hidden")}
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-link-${link.id}`}
                      onClick={() => openEdit(link)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      data-testid={`button-delete-link-${link.id}`}
                      onClick={() => setDeleteConfirm(link.id)}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {links.length === 0 && (
          <p className="text-muted-foreground text-center py-8">{t("no_quick_links")}</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? t("edit_link") : t("add_link")}</DialogTitle>
            <DialogDescription>
              {editingLink ? t("update_link_details") : t("add_link_desc")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link-label-en">{t("name_english")}</Label>
                <Input
                  id="link-label-en"
                  data-testid="input-link-label-en"
                  value={labelEn}
                  onChange={(e) => setLabelEn(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-label-ar">{t("name_arabic")}</Label>
                <Input
                  id="link-label-ar"
                  data-testid="input-link-label-ar"
                  value={labelAr}
                  onChange={(e) => setLabelAr(e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                data-testid="input-link-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/about-us"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-sort-order">{t("sort_order")}</Label>
              <Input
                id="link-sort-order"
                data-testid="input-link-sort-order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("cancel")}
              </Button>
              <Button type="submit" data-testid="button-submit-link" disabled={isPending}>
                {isPending ? t("saving") : editingLink ? t("update") : t("add")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_link")}</DialogTitle>
            <DialogDescription>
              {t("delete_link_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete-link"
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
