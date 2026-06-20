"use client";

import {
  FacebookBrand,
  InstagramBrand,
  LinkedinBrand,
  XBrand,
  YoutubeBrand,
} from "./social-icons";
import { BrandData, SocialPlatform } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import { ArrowRight, ImageIcon, Plus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";

interface StepBrandDnaProps {
  brand: BrandData;
  onChange: (patch: Partial<BrandData>) => void;
  onContinue: () => void;
  onBack: () => void;
}

const FONT_OPTIONS = [
  "Inter",
  "Montserrat",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Lato",
  "Playfair Display",
  "Merriweather",
  "Raleway",
  "Nunito",
];

const SOCIAL_META: Record<
  SocialPlatform,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{
      className?: string;
      style?: React.CSSProperties;
    }>;
    placeholder: string;
  }
> = {
  facebook: {
    label: "Facebook",
    color: "#0866FF",
    icon: FacebookBrand,
    placeholder: "facebook.com/yourpage",
  },
  instagram: {
    label: "Instagram",
    color: "#E4405F",
    icon: InstagramBrand,
    placeholder: "instagram.com/yourbrand",
  },
  linkedin: {
    label: "LinkedIn",
    color: "#0A66C2",
    icon: LinkedinBrand,
    placeholder: "linkedin.com/company/...",
  },
  youtube: {
    label: "YouTube",
    color: "#FF0000",
    icon: YoutubeBrand,
    placeholder: "youtube.com/@yourchannel",
  },
  twitter: {
    label: "X / Twitter",
    color: "#ffffff",
    icon: XBrand,
    placeholder: "x.com/yourhandle",
  },
  tiktok: {
    label: "TikTok",
    color: "#ffffff",
    icon: Sparkles,
    placeholder: "tiktok.com/@you",
  },
};

