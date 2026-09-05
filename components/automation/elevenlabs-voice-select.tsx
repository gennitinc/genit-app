"use client";

import type { ElevenLabsVoice } from "@/types/inspire";
import Loading from "@/utils/Loading";
import { voiceApi } from "@/utils/inspire-api";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  value?: string;
  onChange: (voiceId: string, voiceName: string) => void;
};

export function ElevenLabsVoiceSelect({ value, onChange }: Props) {
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [defaultVoiceId, setDefaultVoiceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let active = true;
    voiceApi
      .getElevenLabs()
      .then((response) => {
        if (!active) return;
        const defaultId = response.defaultVoiceId || response.data[0]?.id || "";
        setVoices(response.data);
        setDefaultVoiceId(defaultId);
        if (!value && defaultId) {
          const voice = response.data.find((item) => item.id === defaultId);
          onChangeRef.current(defaultId, voice?.name || "Default voice");
        }
      })
      .catch((requestError: any) => {
        if (active)
          setError(
            requestError?.response?.data?.message || "Voices unavailable"
          );
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <label className='mb-1 block text-[9px] font-medium tracking-wider text-zinc-500 uppercase dark:text-neutral-400'>
        Voice
      </label>
      <div className='relative'>
        <select
          value={value || defaultVoiceId}
          disabled={loading || Boolean(error)}
          onChange={(event) => {
            const voice = voices.find((item) => item.id === event.target.value);
            onChange(event.target.value, voice?.name || "Voice");
          }}
          className='w-full cursor-pointer rounded border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 pr-7 text-xs text-zinc-800 transition-colors outline-none focus:border-violet-500/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200'
        >
          {loading && <option>Loading voices…</option>}
          {error && <option>{error}</option>}
          {!loading && !error && !voices.length && (
            <option>No voices available</option>
          )}
          {voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
              {voice.id === defaultVoiceId ? " (Default)" : ""}
            </option>
          ))}
        </select>
        {loading && <Loading size={12} className='absolute top-2 right-2' />}
      </div>
    </div>
  );
}
