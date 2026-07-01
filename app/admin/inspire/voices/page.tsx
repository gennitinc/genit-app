"use client";

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
import { Voice } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { voiceApi } from "@/utils/inspire-api";
import {
  Edit,
  Loader2,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";

// Language and accent options
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
  "Dutch",
  "Polish",
  "Turkish",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Greek",
];

const ACCENTS = [
  "Standard",
  "American",
  "British",
  "Australian",
  "Canadian",
  "Irish",
  "Scottish",
  "Welsh",
  "Southern",
  "Northern",
  "Midwestern",
  "New York",
  "California",
  "Texas",
  "Neutral",
  "Formal",
  "Casual",
];

export default function AdminVoicesPage() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | "ai" | "cloned">(
    "all"
  );
  const [filterGender, setFilterGender] = useState<"all" | "male" | "female">(
    "all"
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [voiceToDelete, setVoiceToDelete] = useState<Voice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState<Voice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    language: "English",
    accent: "Standard",
    gender: "male" as "male" | "female",
    category: "ai" as "ai" | "cloned",
    provider: "",
    providerVoiceId: "",
    isPublic: true,
  });

  const fetchVoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: {
        category?: "ai" | "cloned";
        gender?: "male" | "female";
        admin?: string;
      } = {
        admin: "true",
      };
      if (filterCategory !== "all") {
        params.category = filterCategory;
      }
      if (filterGender !== "all") {
        params.gender = filterGender;
      }

      const response = await voiceApi.getAll(params);

      if (response.success && response.data) {
        const voicesArray = Array.isArray(response.data) ? response.data : [];
        setVoices(voicesArray);
      } else {
        setVoices([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch voices:", error);
      toast.error("Failed to load voices");
      setVoices([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, filterGender]);

  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  const handleDeleteClick = (voice: Voice) => {
    setVoiceToDelete(voice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!voiceToDelete) return;

    setIsDeleting(true);
    try {
      const response = await voiceApi.delete(voiceToDelete._id);

      if (response.success) {
        toast.success("Voice deleted successfully");
        setDeleteDialogOpen(false);
        setVoiceToDelete(null);
        setVoices((prev) => prev.filter((v) => v._id !== voiceToDelete._id));
      } else {
        toast.error("Failed to delete voice");
      }
    } catch (error: any) {
      console.error("Failed to delete voice:", error);
      toast.error(error.response?.data?.message || "Failed to delete voice");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateClick = () => {
    setFormData({
      name: "",
      language: "English",
      accent: "Standard",
      gender: "male",
      category: "ai",
      provider: "",
      providerVoiceId: "",
      isPublic: true,
    });
    setAudioFile(null);
    setCreateDialogOpen(true);
  };

  const handleEditClick = (voice: Voice) => {
    setEditingVoice(voice);
    setFormData({
      name: voice.name,
      language: voice.language,
      accent: voice.accent,
      gender: voice.gender,
      category: voice.category,
      provider: voice.provider || "",
      providerVoiceId: voice.providerVoiceId || "",
      isPublic: voice.isPublic,
    });
    setAudioFile(null);
    setEditDialogOpen(true);
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handlePlayToggle = (voice: Voice) => {
    const voiceId = voice._id || voice.id || "";
    if (playingVoiceId === voiceId && audioRef) {
      audioRef.pause();
      setPlayingVoiceId(null);
      setAudioRef(null);
    } else {
      if (audioRef) {
        audioRef.pause();
      }
      const audio = new Audio(voice.sampleUrl);
      audio.play();
      audio.onended = () => {
        setPlayingVoiceId(null);
        setAudioRef(null);
      };
      setPlayingVoiceId(voiceId);
      setAudioRef(audio);
    }
  };

  const handleSubmit = async (isEdit: boolean) => {
    if (!formData.name || !formData.language || !formData.accent) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isEdit && !audioFile) {
      toast.error("Please upload an audio file");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && editingVoice) {
        const response = await voiceApi.update(editingVoice._id, {
          name: formData.name,
          language: formData.language,
          accent: formData.accent,
          isPublic: formData.isPublic,
          audio: audioFile || undefined,
        });
        if (response.success) {
          toast.success("Voice updated successfully");
          setEditDialogOpen(false);
          setEditingVoice(null);
          setAudioFile(null);
          fetchVoices();
        } else {
          toast.error("Failed to update voice");
        }
      } else {
        if (!audioFile) {
          toast.error("Please upload an audio file");
          return;
        }
        const response = await voiceApi.create({
          name: formData.name,
          language: formData.language,
          accent: formData.accent,
          gender: formData.gender,
          category: formData.category,
          provider: formData.provider || undefined,
          providerVoiceId: formData.providerVoiceId || undefined,
          audio: audioFile,
        });
        if (response.success) {
          toast.success("Voice created successfully");
          setCreateDialogOpen(false);
          setAudioFile(null);
          fetchVoices();
        } else {
          toast.error("Failed to create voice");
        }
      }
    } catch (error: any) {
      console.error("Failed to save voice:", error);
      toast.error(error.response?.data?.message || "Failed to save voice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVoices = voices.filter((voice) => {
    const matchesSearch = voice.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='mb-2 text-3xl font-bold'>Voice Management</h1>
          <p className='text-muted-foreground'>
            Manage AI voices for video generation
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className='mr-2 h-4 w-4' />
          Create Voice
        </Button>
      </div>

      <div className='mb-6 flex flex-wrap items-center gap-4'>
        <div className='relative max-w-md flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Search voices...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select
          value={filterCategory}
          onValueChange={(v: "all" | "ai" | "cloned") => setFilterCategory(v)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            <SelectItem value='ai'>AI Voices</SelectItem>
            <SelectItem value='cloned'>Cloned Voices</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterGender}
          onValueChange={(v: "all" | "male" | "female") => setFilterGender(v)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by gender' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Genders</SelectItem>
            <SelectItem value='male'>Male</SelectItem>
            <SelectItem value='female'>Female</SelectItem>
          </SelectContent>
        </Select>
        <div className='text-muted-foreground text-sm'>
          {filteredVoices.length} voice{filteredVoices.length !== 1 ? "s" : ""}
        </div>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <LoadingFileLoader size={16} />
        </div>
      ) : filteredVoices.length === 0 ? (
        <div className='py-12 text-center'>
          <Volume2 className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <p className='text-muted-foreground'>No voices found</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredVoices.map((voice) => {
            const voiceId = voice._id || voice.id || "";
            const isPlaying = playingVoiceId === voiceId;
            return (
              <div
                key={voiceId}
                className='rounded-lg border p-4 transition-shadow hover:shadow-md'
              >
                <div className='mb-3 flex items-start justify-between'>
                  <div className='flex-1'>
                    <h3 className='mb-1 text-lg font-semibold'>{voice.name}</h3>
                    <p className='text-muted-foreground text-sm'>
                      {voice.language} • {voice.accent}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handlePlayToggle(voice)}
                      className='hover:bg-muted rounded-lg p-2 transition-colors'
                    >
                      {isPlaying ? (
                        <Pause className='h-4 w-4' />
                      ) : (
                        <Play className='h-4 w-4' />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditClick(voice)}
                      className='hover:bg-muted rounded-lg p-2 transition-colors'
                    >
                      <Edit className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(voice)}
                      className='hover:bg-destructive/10 text-destructive rounded-lg p-2 transition-colors'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
                <div className='mb-3 flex flex-wrap gap-2'>
                  <Badge variant='outline'>{voice.gender}</Badge>
                  <Badge variant='outline'>{voice.category}</Badge>
                  {voice.status && (
                    <Badge
                      variant={
                        voice.status === "active"
                          ? "default"
                          : voice.status === "processing"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {voice.status}
                    </Badge>
                  )}
                  {voice.isPublic && <Badge variant='secondary'>Public</Badge>}
                </div>
                <div className='text-muted-foreground text-xs'>
                  Used {voice.usageCount} time
                  {voice.usageCount !== 1 ? "s" : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Create New Voice</DialogTitle>
            <DialogDescription>
              Add a new AI voice for video generation
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name *</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='e.g., Professional Male Voice'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='gender'>Gender *</Label>
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
                    <SelectItem value='male'>Male</SelectItem>
                    <SelectItem value='female'>Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='language'>Language *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value })
                  }
                >
                  <SelectTrigger id='language'>
                    <SelectValue placeholder='Select language' />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='accent'>Accent *</Label>
                <Select
                  value={formData.accent}
                  onValueChange={(value) =>
                    setFormData({ ...formData, accent: value })
                  }
                >
                  <SelectTrigger id='accent'>
                    <SelectValue placeholder='Select accent' />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCENTS.map((accent) => (
                      <SelectItem key={accent} value={accent}>
                        {accent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v: "ai" | "cloned") =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ai'>AI Voice</SelectItem>
                    <SelectItem value='cloned'>Cloned Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Select value='active' disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='provider'>Provider (Optional)</Label>
                <Input
                  id='provider'
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  placeholder='e.g., ElevenLabs, OpenAI'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='providerVoiceId'>
                  Provider Voice ID (Optional)
                </Label>
                <Input
                  id='providerVoiceId'
                  value={formData.providerVoiceId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      providerVoiceId: e.target.value,
                    })
                  }
                  placeholder='External provider voice ID'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='audio'>Audio File *</Label>
              <div className='flex items-center gap-4'>
                <div className='flex-1'>
                  <Input
                    id='audio'
                    type='file'
                    accept='audio/*'
                    onChange={handleAudioChange}
                    className='cursor-pointer'
                  />
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Upload an audio sample (MP3, WAV, etc.)
                  </p>
                </div>
                {audioFile && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setAudioFile(null)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Switch
                id='isPublic'
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
              <Label htmlFor='isPublic'>Make Public</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setCreateDialogOpen(false);
                setAudioFile(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingFileLoader size={16} />
                  Creating...
                </>
              ) : (
                "Create Voice"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Voice</DialogTitle>
            <DialogDescription>
              Update voice information and settings
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='edit-name'>Name *</Label>
              <Input
                id='edit-name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='edit-language'>Language *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language: value })
                  }
                >
                  <SelectTrigger id='edit-language'>
                    <SelectValue placeholder='Select language' />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='edit-accent'>Accent *</Label>
                <Select
                  value={formData.accent}
                  onValueChange={(value) =>
                    setFormData({ ...formData, accent: value })
                  }
                >
                  <SelectTrigger id='edit-accent'>
                    <SelectValue placeholder='Select accent' />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCENTS.map((accent) => (
                      <SelectItem key={accent} value={accent}>
                        {accent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='edit-audio'>
                Audio File (Optional - leave empty to keep current)
              </Label>
              <div className='flex items-center gap-4'>
                <div className='flex-1'>
                  <Input
                    id='edit-audio'
                    type='file'
                    accept='audio/*'
                    onChange={handleAudioChange}
                    className='cursor-pointer'
                  />
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Upload a new audio sample to replace the existing one
                  </p>
                </div>
                {audioFile && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setAudioFile(null)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Switch
                id='edit-isPublic'
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
              <Label htmlFor='edit-isPublic'>Make Public</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setEditDialogOpen(false);
                setEditingVoice(null);
                setAudioFile(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(true)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingFileLoader size={16} />
                  Updating...
                </>
              ) : (
                "Update Voice"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Voice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{voiceToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setDeleteDialogOpen(false);
                setVoiceToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoadingFileLoader size={16} />
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
