"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Mic, Play, Square, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Voice } from "@/app/video/create/page";

interface VoiceSelectorProps {
  selectedVoice: Voice | null;
  clonedVoiceId: string | null;
  onSelectVoice: (voice: Voice) => void;
  onCloneVoice: (voiceId: string) => void;
  isCloning: boolean;
  onCloningChange: (isCloning: boolean) => void;
}

// Mock voices data - replace with actual API data
const AVAILABLE_VOICES: Voice[] = [
  {
    id: "voice-1",
    name: "Emma - Natural",
    language: "English",
    gender: "female",
    accent: "American",
  },
  {
    id: "voice-2",
    name: "James - Professional",
    language: "English",
    gender: "male",
    accent: "British",
  },
  {
    id: "voice-3",
    name: "Sophia - Warm",
    language: "English",
    gender: "female",
    accent: "American",
  },
  {
    id: "voice-4",
    name: "Michael - Energetic",
    language: "English",
    gender: "male",
    accent: "American",
  },
  {
    id: "voice-5",
    name: "Olivia - Calm",
    language: "English",
    gender: "female",
    accent: "Australian",
  },
];

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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
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

  const handleCloneVoice = async () => {
    if (!audioBlob) {
      alert("Please record your voice first.");
      return;
    }

    setIsProcessing(true);
    onCloningChange(true);

    try {
      // TODO: Upload audio and clone voice via API
      // const formData = new FormData();
      // formData.append("audio", audioBlob, "voice-sample.wav");
      // const response = await fetch("/api/voice/clone", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();
      // onCloneVoice(data.voiceId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const mockVoiceId = `cloned-voice-${Date.now()}`;
      onCloneVoice(mockVoiceId);
    } catch (error) {
      console.error("Error cloning voice:", error);
      alert("Failed to clone voice. Please try again.");
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

  return (
    <div className="space-y-4">
      {/* Voice Selection */}
      <div>
        <label className="text-sm font-medium mb-2 block">Select Voice</label>
        <Select
          value={selectedVoice?.id || ""}
          onValueChange={(value) => {
            const voice = AVAILABLE_VOICES.find((v) => v.id === value);
            if (voice) {
              onSelectVoice(voice);
            }
          }}
          disabled={!!clonedVoiceId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a voice" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_VOICES.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{voice.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {voice.language} • {voice.accent}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Voice Cloning Section */}
      <div className="pt-4 border-t">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Clone Your Voice</h4>
              <p className="text-xs text-muted-foreground">
                Record a sample to clone your voice
              </p>
            </div>
            {clonedVoiceId && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Check className="w-4 h-4" />
                <span>Cloned</span>
              </div>
            )}
          </div>

          {!clonedVoiceId && (
            <div className="space-y-3">
              {/* Recording Controls */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                {isRecording && (
                  <div className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-md text-sm font-mono">
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>

              {/* Audio Preview */}
              {audioBlob && !isRecording && (
                <div className="space-y-2">
                  <audio
                    src={URL.createObjectURL(audioBlob)}
                    controls
                    className="w-full"
                  />
                  <Button
                    type="button"
                    onClick={handleCloneVoice}
                    disabled={isProcessing}
                    className="w-full"
                    size="sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Cloning Voice...
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Clone This Voice
                      </>
                    )}
                  </Button>
                </div>
              )}

              {isRecording && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    Recording in progress...
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Speak clearly for at least 10 seconds
                  </p>
                </div>
              )}
            </div>
          )}

          {clonedVoiceId && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary">
                Your voice has been cloned successfully! It will be used for video generation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Voice Info */}
      {(selectedVoice || clonedVoiceId) && (
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Active Voice:</span>
              <span className="font-medium">
                {clonedVoiceId ? "Your Cloned Voice" : selectedVoice?.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

