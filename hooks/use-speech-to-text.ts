"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechToTextOptions {
  onTranscript?: (transcript: string) => void;
  onEnd?: () => void;
  continuous?: boolean;
}

export function useSpeechToText({
  onTranscript,
  onEnd,
  continuous = true,
}: UseSpeechToTextOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const onTranscriptRef = useRef(onTranscript);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onEndRef.current = onEnd;
  }, [onTranscript, onEnd]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join("");

      if (onTranscriptRef.current) {
        onTranscriptRef.current(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (onEndRef.current) {
        onEndRef.current();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    startListening,
    stopListening,
    error,
    isSupported:
      typeof window !== "undefined" &&
      !!(
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
      ),
  };
}
