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
import type { Category } from "@shared/schema";

export default function CategoryManager() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories", "all"],
    queryFn: async () => {
      const res = await fetch("/api/categories?all=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/categories/${id}/toggle-visibility`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Visibility updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
      toast({ title: "Category added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
      toast({ title: "Category updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
      toast({ title: "Category deleted" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
    return <p className="text-neutral-500 p-4">Loading categories...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Categories</h2>
          <p className="text-neutral-500 text-sm">{categories.length} categories</p>
        </div>
        <Button data-testid="button-add-category" onClick={openAdd}>
          + Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b bg-neutral-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Order</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Image</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name (EN)</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name (AR)</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Slug</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Visible</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
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
                  <button
                    data-testid={`button-toggle-visibility-${cat.id}`}
                    onClick={() => toggleVisibilityMutation.mutate(cat.id)}
                    disabled={toggleVisibilityMutation.isPending}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      cat.visible
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-neutral-100 text-neutral-400 border border-neutral-200 hover:bg-neutral-200"
                    }`}
                  >
                    {cat.visible ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        Visible
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        Hidden
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-category-${cat.id}`}
                      onClick={() => openEdit(cat)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      data-testid={`button-delete-category-${cat.id}`}
                      onClick={() => setDeleteConfirm(cat.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-neutral-500 text-center py-8">No categories yet. Add your first category.</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update category details." : "Create a new product category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name-en">Name (English)</Label>
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
                <Label htmlFor="cat-name-ar">Name (Arabic)</Label>
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
                <Label htmlFor="cat-slug">URL Slug</Label>
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
                <Label htmlFor="cat-order">Sort Order</Label>
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
              <Label htmlFor="cat-image">Category Image</Label>
              <Input
                id="cat-image"
                data-testid="input-category-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {editingCategory?.imageUrl && !imageFile && (
                <p className="text-xs text-neutral-400">Current image will be kept if no new file is selected.</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-submit-category" disabled={isPending}>
                {isPending ? "Saving..." : editingCategory ? "Update" : "Add Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure? This will also delete all products in this category. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete-category"
              disabled={deleteMutation.isPending}
              onClick={() => deleteConfirm !== null && deleteMutation.mutate(deleteConfirm)}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
