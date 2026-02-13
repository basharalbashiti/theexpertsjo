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
import type { KeyContact } from "@shared/schema";

export default function KeyContactManager() {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingContact, setEditingContact] = useState<KeyContact | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [roleEn, setRoleEn] = useState("");
  const [roleAr, setRoleAr] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const contactImageRef = useRef<HTMLInputElement>(null);
  const [avatarUploadId, setAvatarUploadId] = useState<number | null>(null);

  const { data: contacts = [], isLoading } = useQuery<KeyContact[]>({
    queryKey: ["/api/key-contacts?all=true"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const avatarUploadMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`/api/key-contacts/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/key-contacts?all=true"] });
      toast({ title: t("photo_updated") || "Photo updated" });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const handleAvatarClick = (contactId: number) => {
    setAvatarUploadId(contactId);
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && avatarUploadId !== null) {
      avatarUploadMutation.mutate({ id: avatarUploadId, file });
    }
    e.target.value = "";
    setAvatarUploadId(null);
  };

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
      const res = await fetch("/api/key-contacts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/key-contacts?all=true"] });
      resetForm();
      toast({ title: t("contact_added") });
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
      const res = await fetch(`/api/key-contacts/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/key-contacts?all=true"] });
      resetForm();
      toast({ title: t("contact_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/key-contacts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/key-contacts?all=true"] });
      setDeleteConfirm(null);
      toast({ title: t("contact_deleted") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, visible }: { id: number; visible: boolean }) => {
      const res = await fetch(`/api/key-contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/key-contacts?all=true"] });
      toast({ title: t("visibility_updated") });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingContact(null);
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

  const openEdit = (contact: KeyContact) => {
    setEditingContact(contact);
    setNameEn(contact.nameEn);
    setNameAr(contact.nameAr);
    setRoleEn(contact.roleEn);
    setRoleAr(contact.roleAr);
    setPhone(contact.phone || "");
    setEmail(contact.email || "");
    setSortOrder(String(contact.sortOrder));
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      updateMutation.mutate(editingContact.id);
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
        <h3 className="text-lg font-semibold">{t("key_contacts")} ({contacts.length})</h3>
        <Button data-testid="button-add-contact" onClick={openAdd}>
          {t("add_contact")}
        </Button>
      </div>

      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            data-testid={`card-contact-${contact.id}`}
            className={`border rounded-xl p-5 bg-card flex flex-col items-center gap-3 ${!contact.visible ? "opacity-50" : ""}`}
          >
            <button
              type="button"
              onClick={() => handleAvatarClick(contact.id)}
              className="relative w-20 h-20 rounded-full group cursor-pointer"
              title={t("change_photo") || "Change photo"}
            >
              {contact.imageUrl ? (
                <img
                  src={contact.imageUrl}
                  alt={contact.nameEn}
                  className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center">
                  <span className="text-xl font-serif font-bold text-white tracking-wider">
                    {getInitials(contact.nameEn)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </div>
            </button>
            <div className="text-center">
              <p className="font-semibold text-neutral-900">{contact.nameEn}</p>
              {contact.nameAr && <p className="text-sm text-neutral-500" dir="rtl">{contact.nameAr}</p>}
              <p className="text-xs text-primary uppercase tracking-widest mt-1">{contact.roleEn}</p>
              {contact.roleAr && <p className="text-xs text-neutral-400 mt-0.5" dir="rtl">{contact.roleAr}</p>}
              {(contact.phone || contact.email) && (
                <div className="mt-2 text-xs text-neutral-500 space-y-0.5">
                  {contact.phone && <p>Tel: {contact.phone}</p>}
                  {contact.email && <p>{contact.email}</p>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">{t("sort_order")}: {contact.sortOrder}</span>
              <button
                data-testid={`button-toggle-contact-${contact.id}`}
                onClick={() => toggleVisibility.mutate({ id: contact.id, visible: !contact.visible })}
                disabled={toggleVisibility.isPending}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  contact.visible
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-neutral-100 text-neutral-400 border border-neutral-200 hover:bg-neutral-200"
                }`}
              >
                {contact.visible ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    {t("visible")}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    {t("hidden")}
                  </>
                )}
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                data-testid={`button-edit-contact-${contact.id}`}
                onClick={() => openEdit(contact)}
              >
                {t("edit")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                data-testid={`button-delete-contact-${contact.id}`}
                onClick={() => setDeleteConfirm(contact.id)}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <p className="text-muted-foreground text-center py-8">{t("no_contacts")}</p>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingContact ? t("edit_contact") : t("add_contact")}</DialogTitle>
            <DialogDescription>
              {editingContact ? t("update_contact_details") : t("add_contact_desc")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name-en">{t("name_en")}</Label>
                <Input
                  id="contact-name-en"
                  data-testid="input-contact-name-en"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. John Smith"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-name-ar">{t("name_ar")}</Label>
                <Input
                  id="contact-name-ar"
                  data-testid="input-contact-name-ar"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="الاسم بالعربية"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-role-en">{t("role_en")}</Label>
                <Input
                  id="contact-role-en"
                  data-testid="input-contact-role-en"
                  value={roleEn}
                  onChange={(e) => setRoleEn(e.target.value)}
                  placeholder="e.g. Sales Manager"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-role-ar">{t("role_ar")}</Label>
                <Input
                  id="contact-role-ar"
                  data-testid="input-contact-role-ar"
                  value={roleAr}
                  onChange={(e) => setRoleAr(e.target.value)}
                  placeholder="المنصب بالعربية"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">{t("phone")}</Label>
                <Input
                  id="contact-phone"
                  data-testid="input-contact-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+962 79 1234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">{t("email_address")}</Label>
                <Input
                  id="contact-email"
                  data-testid="input-contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@theexpertsjo.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("photo")} <span className="text-neutral-400 font-normal">({t("optional") || "Optional"})</span></Label>
                <input ref={contactImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                <button type="button" data-testid="input-contact-image" onClick={() => contactImageRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-neutral-300 text-sm font-medium text-primary hover:border-primary hover:bg-primary/5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  {imageFile ? imageFile.name : t("upload_photo")}
                </button>
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-12 h-12 rounded-full object-cover border mt-2" />}
                {editingContact?.imageUrl && !imageFile && <img src={editingContact.imageUrl} alt="Current" className="w-12 h-12 rounded-full object-cover border mt-2" />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-sort">{t("sort_order")}</Label>
                <Input
                  id="contact-sort"
                  data-testid="input-contact-sort"
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
              <Button type="submit" data-testid="button-submit-contact" disabled={isPending}>
                {isPending ? t("saving") : editingContact ? t("update") : t("add")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_contact")}</DialogTitle>
            <DialogDescription>
              {t("delete_contact_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete-contact"
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
