"use client";

import { useState, useEffect, useCallback } from "react";
import { presenterApi } from "@/utils/inspire-api";
import { Presenter } from "@/types/inspire";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Search,
  Loader2,
  Plus,
  Edit,
  X,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { apiResponse } from "@/utils/apiResponse";

export default function AdminPresentersPage() {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState<"all" | "male" | "female">(
    "all"
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [presenterToDelete, setPresenterToDelete] = useState<Presenter | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPresenter, setEditingPresenter] = useState<Presenter | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    gender: "male" as "male" | "female",
    category: "popular" as "popular" | "new" | "custom",
    isPublic: true,
  });

  const fetchPresenters = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: { gender?: "male" | "female"; admin?: string } = {
        admin: "true",
      };
      if (filterGender !== "all") {
        params.gender = filterGender;
      }

      const response = await presenterApi.getAll(params);

      if (response.success && response.data) {
        const presentersArray = Array.isArray(response.data)
          ? response.data
          : [];
        setPresenters(presentersArray);
      } else {
        setPresenters([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch presenters:", error);
      toast.error("Failed to load presenters");
      setPresenters([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterGender]);

  useEffect(() => {
    fetchPresenters();
  }, [fetchPresenters]);

  const handleDeleteClick = (presenter: Presenter) => {
    setPresenterToDelete(presenter);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!presenterToDelete) return;

    setIsDeleting(true);
    try {
      const response = await presenterApi.delete(presenterToDelete._id);

      if (response.success) {
        toast.success("Presenter deleted successfully");
        setDeleteDialogOpen(false);
        setPresenterToDelete(null);
        setPresenters((prev) =>
          prev.filter((p) => p._id !== presenterToDelete._id)
        );
      } else {
        toast.error("Failed to delete presenter");
      }
    } catch (error: any) {
      console.error("Failed to delete presenter:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete presenter"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateClick = () => {
    setFormData({
      name: "",
      gender: "male",
      category: "popular",
      isPublic: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setCreateDialogOpen(true);
  };

  const handleEditClick = (presenter: Presenter) => {
    setEditingPresenter(presenter);
    setFormData({
      name: presenter.name,
      gender: presenter.gender,
      category: presenter.category,
      isPublic: presenter.isPublic,
    });
    setImageFile(null);
    setImagePreview(presenter.imageUrl || null);
    setEditDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (isEdit: boolean) => {
    if (!formData.name || !formData.gender) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isEdit && !imageFile) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && editingPresenter) {
        const response = await presenterApi.update(
          editingPresenter._id,
          {
            name: formData.name,
            category: formData.category,
            isPublic: formData.isPublic,
            image: imageFile || undefined,
          }
        );
        if (response.success) {
          toast.success("Presenter updated successfully");
          setEditDialogOpen(false);
          setEditingPresenter(null);
          setImageFile(null);
          setImagePreview(null);
          fetchPresenters();
        } else {
          toast.error("Failed to update presenter");
        }
      } else {
        if (!imageFile) {
          toast.error("Please upload an image");
          return;
        }
        const response = await presenterApi.create({
          name: formData.name,
          gender: formData.gender,
          category: formData.category,
          image: imageFile,
        });
        if (response.success) {
          toast.success("Presenter created successfully");
          setCreateDialogOpen(false);
          setImageFile(null);
          setImagePreview(null);
          fetchPresenters();
        } else {
          toast.error("Failed to create presenter");
        }
      }
    } catch (error: any) {
      console.error("Failed to save presenter:", error);
      toast.error(
        error.response?.data?.message || "Failed to save presenter"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPresenters = presenters.filter((presenter) => {
    const matchesSearch = presenter.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Avatar Management</h1>
          <p className="text-muted-foreground">
            Manage AI avatars/presenters for video generation
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Create Avatar
        </Button>
      </div>

      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search avatars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterGender}
          onValueChange={(v: "all" | "male" | "female") => setFilterGender(v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          {filteredPresenters.length} avatar
          {filteredPresenters.length !== 1 ? "s" : ""}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPresenters.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No avatars found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPresenters.map((presenter) => (
            <div
              key={presenter._id}
              className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative bg-muted">
                <img
                  src={presenter.imageUrl}
                  alt={presenter.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement?.classList.add(
                      "flex",
                      "items-center",
                      "justify-center"
                    );
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleEditClick(presenter)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(presenter)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">
                      {presenter.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {presenter.gender}
                      </Badge>
                      <Badge
                        variant={
                          presenter.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {presenter.status}
                      </Badge>
                      {presenter.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Usage: {presenter.usageCount || 0} times
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Avatar</DialogTitle>
            <DialogDescription>
              Add a new AI avatar/presenter for video generation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Sarah"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v: "male" | "female") =>
                    setFormData({ ...formData, gender: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v: "popular" | "new" | "custom") =>
                  setFormData({ ...formData, category: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Avatar Image *</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an avatar image (JPEG, PNG, WebP)
                  </p>
                </div>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
              <Label htmlFor="isPublic">Make Public</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setImageFile(null);
                setImagePreview(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Avatar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Avatar</DialogTitle>
            <DialogDescription>
              Update avatar information and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v: "popular" | "new" | "custom") =>
                  setFormData({ ...formData, category: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Avatar Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a new image to replace the current one (JPEG, PNG,
                    WebP)
                  </p>
                </div>
                {imagePreview && editingPresenter && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(editingPresenter.imageUrl || null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="edit-isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
              <Label htmlFor="edit-isPublic">Make Public</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingPresenter(null);
                setImageFile(null);
                setImagePreview(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(true)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Avatar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Avatar</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{presenterToDelete?.name}"? This
              action cannot be undone. The avatar will be marked as inactive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setPresenterToDelete(null);
              }}
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
                "Delete Avatar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

