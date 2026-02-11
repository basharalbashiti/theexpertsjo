import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { SiteContent } from "@shared/schema";

export default function ContentEditor() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editedContents, setEditedContents] = useState<Record<number, { valueEn: string; valueAr: string }>>({});

  const { data: contents = [], isLoading } = useQuery<SiteContent[]>({
    queryKey: ["/api/content"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updatedContents = contents.map((item) => {
        const edited = editedContents[item.id];
        if (edited) {
          return { ...item, valueEn: edited.valueEn, valueAr: edited.valueAr };
        }
        return item;
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

  const grouped = useMemo(() => {
    const groups: Record<string, SiteContent[]> = {};
    const filtered = contents.filter((c) =>
      c.key.toLowerCase().includes(search.toLowerCase()) ||
      c.valueEn.toLowerCase().includes(search.toLowerCase())
    );
    for (const item of filtered) {
      const prefix = item.key.split("_").slice(0, -1).join("_") || item.key;
      const groupKey = prefix.replace(/_$/, "");
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    }
    return groups;
  }, [contents, search]);

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
    return <p className="text-muted-foreground p-4">Loading content...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          data-testid="input-content-search"
          placeholder="Search by key or value..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          data-testid="button-save-content"
          onClick={() => saveMutation.mutate()}
          disabled={!hasChanges || saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {Object.entries(grouped).map(([groupName, items]) => (
        <div key={groupName} className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">
            {groupName}
          </h3>
          {items.map((item) => {
            const edited = editedContents[item.id];
            return (
              <div key={item.id} data-testid={`content-item-${item.id}`} className="grid gap-2 p-3 border rounded-lg bg-card">
                <Label className="text-xs font-mono text-muted-foreground">{item.key}</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">English</Label>
                    <Textarea
                      data-testid={`textarea-en-${item.id}`}
                      value={edited?.valueEn ?? item.valueEn}
                      onChange={(e) => handleChange(item.id, "valueEn", e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Arabic</Label>
                    <Textarea
                      data-testid={`textarea-ar-${item.id}`}
                      value={edited?.valueAr ?? item.valueAr}
                      onChange={(e) => handleChange(item.id, "valueAr", e.target.value)}
                      rows={2}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {Object.keys(grouped).length === 0 && (
        <p className="text-muted-foreground text-center py-8">No content items found.</p>
      )}
    </div>
  );
}
