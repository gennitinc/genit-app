"use client";

import { LocalizedText } from "@/components/localized-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { Image as ImageIcon, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";

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
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(
    new Set()
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
          }
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
    [searchTerm]
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
      { rootMargin: "200px" }
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
        }
      );

      if (res.data.success) {
        toast.success("Template deleted successfully");
        setDeleteDialogOpen(false);
        setTemplateToDelete(null);
        // Remove from UI without reloading
        setTemplates((prev) =>
          prev.filter((t) => t._id !== templateToDelete._id)
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
          prev.filter((t) => !selectedTemplates.has(t._id))
        );
        setSelectedTemplates(new Set());
      } else {
        toast.error("Failed to delete templates");
      }
    } catch (error: any) {
      console.error("Failed to delete templates:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete templates"
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
        'input[type="checkbox"]'
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
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='mb-2 text-3xl font-bold'>
          <LocalizedText text={"Design Inspirations Management"} />
        </h1>
        <p className='text-muted-foreground'>
          <LocalizedText
            text={"Manage all design Inspiration in the platform"}
          />
        </p>
      </div>

      <div className='mb-6 flex flex-wrap items-center gap-4'>
        <div className='relative max-w-md flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Search templates...'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className='pl-10'
          />
        </div>
        <div className='text-muted-foreground text-sm'>
          {templates.length} <LocalizedText text={"template"} />
          {templates.length !== 1 ? "s" : ""}
        </div>
        {selectedTemplates.size > 0 && (
          <Button
            variant='destructive'
            onClick={() => setBulkDeleteDialogOpen(true)}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            <LocalizedText text={"Delete"} />
            {selectedTemplates.size} <LocalizedText text={"selected"} />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <LoadingFileLoader size={16} />
        </div>
      ) : templates.length === 0 ? (
        <div className='text-muted-foreground py-12 text-center'>
          <LocalizedText text={"No templates found"} />
        </div>
      ) : (
        <>
          <div className='mb-4 flex items-center gap-2'>
            <Checkbox
              ref={selectAllCheckboxRef}
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <span className='text-muted-foreground text-sm'>
              {selectedTemplates.size > 0
                ? `${selectedTemplates.size} selected`
                : "Select all"}
            </span>
          </div>
          <div className='columns-2 gap-4 space-y-4 [column-fill:balance] md:columns-4'>
            {templates.map((template) => (
              <div
                key={template._id}
                className={`group bg-card relative mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-lg border align-top transition-shadow hover:shadow-lg ${
                  selectedTemplates.has(template._id)
                    ? "border-primary ring-primary ring-2"
                    : "border-border"
                }`}
              >
                <div className='absolute top-2 left-2 z-10'>
                  <Checkbox
                    checked={selectedTemplates.has(template._id)}
                    onCheckedChange={(checked) =>
                      handleSelectTemplate(template._id, checked as boolean)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className='bg-background/80 backdrop-blur-sm'
                  />
                </div>
                <div className='bg-muted relative'>
                  <img
                    src={template.mediaUrl}
                    alt={template.alt}
                    className='h-auto w-full object-cover'
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement?.classList.add(
                        "flex",
                        "items-center",
                        "justify-center",
                        "h-40" // Add fixed height for broken images
                      );
                    }}
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors group-hover:bg-black/30 group-hover:opacity-100'>
                    <Button
                      variant='destructive'
                      size='icon'
                      onClick={() => handleDeleteClick(template)}
                      className='opacity-0 transition-opacity group-hover:opacity-100'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
                <div className='space-y-2 p-3'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='line-clamp-2 flex-1 text-sm font-medium'>
                      {template.alt || "Untitled Template"}
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {template.category && (
                      <Badge variant='secondary' className='text-xs'>
                        {formatCategory(template.category)}
                      </Badge>
                    )}
                    <Badge variant='outline' className='text-xs'>
                      {template.sourceSite}
                    </Badge>
                    <Badge variant='outline' className='text-xs'>
                      {template.mediaType}
                    </Badge>
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    {new Date(template.scrapedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sentinel for infinite scroll */}
          <div
            ref={loadMoreRef}
            className='flex h-20 items-center justify-center'
          >
            {isFetchingMore && <LoadingFileLoader size={16} />}
            {!hasNextPage && templates.length > 0 && (
              <p className='text-muted-foreground text-sm'>
                <LocalizedText text={"No more templates to load"} />
              </p>
            )}
          </div>
        </>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <LocalizedText text={"Delete Template"} />
            </DialogTitle>
            <DialogDescription>
              <LocalizedText
                text={
                  "Are you sure you want to delete this template? This action cannot be undone."
                }
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setDeleteDialogOpen(false);
                setTemplateToDelete(null);
              }}
              disabled={isDeleting}
            >
              <LocalizedText text={"Cancel"} />
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoadingFileLoader size={16} />
                  <LocalizedText text={"Deleting..."} />
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
            <DialogTitle>
              <LocalizedText text={"Delete Templates"} />
            </DialogTitle>
            <DialogDescription>
              <LocalizedText text={"Are you sure you want to delete"} />
              {selectedTemplates.size} <LocalizedText text={"template"} />
              {selectedTemplates.size !== 1 ? "s" : ""}
              <LocalizedText text={"? This action cannot be undone."} />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setBulkDeleteDialogOpen(false)}
              disabled={isBulkDeleting}
            >
              <LocalizedText text={"Cancel"} />
            </Button>
            <Button
              variant='destructive'
              onClick={handleBulkDeleteConfirm}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? (
                <>
                  <LoadingFileLoader size={16} />
                  <LocalizedText text={"Deleting..."} />
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
