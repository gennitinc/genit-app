"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiResponse } from "@/utils/apiResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, Loader2, Image as ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Template {
  _id: string;
  assetId: string;
  mediaUrl: string;
  alt: string;
  category?: string;
  sourceSite: string;
  mediaType: string;
  tags: string[];
  scrapedAt: string;
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(
    new Set(),
  );
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const fetchTemplates = useCallback(
    async (pageToFetch: number, append: boolean = false) => {
      if (append) {
        setIsFetchingMore(true);
      } else {
        setIsLoading(true);
      }
      try {
        const params = new URLSearchParams();
        params.set("page", String(pageToFetch));
        params.set("limit", "50");
        if (searchTerm.trim()) {
          params.set("search", searchTerm.trim());
        }

        const res = await apiResponse.get(
          `/designinspirations?${params.toString()}`,
          {
            withCredentials: true,
          },
        );

        const data = res.data;

        if (data.success && data.data?.templates) {
          const newTemplates = data.data.templates;
          if (append) {
            setTemplates((prev) => [...prev, ...newTemplates]);
          } else {
            setTemplates(newTemplates);
          }
          setTotalPages(data.data.pagination?.totalPages || 1);
          setHasNextPage(Boolean(data.data.pagination?.hasNextPage));
        } else {
          if (!append) setTemplates([]);
          setHasNextPage(false);
        }
      } catch (error: any) {
        console.error("Failed to fetch templates:", error);
        toast.error("Failed to load templates");
        if (!append) setTemplates([]);
        setHasNextPage(false);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [searchTerm],
  );

  useEffect(() => {
    setPage(1);
    fetchTemplates(1, false);
    // Clear selection when templates change (page/search)
    setSelectedTemplates(new Set());
  }, [searchTerm, fetchTemplates]);

  useEffect(() => {
    if (page > 1) {
      fetchTemplates(page, true);
    }
  }, [page, fetchTemplates]);

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const el = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          hasNextPage &&
          !isFetchingMore &&
          !isLoading
        ) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [hasNextPage, isFetchingMore, isLoading]);

  const handleDeleteClick = (template: Template) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    setIsDeleting(true);
    try {
      const res = await apiResponse.delete(
        `/designinspirations/${templateToDelete._id}`,
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success("Template deleted successfully");
        setDeleteDialogOpen(false);
        setTemplateToDelete(null);
        // Remove from UI without reloading
        setTemplates((prev) =>
          prev.filter((t) => t._id !== templateToDelete._id),
        );
        // Remove from selection if it was selected
        setSelectedTemplates((prev) => {
          const newSet = new Set(prev);
          newSet.delete(templateToDelete._id);
          return newSet;
        });
      } else {
        toast.error("Failed to delete template");
      }
    } catch (error: any) {
      console.error("Failed to delete template:", error);
      toast.error(error.response?.data?.message || "Failed to delete template");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedTemplates.size === 0) return;

    setIsBulkDeleting(true);
    try {
      const ids = Array.from(selectedTemplates);
      const res = await apiResponse.delete("/designinspirations", {
        data: { ids },
        withCredentials: true,
      });

      if (res.data.success) {
        const deletedCount = res.data.data?.deletedCount || ids.length;
        toast.success(`${deletedCount} template(s) deleted successfully`);
        setBulkDeleteDialogOpen(false);
        // Remove deleted items from UI without reloading
        setTemplates((prev) =>
          prev.filter((t) => !selectedTemplates.has(t._id)),
        );
        setSelectedTemplates(new Set());
      } else {
        toast.error("Failed to delete templates");
      }
    } catch (error: any) {
      console.error("Failed to delete templates:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete templates",
      );
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleSelectTemplate = (templateId: string, checked: boolean) => {
    setSelectedTemplates((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(templateId);
      } else {
        newSet.delete(templateId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTemplates(new Set(templates.map((t) => t._id)));
    } else {
      setSelectedTemplates(new Set());
    }
  };

  const selectAllCheckboxRef = useRef<HTMLButtonElement>(null);

  const isAllSelected =
    templates.length > 0 &&
    templates.every((t) => selectedTemplates.has(t._id));
  const isSomeSelected =
    selectedTemplates.size > 0 && selectedTemplates.size < templates.length;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const input = selectAllCheckboxRef.current.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;
      if (input) {
        input.indeterminate = isSomeSelected;
      }
    }
  }, [isSomeSelected]);

  const formatCategory = (category?: string) => {
    if (!category) return "other";
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Design Inspirations Management
        </h1>
        <p className="text-muted-foreground">
          Manage all design Inspiration in the platform
        </p>
      </div>

      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {templates.length} template{templates.length !== 1 ? "s" : ""}
        </div>
        {selectedTemplates.size > 0 && (
          <Button
            variant="destructive"
            onClick={() => setBulkDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete {selectedTemplates.size} selected
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No templates found
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <Checkbox
              ref={selectAllCheckboxRef}
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              {selectedTemplates.size > 0
                ? `${selectedTemplates.size} selected`
                : "Select all"}
            </span>
          </div>
          <div className="columns-2 md:columns-4 gap-4 [column-fill:balance] space-y-4">
            {templates.map((template) => (
              <div
                key={template._id}
                className={`group relative mb-4 inline-block w-full align-top break-inside-avoid border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow ${
                  selectedTemplates.has(template._id)
                    ? "border-primary ring-2 ring-primary"
                    : "border-border"
                }`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedTemplates.has(template._id)}
                    onCheckedChange={(checked) =>
                      handleSelectTemplate(template._id, checked as boolean)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="bg-background/80 backdrop-blur-sm"
                  />
                </div>
                <div className="relative bg-muted">
                  <img
                    src={template.mediaUrl}
                    alt={template.alt}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement?.classList.add(
                        "flex",
                        "items-center",
                        "justify-center",
                        "h-40", // Add fixed height for broken images
                      );
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(template)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium line-clamp-2 flex-1">
                      {template.alt || "Untitled Template"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.category && (
                      <Badge variant="secondary" className="text-xs">
                        {formatCategory(template.category)}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {template.sourceSite}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.mediaType}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(template.scrapedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sentinel for infinite scroll */}
          <div
            ref={loadMoreRef}
            className="h-20 flex items-center justify-center"
          >
            {isFetchingMore && (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            )}
            {!hasNextPage && templates.length > 0 && (
              <p className="text-sm text-muted-foreground">
                No more templates to load
              </p>
            )}
          </div>
        </>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setTemplateToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Templates</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTemplates.size} template
              {selectedTemplates.size !== 1 ? "s" : ""}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
              disabled={isBulkDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDeleteConfirm}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
