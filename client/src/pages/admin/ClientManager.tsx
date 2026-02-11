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
import type { Client } from "@shared/schema";

export default function ClientManager() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: clientsList = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch("/api/clients", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      resetForm();
      toast({ title: "Client added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (id: number) => {
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      resetForm();
      toast({ title: "Client updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setDeleteConfirm(null);
      toast({ title: "Client removed" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingClient(null);
    setName("");
    setImageFile(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateMutation.mutate(editingClient.id);
    } else {
      createMutation.mutate();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <p className="text-neutral-500 p-4">Loading clients...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Clients</h2>
          <p className="text-neutral-500 text-sm">{clientsList.length} hotel brand clients (Four Seasons, Marriott, etc.)</p>
        </div>
        <Button data-testid="button-add-client" onClick={openAdd}>
          + Add Client
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {clientsList.map((client) => (
          <div
            key={client.id}
            data-testid={`card-client-${client.id}`}
            className="bg-white rounded-xl border p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow group"
          >
            {client.imageUrl ? (
              <img
                src={client.imageUrl}
                alt={client.name}
                className="w-20 h-20 object-contain rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
            )}
            <p className="text-sm font-medium text-neutral-800 text-center truncate w-full">{client.name}</p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                data-testid={`button-edit-client-${client.id}`}
                onClick={() => openEdit(client)}
                className="text-xs px-2 py-1 h-auto"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                data-testid={`button-delete-client-${client.id}`}
                onClick={() => setDeleteConfirm(client.id)}
                className="text-xs px-2 py-1 h-auto"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {clientsList.length === 0 && (
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-neutral-500">No clients yet. Add your first hotel brand client.</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Add Client"}</DialogTitle>
            <DialogDescription>
              {editingClient ? "Update client details." : "Add a hotel brand client logo."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                data-testid="input-client-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Four Seasons"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-image">Logo Image</Label>
              <Input
                id="client-image"
                data-testid="input-client-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {editingClient?.imageUrl && !imageFile && (
                <p className="text-xs text-neutral-400">Current logo will be kept if no new file is selected.</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" data-testid="button-submit-client" disabled={isPending}>
                {isPending ? "Saving..." : editingClient ? "Update" : "Add Client"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete-client"
              disabled={deleteMutation.isPending}
              onClick={() => deleteConfirm !== null && deleteMutation.mutate(deleteConfirm)}
            >
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
