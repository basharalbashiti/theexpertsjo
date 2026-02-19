import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAdminLang } from "@/hooks/useAdminLang";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { Product, Category } from "@shared/schema";

type SortField = "nameEn" | "brand" | "category" | "sortOrder";
type SortDir = "asc" | "desc";

export default function ProductManager() {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);
  const [filterBrand, setFilterBrand] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const prodImageRef = useRef<HTMLInputElement>(null);
  const [sortField, setSortField] = useState<SortField>("sortOrder");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories", { all: true }],
    queryFn: async () => {
      const res = await fetch("/api/categories?all=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { all: true }],
    queryFn: async () => {
      const res = await fetch("/api/products?all=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const getCategoryName = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat?.nameEn || t("unknown");
  };

  const brandList = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => { if (p.brand) brands.add(p.brand); });
    return Array.from(brands).sort();
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    let list = [...products];
    if (filterCategoryId) list = list.filter((p) => p.categoryId === filterCategoryId);
    if (filterBrand) list = list.filter((p) => p.brand === filterBrand);
    if (searchName) list = list.filter((p) => p.nameEn.toLowerCase().includes(searchName.toLowerCase()) || p.nameAr.includes(searchName));

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "nameEn") {
        cmp = a.nameEn.localeCompare(b.nameEn);
      } else if (sortField === "brand") {
        cmp = (a.brand || "").localeCompare(b.brand || "");
      } else if (sortField === "category") {
        cmp = getCategoryName(a.categoryId).localeCompare(getCategoryName(b.categoryId));
      } else {
        cmp = a.sortOrder - b.sortOrder;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [products, filterCategoryId, filterBrand, searchName, sortField, sortDir, categories]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="ml-1 inline text-neutral-300" />;
    return sortDir === "asc"
      ? <ArrowUp size={12} className="ml-1 inline text-primary" />
      : <ArrowDown size={12} className="ml-1 inline text-primary" />;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("nameEn", nameEn);
      formData.append("nameAr", nameAr);
      formData.append("descriptionEn", descEn);
      formData.append("descriptionAr", descAr);
      formData.append("brand", brand);
      formData.append("categoryId", categoryId);
      formData.append("sortOrder", sortOrder);
      if (imageFile) formData.append("image", imageFile);
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetForm();
      toast({ title: t("product_added") });
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
      formData.append("descriptionEn", descEn);
      formData.append("descriptionAr", descAr);
      formData.append("brand", brand);
      formData.append("categoryId", categoryId);
      formData.append("sortOrder", sortOrder);
      if (imageFile) formData.append("image", imageFile);
      if (removeImage) formData.append("removeImage", "true");
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetForm();
      toast({ title: t("product_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}/toggle-visibility`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: t("visibility_updated") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setDeleteConfirm(null);
      toast({ title: t("product_deleted") });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setNameEn("");
    setNameAr("");
    setDescEn("");
    setDescAr("");
    setBrand("");
    setCategoryId("");
    setSortOrder("0");
    setImageFile(null);
    setRemoveImage(false);
  };

  const openAdd = () => {
    resetForm();
    if (filterCategoryId) setCategoryId(String(filterCategoryId));
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setNameEn(product.nameEn);
    setNameAr(product.nameAr);
    setDescEn(product.descriptionEn);
    setDescAr(product.descriptionAr);
    setBrand(product.brand || "");
    setCategoryId(String(product.categoryId));
    setSortOrder(String(product.sortOrder));
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate(editingProduct.id);
    } else {
      createMutation.mutate();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return <p className="text-neutral-500 p-4">{t("loading_products")}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">{t("products")}</h2>
            <p className="text-neutral-500 text-sm">{filteredAndSorted.length} {t("n_products")}{filterCategoryId ? ` ${t("in")} ${getCategoryName(filterCategoryId)}` : ""}{filterBrand ? ` · ${filterBrand}` : ""}</p>
          </div>
          <Button data-testid="button-add-product" onClick={openAdd}>
            {`+ ${t("add_product")}`}
          </Button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            data-testid="input-search-name"
            placeholder={t("search_name")}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-56 text-sm"
          />
          <select
            data-testid="select-filter-category"
            value={filterCategoryId || ""}
            onChange={(e) => setFilterCategoryId(e.target.value ? parseInt(e.target.value) : null)}
            className="text-sm border rounded-lg px-3 py-2 bg-white text-neutral-700"
          >
            <option value="">{t("all_categories")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
            ))}
          </select>
          <select
            data-testid="select-filter-brand"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="text-sm border rounded-lg px-3 py-2 bg-white text-neutral-700"
          >
            <option value="">{t("all_brands")}</option>
            {brandList.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b bg-neutral-50">
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer select-none hover:text-neutral-700"
                onClick={() => toggleSort("sortOrder")}
              >
                {t("order")}<SortIcon field="sortOrder" />
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("image")}</th>
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer select-none hover:text-neutral-700"
                onClick={() => toggleSort("nameEn")}
              >
                {t("name_en")}<SortIcon field="nameEn" />
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("name_ar")}</th>
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer select-none hover:text-neutral-700"
                onClick={() => toggleSort("brand")}
              >
                {t("brand")}<SortIcon field="brand" />
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer select-none hover:text-neutral-700"
                onClick={() => toggleSort("category")}
              >
                {t("category")}<SortIcon field="category" />
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("visible")}</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((product) => (
              <tr key={product.id} data-testid={`row-product-${product.id}`} className="border-b last:border-0 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-sm text-neutral-500">{product.sortOrder}</td>
                <td className="px-4 py-3">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.nameEn} className="w-12 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-neutral-900">{product.nameEn}</p>
                  {product.descriptionEn && (
                    <p className="text-xs text-neutral-400 truncate max-w-[200px]">{product.descriptionEn}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600" dir="rtl">{product.nameAr}</td>
                <td className="px-4 py-3">
                  {product.brand ? (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">{product.brand}</span>
                  ) : (
                    <span className="text-xs text-neutral-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                    {getCategoryName(product.categoryId)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    data-testid={`button-toggle-visibility-product-${product.id}`}
                    onClick={() => toggleVisibilityMutation.mutate(product.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      product.visible
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                    }`}
                  >
                    {product.visible ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                    )}
                    {product.visible ? t("visible") : t("hidden")}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-product-${product.id}`}
                      onClick={() => openEdit(product)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      data-testid={`button-delete-product-${product.id}`}
                      onClick={() => setDeleteConfirm(product.id)}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAndSorted.length === 0 && (
          <p className="text-neutral-500 text-center py-8">{t("no_products")}</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? t("edit_product") : t("add_product")}</DialogTitle>
            <DialogDescription>
              {editingProduct ? t("update_product_details") : t("create_product")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-name-en">{t("name_english")}</Label>
                <Input
                  id="prod-name-en"
                  data-testid="input-product-name-en"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-name-ar">{t("name_arabic")}</Label>
                <Input
                  id="prod-name-ar"
                  data-testid="input-product-name-ar"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-desc-en">{t("description_en")}</Label>
                <Textarea
                  id="prod-desc-en"
                  data-testid="input-product-desc-en"
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-desc-ar">{t("description_ar")}</Label>
                <Textarea
                  id="prod-desc-ar"
                  data-testid="input-product-desc-ar"
                  value={descAr}
                  onChange={(e) => setDescAr(e.target.value)}
                  rows={3}
                  dir="rtl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-brand">{t("brand")}</Label>
                <Input
                  id="prod-brand"
                  data-testid="input-product-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Abdeen, Cashmere"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-category">{t("category")}</Label>
                <select
                  id="prod-category"
                  data-testid="select-product-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full text-sm border rounded-lg px-3 py-2 bg-white text-neutral-700"
                >
                  <option value="">{t("select_category")}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-order">{t("sort_order")}</Label>
                <Input
                  id="prod-order"
                  data-testid="input-product-order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("image")}</Label>
                <input
                  ref={prodImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  data-testid="input-product-image"
                  onClick={() => prodImageRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-neutral-300 text-sm font-medium text-primary hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  {imageFile ? imageFile.name : t("upload_photo") || "Upload photo"}
                </button>
                {imageFile && (
                  <div className="relative inline-block mt-2">
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                    <button type="button" onClick={() => { setImageFile(null); if (prodImageRef.current) prodImageRef.current.value = ""; }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                  </div>
                )}
                {editingProduct?.imageUrl && !imageFile && !removeImage && (
                  <div className="relative inline-block mt-2">
                    <img src={editingProduct.imageUrl} alt="Current" className="w-20 h-20 object-cover rounded-lg border" />
                    <button type="button" onClick={() => setRemoveImage(true)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">×</button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("cancel")}
              </Button>
              <Button type="submit" data-testid="button-submit-product" disabled={isPending}>
                {isPending ? t("saving") : editingProduct ? t("update") : t("add_product")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_product")}</DialogTitle>
            <DialogDescription>
              {t("delete_product_confirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>{t("cancel")}</Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete-product"
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
