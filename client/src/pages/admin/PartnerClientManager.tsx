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
import type { Partner, Client } from "@shared/schema";

type ActiveTab = "partners" | "clients";

export default function PartnerClientManager() {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [activeTab, setActiveTab] = useState<ActiveTab>("partners");

  const { data: partners = [], isLoading: loadingPartners } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: clientsList = [], isLoading: loadingClients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const isLoading = loadingPartners || loadingClients;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">{t("partners_and_clients")}</h2>
        <p className="text-neutral-500 mt-1">{t("partners_clients_desc")}</p>
      </div>

      <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
        <button
          data-testid="tab-partners"
          onClick={() => setActiveTab("partners")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "partners"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          {t("partners")} ({partners.length})
        </button>
        <button
          data-testid="tab-clients"
          onClick={() => setActiveTab("clients")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "clients"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          {t("clients")} ({clientsList.length})
        </button>
      </div>

      {activeTab === "partners" ? (
        <PartnerSection partners={partners} />
      ) : (
        <ClientSection clients={clientsList} />
      )}
    </div>
  );
}

function PartnerSection({ partners }: { partners: Partner[] }) {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch("/api/partners", { method: "POST", body: formData, credentials: "include" });
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
      const res = await fetch(`/api/partners/${id}`, { method: "PUT", body: formData, credentials: "include" });
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
      const res = await fetch(`/api/partners/${id}`, { method: "DELETE", credentials: "include" });
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

  const openAdd = () => { setEditingPartner(null); setName(""); setImageFile(null); setDialogOpen(true); };
  const openEdit = (partner: Partner) => { setEditingPartner(partner); setName(partner.name); setImageFile(null); setDialogOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPartner) updateMutation.mutate(editingPartner.id);
    else createMutation.mutate();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{t("desc_partners")}</p>
        <Button data-testid="button-add-partner" onClick={openAdd}>+ {t("add_partner")}</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <div key={partner.id} data-testid={`card-partner-${partner.id}`} className="bg-white rounded-xl border p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow group">
            {partner.imageUrl ? (
              <img src={partner.imageUrl} alt={partner.name} className="w-24 h-24 object-contain rounded-lg" />
            ) : (
              <div className="w-24 h-24 bg-neutral-100 border border-dashed border-neutral-300 rounded-lg flex items-center justify-center text-neutral-400 text-xs text-center px-1">{t("no_image")}</div>
            )}
            <p className="text-sm font-medium text-center truncate w-full">{partner.name}</p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" data-testid={`button-edit-partner-${partner.id}`} onClick={() => openEdit(partner)} className="text-xs px-2 py-1 h-auto">{t("edit")}</Button>
              <Button variant="destructive" size="sm" data-testid={`button-delete-partner-${partner.id}`} onClick={() => setDeleteConfirm(partner.id)} className="text-xs px-2 py-1 h-auto">{t("delete")}</Button>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-neutral-500">{t("no_partners")}</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPartner ? t("edit_partner") : t("add_partner")}</DialogTitle>
            <DialogDescription>{editingPartner ? t("update_partner_details") : t("add_partner_desc")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partner-name">{t("name")}</Label>
              <Input id="partner-name" data-testid="input-partner-name" value={name} onChange={(e) => setName(e.target.value)} required />
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
              <Button type="button" variant="outline" onClick={resetForm}>{t("cancel")}</Button>
              <Button type="submit" data-testid="button-submit-partner" disabled={isPending}>{isPending ? t("saving") : editingPartner ? t("update") : t("add")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_partner")}</DialogTitle>
            <DialogDescription>{t("delete_partner_confirm")}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>{t("cancel")}</Button>
            <Button variant="destructive" data-testid="button-confirm-delete" disabled={deleteMutation.isPending} onClick={() => deleteConfirm !== null && deleteMutation.mutate(deleteConfirm)}>
              {deleteMutation.isPending ? t("deleting") : t("delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ClientSection({ clients }: { clients: Client[] }) {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch("/api/clients", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      resetForm();
      toast({ title: t("client_added") });
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
      const res = await fetch(`/api/clients/${id}`, { method: "PUT", body: formData, credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      resetForm();
      toast({ title: t("client_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setDeleteConfirm(null);
      toast({ title: t("client_removed") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingClient(null);
    setName("");
    setImageFile(null);
    setRemoveImage(false);
  };

  const openAdd = () => { resetForm(); setDialogOpen(true); };
  const openEdit = (client: Client) => { setEditingClient(client); setName(client.name); setImageFile(null); setDialogOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) updateMutation.mutate(editingClient.id);
    else createMutation.mutate();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{t("desc_clients")}</p>
        <Button data-testid="button-add-client" onClick={openAdd}>+ {t("add_client")}</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {clients.map((client) => (
          <div key={client.id} data-testid={`card-client-${client.id}`} className="bg-white rounded-xl border p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow group">
            {client.imageUrl ? (
              <img src={client.imageUrl} alt={client.name} className="w-20 h-20 object-contain rounded-lg" />
            ) : (
              <div className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
            )}
            <p className="text-sm font-medium text-neutral-800 text-center truncate w-full">{client.name}</p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" data-testid={`button-edit-client-${client.id}`} onClick={() => openEdit(client)} className="text-xs px-2 py-1 h-auto">{t("edit")}</Button>
              <Button variant="destructive" size="sm" data-testid={`button-delete-client-${client.id}`} onClick={() => setDeleteConfirm(client.id)} className="text-xs px-2 py-1 h-auto">{t("delete")}</Button>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-neutral-500">{t("no_clients")}</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingClient ? t("edit_client") : t("add_client")}</DialogTitle>
            <DialogDescription>{editingClient ? t("update_client_details") : t("add_client_desc")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">{t("client_name")}</Label>
              <Input id="client-name" data-testid="input-client-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Four Seasons" required />
            </div>
            <div className="space-y-2">
              <Label>{t("logo_image")}</Label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              <button type="button" data-testid="input-client-image" onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-neutral-300 text-sm font-medium text-primary hover:border-primary hover:bg-primary/5 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                {imageFile ? imageFile.name : t("upload_photo")}
              </button>
              {imageFile && (
                <div className="relative inline-block mt-2">
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
                  <button type="button" onClick={() => { setImageFile(null); if (fileRef.current) fileRef.current.value = ""; }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                </div>
              )}
              {editingClient?.imageUrl && !imageFile && !removeImage && (
                <div className="relative inline-block mt-2">
                  <img src={editingClient.imageUrl} alt="Current" className="w-16 h-16 object-cover rounded-lg border" />
                  <button type="button" onClick={() => setRemoveImage(true)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>{t("cancel")}</Button>
              <Button type="submit" data-testid="button-submit-client" disabled={isPending}>{isPending ? t("saving") : editingClient ? t("update") : t("add_client")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("remove_client")}</DialogTitle>
            <DialogDescription>{t("delete_client_confirm")}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>{t("cancel")}</Button>
            <Button variant="destructive" data-testid="button-confirm-delete-client" disabled={deleteMutation.isPending} onClick={() => deleteConfirm !== null && deleteMutation.mutate(deleteConfirm)}>
              {deleteMutation.isPending ? t("removing") : t("remove")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
