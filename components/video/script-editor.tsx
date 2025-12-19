"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Mic, RefreshCw, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptEditorProps {
  script: string;
  onScriptChange: (script: string) => void;
  onGenerateScript: (prompt: string) => void;
}

const MAX_CHARACTERS = 500;

export function ScriptEditor({
  script,
  onScriptChange,
  onGenerateScript,
}: ScriptEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerateScript(prompt);
      // Clear prompt after generation
      setPrompt("");
    } catch (error) {
      console.error("Error generating script:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    setIsListening(true);
    // TODO: Implement speech recognition
    // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // const recognition = new SpeechRecognition();
    // recognition.continuous = false;
    // recognition.interimResults = false;
    // recognition.onresult = (event) => {
    //   const transcript = event.results[0][0].transcript;
    //   onScriptChange(transcript);
    //   setIsListening(false);
    // };
    // recognition.onerror = () => {
    //   setIsListening(false);
    // };
    // recognition.start();
  };

  const handleListen = () => {
    // TODO: Implement text-to-speech playback
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(script);
      window.speechSynthesis.speak(utterance);
    }
  };

  const calculateDuration = (text: string): number => {
    // Rough estimate: average speaking rate is 150 words per minute
    const words = text.trim().split(/\s+/).length;
    const minutes = words / 150;
    return Math.ceil(minutes * 60); // Return in seconds
  };

  const duration = calculateDuration(script);
  const characterCount = script.length;

  return (
    <div className="space-y-4">
      {/* AI Script Generation Prompt */}
      {!script && (
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
            <Sparkles className="w-4 h-4 text-primary" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write a script about Business promotion for product."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <button
              onClick={() => setPrompt("")}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
          {prompt && (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="sm"
              className="mt-2 w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Script
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Script Textarea */}
      <div className="relative">
        <Textarea
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          placeholder="Enter your script here or use AI to generate one..."
          className="min-h-[200px] resize-none"
          maxLength={MAX_CHARACTERS}
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {characterCount}/{MAX_CHARACTERS}
        </div>
      </div>

      {/* Script Controls */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleVoiceInput}
            disabled={isListening}
          >
            <Mic className={cn("w-4 h-4", isListening && "text-primary animate-pulse")} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onScriptChange("")}
            disabled={!script}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{duration}s</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleListen}
            disabled={!script}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Listen
          </Button>
        </div>
      </div>
    </div>
  );
}

