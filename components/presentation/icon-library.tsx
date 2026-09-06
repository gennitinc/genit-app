"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LoadingFileLoader } from "@/utils/Loading";
import { Icon } from "@iconify/react";
import { Download, Loader2, Palette, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Popular icons to show initially (format: "icon-set:icon-name")
const POPULAR_ICONS = [
  // Material Design Icons
  "mdi:home",
  "mdi:user",
  "mdi:settings",
  "mdi:search",
  "mdi:heart",
  "mdi:star",
  "mdi:check",
  "mdi:close",
  "mdi:arrow-right",
  "mdi:arrow-left",
  "mdi:arrow-up",
  "mdi:arrow-down",
  "mdi:menu",
  "mdi:email",
  "mdi:phone",
  "mdi:calendar",
  "mdi:clock",
  "mdi:location",
  "mdi:image",
  "mdi:video",
  "mdi:music",
  "mdi:file",
  "mdi:folder",
  "mdi:download",
  "mdi:upload",
  "mdi:share",
  "mdi:like",
  "mdi:comment",
  "mdi:bell",
  "mdi:lock",
  "mdi:unlock",
  "mdi:eye",
  "mdi:eye-off",
  "mdi:edit",
  "mdi:delete",
  "mdi:add",
  "mdi:remove",
  "mdi:save",
  "mdi:refresh",
  "mdi:play",
  "mdi:pause",
  "mdi:stop",
  "mdi:next",
  "mdi:previous",
  "mdi:volume-high",
  "mdi:volume-off",
  "mdi:fullscreen",
  "mdi:fullscreen-exit",
  "mdi:zoom-in",
  "mdi:zoom-out",
  // Heroicons
  "heroicons:home-20-solid",
  "heroicons:user-20-solid",
  "heroicons:cog-6-tooth-20-solid",
  "heroicons:magnifying-glass-20-solid",
  "heroicons:heart-20-solid",
  "heroicons:star-20-solid",
  "heroicons:check-20-solid",
  "heroicons:x-mark-20-solid",
  "heroicons:arrow-right-20-solid",
  "heroicons:arrow-left-20-solid",
  "heroicons:arrow-up-20-solid",
  "heroicons:arrow-down-20-solid",
  "heroicons:bars-3-20-solid",
  "heroicons:envelope-20-solid",
  "heroicons:phone-20-solid",
  "heroicons:calendar-20-solid",
  "heroicons:clock-20-solid",
  "heroicons:map-pin-20-solid",
  "heroicons:photo-20-solid",
  "heroicons:video-camera-20-solid",
  "heroicons:musical-note-20-solid",
  "heroicons:document-20-solid",
  "heroicons:folder-20-solid",
  "heroicons:arrow-down-tray-20-solid",
  "heroicons:arrow-up-tray-20-solid",
  "heroicons:share-20-solid",
  "heroicons:hand-thumb-up-20-solid",
  "heroicons:chat-bubble-left-20-solid",
  "heroicons:bell-20-solid",
  "heroicons:lock-closed-20-solid",
  "heroicons:lock-open-20-solid",
  "heroicons:eye-20-solid",
  "heroicons:eye-slash-20-solid",
  "heroicons:pencil-20-solid",
  "heroicons:trash-20-solid",
  "heroicons:plus-20-solid",
  "heroicons:minus-20-solid",
  "heroicons:bookmark-20-solid",
  "heroicons:arrow-path-20-solid",
  "heroicons:play-20-solid",
  "heroicons:pause-20-solid",
  "heroicons:stop-20-solid",
  "heroicons:forward-20-solid",
  "heroicons:backward-20-solid",
  "heroicons:speaker-wave-20-solid",
  "heroicons:speaker-x-mark-20-solid",
  "heroicons:arrows-pointing-out-20-solid",
  "heroicons:arrows-pointing-in-20-solid",
  "heroicons:magnifying-glass-plus-20-solid",
  "heroicons:magnifying-glass-minus-20-solid",
  // Lucide
  "lucide:home",
  "lucide:user",
  "lucide:settings",
  "lucide:search",
  "lucide:heart",
  "lucide:star",
  "lucide:check",
  "lucide:x",
  "lucide:arrow-right",
  "lucide:arrow-left",
  "lucide:arrow-up",
  "lucide:arrow-down",
  "lucide:menu",
  "lucide:mail",
  "lucide:phone",
  "lucide:calendar",
  "lucide:clock",
  "lucide:map-pin",
  "lucide:image",
  "lucide:video",
  "lucide:music",
  "lucide:file",
  "lucide:folder",
  "lucide:download",
  "lucide:upload",
  "lucide:share",
  "lucide:thumbs-up",
  "lucide:message-circle",
  "lucide:bell",
  "lucide:lock",
  "lucide:unlock",
  "lucide:eye",
  "lucide:eye-off",
  "lucide:edit",
  "lucide:trash",
  "lucide:plus",
  "lucide:minus",
  "lucide:save",
  "lucide:refresh-cw",
  "lucide:play",
  "lucide:pause",
  "lucide:stop",
  "lucide:skip-forward",
  "lucide:skip-back",
  "lucide:volume-2",
  "lucide:volume-x",
  "lucide:maximize",
  "lucide:minimize",
  "lucide:zoom-in",
  "lucide:zoom-out",
];

const ICONS_PER_LOAD = 50;

interface IconItem {
  icon: string; // Format: "icon-set:icon-name"
  name: string; // Display name
}

interface IconLibraryProps {
  onInsertIcon: (
    iconName: string,
    iconData: string,
    color?: string,
    size?: number
  ) => void;
  onClose?: () => void;
  showHeader?: boolean;
  preSelectedIcon?: string; // Icon to pre-select when opening (format: "icon-set:icon-name")
  preSelectedColor?: string; // Color to pre-select
}

export function IconLibrary({
  onInsertIcon,
  onClose,
  showHeader = true,
  preSelectedIcon,
  preSelectedColor,
}: IconLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedIcons, setDisplayedIcons] = useState<IconItem[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    preSelectedIcon || null
  );
  const [iconColor, setIconColor] = useState(preSelectedColor || "#000000");
  const [iconSize, setIconSize] = useState(24);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<IconItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Convert popular icons to IconItem format
  const popularIconsList: IconItem[] = useMemo(
    () =>
      POPULAR_ICONS.map((icon) => {
        const [prefix, ...nameParts] = icon.split(":");
        const name = nameParts.join(":");
        return {
          icon,
          name: `${prefix}:${name}`,
        };
      }),
    []
  );

  // Search icons using Iconify API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setDisplayedIcons(popularIconsList.slice(0, ICONS_PER_LOAD));
      setHasMore(popularIconsList.length > ICONS_PER_LOAD);
      return;
    }

    const searchIcons = async () => {
      setIsSearching(true);
      try {
        const query = searchQuery.trim().toLowerCase();
        const response = await fetch(
          `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=500`
        );
        const data = await response.json();

        if (data.icons && Array.isArray(data.icons)) {
          const results: IconItem[] = data.icons.map((icon: string) => {
            const [prefix, ...nameParts] = icon.split(":");
            const name = nameParts.join(":");
            return {
              icon,
              name: `${prefix}:${name}`,
            };
          });
          setSearchResults(results);
          setDisplayedIcons(results.slice(0, ICONS_PER_LOAD));
          setHasMore(results.length > ICONS_PER_LOAD);
        } else {
          setSearchResults([]);
          setDisplayedIcons([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error searching icons:", error);
        setSearchResults([]);
        setDisplayedIcons([]);
        setHasMore(false);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchIcons, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, popularIconsList]);

  // Load more icons on scroll
  const loadMoreIcons = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      const allIcons = searchQuery.trim() ? searchResults : popularIconsList;
      const nextBatch = allIcons.slice(
        displayedIcons.length,
        displayedIcons.length + ICONS_PER_LOAD
      );

      if (nextBatch.length > 0) {
        setDisplayedIcons((prev) => [...prev, ...nextBatch]);
        setHasMore(displayedIcons.length + nextBatch.length < allIcons.length);
      } else {
        setHasMore(false);
      }
      setIsLoadingMore(false);
    }, 100);
  }, [
    displayedIcons.length,
    hasMore,
    isLoadingMore,
    searchQuery,
    searchResults,
    popularIconsList,
  ]);

  // Handle scroll for pagination
  useEffect(() => {
    const scrollElement =
      scrollAreaRef.current?.closest("[data-radix-scroll-area-viewport]") ||
      scrollAreaRef.current?.parentElement?.querySelector(
        "[data-radix-scroll-area-viewport]"
      );

    if (!scrollElement) {
      // Fallback: try to find scrollable element after a short delay
      setTimeout(() => {
        const viewport = document.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (viewport) {
          const handleScroll = () => {
            const target = viewport as HTMLElement;
            const scrollBottom =
              target.scrollHeight - target.scrollTop - target.clientHeight;

            if (scrollBottom < 100 && hasMore && !isLoadingMore) {
              loadMoreIcons();
            }
          };
          viewport.addEventListener("scroll", handleScroll);
          return () => viewport.removeEventListener("scroll", handleScroll);
        }
      }, 100);
      return;
    }

    const handleScroll = () => {
      const target = scrollElement as HTMLElement;
      const scrollBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight;

      if (scrollBottom < 100 && hasMore && !isLoadingMore) {
        loadMoreIcons();
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoadingMore, loadMoreIcons, displayedIcons.length]);

  // Scroll to pre-selected icon when it's loaded
  useEffect(() => {
    if (preSelectedIcon && displayedIcons.length > 0) {
      const iconIndex = displayedIcons.findIndex(
        (item) => item.icon === preSelectedIcon
      );
      if (iconIndex !== -1 && scrollAreaRef.current) {
        // Scroll to the icon after a short delay to ensure it's rendered
        setTimeout(() => {
          const iconElement = scrollAreaRef.current?.querySelector(
            `[data-icon="${preSelectedIcon}"]`
          );
          iconElement?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, [preSelectedIcon, displayedIcons]);

  const handleIconClick = (icon: string) => {
    setSelectedIcon(icon);
  };

  const handleInsert = () => {
    if (!selectedIcon) return;
    onInsertIcon(selectedIcon, selectedIcon, iconColor, iconSize);
    setSelectedIcon(null);
  };

  return (
    <div className='flex h-full max-h-[600px] flex-col'>
      {/* Header */}
      {showHeader && (
        <div className='flex-shrink-0 p-4 pb-0'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 dark:bg-orange-500/10'>
                <Palette className='h-5 w-5 text-orange-500 dark:text-orange-400' />
              </div>
              <div>
                <h3 className='text-foreground text-sm font-semibold'>
                  <LocalizedText text={"Icon Library"} />
                </h3>
                <p className='text-muted-foreground text-xs'>
                  {isSearching
                    ? "Searching..."
                    : `${displayedIcons.length}${hasMore ? "+" : ""} icons shown`}
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='hover:bg-muted text-muted-foreground hover:text-foreground h-6 w-6 p-0'
              >
                <X className='h-3 w-3' />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Search and Customization Section */}
      <div className='flex-shrink-0 p-4 pb-0'>
        {/* Search */}
        <div className='relative mb-4'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            type='text'
            placeholder='Search 200,000+ icons...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='h-9 pl-9 text-sm'
          />
          {isSearching && <LoadingFileLoader size={20} />}
        </div>

        {/* Icon Customization (when selected) */}
        {selectedIcon && (
          <div className='bg-muted/50 border-border mb-4 space-y-3 rounded-lg border p-3'>
            <div className='flex items-center justify-between'>
              <span className='text-foreground text-xs font-medium'>
                <LocalizedText text={"Selected:"} />
              </span>
              <span className='text-muted-foreground max-w-[200px] truncate font-mono text-xs'>
                {selectedIcon}
              </span>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className='text-muted-foreground mb-1 block text-[10px]'>
                  <LocalizedText text={"Color"} />
                </label>
                <div className='flex gap-1'>
                  <input
                    type='color'
                    value={iconColor}
                    onChange={(e) => setIconColor(e.target.value)}
                    className='border-border h-8 w-8 cursor-pointer rounded border'
                  />
                  <Input
                    type='text'
                    value={iconColor}
                    onChange={(e) => setIconColor(e.target.value)}
                    className='h-8 flex-1 text-xs'
                    placeholder='#000000'
                  />
                </div>
              </div>
              <div>
                <label className='text-muted-foreground mb-1 block text-[10px]'>
                  <LocalizedText text={"Size"} />
                </label>
                <Input
                  type='number'
                  value={iconSize}
                  onChange={(e) => setIconSize(Number(e.target.value))}
                  className='h-8 text-xs'
                  min={12}
                  max={128}
                />
              </div>
            </div>
            <Button
              onClick={handleInsert}
              size='sm'
              className='h-8 w-full text-xs'
            >
              <Download className='mr-1 h-3 w-3' />
              <LocalizedText text={"Insert Icon"} />
            </Button>
          </div>
        )}
      </div>

      {/* Icons Grid */}
      <div
        className='min-h-0 flex-1 overflow-hidden px-4'
        style={{ maxHeight: "400px" }}
      >
        <ScrollArea className='h-full'>
          <div ref={scrollAreaRef}>
            {isSearching && displayedIcons.length === 0 ? (
              <div className='flex h-32 items-center justify-center'>
                <LoadingFileLoader size={20} />
              </div>
            ) : displayedIcons.length === 0 ? (
              <div className='flex h-32 items-center justify-center'>
                <p className='text-muted-foreground text-sm'>
                  <LocalizedText
                    text={"No icons found. Try a different search term."}
                  />
                </p>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-5 gap-2 pb-4'>
                  {displayedIcons.map(({ icon, name }) => (
                    <button
                      key={icon}
                      data-icon={icon}
                      onClick={() => handleIconClick(icon)}
                      className={cn(
                        "group flex aspect-square items-center justify-center rounded-lg border-2 transition-all duration-200",
                        selectedIcon === icon
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-border bg-muted/30 hover:bg-muted/50 hover:border-orange-500/50"
                      )}
                      title={name}
                    >
                      <div
                        style={
                          selectedIcon === icon
                            ? {
                                color: iconColor,
                                width: `${iconSize}px`,
                                height: `${iconSize}px`,
                              }
                            : undefined
                        }
                        className='flex items-center justify-center'
                      >
                        <Icon
                          icon={icon}
                          className={cn(
                            "transition-colors",
                            selectedIcon === icon
                              ? "text-orange-500"
                              : "text-muted-foreground group-hover:text-foreground",
                            !selectedIcon || selectedIcon !== icon
                              ? "h-5 w-5"
                              : ""
                          )}
                          style={
                            selectedIcon === icon
                              ? {
                                  color: iconColor,
                                  width: `${iconSize}px`,
                                  height: `${iconSize}px`,
                                }
                              : undefined
                          }
                        />
                      </div>
                    </button>
                  ))}
                </div>
                {isLoadingMore && (
                  <div className='flex items-center justify-center py-4'>
                    <LoadingFileLoader size={20} />
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
