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
import type { Leadership } from "@shared/schema";

export default function LeadershipManager() {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingLeader, setEditingLeader] = useState<Leadership | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [roleEn, setRoleEn] = useState("");
  const [roleAr, setRoleAr] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: leaders = [], isLoading } = useQuery<Leadership[]>({
    queryKey: ["/api/leadership?all=true"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, visible }: { id: number; visible: boolean }) => {
      const res = await fetch(`/api/leadership/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leadership?all=true"] });
      toast({ title: t("visibility_updated") });
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("nameEn", nameEn);
      formData.append("nameAr", nameAr);
      formData.append("roleEn", roleEn);
      formData.append("roleAr", roleAr);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("sortOrder", sortOrder);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch("/api/leadership", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leadership?all=true"] });
      resetForm();
      toast({ title: t("leader_added") });
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
      formData.append("roleEn", roleEn);
      formData.append("roleAr", roleAr);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("sortOrder", sortOrder);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch(`/api/leadership/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leadership?all=true"] });
      resetForm();
      toast({ title: t("leader_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/leadership/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leadership?all=true"] });
      setDeleteConfirm(null);
      toast({ title: t("leader_deleted") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingLeader(null);
    setNameEn("");
    setNameAr("");
    setRoleEn("");
    setRoleAr("");
    setPhone("");
    setEmail("");
    setSortOrder("0");
    setImageFile(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (leader: Leadership) => {
    setEditingLeader(leader);
    setNameEn(leader.nameEn);
    setNameAr(leader.nameAr);
    setRoleEn(leader.roleEn);
    setRoleAr(leader.roleAr);
    setPhone(leader.phone || "");
    setEmail(leader.email || "");
    setSortOrder(String(leader.sortOrder));
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLeader) {
      updateMutation.mutate(editingLeader.id);
    } else {
      createMutation.mutate();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return <p className="text-muted-foreground p-4">{t("loading")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("leadership")} ({leaders.length})</h3>
        <Button data-testid="button-add-leader" onClick={openAdd}>
          {t("add_leader")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaders.map((leader) => (
          <div
            key={leader.id}
            data-testid={`card-leader-${leader.id}`}
            className={`border rounded-xl p-5 bg-card flex flex-col items-center gap-3 ${!leader.visible ? "opacity-50" : ""}`}
          >
            {leader.imageUrl ? (
              <img
                src={leader.imageUrl}
                alt={leader.nameEn}
                className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center">
                <span className="text-xl font-serif font-bold text-white tracking-wider">
                  {getInitials(leader.nameEn)}
                </span>
              </div>
            )}
            <div className="text-center">
              <p className="font-semibold text-neutral-900">{leader.nameEn}</p>
              {leader.nameAr && <p className="text-sm text-neutral-500" dir="rtl">{leader.nameAr}</p>}
              <p className="text-xs text-primary uppercase tracking-widest mt-1">{leader.roleEn}</p>
              {leader.roleAr && <p className="text-xs text-neutral-400 mt-0.5" dir="rtl">{leader.roleAr}</p>}
              {(leader.phone || leader.email) && (
                <div className="mt-2 text-xs text-neutral-500 space-y-0.5">
                  {leader.phone && <p>Tel: {leader.phone}</p>}
                  {leader.email && <p>{leader.email}</p>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">{t("sort_order")}: {leader.sortOrder}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${leader.visible ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                {leader.visible ? t("visible") : t("hidden")}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                data-testid={`button-toggle-leader-${leader.id}`}
                onClick={() => toggleVisibility.mutate({ id: leader.id, visible: !leader.visible })}
              >
                {leader.visible ? t("hide") : t("show")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                data-testid={`button-edit-leader-${leader.id}`}
                onClick={() => openEdit(leader)}
              >
                {t("edit")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                data-testid={`button-delete-leader-${leader.id}`}
                onClick={() => setDeleteConfirm(leader.id)}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {leaders.length === 0 && (
        <p className="text-muted-foreground text-center py-8">{t("no_leaders")}</p>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingLeader ? t("edit_leader") : t("add_leader")}</DialogTitle>
            <DialogDescription>
              {editingLeader ? t("update_leader_details") : t("add_leader_desc")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leader-name-en">{t("name_en")}</Label>
                <Input
                  id="leader-name-en"
                  data-testid="input-leader-name-en"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. John Smith"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leader-name-ar">{t("name_ar")}</Label>
                <Input
                  id="leader-name-ar"
                  data-testid="input-leader-name-ar"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="الاسم بالعربية"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leader-role-en">{t("role_en")}</Label>
                <Input
                  id="leader-role-en"
                  data-testid="input-leader-role-en"
                  value={roleEn}
                  onChange={(e) => setRoleEn(e.target.value)}
                  placeholder="e.g. General Manager"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leader-role-ar">{t("role_ar")}</Label>
                <Input
                  id="leader-role-ar"
                  data-testid="input-leader-role-ar"
                  value={roleAr}
                  onChange={(e) => setRoleAr(e.target.value)}
                  placeholder="المنصب بالعربية"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leader-phone">{t("phone")}</Label>
                <Input
                  id="leader-phone"
                  data-testid="input-leader-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+962 79 1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leader-email">{t("email_address")}</Label>
                <Input
                  id="leader-email"
                  data-testid="input-leader-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@theexpertsjo.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leader-image">{t("photo")}</Label>
                <Input
                  id="leader-image"
                  data-testid="input-leader-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leader-sort">{t("sort_order")}</Label>
                <Input
                  id="leader-sort"
                  data-testid="input-leader-sort"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("cancel")}
              </Button>
              <Button type="submit" data-testid="button-submit-leader" disabled={isPending}>
                {isPending ? t("saving") : editingLeader ? t("update") : t("add")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_leader")}</DialogTitle>
            <DialogDescription>
              {t("delete_leader_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete-leader"
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
