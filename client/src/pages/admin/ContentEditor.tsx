import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { SiteContent } from "@shared/schema";

const sectionLabels: Record<string, string> = {
  hero: "Hero Banners",
  cat: "Category Names",
  stat: "Statistics",
  home: "Home Page",
  about: "About Page",
  chairman: "Chairman Section",
  our: "Section Titles",
  sustain: "Sustainability",
  ecovadis: "EcoVadis",
  partner: "Partners Page",
  footer: "Footer",
  contact: "Contact Page",
  rs: "Room Service Products",
  spa: "Spa Products",
  amenities: "Amenities Products",
  buffet: "Buffet Products",
  fb: "Food & Beverage Products",
  linens: "Linens Products",
  general: "General",
};

const keyToSection: Record<string, string> = {
  about: "hero",
  about_hero_desc: "hero",
  who_we_are: "about",
  about_desc: "about",
  founded_in: "about",
  home: "home",
  all_in_one: "home",
  hospitality_solution: "home",
  discover_more: "home",
  products: "home",
  our_products: "hero",
  explore_range: "hero",
  looking_specific: "our",
  sustainability: "hero",
  sustainability_hero_desc: "hero",
  sustainability_quote: "sustain",
  harmony: "sustain",
  contact: "hero",
  contact_us: "contact",
  contact_sales: "contact",
  get_in_touch: "hero",
  send_message: "contact",
  full_name: "contact",
  email_addr: "contact",
  subject: "contact",
  message: "contact",
  submit: "contact",
  dubai: "contact",
  riyadh: "contact",
  amman: "contact",
  partners: "partner",
  partners_clients: "hero",
  trusted_by: "hero",
  become_partner: "partner",
  categories: "cat",
  quick_links: "footer",
  rights_reserved: "footer",
  back_to_categories: "cat",
  download_sop: "about",
  employee_handbook: "about",
  mission_desc: "our",
  vision_desc: "our",
  cat_room_service: "hero",
  room_service_hero_desc: "hero",
  category_hero_desc: "hero",
};

function getSection(key: string): string {
  if (keyToSection[key]) return keyToSection[key];
  const parts = key.split("_");
  for (let i = parts.length; i >= 1; i--) {
    const prefix = parts.slice(0, i).join("_");
    if (sectionLabels[prefix]) return prefix;
  }
  const numericStripped = parts[0].replace(/\d+$/, "");
  if (numericStripped && sectionLabels[numericStripped]) return numericStripped;
  if (parts.length >= 2 && sectionLabels[parts[0]]) return parts[0];
  return "general";
}

export default function ContentEditor() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editedContents, setEditedContents] = useState<Record<number, { valueEn: string; valueAr: string }>>({});

  const { data: contents = [], isLoading } = useQuery<SiteContent[]>({
    queryKey: ["/api/content"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updatedContents = contents
        .filter((item) => editedContents[item.id])
        .map((item) => {
          const edited = editedContents[item.id];
          return { key: item.key, valueEn: edited.valueEn, valueAr: edited.valueAr };
        });
      await apiRequest("PUT", "/api/content", { contents: updatedContents });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setEditedContents({});
      toast({ title: "Saved", description: "Content updated successfully." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const sections = useMemo(() => {
    const groups: Record<string, SiteContent[]> = {};
    for (const item of contents) {
      const section = getSection(item.key);
      if (!groups[section]) groups[section] = [];
      groups[section].push(item);
    }
    return groups;
  }, [contents]);

  const sectionKeys = Object.keys(sections).sort((a, b) => {
    const order = Object.keys(sectionLabels);
    return order.indexOf(a) - order.indexOf(b);
  });

  const displayedItems = useMemo(() => {
    let items = activeSection ? (sections[activeSection] || []) : contents;
    if (search) {
      items = items.filter(
        (c) =>
          c.key.toLowerCase().includes(search.toLowerCase()) ||
          c.valueEn.toLowerCase().includes(search.toLowerCase())
      );
    }
    return items;
  }, [activeSection, sections, contents, search]);

  const handleChange = (id: number, field: "valueEn" | "valueAr", value: string) => {
    const existing = contents.find((c) => c.id === id);
    if (!existing) return;
    setEditedContents((prev) => ({
      ...prev,
      [id]: {
        valueEn: prev[id]?.valueEn ?? existing.valueEn,
        valueAr: prev[id]?.valueAr ?? existing.valueAr,
        [field]: value,
      },
    }));
  };

  const hasChanges = Object.keys(editedContents).length > 0;

  if (isLoading) {
    return <p className="text-neutral-500 p-4">Loading content...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Site Content</h2>
          <p className="text-neutral-500 text-sm">Edit text and translations for your website</p>
        </div>
        <Button
          data-testid="button-save-content"
          onClick={() => saveMutation.mutate()}
          disabled={!hasChanges || saveMutation.isPending}
          className={hasChanges ? "" : "opacity-50"}
        >
          {saveMutation.isPending ? "Saving..." : `Save Changes${hasChanges ? ` (${Object.keys(editedContents).length})` : ""}`}
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-xl border p-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-3 py-2">Sections</p>
            <button
              data-testid="section-all"
              onClick={() => setActiveSection(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === null ? "bg-primary/10 text-primary font-medium" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              All ({contents.length})
            </button>
            {sectionKeys.map((key) => (
              <button
                key={key}
                data-testid={`section-${key}`}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === key ? "bg-primary/10 text-primary font-medium" : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {sectionLabels[key] || key} ({sections[key].length})
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <Input
            data-testid="input-content-search"
            placeholder="Search by key or value..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />

          {displayedItems.map((item) => {
            const edited = editedContents[item.id];
            const isEdited = !!edited;
            return (
              <div
                key={item.id}
                data-testid={`content-item-${item.id}`}
                className={`rounded-xl border bg-white p-4 transition-colors ${isEdited ? "border-primary/30 bg-primary/5" : ""}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">{item.key}</span>
                  {isEdited && <span className="text-xs text-primary font-medium">Modified</span>}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-500">English</Label>
                    <Textarea
                      data-testid={`textarea-en-${item.id}`}
                      value={edited?.valueEn ?? item.valueEn}
                      onChange={(e) => handleChange(item.id, "valueEn", e.target.value)}
                      rows={2}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-500">Arabic</Label>
                    <Textarea
                      data-testid={`textarea-ar-${item.id}`}
                      value={edited?.valueAr ?? item.valueAr}
                      onChange={(e) => handleChange(item.id, "valueAr", e.target.value)}
                      rows={2}
                      dir="rtl"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {displayedItems.length === 0 && (
            <p className="text-neutral-500 text-center py-8">No content items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
