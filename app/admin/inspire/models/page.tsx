"use client";

import { LocalizedText } from "@/components/localized-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Model, ModelType } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { modelApi } from "@/utils/inspire-api";
import {
  CircleFadingArrowUp,
  Edit,
  FileText,
  Image as ImageIcon,
  Loader2,
  Music,
  Plus,
  Search,
  Share2,
  Sparkles,
  Trash2,
  Type as TypeIcon,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

export default function AdminModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ModelType | "all">("all");
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
    type: "general" as ModelType,
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
      supportsVideoReference: false,
      supportsSubjectReference: false,
      maxResolution: "",
      supportedAspectRatios: [] as string[],
    },
  });

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: { type?: ModelType } = {};
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
      type: "general",
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
        supportsVideoReference: false,
        supportsSubjectReference: false,
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
        supportsVideoReference:
          model.capabilities?.supportsVideoReference || false,
        supportsSubjectReference:
          model.capabilities?.supportsSubjectReference || false,
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
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='mb-2 text-3xl font-bold'>
            <LocalizedText text={"Model Management"} />
          </h1>
          <p className='text-muted-foreground'>
            <LocalizedText
              text={"Manage AI models for image and video generation"}
            />
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className='mr-2 h-4 w-4' />
          <LocalizedText text={"Create Model"} />
        </Button>
      </div>

      <div className='mb-6 flex flex-wrap items-center gap-4'>
        <div className='relative max-w-md flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Search models...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>
              <LocalizedText text={"All Types"} />
            </SelectItem>
            <SelectItem value='general'>
              <LocalizedText text={"General (Agent) Models"} />
            </SelectItem>
            <SelectItem value='image'>
              <LocalizedText text={"Image Models"} />
            </SelectItem>
            <SelectItem value='video'>
              <LocalizedText text={"Video Models"} />
            </SelectItem>
            <SelectItem value='audio'>
              <LocalizedText text={"Audio Models"} />
            </SelectItem>
            <SelectItem value='text'>
              <LocalizedText text={"Text Models"} />
            </SelectItem>
            <SelectItem value='social'>
              <LocalizedText text={"Social Models"} />
            </SelectItem>
            <SelectItem value='docs'>
              <LocalizedText text={"Docs Models"} />
            </SelectItem>
          </SelectContent>
        </Select>
        <div className='text-muted-foreground text-sm'>
          {filteredModels.length} <LocalizedText text={"model"} />
          {filteredModels.length !== 1 ? "s" : ""}
        </div>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <LoadingFileLoader size={20} />
        </div>
      ) : filteredModels.length === 0 ? (
        <div className='text-muted-foreground py-12 text-center'>
          {/* No models found */}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredModels.map((model) => (
            <div
              key={model._id}
              className='group bg-card relative rounded-lg border p-4 transition-shadow hover:shadow-lg'
            >
              <div className='mb-3 flex items-start justify-between'>
                <div className='flex items-center gap-2'>
                  {model.type === "general" && (
                    <Sparkles className='h-5 w-5 text-indigo-500' />
                  )}
                  {model.type === "image" && (
                    <ImageIcon className='h-5 w-5 text-blue-500' />
                  )}
                  {model.type === "video" && (
                    <Video className='h-5 w-5 text-purple-500' />
                  )}
                  {model.type === "audio" && (
                    <Music className='h-5 w-5 text-green-500' />
                  )}
                  {model.type === "text" && (
                    <TypeIcon className='h-5 w-5 text-orange-500' />
                  )}
                  {model.type === "social" && (
                    <Share2 className='h-5 w-5 text-pink-500' />
                  )}
                  {model.type === "docs" && (
                    <FileText className='h-5 w-5 text-gray-500' />
                  )}
                  <h3 className='font-semibold'>{model.name}</h3>
                </div>
                <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleEditClick(model)}
                    className='h-8 w-8'
                  >
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDeleteClick(model)}
                    className='text-destructive h-8 w-8'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='outline'>{model.provider}</Badge>
                  <Badge
                    variant={
                      model.status === "active" ? "default" : "secondary"
                    }
                  >
                    {model.status}
                  </Badge>
                  {model.isDefault && (
                    <Badge variant='default' className='bg-green-500'>
                      <LocalizedText text={"Default"} />
                    </Badge>
                  )}
                  {model.isPremium && (
                    <Badge variant='default' className='bg-yellow-500'>
                      <LocalizedText text={"Premium"} />
                    </Badge>
                  )}
                </div>

                <p className='text-muted-foreground text-sm'>
                  <LocalizedText text={"ID:"} />
                  {model.modelId}
                </p>

                {model.description && (
                  <p className='text-muted-foreground line-clamp-2 text-sm'>
                    {model.description}
                  </p>
                )}

                <div className='text-muted-foreground text-xs'>
                  <LocalizedText text={"Usage:"} />
                  {model.usageCount || 0} <LocalizedText text={"times"} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              <LocalizedText text={"Create New Model"} />
            </DialogTitle>
            <DialogDescription>
              <LocalizedText
                text={"Add a new AI model for image or video generation"}
              />
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>
                  <LocalizedText text={"Name *"} />
                </Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='e.g., DALL-E 3'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='type'>
                  <LocalizedText text={"Type *"} />
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: ModelType) =>
                    setFormData({ ...formData, type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='general'>
                      <LocalizedText text={"General (Agent)"} />
                    </SelectItem>
                    <SelectItem value='image'>
                      <LocalizedText text={"Image"} />
                    </SelectItem>
                    <SelectItem value='video'>
                      <LocalizedText text={"Video"} />
                    </SelectItem>
                    <SelectItem value='audio'>
                      <LocalizedText text={"Audio"} />
                    </SelectItem>
                    <SelectItem value='text'>
                      <LocalizedText text={"Text"} />
                    </SelectItem>
                    <SelectItem value='social'>
                      <LocalizedText text={"Social"} />
                    </SelectItem>
                    <SelectItem value='docs'>
                      <LocalizedText text={"Documentation"} />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='provider'>
                  <LocalizedText text={"Provider *"} />
                </Label>
                <Input
                  id='provider'
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  placeholder='e.g., openai, stability'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='modelId'>
                  <LocalizedText text={"Model ID *"} />
                </Label>
                <Input
                  id='modelId'
                  value={formData.modelId}
                  onChange={(e) =>
                    setFormData({ ...formData, modelId: e.target.value })
                  }
                  placeholder='e.g., dall-e-3'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>
                <LocalizedText text={"Description"} />
              </Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Model description...'
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='icon'>
                <LocalizedText text={"Model Icon/Logo"} />
              </Label>
              <div className='flex items-center gap-4'>
                {iconPreview && (
                  <div className='relative h-16 w-16 overflow-hidden rounded-lg border'>
                    {iconPreview.startsWith("data:image") ||
                    iconPreview.startsWith("http") ? (
                      <img
                        src={iconPreview}
                        alt='Icon preview'
                        className='h-full w-full object-contain'
                      />
                    ) : (
                      <div
                        className='h-full w-full'
                        dangerouslySetInnerHTML={{ __html: iconPreview }}
                      />
                    )}
                  </div>
                )}
                <div className='flex-1'>
                  <Input
                    id='icon'
                    type='file'
                    accept='image/*,.svg'
                    onChange={handleIconChange}
                    className='cursor-pointer'
                  />
                  <p className='text-muted-foreground mt-1 text-xs'>
                    <LocalizedText
                      text={
                        "Upload an icon/logo for this model (SVG, PNG, JPG, WebP)"
                      }
                    />
                  </p>
                </div>
                {iconPreview && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setIconFile(null);
                      setIconPreview(null);
                    }}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='status'>
                  <LocalizedText text={"Status"} />
                </Label>
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
                    <SelectItem value='active'>
                      <LocalizedText text={"Active"} />
                    </SelectItem>
                    <SelectItem value='inactive'>
                      <LocalizedText text={"Inactive"} />
                    </SelectItem>
                    <SelectItem value='beta'>
                      <LocalizedText text={"Beta"} />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='maxResolution'>
                  <LocalizedText text={"Max Resolution"} />
                </Label>
                <Input
                  id='maxResolution'
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
                  placeholder='e.g., 1024x1024'
                />
              </div>
            </div>

            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <Switch
                  id='isDefault'
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDefault: checked })
                  }
                />
                <Label htmlFor='isDefault'>
                  <LocalizedText text={"Set as Default"} />
                </Label>
              </div>

              <div className='flex items-center gap-2'>
                <Switch
                  id='isPremium'
                  checked={formData.isPremium}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPremium: checked })
                  }
                />
                <Label htmlFor='isPremium'>
                  <LocalizedText text={"Premium Model"} />
                </Label>
              </div>
            </div>

            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <Switch
                  id='supportsAspectRatio'
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
                <Label htmlFor='supportsAspectRatio'>
                  <LocalizedText text={"Supports Aspect Ratio"} />
                </Label>
              </div>

              <div className='flex items-center gap-2'>
                <Switch
                  id='supportsStyle'
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
                <Label htmlFor='supportsStyle'>
                  <LocalizedText text={"Supports Style"} />
                </Label>
              </div>
            </div>

            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <Switch
                  id='supportsVideoReference'
                  checked={formData.capabilities.supportsVideoReference}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        supportsVideoReference: checked,
                      },
                    })
                  }
                />
                <Label htmlFor='supportsVideoReference'>
                  <LocalizedText text={"Supports Video Ref"} />
                </Label>
              </div>

              <div className='flex items-center gap-2'>
                <Switch
                  id='supportsSubjectReference'
                  checked={formData.capabilities.supportsSubjectReference}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        supportsSubjectReference: checked,
                      },
                    })
                  }
                />
                <Label htmlFor='supportsSubjectReference'>
                  <LocalizedText text={"Supports Subject Ref"} />
                </Label>
              </div>
            </div>

            {formData.type === "video" && (
              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-2'>
                  <Switch
                    id='allowCustomAudio'
                    checked={formData.allowCustomAudio}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowCustomAudio: checked })
                    }
                  />
                  <Label htmlFor='allowCustomAudio'>
                    <LocalizedText text={"Allow Custom Audio"} />
                  </Label>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setCreateDialogOpen(false)}
            >
              <LocalizedText text={"Cancel"} />
            </Button>
            <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingFileLoader size={20} />
                  <LocalizedText text={"Creating..."} />
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
        <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              <LocalizedText text={"Edit Model"} />
            </DialogTitle>
            <DialogDescription>
              <LocalizedText text={"Update model information and settings"} />
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-name'>
                  <LocalizedText text={"Name *"} />
                </Label>
                <Input
                  id='edit-name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='edit-type'>
                  <LocalizedText text={"Type *"} />
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: ModelType) =>
                    setFormData({ ...formData, type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='general'>
                      <LocalizedText text={"General (Agent)"} />
                    </SelectItem>
                    <SelectItem value='image'>
                      <LocalizedText text={"Image"} />
                    </SelectItem>
                    <SelectItem value='video'>
                      <LocalizedText text={"Video"} />
                    </SelectItem>
                    <SelectItem value='audio'>
                      <LocalizedText text={"Audio"} />
                    </SelectItem>
                    <SelectItem value='text'>
                      <LocalizedText text={"Text"} />
                    </SelectItem>
                    <SelectItem value='social'>
                      <LocalizedText text={"Social"} />
                    </SelectItem>
                    <SelectItem value='docs'>
                      <LocalizedText text={"Documentation"} />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-provider'>
                  <LocalizedText text={"Provider *"} />
                </Label>
                <Input
                  id='edit-provider'
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='edit-modelId'>
                  <LocalizedText text={"Model ID *"} />
                </Label>
                <Input
                  id='edit-modelId'
                  value={formData.modelId}
                  onChange={(e) =>
                    setFormData({ ...formData, modelId: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='edit-description'>
                <LocalizedText text={"Description"} />
              </Label>
              <Textarea
                id='edit-description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='edit-icon'>
                <LocalizedText text={"Model Icon/Logo"} />
              </Label>
              <div className='flex items-center gap-4'>
                {iconPreview && (
                  <div className='relative h-16 w-16 overflow-hidden rounded-lg border'>
                    {iconPreview.startsWith("data:image") ||
                    iconPreview.startsWith("http") ? (
                      <img
                        src={iconPreview}
                        alt='Icon preview'
                        className='h-full w-full object-contain'
                      />
                    ) : (
                      <div
                        className='h-full w-full'
                        dangerouslySetInnerHTML={{ __html: iconPreview }}
                      />
                    )}
                  </div>
                )}
                <div className='flex-1'>
                  <Input
                    id='edit-icon'
                    type='file'
                    accept='image/*,.svg'
                    onChange={handleIconChange}
                    className='cursor-pointer'
                  />
                  <p className='text-muted-foreground mt-1 text-xs'>
                    <LocalizedText
                      text={
                        "Upload an icon/logo for this model (SVG, PNG, JPG, WebP)"
                      }
                    />
                  </p>
                </div>
                {iconPreview && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setIconFile(null);
                      setIconPreview(editingModel?.icon || null);
                    }}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-status'>
                  <LocalizedText text={"Status"} />
                </Label>
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
                    <SelectItem value='active'>
                      <LocalizedText text={"Active"} />
                    </SelectItem>
                    <SelectItem value='inactive'>
                      <LocalizedText text={"Inactive"} />
                    </SelectItem>
                    <SelectItem value='beta'>
                      <LocalizedText text={"Beta"} />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='edit-maxResolution'>
                  <LocalizedText text={"Max Resolution"} />
                </Label>
                <Input
                  id='edit-maxResolution'
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
                  placeholder='e.g., 1024x1024'
                />
              </div>
            </div>

            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <Switch
                  id='edit-isDefault'
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDefault: checked })
                  }
                />
                <Label htmlFor='edit-isDefault'>
                  <LocalizedText text={"Set as Default"} />
                </Label>
              </div>

              <div className='flex items-center gap-2'>
                <Switch
                  id='edit-isPremium'
                  checked={formData.isPremium}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPremium: checked })
                  }
                />
                <Label htmlFor='edit-isPremium'>
                  <LocalizedText text={"Premium Model"} />
                </Label>
              </div>
            </div>

            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <Switch
                  id='edit-supportsAspectRatio'
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
                <Label htmlFor='edit-supportsAspectRatio'>
                  <LocalizedText text={"Supports Aspect Ratio"} />
                </Label>
              </div>

              <div className='flex items-center gap-2'>
                <Switch
                  id='edit-supportsStyle'
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
                <Label htmlFor='edit-supportsStyle'>
                  <LocalizedText text={"Supports Style"} />
                </Label>
              </div>
            </div>

            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <Switch
                  id='edit-supportsVideoReference'
                  checked={formData.capabilities.supportsVideoReference}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        supportsVideoReference: checked,
                      },
                    })
                  }
                />
                <Label htmlFor='edit-supportsVideoReference'>
                  <LocalizedText text={"Supports Video Ref"} />
                </Label>
              </div>

              <div className='flex items-center gap-2'>
                <Switch
                  id='edit-supportsSubjectReference'
                  checked={formData.capabilities.supportsSubjectReference}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        supportsSubjectReference: checked,
                      },
                    })
                  }
                />
                <Label htmlFor='edit-supportsSubjectReference'>
                  <LocalizedText text={"Supports Subject Ref"} />
                </Label>
              </div>
            </div>

            {formData.type === "video" && (
              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-2'>
                  <Switch
                    id='edit-allowCustomAudio'
                    checked={formData.allowCustomAudio}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowCustomAudio: checked })
                    }
                  />
                  <Label htmlFor='edit-allowCustomAudio'>
                    <LocalizedText text={"Allow Custom Audio"} />
                  </Label>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setEditDialogOpen(false);
                setEditingModel(null);
              }}
            >
              <LocalizedText text={"Cancel"} />
            </Button>
            <Button onClick={() => handleSubmit(true)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingFileLoader size={20} />
                  <LocalizedText text={"Updating..."} />
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
            <DialogTitle>
              <LocalizedText text={"Delete Model"} />
            </DialogTitle>
            <DialogDescription>
              <LocalizedText text={'Are you sure you want to delete "'} />
              {modelToDelete?.name}
              <LocalizedText
                text={
                  '"? This action cannot be undone. The model will be marked as inactive.'
                }
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setDeleteDialogOpen(false);
                setModelToDelete(null);
              }}
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
                  <LoadingFileLoader size={20} />
                  <LocalizedText text={"Deleting..."} />
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