export function StepBrandDna({
  brand,
  onChange,
  onContinue,
  onBack,
}: StepBrandDnaProps) {
  const logoRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be under 5MB");
      return;
    }
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("brandLogo", file);
      const { data } = await apiResponseFileUpload.post(
        "/auth/onboarding/save",
        fd
      );
      if (data?.onboarding?.brandLogo) {
        onChange({ brandLogo: data.onboarding.brandLogo });
      }
    } catch {
      toast.error("Could not upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const colors =
    brand.brandColors && brand.brandColors.length > 0
      ? brand.brandColors
      : [brand.primaryColor, brand.secondaryColor].filter(Boolean);

  const setColorAt = (idx: number, value: string) => {
    const next = [...colors];
    next[idx] = value;
    onChange({
      brandColors: next,
      primaryColor: next[0] || brand.primaryColor,
      secondaryColor: next[1] || brand.secondaryColor,
    });
  };

  const addColor = () => {
    if (colors.length >= 6) return;
    const next = [...colors, "#22D3EE"];
    onChange({ brandColors: next });
  };

  const removeColor = (idx: number) => {
    const next = colors.filter((_, i) => i !== idx);
    onChange({
      brandColors: next,
      primaryColor: next[0] || "",
      secondaryColor: next[1] || "",
    });
  };

  const updateSocial = (platform: SocialPlatform, url: string) => {
    onChange({
      socials: {
        ...brand.socials,
        [platform]: url,
      },
    });
  };

  return (
    <div className='mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6 lg:px-8'>
      <div className='mb-8 text-center'>
        <h1 className='onb-animate-in onb-stagger-1 mt-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl lg:mt-16 dark:text-white'>
          Your brand, distilled
        </h1>

        <p className='onb-animate-in onb-stagger-2 mt-2 text-sm text-neutral-600 sm:text-base dark:text-neutral-300'>
          Review and tweak anything that doesn&apos;t feel right.
        </p>

        <div className='mt-8 flex justify-center gap-3'>
          <Button
            variant='ghost'
            onClick={onBack}
            className='text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:text-white dark:hover:bg-white/5'
          >
            ← Back
          </Button>

          <Button
            onClick={onContinue}
            className='bg-indigo-600 font-medium text-white hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 md:px-10'
          >
            Save &amp; Continue
            <ArrowRight className='ml-1 size-4' />
          </Button>
        </div>
      </div>

      {/* Header / source preview */}
      <div className='onb-animate-in onb-stagger-2 mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 md:p-6 dark:border-white/10 dark:bg-white/[0.03]'>
        <div className='flex flex-col items-start gap-6 md:flex-row'>
          <button
            type='button'
            onClick={() => logoRef.current?.click()}
            className='flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition-colors hover:border-cyan-300/50 md:size-32 dark:border-white/15 dark:bg-white/[0.02]'
          >
            {brand.brandLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.brandLogo}
                alt='logo'
                className='max-h-full max-w-full rounded-md bg-white object-contain p-2'
              />
            ) : (
              <div className='flex flex-col items-center gap-1 text-neutral-500'>
                <ImageIcon className='size-6' />
                <span className='text-xs'>Upload logo</span>
              </div>
            )}
          </button>
          <input
            ref={logoRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleLogoUpload(f);
            }}
          />
          <div className='w-full min-w-0 flex-1 space-y-3'>
            <Input
              value={brand.businessName}
              onChange={(e) => onChange({ businessName: e.target.value })}
              placeholder='Brand name'
              className='h-12 border-0 bg-transparent px-2 text-2xl font-semibold text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-0 md:px-4 lg:px-6 dark:text-white dark:placeholder:text-neutral-500'
            />
            <Input
              value={brand.companyWebsite}
              onChange={(e) => onChange({ companyWebsite: e.target.value })}
              placeholder='https://yoursite.com'
              className='h-9 border-0 bg-transparent px-2 text-neutral-500 shadow-none placeholder:text-neutral-400 focus-visible:ring-0 md:px-4 lg:px-6 dark:text-neutral-400 dark:placeholder:text-neutral-600'
            />
            <Textarea
              value={brand.businessBio}
              onChange={(e) => onChange({ businessBio: e.target.value })}
              placeholder='One-line description'
              rows={2}
              className='resize-none border-0 bg-transparent px-2 text-neutral-800 shadow-none placeholder:text-neutral-400 focus-visible:ring-0 md:px-4 lg:px-6 dark:text-neutral-200 dark:placeholder:text-neutral-600'
            />
          </div>

          {brand.screenshot ? (
            <div className='hidden w-56 shrink-0 md:block'>
              <Label className='mb-1.5 block text-[10px] tracking-wider text-neutral-500 uppercase'>
                Source preview
              </Label>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.screenshot}
                alt='site screenshot'
                className='w-full rounded-lg border border-neutral-200 dark:border-white/10'
              />
            </div>
          ) : null}
        </div>
        {uploadingLogo && (
          <p className='mt-3 text-xs text-neutral-500'>Uploading logo…</p>
        )}
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Left column */}
        <div className='space-y-6'>
          <Card title='Fonts'>
            <div className='grid grid-cols-2 gap-3'>
              <FontSelect
                label='Headline'
                value={brand.fontHeadline}
                onChange={(v) => onChange({ fontHeadline: v })}
              />
              <FontSelect
                label='Body'
                value={brand.fontBody}
                onChange={(v) => onChange({ fontBody: v })}
              />
            </div>
          </Card>

          <Card title='About Us'>
            <Textarea
              value={brand.aboutUs}
              onChange={(e) => onChange({ aboutUs: e.target.value })}
              rows={5}
              placeholder='What does your brand do, and for whom?'
              className='border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-cyan-400/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 dark:placeholder:text-neutral-500'
            />
          </Card>

          <Card title='Values'>
            <ChipEditor
              values={brand.values}
              onChange={(values) => onChange({ values })}
              placeholder='Add a value (e.g. Integrity)'
            />
          </Card>

          <Card title='Voice Tone'>
            <NumberedList
              values={brand.voiceTone}
              onChange={(voiceTone) => onChange({ voiceTone })}
              placeholder='Add a tone word'
              max={5}
            />
          </Card>
        </div>

        {/* Right column */}
        <div className='space-y-6'>
          <Card title='Colors'>
            <div className='flex flex-wrap items-center gap-3'>
              {colors.map((c, i) => (
                <ColorSwatch
                  key={i}
                  value={c}
                  onChange={(v) => setColorAt(i, v)}
                  onRemove={() => removeColor(i)}
                />
              ))}
              {colors.length < 6 && (
                <button
                  type='button'
                  onClick={addColor}
                  className='flex size-12 items-center justify-center rounded-full border-2 border-dashed border-neutral-200 text-neutral-500 transition-colors hover:border-cyan-300/50 hover:text-cyan-700 dark:border-white/15 dark:text-cyan-300'
                >
                  <Plus className='size-4' />
                </button>
              )}
            </div>
          </Card>

          <Card title='Mission'>
            <Textarea
              value={brand.mission}
              onChange={(e) => onChange({ mission: e.target.value })}
              rows={3}
              placeholder='One sentence — what you do, now.'
              className='border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-cyan-400/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 dark:placeholder:text-neutral-500'
            />
          </Card>

          <Card title='Vision'>
            <Textarea
              value={brand.vision}
              onChange={(e) => onChange({ vision: e.target.value })}
              rows={3}
              placeholder="One sentence — where you're going."
              className='border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-cyan-400/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 dark:placeholder:text-neutral-500'
            />
          </Card>

          <Card title='Slogan'>
            <Input
              value={brand.slogan}
              onChange={(e) => onChange({ slogan: e.target.value })}
              placeholder='A short tagline'
              className='h-11 border-neutral-200 bg-white text-neutral-900 italic placeholder:text-neutral-400 focus-visible:ring-cyan-400/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 dark:placeholder:text-neutral-500'
            />
          </Card>

          <Card title='Social profiles'>
            <div className='grid grid-cols-1 gap-2.5'>
              {(Object.keys(SOCIAL_META) as SocialPlatform[]).map((key) => {
                const meta = SOCIAL_META[key];
                const Icon = meta.icon;
                return (
                  <div key={key} className='relative'>
                    <Icon
                      className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2'
                      style={{ color: meta.color }}
                    />
                    <Input
                      value={brand.socials?.[key] || ""}
                      onChange={(e) => updateSocial(key, e.target.value)}
                      placeholder={meta.placeholder}
                      className='h-11 border-neutral-200 bg-white pl-10 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-cyan-400/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-neutral-600'
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-white/10 dark:bg-white/[0.03]'>
      <Label className='mb-3 block text-[10px] tracking-widest text-neutral-500 uppercase dark:text-neutral-400'>
        {title}
      </Label>
      {children}
    </div>
  );
}

function FontSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const options =
    value && !FONT_OPTIONS.includes(value)
      ? [value, ...FONT_OPTIONS]
      : FONT_OPTIONS;
  return (
    <div>
      <Label className='mb-1 block text-xs text-neutral-500'>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:ring-2 focus:ring-cyan-400/40 focus:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
        style={{ fontFamily: value || "inherit" }}
      >
        <option value='' className='bg-white dark:bg-neutral-900'>
          Select font
        </option>
        {options.map((f) => (
          <option
            key={f}
            value={f}
            style={{ fontFamily: f }}
            className='bg-white dark:bg-neutral-900'
          >
            {f}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorSwatch({
  value,
  onChange,
  onRemove,
}: {
  value: string;
  onChange: (v: string) => void;
  onRemove?: () => void;
}) {
  return (
    <div className='group relative flex flex-col items-center gap-1'>
      <label
        className='relative size-12 cursor-pointer overflow-hidden rounded-full border border-neutral-200 dark:border-white/15'
        style={{ backgroundColor: value || "#444" }}
      >
        <input
          type='color'
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className='absolute inset-0 cursor-pointer opacity-0'
        />
      </label>
      {onRemove && (
        <button
          type='button'
          onClick={onRemove}
          className='absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-neutral-200 opacity-0 ring-1 ring-white/10 transition-opacity group-hover:opacity-100 dark:bg-neutral-800'
        >
          <X className='size-2.5 text-neutral-600 dark:text-neutral-300' />
        </button>
      )}
      <span className='font-mono text-[10px] text-neutral-500 uppercase'>
        {value || "—"}
      </span>
    </div>
  );
}

function ChipEditor({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (values.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...values, v]);
    setDraft("");
  };
  return (
    <div>
      <div className='mb-3 flex flex-wrap gap-2'>
        {values.map((v, i) => (
          <span
            key={`${v}-${i}`}
            className='inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200'
          >
            {v}
            <button
              type='button'
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className='hover:text-red-400'
            >
              <X className='size-3' />
            </button>
          </span>
        ))}
      </div>
      <div className='flex gap-2'>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className='h-10 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-cyan-400/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-neutral-500'
        />
        <Button
          type='button'
          variant='outline'
          onClick={add}
          className='h-10 border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-200 hover:text-neutral-900 dark:border-white/15 dark:bg-white/10 dark:bg-white/[0.04] dark:text-white'
        >
          Add
        </Button>
      </div>
    </div>
  );
}

function NumberedList({
  values,
  onChange,
  placeholder,
  max = 5,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  max?: number;
}) {
  return (
    <div className='space-y-2'>
      {values.map((v, i) => (
        <div key={i} className='flex items-center gap-2'>
          <span className='w-5 text-sm text-neutral-500'>{i + 1}.</span>
          <Input
            value={v}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
            className='h-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-cyan-400/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-neutral-500'
          />
          <button
            type='button'
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            className='text-neutral-500 hover:text-red-400'
          >
            <X className='size-4' />
          </button>
        </div>
      ))}
      {values.length < max && (
        <button
          type='button'
          onClick={() => onChange([...values, ""])}
          className='inline-flex items-center gap-1 text-sm text-cyan-700 hover:underline dark:text-cyan-300'
        >
          <Plus className='size-3' /> {placeholder}
        </button>
      )}
    </div>
  );
}
