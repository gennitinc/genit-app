"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  EmojiClickData,
  EmojiStyle,
  Theme as EmojiTheme,
} from "emoji-picker-react";
import { Smile } from "lucide-react";
import dynamic from "next/dynamic";
import { memo, useCallback, useMemo, useRef, useState } from "react";

const loadPicker = () => import("emoji-picker-react");

const PICKER_WIDTH = "min(340px, calc(100vw - 1.5rem))";
const PICKER_HEIGHT = "min(400px, calc(100dvh - 7rem))";

const EmojiPicker = dynamic(loadPicker, {
  ssr: false,
  loading: () => (
    <div
      className='bg-popover animate-pulse rounded-xl border'
      style={{ width: PICKER_WIDTH, height: PICKER_HEIGHT }}
    />
  ),
});

/**
 * Isolated from the inbox page so typing, socket refreshes and polling do not
 * re-render ~1,800 emoji. The picker mounts on first open and then stays
 * mounted (hidden) so reopening is instant.
 */
export const EmojiPickerButton = memo(function EmojiPickerButton({
  onPick,
  theme,
  disabled,
}: {
  onPick: (emoji: string) => void;
  theme: "light" | "dark";
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  const handleEmoji = useCallback(
    (data: EmojiClickData) => onPickRef.current(data.emoji),
    []
  );

  const picker = useMemo(
    () =>
      mounted ? (
        <EmojiPicker
          onEmojiClick={handleEmoji}
          // Native glyphs: the default fetches every emoji as a CDN image.
          emojiStyle={"native" as EmojiStyle}
          lazyLoadEmojis
          autoFocusSearch
          searchPlaceholder='Search emoji'
          theme={theme as EmojiTheme}
          width={PICKER_WIDTH}
          height={PICKER_HEIGHT}
          previewConfig={{ showPreview: false }}
        />
      ) : null,
    [mounted, theme, handleEmoji]
  );

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setMounted(true);
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          disabled={disabled}
          className='text-muted-foreground hover:text-foreground h-8 w-8'
          aria-label='Add emoji'
          // Start fetching the chunk before the click lands.
          onPointerEnter={() => void loadPicker()}
          onFocus={() => void loadPicker()}
        >
          <Smile className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      {mounted && (
        <PopoverContent
          forceMount
          side='top'
          align='start'
          collisionPadding={12}
          className='w-auto border-0 bg-transparent p-0 shadow-lg data-[state=closed]:hidden'
        >
          {picker}
        </PopoverContent>
      )}
    </Popover>
  );
});
