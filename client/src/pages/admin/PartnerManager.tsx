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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Partner } from "@shared/schema";

const FONT_OPTIONS = [
  { value: "sans-serif", label: "Sans-serif (Clean)" },
  { value: "serif", label: "Serif (Elegant)" },
  { value: "monospace", label: "Monospace" },
  { value: "'Georgia', serif", label: "Georgia" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
];

const WEIGHT_OPTIONS = [
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
  { value: "900", label: "Black" },
];

const SPACING_OPTIONS = [
  { value: "-0.05em", label: "Tight" },
  { value: "0em", label: "Normal" },
  { value: "0.05em", label: "Wide" },
  { value: "0.1em", label: "Wider" },
  { value: "0.2em", label: "Widest" },
];

export default function PartnerManager() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [displayType, setDisplayType] = useState<string>("image");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [fontWeight, setFontWeight] = useState("900");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textColor, setTextColor] = useState("#4A5568");
  const [letterSpacing, setLetterSpacing] = useState("0.05em");

  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("displayType", displayType);
      if (displayType === "image" && imageFile) {
        formData.append("image", imageFile);
      }
      if (displayType === "text") {
        formData.append("fontFamily", fontFamily);
        formData.append("fontWeight", fontWeight);
        formData.append("fontStyle", fontStyle);
        formData.append("textColor", textColor);
        formData.append("letterSpacing", letterSpacing);
      }
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
      toast({ title: "Partner added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (id: number) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("displayType", displayType);
      if (displayType === "image" && imageFile) {
        formData.append("image", imageFile);
      }
      if (displayType === "text") {
        formData.append("fontFamily", fontFamily);
        formData.append("fontWeight", fontWeight);
        formData.append("fontStyle", fontStyle);
        formData.append("textColor", textColor);
        formData.append("letterSpacing", letterSpacing);
      }
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
      toast({ title: "Partner updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
      toast({ title: "Partner deleted" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setDialogOpen(false);
    setEditingPartner(null);
    setName("");
    setImageFile(null);
    setDisplayType("image");
    setFontFamily("sans-serif");
    setFontWeight("900");
    setFontStyle("normal");
    setTextColor("#4A5568");
    setLetterSpacing("0.05em");
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setName(partner.name);
    setImageFile(null);
    setDisplayType(partner.displayType || "image");
    setFontFamily(partner.fontFamily || "sans-serif");
    setFontWeight(partner.fontWeight || "900");
    setFontStyle(partner.fontStyle || "normal");
    setTextColor(partner.textColor || "#4A5568");
    setLetterSpacing(partner.letterSpacing || "0.05em");
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
    return <p className="text-muted-foreground p-4">Loading partners...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Partners ({partners.length})</h3>
        <Button data-testid="button-add-partner" onClick={openAdd}>
          Add Partner
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            data-testid={`card-partner-${partner.id}`}
            className="border rounded-lg p-3 bg-card flex flex-col items-center gap-2"
          >
            {partner.displayType === "text" ? (
              <div
                className="w-24 h-24 flex items-center justify-center text-center px-1"
                style={{
                  fontFamily: partner.fontFamily,
                  fontWeight: partner.fontWeight as any,
                  fontStyle: partner.fontStyle,
                  color: partner.textColor,
                  letterSpacing: partner.letterSpacing,
                  fontSize: "1.1rem",
                  textTransform: "uppercase",
                }}
              >
                {partner.name}
              </div>
            ) : partner.imageUrl ? (
              <img
                src={partner.imageUrl}
                alt={partner.name}
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-neutral-100 border border-dashed border-neutral-300 rounded flex items-center justify-center text-neutral-400 text-xs text-center px-1">
                No image
              </div>
            )}
            <p className="text-sm font-medium text-center">{partner.name}</p>
            <span className="text-xs text-muted-foreground capitalize">{partner.displayType || "image"}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                data-testid={`button-edit-partner-${partner.id}`}
                onClick={() => openEdit(partner)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                data-testid={`button-delete-partner-${partner.id}`}
                onClick={() => setDeleteConfirm(partner.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No partners yet.</p>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
            <DialogDescription>
              {editingPartner ? "Update partner details." : "Add a new partner to display on the site."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partner-name">Name</Label>
              <Input
                id="partner-name"
                data-testid="input-partner-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Display Type</Label>
              <Select value={displayType} onValueChange={setDisplayType}>
                <SelectTrigger data-testid="select-display-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image (Logo)</SelectItem>
                  <SelectItem value="text">Text (Styled Name)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {displayType === "image" && (
              <div className="space-y-2">
                <Label htmlFor="partner-image">Logo Image</Label>
                <Input
                  id="partner-image"
                  data-testid="input-partner-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  required={!editingPartner}
                />
                {editingPartner?.imageUrl && !imageFile && (
                  <p className="text-xs text-neutral-400">Current logo will be kept if no new file is selected.</p>
                )}
              </div>
            )}

            {displayType === "text" && (
              <div className="space-y-4 p-4 bg-neutral-50 rounded-lg border">
                <p className="text-sm font-medium text-neutral-700">Text Style Options</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger data-testid="select-font-family">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Font Weight</Label>
                    <Select value={fontWeight} onValueChange={setFontWeight}>
                      <SelectTrigger data-testid="select-font-weight">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WEIGHT_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Font Style</Label>
                    <Select value={fontStyle} onValueChange={setFontStyle}>
                      <SelectTrigger data-testid="select-font-style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="italic">Italic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Letter Spacing</Label>
                    <Select value={letterSpacing} onValueChange={setLetterSpacing}>
                      <SelectTrigger data-testid="select-letter-spacing">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPACING_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded border cursor-pointer"
                      data-testid="input-text-color"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1"
                      placeholder="#4A5568"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border text-center">
                  <p className="text-xs text-neutral-400 mb-2">Preview</p>
                  <span
                    style={{
                      fontFamily,
                      fontWeight: fontWeight as any,
                      fontStyle,
                      color: textColor,
                      letterSpacing,
                      fontSize: "1.5rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {name || "Partner Name"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-submit-partner" disabled={isPending}>
                {isPending ? "Saving..." : editingPartner ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Partner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this partner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              data-testid="button-confirm-delete"
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
