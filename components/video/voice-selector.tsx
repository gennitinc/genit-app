"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Mic,
  Play,
  Square,
  Loader2,
  Check,
  Plus,
  Volume2,
  Pause,
  Trash2,
  Upload,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Voice } from "@/types/inspire";
import { voiceApi } from "@/utils/inspire-api";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface VoiceSelectorProps {
  selectedVoice: Voice | null;
  clonedVoiceId: string | null;
  onSelectVoice: (voice: Voice | null) => void;
  onCloneVoice: (voiceId: string) => void;
  isCloning: boolean;
  onCloningChange: (isCloning: boolean) => void;
}

function VoiceCard({
  voice,
  isSelected,
  onSelect,
  isPlaying,
  onPlayToggle,
  onDelete,
  showDelete = false,
}: {
  voice: Voice;
  isSelected: boolean;
  onSelect: () => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onSelect}
        className={cn(
          "relative overflow-hidden rounded-lg transition-all w-full",
          isSelected
            ? "ring-1 ring-neutral-500 dark:ring-neutral-500"
            : "ring-1 ring-neutral-500 dark:ring-neutral-400"
        )}
      >
        <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center p-3 gap-2">
          {/* Play Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayToggle();
            }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0",
              isPlaying
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-600 dark:hover:bg-neutral-200"
            )}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          {/* Voice Info */}
          <div className="text-center flex-1 flex flex-col justify-center">
            <p className="text-[10px] font-medium text-neutral-900 dark:text-white truncate w-full">
              {voice.name}
            </p>
            <p className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {voice.language} • {voice.accent}
            </p>
          </div>
        </div>
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-neutral-900 dark:bg-neutral-100 rounded-full flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white dark:text-neutral-900" />
          </div>
        )}
      </button>
      {/* Delete Button (only for user voices) */}
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-1.5 left-1.5 w-6 h-6 rounded flex items-center justify-center transition-colors text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100"
          title="Delete voice"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export function VoiceSelector({
  selectedVoice,
  clonedVoiceId,
  onSelectVoice,
  onCloneVoice,
  isCloning,
  onCloningChange,
}: VoiceSelectorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"voices" | "my-audio" | "clone">(
    "voices"
  );
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [userVoices, setUserVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [voiceName, setVoiceName] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState("English");
  const [voiceAccent, setVoiceAccent] = useState("Standard");
  const [voiceGender, setVoiceGender] = useState<"male" | "female">("male");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch voices from API
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setLoading(true);

        // Fetch AI voices (public, no auth required)
        try {
          const aiResponse = await voiceApi.getAll({ category: "ai" });
          if (aiResponse?.success && aiResponse?.data) {
            // Show admin-created voices and public non-user voices in "AI Voice" section
            // Filter to ensure we only show admin voices or public non-user voices
            const aiVoices = Array.isArray(aiResponse.data)
              ? aiResponse.data.filter(
                  (v) => v.admin || (v.isPublic && !v.userId)
                )
              : [];
            setVoices(aiVoices);
          }
        } catch (error: any) {
          console.error("Error fetching AI voices:", error);
          // Set empty array on error to prevent crashes
          setVoices([]);
        }

        // User voices will be fetched when "My Audio" tab is active
        setUserVoices([]);
      } catch (error: any) {
        console.error("Error fetching voices:", error);
        // Ensure we have empty arrays to prevent rendering errors
        setVoices([]);
        setUserVoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch user voices when "My Audio" tab is active
  useEffect(() => {
    if (activeTab === "my-audio") {
      const fetchUserVoices = async () => {
        try {
          setLoading(true);
          const userResponse = await voiceApi.getAll({ userId: "me" });
          if (userResponse?.success && userResponse?.data) {
            // Only show voices created by this user (userId matches)
            // Filter out any admin-created voices as a safety measure
            const userOwnedVoices = Array.isArray(userResponse.data)
              ? userResponse.data.filter((v) => !v.admin)
              : [];
            setUserVoices(userOwnedVoices);
          } else {
            setUserVoices([]);
          }
        } catch (error: any) {
          // Silently fail for user voices - user might not be authenticated
          console.log("User voices not available (may require authentication)");
          setUserVoices([]);
        } finally {
          setLoading(false);
        }
      };

      fetchUserVoices();
    }
  }, [activeTab]);

  const handlePlayToggle = (voice: Voice) => {
    if (!voice.sampleUrl) return;

    const voiceId = voice._id || voice.id || "";
    if (playingVoiceId === voiceId) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingVoiceId(null);
    } else {
      // Start playing new voice
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(voice.sampleUrl);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingVoiceId(null);
      setPlayingVoiceId(voiceId);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to clone your voice.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;

    // Validate audio file
    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file",
        description: "Please select an audio file.",
        variant: "destructive",
      });
      return;
    }

    // Convert file to blob for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      setAudioBlob(blob);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCloneVoice = async () => {
    if (!audioBlob) {
      toast({
        title: "No audio",
        description: "Please record or upload your voice first.",
        variant: "destructive",
      });
      return;
    }

    if (!voiceName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your voice.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    onCloningChange(true);

    try {
      // Convert blob to File
      const audioFile = new File([audioBlob], "voice-recording.wav", {
        type: audioBlob.type || "audio/wav",
      });

      const response = await voiceApi.clone({
        name: voiceName.trim(),
        language: voiceLanguage,
        accent: voiceAccent,
        gender: voiceGender,
        audioFile,
      });

      if (response.success && response.data) {
        const clonedVoice = response.data;
        setUserVoices((prev) => [clonedVoice, ...prev]);
        onCloneVoice(clonedVoice._id || clonedVoice.id || "");

        // Reset form
        setVoiceName("");
        setAudioBlob(null);
        setRecordingTime(0);

        // Refresh user voices list
        try {
          const userResponse = await voiceApi.getAll({ userId: "me" });
          if (userResponse?.success && userResponse?.data) {
            // Filter out any admin-created voices as a safety measure
            const userOwnedVoices = Array.isArray(userResponse.data)
              ? userResponse.data.filter((v) => !v.admin)
              : [];
            setUserVoices(userOwnedVoices);
          }
        } catch (error) {
          // Continue even if refresh fails
          setUserVoices((prev) => [clonedVoice, ...prev]);
        }

        // Switch to "My Audio" tab to show the uploaded/cloned voice
        setActiveTab("my-audio");
        setIsOpen(false);
        toast({
          title: "Voice cloned successfully",
          description: "Your voice has been saved and is ready to use.",
        });
      }
    } catch (error: any) {
      console.error("Error cloning voice:", error);
      toast({
        title: "Clone failed",
        description:
          error?.response?.data?.message ||
          "Failed to clone voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      onCloningChange(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectVoice = async (voice: Voice) => {
    // Only one voice can be selected at a time
    // This will replace any previously selected voice
    onSelectVoice(voice);

    // Track usage
    try {
      await voiceApi.trackUsage(voice._id || voice.id || "");
    } catch (error) {
      // Continue even if tracking fails
    }

    setIsOpen(false);
  };

  const handleDeleteVoice = async (voice: Voice) => {
    const voiceId = voice._id || voice.id || "";
    if (!voiceId) return;

    if (!confirm(`Are you sure you want to delete "${voice.name}"?`)) {
      return;
    }

    try {
      const response = await voiceApi.delete(voiceId);
      if (response.success) {
        // Remove from user voices list
        setUserVoices((prev) =>
          prev.filter((v) => (v._id || v.id) !== voiceId)
        );

        // If this was the selected voice, clear selection
        if (
          selectedVoice?._id === voiceId ||
          selectedVoice?.id === voiceId ||
          clonedVoiceId === voiceId
        ) {
          onSelectVoice(null);
          onCloneVoice("");
        }

        toast({
          title: "Voice deleted",
          description: "Your voice has been deleted successfully.",
        });
      }
    } catch (error: any) {
      console.error("Error deleting voice:", error);
      toast({
        title: "Delete failed",
        description:
          error?.response?.data?.message ||
          "Failed to delete voice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const MoreButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="relative overflow-hidden rounded-lg transition-all group aspect-[3/4] w-full bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500"
    >
      <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
        <Plus className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
      </div>
      <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
        View More
      </p>
    </button>
  );

  const FullVoiceList = () => (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700 ">
        <button
          onClick={() => setActiveTab("voices")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "voices"
              ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
              : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          AI Voices
        </button>
        <button
          onClick={() => setActiveTab("my-audio")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "my-audio"
              ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
              : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          My Audio
        </button>
        <button
          onClick={() => setActiveTab("clone")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "clone"
              ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
              : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          Clone Voice
        </button>
      </div>

      {activeTab === "voices" && (
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
            </div>
          ) : voices.length === 0 ? (
            <div className="text-center py-8 text-sm text-neutral-500 dark:text-neutral-400">
              No voices available
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {voices.map((voice) => {
                const voiceId = voice._id || voice.id || "";
                const selectedId = selectedVoice?._id || selectedVoice?.id;
                return (
                  <VoiceCard
                    key={voiceId}
                    voice={voice}
                    isSelected={
                      !!selectedVoice &&
                      !!voiceId &&
                      !!selectedId &&
                      selectedId === voiceId
                    }
                    onSelect={() => handleSelectVoice(voice)}
                    isPlaying={playingVoiceId === voiceId}
                    onPlayToggle={() => handlePlayToggle(voice)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "my-audio" && (
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
            </div>
          ) : userVoices.length === 0 ? (
            <div className="text-center py-8 text-sm text-neutral-500 dark:text-neutral-400">
              You haven't cloned or uploaded any voices yet
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {userVoices.map((voice) => {
                const voiceId = voice._id || voice.id || "";
                const selectedId = selectedVoice?._id || selectedVoice?.id;
                return (
                  <VoiceCard
                    key={voiceId}
                    voice={voice}
                    isSelected={
                      !!selectedVoice &&
                      !!voiceId &&
                      !!selectedId &&
                      selectedId === voiceId
                    }
                    onSelect={() => handleSelectVoice(voice)}
                    isPlaying={playingVoiceId === voiceId}
                    onPlayToggle={() => handlePlayToggle(voice)}
                    onDelete={() => handleDeleteVoice(voice)}
                    showDelete={true}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "clone" && (
        <div className="py-6 space-y-4">
          <div className="text-center mb-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <Mic className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            </div>
            <h4 className="text-sm font-medium text-neutral-900 dark:text-white">
              Clone Your Voice
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Record or upload a sample to create your unique voice
            </p>
          </div>

          {/* Recording/Upload Controls */}
          <div className="flex flex-col items-center gap-3">
            {!audioBlob && (
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={cn(
                    "w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2",
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
                  )}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4" />
                      Stop ({formatTime(recordingTime)})
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Record
                    </>
                  )}
                </button>
                <label className="w-full">
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    disabled={isProcessing}
                  />
                  <span className="w-full py-2.5 px-3 rounded-lg font-medium text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-all flex items-center justify-center gap-2 cursor-pointer border border-neutral-300 dark:border-neutral-600">
                    <Upload className="w-4 h-4" />
                    Upload
                  </span>
                </label>
              </div>
            )}

            {isRecording && (
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Speak clearly for at least 10 seconds
              </div>
            )}

            {audioBlob && !isRecording && (
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <audio
                    src={URL.createObjectURL(audioBlob)}
                    controls
                    className="flex-1 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAudioBlob(null);
                      setRecordingTime(0);
                    }}
                    className="ml-2 px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    Remove
                  </button>
                </div>

                {/* Voice Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Voice Name *
                  </label>
                  <input
                    type="text"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    placeholder="e.g., My Professional Voice"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {/* Language Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Language
                  </label>
                  <Select
                    value={voiceLanguage}
                    onValueChange={setVoiceLanguage}
                  >
                    <SelectTrigger className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-sm text-neutral-900 dark:text-white">
                      <SelectValue placeholder="Select language" />
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

                {/* Accent Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Accent
                  </label>
                  <Select value={voiceAccent} onValueChange={setVoiceAccent}>
                    <SelectTrigger className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-sm text-neutral-900 dark:text-white">
                      <SelectValue placeholder="Select accent" />
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

                {/* Gender Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Gender
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVoiceGender("male")}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        voiceGender === "male"
                          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      )}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoiceGender("female")}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        voiceGender === "female"
                          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      )}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloneVoice}
                  disabled={isProcessing || !voiceName.trim()}
                  className="w-full py-2 px-3 rounded-lg font-medium text-sm bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed text-white dark:text-neutral-900 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Voice...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Save & Clone Voice
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setActiveTab("voices")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "voices"
              ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
              : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          AI Voices
        </button>
        <button
          onClick={() => setActiveTab("my-audio")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "my-audio"
              ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
              : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          My Audio
        </button>
        <button
          onClick={() => setActiveTab("clone")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "clone"
              ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
              : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
        >
          Clone Voice
        </button>
      </div>

      {/* Voice Grid */}
      {activeTab === "voices" && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Choose voice
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
            </div>
          ) : voices.length === 0 ? (
            <div className="text-center py-8 text-sm text-neutral-500 dark:text-neutral-400">
              No voices available
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {voices.slice(0, 6).map((voice) => {
                const voiceId = voice._id || voice.id || "";
                const selectedId = selectedVoice?._id || selectedVoice?.id;
                return (
                  <VoiceCard
                    key={voiceId}
                    voice={voice}
                    isSelected={
                      !!selectedVoice &&
                      !!voiceId &&
                      !!selectedId &&
                      selectedId === voiceId
                    }
                    onSelect={() => handleSelectVoice(voice)}
                    isPlaying={playingVoiceId === voiceId}
                    onPlayToggle={() => handlePlayToggle(voice)}
                  />
                );
              })}
              <MoreButton />
            </div>
          )}
        </div>
      )}

      {/* My Audio Tab */}
      {activeTab === "my-audio" && (
        <div className="py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
            </div>
          ) : userVoices.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                You haven't cloned or uploaded any voices yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {userVoices.map((voice) => {
                const voiceId = voice._id || voice.id || "";
                const selectedId = selectedVoice?._id || selectedVoice?.id;
                return (
                  <VoiceCard
                    key={voiceId}
                    voice={voice}
                    isSelected={
                      !!selectedVoice &&
                      !!voiceId &&
                      !!selectedId &&
                      selectedId === voiceId
                    }
                    onSelect={() => handleSelectVoice(voice)}
                    isPlaying={playingVoiceId === voiceId}
                    onPlayToggle={() => handlePlayToggle(voice)}
                    onDelete={() => handleDeleteVoice(voice)}
                    showDelete={true}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Clone Voice Tab */}
      {activeTab === "clone" && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <Mic className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            </div>
            <h4 className="text-sm font-medium text-neutral-900 dark:text-white">
              Clone Your Voice
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Record or upload a sample to create your unique voice
            </p>
          </div>

          {/* Recording/Upload Controls */}
          <div className="flex flex-col items-center gap-3">
            {!audioBlob && (
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={cn(
                    "w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2",
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
                  )}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4" />
                      Stop ({formatTime(recordingTime)})
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Record
                    </>
                  )}
                </button>
                <label className="w-full">
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    disabled={isProcessing}
                  />
                  <span className="w-full py-2.5 px-3 rounded-lg font-medium text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-all flex items-center justify-center gap-2 cursor-pointer border border-neutral-300 dark:border-neutral-600">
                    <Upload className="w-4 h-4" />
                    Upload
                  </span>
                </label>
              </div>
            )}

            {isRecording && (
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Speak clearly for at least 10 seconds
              </div>
            )}

            {audioBlob && !isRecording && (
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <audio
                    src={URL.createObjectURL(audioBlob)}
                    controls
                    className="flex-1 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAudioBlob(null);
                      setRecordingTime(0);
                    }}
                    className="ml-2 px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    Remove
                  </button>
                </div>

                {/* Voice Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Voice Name *
                  </label>
                  <input
                    type="text"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    placeholder="e.g., My Professional Voice"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {/* Language Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Language
                  </label>
                  <Select
                    value={voiceLanguage}
                    onValueChange={setVoiceLanguage}
                  >
                    <SelectTrigger className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-sm text-neutral-900 dark:text-white">
                      <SelectValue placeholder="Select language" />
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

                {/* Accent Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Accent
                  </label>
                  <Select value={voiceAccent} onValueChange={setVoiceAccent}>
                    <SelectTrigger className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-sm text-neutral-900 dark:text-white">
                      <SelectValue placeholder="Select accent" />
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

                {/* Gender Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Gender
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setVoiceGender("male")}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        voiceGender === "male"
                          ? "bg-cyan-500 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      )}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoiceGender("female")}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        voiceGender === "female"
                          ? "bg-cyan-500 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      )}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloneVoice}
                  disabled={isProcessing || !voiceName.trim()}
                  className="w-full py-2 px-3 rounded-lg font-medium text-sm bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed text-white dark:text-neutral-900 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Voice...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Save & Clone Voice
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialog for Desktop */}
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Select Voice</DialogTitle>
              <DialogDescription>
                Choose an AI voice or clone your own
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <FullVoiceList />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="max-h-[85vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>Select Voice</DrawerTitle>
              <DrawerDescription>
                Choose an AI voice or clone your own
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <FullVoiceList />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
