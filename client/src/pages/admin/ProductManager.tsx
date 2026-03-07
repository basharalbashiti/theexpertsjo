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
import { ArrowUp, ArrowDown, ArrowUpDown, ImagePlus, X, Images, Download } from "lucide-react";
import * as XLSX from "xlsx";
import type { Product, Category, ProductImage } from "@shared/schema";

type SortField = "nameEn" | "brand" | "category" | "sortOrder";
type SortDir = "asc" | "desc";

function ProductImageGallery({ productId }: { productId: number }) {
  const { toast } = useToast();
  const { t } = useAdminLang();
  const galleryRef = useRef<HTMLInputElement>(null);

  const { data: images = [], isLoading } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${productId}/images`],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}/images`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch images");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("sortOrder", String(images.length));
      const res = await fetch(`/api/products/${productId}/images`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to upload");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/images`] });
      toast({ title: t("image_added") || "Image added" });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (imageId: number) => {
      const res = await fetch(`/api/product-images/${imageId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/images`] });
      toast({ title: t("image_deleted") || "Image deleted" });
    },
    onError: (err: Error) => {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
      if (galleryRef.current) galleryRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Images size={16} />
          {t("product_gallery") || "Product Gallery"} ({images.length}/4)
        </Label>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative group">
            <img
              src={img.imageUrl}
              alt=""
              className="w-full aspect-square object-cover rounded-lg border"
              data-testid={`img-product-gallery-${img.id}`}
            />
            <button
              type="button"
              data-testid={`button-delete-gallery-image-${img.id}`}
              onClick={() => deleteMutation.mutate(img.id)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {images.length < 4 && (
          <div>
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              data-testid="button-add-gallery-image"
              onClick={() => galleryRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="w-full aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
            >
              <ImagePlus size={20} />
              <span className="text-xs">{uploadMutation.isPending ? (t("uploading") || "Uploading...") : (t("add_image") || "Add")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
    onSuccess: (data: Product) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(data);
      setImageFile(null);
      setRemoveImage(false);
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

  const visibilityMutation = useMutation({
    mutationFn: async ({ id, visibility }: { id: number; visibility: string }) => {
      const res = await fetch(`/api/products/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
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
          <div className="flex items-center gap-2">
            <button
              data-testid="button-export-products"
              onClick={() => {
                const rows = filteredAndSorted.map((p) => ({
                  [t("order")]: p.sortOrder,
                  [t("name_en")]: p.nameEn,
                  [t("name_arabic")]: p.nameAr,
                  [t("description_en")]: p.descriptionEn || "",
                  [t("description_ar")]: p.descriptionAr || "",
                  [t("brand")]: p.brand || "",
                  [t("category")]: getCategoryName(p.categoryId),
                  [t("visibility")]: p.visibility || "both",
                }));
                const ws = XLSX.utils.json_to_sheet(rows);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Products");
                XLSX.writeFile(wb, "products.xlsx");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1D6F42] hover:bg-[#185C36] text-white text-sm font-medium shadow-sm transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.15)"/>
                <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="12" y="17" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">XLS</text>
              </svg>
              {t("export_excel")}
            </button>
            <Button data-testid="button-add-product" onClick={openAdd}>
              {`+ ${t("add_product")}`}
            </Button>
          </div>
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
              <th className="text-center px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t("visibility")}</th>
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
                <td className="px-4 py-3 text-sm text-neutral-600 whitespace-nowrap" dir="rtl">{product.nameAr}</td>
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
                  <select
                    data-testid={`select-visibility-product-${product.id}`}
                    value={product.visibility || "both"}
                    onChange={(e) => visibilityMutation.mutate({ id: product.id, visibility: e.target.value })}
                    disabled={visibilityMutation.isPending}
                    className={`text-xs font-semibold rounded-full px-2.5 py-1.5 border cursor-pointer transition-colors ${
                      product.visibility === "hidden"
                        ? "bg-neutral-100 text-neutral-400 border-neutral-200"
                        : product.visibility === "both"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : product.visibility === "products"
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
                <Label>{t("main_image") || "Main Image"}</Label>
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

            {editingProduct && (
              <div className="border-t pt-4">
                <ProductImageGallery productId={editingProduct.id} />
              </div>
            )}

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
