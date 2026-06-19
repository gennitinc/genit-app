"use client";

import { ColorShadeScale } from "./color-shade-scale";
import { useProjectDesign } from "@/context/DesignProject";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Plus, RefreshCw, Search, Unlock, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";


type Tab = "brand" | "neutral" | "status" | "fonts";

interface ColorScale {
  id: string;
  label: string;
  base: string;
  shades: { [key: number]: string };
}

interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateShades(hex: string): { [key: number]: string } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  const toHex = (r: number, g: number, b: number) =>
    "#" +
    [r, g, b]
      .map((v) =>
        Math.min(255, Math.max(0, Math.round(v)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("");

  const mix = (a: number, t: number[], fac: number) =>
    toHex(
      a * (1 - fac) + t[0] * fac,
      g * (1 - fac) + t[1] * fac,
      b * (1 - fac) + t[2] * fac
    );

  const W = [255, 255, 255];
  const Bk = [0, 0, 0];

  return {
    50: mix(r, W, 0.95),
    100: mix(r, W, 0.88),
    200: mix(r, W, 0.75),
    300: mix(r, W, 0.58),
    400: mix(r, W, 0.38),
    500: mix(r, W, 0.18),
    600: toHex(r, g, b),
    700: mix(r, Bk, 0.15),
    800: mix(r, Bk, 0.32),
    900: mix(r, Bk, 0.5),
    950: mix(r, Bk, 0.65),
  };
}

function randomHex() {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}

// Curated fallback fonts (no API key needed)
const FALLBACK_FONTS: GoogleFont[] = [
  { family: "Inter", category: "sans-serif", variants: ["400", "700"] },
  { family: "Roboto", category: "sans-serif", variants: ["400", "700"] },
  { family: "Playfair Display", category: "serif", variants: ["400", "700"] },
  { family: "Merriweather", category: "serif", variants: ["400", "700"] },
  { family: "Space Grotesk", category: "sans-serif", variants: ["400", "700"] },
  { family: "DM Sans", category: "sans-serif", variants: ["400", "700"] },
  { family: "Nunito", category: "sans-serif", variants: ["400", "700"] },
  { family: "Lora", category: "serif", variants: ["400", "700"] },
  { family: "Josefin Sans", category: "sans-serif", variants: ["400", "700"] },
  { family: "Raleway", category: "sans-serif", variants: ["400", "700"] },
  {
    family: "Source Code Pro",
    category: "monospace",
    variants: ["400", "700"],
  },
  { family: "Fira Code", category: "monospace", variants: ["400", "700"] },
  {
    family: "Bricolage Grotesque",
    category: "sans-serif",
    variants: ["400", "700"],
  },
  { family: "Sora", category: "sans-serif", variants: ["400", "700"] },
  { family: "Outfit", category: "sans-serif", variants: ["400", "700"] },
  {
    family: "Plus Jakarta Sans",
    category: "sans-serif",
    variants: ["400", "700"],
  },
  { family: "Geist", category: "sans-serif", variants: ["400", "700"] },
  { family: "Cormorant Garamond", category: "serif", variants: ["400", "700"] },
  { family: "IBM Plex Mono", category: "monospace", variants: ["400", "700"] },
  { family: "Bebas Neue", category: "display", variants: ["400"] },
];

const STATUS_COLORS = [
  { id: "success", label: "Success", hex: "#22c55e" },
  { id: "warning", label: "Warning", hex: "#f59e0b" },
  { id: "danger", label: "Danger", hex: "#ef4444" },
];

const TABS: { id: Tab; label: string }[] = [
  { id: "brand", label: "Brand" },
  { id: "neutral", label: "Neutral" },
  { id: "status", label: "Status" },
  { id: "fonts", label: "Fonts" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function HexInput({
  value,
  onChange,
  locked,
  onLockToggle,
  onRemove,
  showRemove,
}: {
  value: string;
  onChange: (hex: string) => void;
  locked: boolean;
  onLockToggle: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <div className='group/hex flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 transition-colors focus-within:border-white/25'>
      <div
        className='h-5 w-5 shrink-0 rounded-full border border-white/10'
        style={{ backgroundColor: value }}
      />
      <input
        type='text'
        value={draft}
        maxLength={7}
        placeholder='#000000'
        className='text-foreground min-w-0 flex-1 border-none bg-transparent font-mono text-sm outline-none'
        onChange={(e) => {
          setDraft(e.target.value);
          if (/^#[0-9a-fA-F]{6}$/.test(e.target.value))
            onChange(e.target.value);
        }}
        onBlur={() => setDraft(value)}
      />
      <label className='text-muted-foreground hover:text-foreground shrink-0 cursor-pointer transition-opacity'>
        <input
          type='color'
          value={value}
          className='sr-only'
          onChange={(e) => onChange(e.target.value)}
        />
        <div
          className='h-3.5 w-3.5 rounded border border-white/20'
          style={{ backgroundColor: value }}
        />
      </label>
      <button
        onClick={onLockToggle}
        className='text-muted-foreground hover:text-foreground transition-colors'
      >
        {locked ? (
          <Lock className='h-3 w-3' />
        ) : (
          <Unlock className='h-3 w-3 opacity-30 group-hover/hex:opacity-80' />
        )}
      </button>
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className='text-muted-foreground transition-colors hover:text-red-400'
        >
          <X className='h-3 w-3' />
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ColorManagement({
  className,
  isLocked,
  finalizedPalette,
  finalizedFont,
}: {
  className?: string;
  isLocked?: boolean;
  finalizedPalette?: any[];
  finalizedFont?: string | null;
}) {
  const {
    generationMode,
    setGenerationMode,
    selectedColorScales,
    setSelectedColorScales,
    primaryFont,
    setPrimaryFont,
  } = useProjectDesign();

  const [activeTab, setActiveTab] = useState<Tab>("brand");

  const hasSyncedFromContext = useRef(false);
  const isInternalUpdate = useRef(false);

  // Brand
  const [brandScales, setBrandScales] = useState<ColorScale[]>(() => {
    if (isLocked && finalizedPalette) {
      return finalizedPalette.map((s, idx) => ({
        id: s.id || (idx === 0 ? "primary" : `secondary-${idx}`),
        label: idx === 0 ? "Primary" : "Secondary",
        base: s.base,
        shades: s.shades || generateShades(s.base),
      }));
    }
    if (selectedColorScales && selectedColorScales.length > 0) {
      hasSyncedFromContext.current = true;
      return selectedColorScales.map((s, idx) => ({
        id: idx === 0 ? "primary" : `secondary-${idx}`,
        label: idx === 0 ? "Primary" : "Secondary",
        base: s.base,
        shades: s.shades,
      }));
    }
    return [
      {
        id: "primary",
        label: "Primary",
        base: "#6366f1",
        shades: generateShades("#6366f1"),
      },
    ];
  });

  // Sync context to local state if context changes (e.g. after project fetch)
  useEffect(() => {
    if (selectedColorScales.length > 0 && !isLocked) {
      // If this update came from our own internal change, skip syncing back
      if (isInternalUpdate.current) {
        isInternalUpdate.current = false;
        return;
      }

      const currentContextHexes = selectedColorScales.map((s) => s.base).join(",");
      const currentLocalHexes = brandScales.map((s) => s.base).join(",");
      
      if (currentContextHexes !== currentLocalHexes) {
        hasSyncedFromContext.current = true;
        setBrandScales(
          selectedColorScales.map((s, idx) => ({
            id: idx === 0 ? "primary" : `secondary-${idx}`,
            label: idx === 0 ? "Primary" : "Secondary",
            base: s.base,
            shades: s.shades,
          }))
        );
      }
    }
  }, [selectedColorScales, isLocked]);

  // Sync local state to context whenever brandScales change (ONLY if not locked)
  useEffect(() => {
    if (!isLocked) {
      // Prevent overwriting context with defaults on initial mount if context was empty
      if (!hasSyncedFromContext.current && selectedColorScales.length === 0) {
        const isDefault = brandScales.length === 1 && brandScales[0].base === "#6366f1";
        if (isDefault) return;
      }

      const currentContextHexes = selectedColorScales.map((s) => s.base).join(",");
      const currentLocalHexes = brandScales.map((s) => s.base).join(",");

      if (currentContextHexes !== currentLocalHexes) {
        isInternalUpdate.current = true;
        setSelectedColorScales(
          brandScales.map((s) => ({ base: s.base, shades: s.shades }))
        );
      }
    }
  }, [brandScales, setSelectedColorScales, isLocked]);
  const [brandLocked, setBrandLocked] = useState<Set<string>>(new Set());

  // Neutral
  const [neutralBase, setNeutralBase] = useState("#64748b");
  const [neutralShades, setNeutralShades] = useState(generateShades("#64748b"));

  // Status
  const [statusColors, setStatusColors] = useState(
    STATUS_COLORS.map((s) => ({ ...s, shades: generateShades(s.hex) }))
  );

  // Fonts
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const resolvedPrimaryFont = isLocked ? finalizedFont : primaryFont;
  const [fontSearch, setFontSearch] = useState("");
  const [fontsLoading, setFontsLoading] = useState(false);
  const fontLoadedRef = useRef(false);

  // Load Google Fonts once when Fonts tab opens
  useEffect(() => {
    if (activeTab !== "fonts" || fontLoadedRef.current) return;
    fontLoadedRef.current = true;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_KEY;
    if (!apiKey) {
      setFonts(FALLBACK_FONTS);
      return;
    }

    setFontsLoading(true);
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`
    )
      .then((r) => r.json())
      .then((data) => {
        const items: GoogleFont[] = (data.items || [])
          .slice(0, 40)
          .map((f: any) => ({
            family: f.family,
            category: f.category,
            variants: f.variants,
          }));
        setFonts(items);
        // Inject link tag for preview
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?${items.map((f) => `family=${encodeURIComponent(f.family)}:wght@400;700`).join("&")}&display=swap`;
        document.head.appendChild(link);
      })
      .catch(() => setFonts(FALLBACK_FONTS))
      .finally(() => setFontsLoading(false));
  }, [activeTab]);

  // Also load fallback for preview
  useEffect(() => {
    if (fonts.length > 0) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${FALLBACK_FONTS.map((f) => `family=${encodeURIComponent(f.family)}:wght@400;700`).join("&")}&display=swap`;
    document.head.appendChild(link);
    if (!fontLoadedRef.current) setFonts(FALLBACK_FONTS);
  }, []);

  // ── Brand tab helpers ────────────────────────────────────────────────────
  const updateBrandBase = (id: string, hex: string) => {
    setBrandScales((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, base: hex, shades: generateShades(hex) } : s
      );
      return next;
    });
  };

  const addBrandSecondary = () => {
    const hex = randomHex();
    setBrandScales((prev) => [
      ...prev,
      {
        id: `secondary-${Date.now()}`,
        label: "Secondary",
        base: hex,
        shades: generateShades(hex),
      },
    ]);
  };

  const removeBrandScale = (id: string) =>
    setBrandScales((prev) => prev.filter((s) => s.id !== id));

  const randomiseAll = () => {
    setBrandScales((prev) => {
      const next = prev.map((s) =>
        brandLocked.has(s.id)
          ? s
          : { ...s, base: randomHex(), shades: generateShades(randomHex()) }
      );
      return next;
    });
  };

  // ── Neutral ──────────────────────────────────────────────────────────────
  const updateNeutral = (hex: string) => {
    setNeutralBase(hex);
    setNeutralShades(generateShades(hex));
  };

  // ── Status ───────────────────────────────────────────────────────────────
  const updateStatus = (id: string, hex: string) => {
    setStatusColors((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, hex, shades: generateShades(hex) } : s
      )
    );
  };

  const filteredFonts = fonts.filter((f) =>
    f.family.toLowerCase().includes(fontSearch.toLowerCase())
  );

  const categoryBadgeColor: Record<string, string> = {
    "sans-serif": "bg-blue-500/10 text-blue-400",
    serif: "bg-amber-500/10 text-amber-400",
    monospace: "bg-green-500/10 text-green-400",
    display: "bg-purple-500/10 text-purple-400",
    handwriting: "bg-pink-500/10 text-pink-400",
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Mode + Tab row */}
      <div className='flex items-center justify-between'>
        <div className='bg-muted/40 border-border flex items-center rounded-xl border p-1 text-xs font-semibold tracking-wide uppercase'>
          {(["auto", "custom"] as const).map((m) => {
            const active = generationMode === m;

            return (
              <button
                key={m}
                onClick={() => !isLocked && setGenerationMode(m)}
                disabled={isLocked}
                className={cn(
                  "relative flex-1 rounded-lg px-4 py-1.5 transition-all duration-200",
                  "focus:outline-none",
                  active
                    ? "bg-indigo-600 hover:bg-indigo-700 text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {m}
              </button>
            );
          })}
        </div>

        <div className='relative flex items-center gap-4'>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative pb-0.5 text-[11px] font-medium transition-colors",
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/70"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId='color-tab-indicator'
                  className='bg-indigo-600 hover:bg-indigo-700 absolute inset-x-0 -bottom-0.5 h-px'
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode='wait'>
        {generationMode === "auto" ? (
          <motion.p
            key='auto'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='text-muted-foreground/50 py-2 text-center text-[11px] italic'
          >
            AI will select the optimal palette automatically.
          </motion.p>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className='space-y-3'
          >
            {/* ── Brand ── */}
            {activeTab === "brand" && (
              <div className='space-y-3'>
                {brandScales.map((scale, idx) => (
                  <div key={scale.id} className='space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-[10px] font-medium'>
                        {scale.label}
                      </span>
                    </div>
                    <HexInput
                      value={scale.base}
                      locked={brandLocked.has(scale.id)}
                      onLockToggle={() =>
                        setBrandLocked((prev) => {
                          const n = new Set(prev);
                          n.has(scale.id)
                            ? n.delete(scale.id)
                            : n.add(scale.id);
                          return n;
                        })
                      }
                      onChange={(hex) =>
                        !isLocked && updateBrandBase(scale.id, hex)
                      }
                      showRemove={idx > 0 && !isLocked}
                      onRemove={() => !isLocked && removeBrandScale(scale.id)}
                    />
                    <ColorShadeScale
                      shades={scale.shades}
                      defaultSelected={600}
                      onSelect={(_, hex) => {
                        if (!isLocked) updateBrandBase(scale.id, hex);
                      }}
                    />
                  </div>
                ))}

                {brandScales.length < 3 && !isLocked && (
                  <button
                    onClick={addBrandSecondary}
                    className='text-muted-foreground hover:text-foreground flex h-8 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 text-[10px] transition-all hover:border-white/20'
                  >
                    <Plus className='h-3 w-3' /> Add secondary scale
                  </button>
                )}
                {!isLocked && (
                  <button
                    onClick={randomiseAll}
                    className='text-muted-foreground hover:text-foreground group flex h-8 w-full items-center justify-center gap-2 rounded-xl border border-white/5 text-[10px] transition-all hover:border-white/10 hover:bg-white/5'
                  >
                    <RefreshCw className='h-3 w-3 transition-transform duration-500 group-hover:rotate-180' />{" "}
                    Randomise colors
                  </button>
                )}
              </div>
            )}

            {/* ── Neutral ── */}
            {activeTab === "neutral" && (
              <div className='space-y-1.5'>
                <span className='text-muted-foreground text-[10px] font-medium'>
                  Base Grey
                </span>
                <HexInput
                  value={neutralBase}
                  locked={false}
                  onLockToggle={() => {}}
                  onChange={updateNeutral}
                />
                <ColorShadeScale shades={neutralShades} defaultSelected={500} />
              </div>
            )}

            {/* ── Status ── */}
            {activeTab === "status" && (
              <div className='space-y-3'>
                {statusColors.map((s) => (
                  <div key={s.id} className='space-y-1.5'>
                    <span className='text-muted-foreground text-[10px] font-medium'>
                      {s.label}
                    </span>
                    <HexInput
                      value={s.hex}
                      locked={false}
                      onLockToggle={() => {}}
                      onChange={(hex) => updateStatus(s.id, hex)}
                    />
                    <ColorShadeScale shades={s.shades} defaultSelected={500} />
                  </div>
                ))}
              </div>
            )}

            {/* ── Fonts ── */}
            {activeTab === "fonts" && (
              <div className='space-y-2'>
                <div className='flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 transition-colors focus-within:border-white/25'>
                  <Search className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
                  <input
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    placeholder='Search fonts…'
                    disabled={isLocked}
                    className='text-foreground placeholder:text-muted-foreground/50 flex-1 border-none bg-transparent text-sm outline-none'
                  />
                </div>

                {fontsLoading ? (
                  <div className='text-muted-foreground/40 flex items-center justify-center py-6 text-xs'>
                    Loading fonts…
                  </div>
                ) : (
                  <div className='custom-scrollbar grid max-h-52 grid-cols-2 gap-1.5 overflow-y-auto pr-1'>
                    {filteredFonts.map((font) => {
                      const isSelected = resolvedPrimaryFont === font.family;
                      return (
                        <button
                          key={font.family}
                          disabled={isLocked}
                          onClick={() =>
                            !isLocked &&
                            setPrimaryFont(isSelected ? null : font.family)
                          }
                          className={cn(
                            "group relative rounded-xl border p-2.5 text-left transition-all duration-200",
                            isSelected
                              ? "border-primary/50 bg-indigo-600 hover:bg-indigo-700/5"
                              : "border-white/8 bg-white/[0.02] hover:border-white/20"
                          )}
                        >
                          {isSelected && (
                            <span className='absolute top-2 right-2'>
                              <Check className='text-primary h-3 w-3' />
                            </span>
                          )}
                          <p
                            className='text-foreground truncate text-sm leading-tight'
                            style={{
                              fontFamily: `"${font.family}", ${font.category}`,
                            }}
                          >
                            {font.family}
                          </p>
                          <span
                            className={cn(
                              "mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-medium tracking-wider uppercase",
                              categoryBadgeColor[font.category] ||
                                "text-muted-foreground bg-white/5"
                            )}
                          >
                            {font.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {resolvedPrimaryFont && (
                  <p className='text-primary/70 text-center text-[10px]'>
                    Selected:{" "}
                    <span
                      className='font-semibold'
                      style={{ fontFamily: `"${resolvedPrimaryFont}"` }}
                    >
                      {resolvedPrimaryFont}
                    </span>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
