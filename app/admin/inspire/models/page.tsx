"use client";

import { useState, useEffect, useCallback } from "react";
import { modelApi } from "@/utils/inspire-api";
import { Model } from "@/types/inspire";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Search,
  Loader2,
  Image as ImageIcon,
  Video,
  Plus,
  Edit,
  X,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "image" | "video" | "audio" | "text"
  >("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "image" as "image" | "video" | "audio" | "text",
    provider: "",
    modelId: "",
    description: "",
    isDefault: false,
    isPremium: false,
    status: "active" as "active" | "inactive" | "beta",
    allowCustomAudio: false,
    capabilities: {
      supportsAspectRatio: false,
      supportsStyle: false,
      maxResolution: "",
      supportedAspectRatios: [] as string[],
    },
  });

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: { type?: "image" | "video" | "audio" | "text" } = {};
      if (filterType !== "all") {
        params.type = filterType;
      }

      const response = await modelApi.getAll(params);

      if (response.success && response.data) {
        const modelsArray = Array.isArray(response.data) ? response.data : [];
        setModels(modelsArray);
      } else {
        setModels([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch models:", error);
      toast.error("Failed to load models");
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleDeleteClick = (model: Model) => {
    setModelToDelete(model);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!modelToDelete) return;

    setIsDeleting(true);
    try {
      const response = await modelApi.delete(modelToDelete._id);

      if (response.success) {
        toast.success("Model deleted successfully");
        setDeleteDialogOpen(false);
        setModelToDelete(null);
        setModels((prev) => prev.filter((m) => m._id !== modelToDelete._id));
      } else {
        toast.error("Failed to delete model");
      }
    } catch (error: any) {
      console.error("Failed to delete model:", error);
      toast.error(error.response?.data?.message || "Failed to delete model");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateClick = () => {
    setFormData({
      name: "",
      type: "image",
      provider: "",
      modelId: "",
      description: "",
      isDefault: false,
      isPremium: false,
      status: "active",
      allowCustomAudio: false,
      capabilities: {
        supportsAspectRatio: false,
        supportsStyle: false,
        maxResolution: "",
        supportedAspectRatios: [],
      },
    });
    setIconFile(null);
    setIconPreview(null);
    setCreateDialogOpen(true);
  };

  const handleEditClick = (model: Model) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      type: model.type,
      provider: model.provider,
      modelId: model.modelId,
      description: model.description || "",
      isDefault: model.isDefault,
      isPremium: model.isPremium,
      status: model.status,
      allowCustomAudio: model.allowCustomAudio || false,
      capabilities: {
        supportsAspectRatio: model.capabilities?.supportsAspectRatio || false,
        supportsStyle: model.capabilities?.supportsStyle || false,
        maxResolution: model.capabilities?.maxResolution || "",
        supportedAspectRatios: model.capabilities?.supportedAspectRatios || [],
      },
    });
    setIconFile(null);
    setIconPreview(model.icon || null);
    setEditDialogOpen(true);
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (isEdit: boolean) => {
    if (!formData.name || !formData.provider || !formData.modelId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && editingModel) {
        const response = await modelApi.update(
          editingModel._id,
          formData,
          iconFile || undefined
        );
        if (response.success) {
          toast.success("Model updated successfully");
          setEditDialogOpen(false);
          setEditingModel(null);
          setIconFile(null);
          setIconPreview(null);
          fetchModels();
        } else {
          toast.error("Failed to update model");
        }
      } else {
        const response = await modelApi.create(formData, iconFile || undefined);
        if (response.success) {
          toast.success("Model created successfully");
          setCreateDialogOpen(false);
          setIconFile(null);
          setIconPreview(null);
          fetchModels();
        } else {
          toast.error("Failed to create model");
        }
      }
    } catch (error: any) {
      console.error("Failed to save model:", error);
      toast.error(error.response?.data?.message || "Failed to save model");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.modelId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Model Management</h1>
          <p className="text-muted-foreground">
            Manage AI models for image and video generation
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Create Model
        </Button>
      </div>

      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Image Models</SelectItem>
            <SelectItem value="video">Video Models</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No models found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => (
            <div
              key={model._id}
              className="group relative border rounded-lg p-4 bg-card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {model.type === "image" ? (
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Video className="w-5 h-5 text-purple-500" />
                  )}
                  <h3 className="font-semibold">{model.name}</h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(model)}
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(model)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{model.provider}</Badge>
                  <Badge
                    variant={
                      model.status === "active" ? "default" : "secondary"
                    }
                  >
                    {model.status}
                  </Badge>
                  {model.isDefault && (
                    <Badge variant="default" className="bg-green-500">
                      Default
                    </Badge>
                  )}
                  {model.isPremium && (
                    <Badge variant="default" className="bg-yellow-500">
                      Premium
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  ID: {model.modelId}
                </p>

                {model.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {model.description}
                  </p>
                )}

                <div className="text-xs text-muted-foreground">
                  Usage: {model.usageCount || 0} times
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
            <DialogTitle>Create New Model</DialogTitle>
            <DialogDescription>
              Add a new AI model for image or video generation
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
                  placeholder="e.g., DALL-E 3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: "image" | "video" | "audio" | "text") =>
                    setFormData({ ...formData, type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Input
                  id="provider"
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  placeholder="e.g., openai, stability"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelId">Model ID *</Label>
                <Input
                  id="modelId"
                  value={formData.modelId}
                  onChange={(e) =>
                    setFormData({ ...formData, modelId: e.target.value })
                  }
                  placeholder="e.g., dall-e-3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Model description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Model Icon/Logo</Label>
              <div className="flex items-center gap-4">
                {iconPreview && (
                  <div className="relative w-16 h-16 border rounded-lg overflow-hidden">
                    {iconPreview.startsWith("data:image") ||
                    iconPreview.startsWith("http") ? (
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: iconPreview }}
                      />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="icon"
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleIconChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an icon/logo for this model (SVG, PNG, JPG, WebP)
                  </p>
                </div>
                {iconPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIconFile(null);
                      setIconPreview(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: "active" | "inactive" | "beta") =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxResolution">Max Resolution</Label>
                <Input
                  id="maxResolution"
                  value={formData.capabilities.maxResolution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        maxResolution: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., 1024x1024"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDefault: checked })
                  }
                />
                <Label htmlFor="isDefault">Set as Default</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isPremium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPremium: checked })
                  }
                />
                <Label htmlFor="isPremium">Premium Model</Label>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="supportsAspectRatio"
                  checked={formData.capabilities.supportsAspectRatio}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        supportsAspectRatio: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="supportsAspectRatio">
                  Supports Aspect Ratio
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="supportsStyle"
                  checked={formData.capabilities.supportsStyle}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        supportsStyle: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="supportsStyle">Supports Style</Label>
              </div>
            </div>

            {formData.type === "video" && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="allowCustomAudio"
                    checked={formData.allowCustomAudio}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowCustomAudio: checked })
                    }
                  />
                  <Label htmlFor="allowCustomAudio">Allow Custom Audio</Label>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
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
                "Create Model"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Model</DialogTitle>
            <DialogDescription>
              Update model information and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="edit-type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: "image" | "video") =>
                    setFormData({ ...formData, type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-provider">Provider *</Label>
                <Input
                  id="edit-provider"
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-modelId">Model ID *</Label>
                <Input
                  id="edit-modelId"
                  value={formData.modelId}
                  onChange={(e) =>
                    setFormData({ ...formData, modelId: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-icon">Model Icon/Logo</Label>
              <div className="flex items-center gap-4">
                {iconPreview && (
                  <div className="relative w-16 h-16 border rounded-lg overflow-hidden">
                    {iconPreview.startsWith("data:image") ||
                    iconPreview.startsWith("http") ? (
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: iconPreview }}
                      />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="edit-icon"
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleIconChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an icon/logo for this model (SVG, PNG, JPG, WebP)
                  </p>
                </div>
                {iconPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIconFile(null);
                      setIconPreview(editingModel?.icon || null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: "active" | "inactive" | "beta") =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-maxResolution">Max Resolution</Label>
                <Input
                  id="edit-maxResolution"
                  value={formData.capabilities.maxResolution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        maxResolution: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., 1024x1024"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDefault: checked })
                  }
                />
                <Label htmlFor="edit-isDefault">Set as Default</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="edit-isPremium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPremium: checked })
                  }
                />
                <Label htmlFor="edit-isPremium">Premium Model</Label>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-supportsAspectRatio"
                  checked={formData.capabilities.supportsAspectRatio}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        supportsAspectRatio: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="edit-supportsAspectRatio">
                  Supports Aspect Ratio
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="edit-supportsStyle"
                  checked={formData.capabilities.supportsStyle}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        supportsStyle: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="edit-supportsStyle">Supports Style</Label>
              </div>
            </div>

            {formData.type === "video" && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-allowCustomAudio"
                    checked={formData.allowCustomAudio}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowCustomAudio: checked })
                    }
                  />
                  <Label htmlFor="edit-allowCustomAudio">
                    Allow Custom Audio
                  </Label>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingModel(null);
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
                "Update Model"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Model</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{modelToDelete?.name}"? This
              action cannot be undone. The model will be marked as inactive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setModelToDelete(null);
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
                "Delete Model"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
