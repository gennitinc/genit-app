"use client";

import {
  FacebookBrand,
  InstagramBrand,
  LinkedinBrand,
  XBrand,
  YoutubeBrand,
} from "./social-icons";
import { BrandData, SocialPlatform, SocialUrls } from "./types";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import {
  ArrowRight,
  Camera,
  Globe,
  Link2,
  Loader2,
  Palette,
  Plus,
  ShieldCheck,
  Upload,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import { useCallback, useMemo, useRef, useState } from "react";

interface StepImportProps {
  onComplete: (brand: BrandData) => void;
  onSkip?: () => void;
  isSkipping?: boolean;
}

const LOADING_MESSAGES = [
  "Fetching your site...",
  "Taking a screenshot...",
  "Reading meta tags & OG image...",
  "Visiting your about / pricing pages...",
  "Extracting dominant brand colors...",
  "Pulling fonts & tone of voice...",
  "Drafting your brand DNA with AI...",
  "Almost ready...",
];

function Karaoke({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className='onb-karaoke'>
      {words.map((w, i) => (
        <span
          key={i}
          className='onb-word'
          style={{ animationDelay: `${0.15 + i * 0.06}s` }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

export function StepImport({
  onComplete,
  onSkip,
  isSkipping,
}: StepImportProps) {
  const [mode, setMode] = useState<"import" | "manual">("import");
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  const handleImport = useCallback(async () => {
    if (!url.trim()) {
      toast.error("Enter a website or social link");
      return;
    }
    setIsImporting(true);
    setLoadingMessage(LOADING_MESSAGES[0]);

    const interval = setInterval(() => {
      setLoadingMessage((prev) => {
        const idx = LOADING_MESSAGES.indexOf(prev);
        return LOADING_MESSAGES[Math.min(idx + 1, LOADING_MESSAGES.length - 1)];
      });
    }, 3500);

    try {
      const { data } = await apiResponse.post(
        "/auth/onboarding/extract-brand",
        {
          url: url.trim(),
        }
      );
      clearInterval(interval);
      if (!data?.success || !data?.brand) {
        throw new Error(data?.message || "Failed to import brand");
      }
      onComplete(data.brand as BrandData);
    } catch (err: any) {
      clearInterval(interval);
      console.error("Import failed", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not import that site. Try another URL or add manually."
      );
      setIsImporting(false);
    }
  }, [url, onComplete]);

  if (isImporting) {
    return <ImportingState message={loadingMessage} />;
  }

  if (mode === "manual") {
    return (
      <ManualSetup onComplete={onComplete} onBack={() => setMode("import")} />
    );
  }

  return (
    <div className='mx-auto w-full max-w-5xl px-4 pt-10 pb-16 sm:px-6 lg:px-8'>
      {/* Hero */}
      <div className='text-center'>
        <h1 className='onb-animate-in onb-stagger-1 mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:mt-14 dark:text-white'>
          <Karaoke text="Let's import your brand" />
        </h1>
        <p className='onb-animate-in onb-stagger-2 mx-auto mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base dark:text-neutral-300'>
          <Karaoke text="Paste a website or a social profile. We'll screenshot, sample colors, and draft your brand DNA in seconds." />
        </p>
      </div>

      {/* Source icons row */}
      <div className='onb-animate-in onb-stagger-3 mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6'>
        <SourceIcon icon={<Globe className='h-5 w-5' />} label='Website' />
        <SourceIcon
          icon={<FacebookBrand className='h-7 w-7' />}
          label='Facebook'
          branded
        />
        <SourceIcon
          icon={<InstagramBrand className='h-7 w-7' />}
          label='Instagram'
          branded
        />
        <SourceIcon
          icon={<LinkedinBrand className='h-7 w-7' />}
          label='LinkedIn'
          branded
        />
        <SourceIcon
          icon={<YoutubeBrand className='h-7 w-7' />}
          label='YouTube'
          branded
        />
        <SourceIcon
          icon={<XBrand className='h-5 w-5 text-neutral-900 dark:text-white' />}
          label='X'
        />
      </div>

      {/* Connection visual */}
      <ConnectionVisual />

      {/* URL input */}
      <div className='onb-animate-in onb-stagger-4 mx-auto mt-6 max-w-xl'>
        <div className='relative'>
          <Link2 className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-500 dark:text-neutral-400' />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder='yoursite.com  ·  instagram.com/yourbrand  ·  linkedin.com/in/you'
            className='focus-visible:border-neutral h-14 rounded-lg border-neutral-200 bg-white pr-32 pl-12 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-transparent dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500'
            onKeyDown={(e) => {
              if (e.key === "Enter") handleImport();
            }}
          />
          <Button
            onClick={handleImport}
            disabled={!url.trim()}
            className='absolute top-1/2 right-2 h-10 -translate-y-1/2 rounded-xl bg-indigo-600 font-medium text-neutral-900 hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 disabled:bg-neutral-200 disabled:text-neutral-500 dark:text-neutral-400 dark:text-white dark:disabled:bg-white/10'
          >
            Import
            <ArrowRight className='ml-1 h-4 w-4' />
          </Button>
        </div>

        <div className='my-7 flex items-center gap-4'>
          <div className='h-px flex-1 bg-neutral-200 dark:bg-white/10' />
          <span className='text-xs tracking-widest text-neutral-500 uppercase dark:text-neutral-400'>
            Or
          </span>
          <div className='h-px flex-1 bg-neutral-200 dark:bg-white/10' />
        </div>

        <div className='flex w-full flex-col items-center gap-3'>
          <button
            onClick={() => setMode("manual")}
            className='mx-auto inline-flex h-14 w-fit items-center justify-center gap-2 rounded-2xl border border-dashed border-cyan-300/30 px-4 text-base text-neutral-500 transition-colors hover:bg-cyan-400/10 dark:text-neutral-400'
          >
            <Plus className='h-5 w-5' />
            Add brand manually
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              disabled={isSkipping}
              className='inline-flex items-center justify-center gap-1.5 text-sm text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline disabled:opacity-50 dark:text-neutral-400 dark:text-white'
            >
              {isSkipping ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Skipping...
                </>
              ) : (
                "Skip for now"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Feature row */}
      {/* <div className='onb-animate-in onb-stagger-5 mx-auto mt-12 max-w-4xl'>
        <div className='flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-600 dark:text-neutral-300'>
          <Feature
            icon={<Camera className='h-4 w-4 text-neutral-500 dark:text-neutral-400' />}
            label='Live screenshot'
          />
          <Divider />
          <Feature
            icon={<Palette className='h-4 w-4 text-neutral-500 dark:text-neutral-400' />}
            label='Real brand colors'
          />
          <Divider />
          <Feature
            icon={<Workflow className='h-4 w-4 text-neutral-500 dark:text-neutral-400' />}
            label='Multi-page scan'
          />
          <Divider />
          <Feature
            icon={<ShieldCheck className='h-4 w-4 text-neutral-500 dark:text-neutral-400' />}
            label='Private & secure'
          />
        </div>
      </div> */}
    </div>
  );
}

function SourceIcon({
  icon,
  label,
  branded,
}: {
  icon: React.ReactNode;
  label: string;
  branded?: boolean;
}) {
  return (
    <div className='flex flex-col items-center gap-1.5'>
      <span
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center overflow-hidden text-neutral-900 dark:text-white",
          branded
            ? "rounded-lg ring-1 ring-white/10"
            : "rounded-lg bg-neutral-100 ring-1 ring-white/10 dark:bg-white/5"
        )}
      >
        {icon}
      </span>
      <span className='text-[10px] tracking-wider text-neutral-500 uppercase dark:text-neutral-400'>
        {label}
      </span>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className='inline-flex items-center gap-2'>
      {icon}
      <span className='font-medium text-neutral-600 dark:text-neutral-300'>
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div className='hidden h-px w-20 border-t border-dashed border-neutral-300/30 sm:block' />
  );
}

function ConnectionVisual() {
  return (
    <div className='onb-animate-in onb-stagger-3 relative mx-auto mt-6 h-36 w-full max-w-3xl'>
      <svg
        viewBox='0 0 900 300'
        className='absolute inset-0 h-full w-full'
        fill='none'
        aria-hidden
      >
        <defs>
          <filter id='onb-glow' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur stdDeviation='3' result='blur' />
            <feMerge>
              <feMergeNode in='blur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>
        {[150, 270, 390, 510, 630, 750].map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy={30}
            r={4}
            fill='#22D3EE'
            filter='url(#onb-glow)'
          >
            <animate
              attributeName='opacity'
              values='0.5;1;0.5'
              dur='2s'
              begin={`${i * 0.2}s`}
              repeatCount='indefinite'
            />
          </circle>
        ))}
        {[
          { d: "M450 270 C 450 180, 300 110, 150 30", len: 600, begin: 0 },
          { d: "M450 270 C 450 200, 360 120, 270 30", len: 520, begin: 0.2 },
          { d: "M450 270 C 450 140, 420 80, 390 30", len: 420, begin: 0.4 },
          { d: "M450 270 C 450 140, 480 80, 510 30", len: 420, begin: 0.6 },
          { d: "M450 270 C 450 200, 540 120, 630 30", len: 520, begin: 0.8 },
          { d: "M450 270 C 450 180, 600 110, 750 30", len: 600, begin: 1 },
        ].map((p, i) => (
          <path
            key={i}
            d={p.d}
            stroke='#22D3EE'
            strokeWidth={2}
            strokeLinecap='round'
            fill='none'
            style={{ strokeDasharray: p.len, strokeDashoffset: p.len }}
          >
            <animate
              attributeName='stroke-dashoffset'
              values={`${p.len};0;${p.len}`}
              dur='3s'
              begin={`${p.begin}s`}
              repeatCount='indefinite'
              calcMode='spline'
              keySplines='0.42 0 0.58 1; 0.42 0 0.58 1'
            />
          </path>
        ))}
      </svg>
      <div className='absolute bottom-0 left-1/2 -translate-x-1/2'>
        <div className='inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-neutral-900'>
          <Logo className='h-12 w-12 flex-shrink-0' />
        </div>
      </div>
    </div>
  );
}

function ImportingState({ message }: { message: string }) {
  return (
    <div className='mx-auto w-full max-w-3xl px-4 pt-16 pb-24'>
      <div className='text-center'>
        <h2 className='mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:mt-16 dark:text-white'>
          Reading your brand
        </h2>
        <p className='mt-3 min-h-[1.5rem] text-neutral-600 transition-all dark:text-neutral-300'>
          {message}
        </p>
      </div>

      <div className='relative mx-auto mt-12 flex h-56 items-center justify-center'>
        <div className='onb-radar'>
          <span />
        </div>
      </div>
    </div>
  );
}

function ManualSetup({
  onComplete,
  onBack,
}: {
  onComplete: (brand: BrandData) => void;
  onBack: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [socials, setSocials] = useState<SocialUrls>({});

  // If user has no website, we require at least one social URL.
  const hasAnyContact = useMemo(
    () =>
      website.trim() !== "" || Object.values(socials).some((v) => !!v?.trim()),
    [website, socials]
  );

  const handleLogoSelect = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be under 5MB");
      return;
    }
    setLogoPreview(URL.createObjectURL(file));
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("brandLogo", file);
      const { data } = await apiResponseFileUpload.post(
        "/auth/onboarding/save",
        fd
      );
      if (data?.onboarding?.brandLogo) {
        setLogoUrl(data.onboarding.brandLogo);
      }
    } catch (err) {
      console.error("Logo upload failed", err);
      toast.error("Could not upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    if (!businessName.trim()) {
      toast.error("Add a business name to continue");
      return;
    }
    if (!hasAnyContact) {
      toast.error(
        "Add a website or at least one social URL so we know where to find you"
      );
      return;
    }
    const cleanedSocials: SocialUrls = {};
    (Object.keys(socials) as SocialPlatform[]).forEach((k) => {
      const v = socials[k]?.trim();
      if (v) cleanedSocials[k] = v;
    });
    onComplete({
      companyWebsite: website.trim(),
      businessName: businessName.trim(),
      businessBio: "",
      industry: "",
      brandLogo: logoUrl,
      ogImage: "",
      brandColors: [],
      primaryColor: "",
      secondaryColor: "",
      fontHeadline: "",
      fontBody: "",
      aboutUs: "",
      mission: "",
      vision: "",
      slogan: "",
      values: [],
      voiceTone: [],
      role: "",
      hearAboutUs: "",
      socials: cleanedSocials,
    });
  };

  return (
    <div className='mx-auto w-full max-w-2xl px-4 pt-10 pb-16'>
      <div className='mb-8 text-center'>
        <h1 className='onb-animate-in onb-stagger-1 mt-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl lg:mt-16 dark:text-white'>
          <Karaoke text='Tell us about your brand' />
        </h1>
        <p className='onb-animate-in onb-stagger-2 mt-3 text-sm text-neutral-600 sm:text-base dark:text-neutral-300'>
          No website yet? No problem — just add your socials.
        </p>
      </div>

      <div className='onb-animate-in onb-stagger-3 space-y-6'>
        {/* Logo */}
        <div>
          <Label className='mb-2 block text-neutral-600 dark:text-neutral-300'>
            Your Logo
          </Label>
          <button
            type='button'
            onClick={() => fileRef.current?.click()}
            className='relative flex aspect-[3/1] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 transition-colors hover:border-cyan-300/60 hover:bg-cyan-400/5 dark:border-white/15'
          >
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt='logo preview'
                className='max-h-full max-w-full object-contain'
              />
            ) : (
              <>
                <div className='flex size-12 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-300/20'>
                  <Upload className='size-5 text-neutral-500 dark:text-neutral-400' />
                </div>
                <p className='font-medium text-neutral-900 dark:text-white'>
                  Upload your logo
                </p>
                <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                  PNG, SVG, JPG &middot; max 5MB
                </p>
              </>
            )}
            {isUploading && (
              <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-white backdrop-blur-sm dark:bg-neutral-950/60'>
                <Loader2 className='size-6 animate-spin text-neutral-500 dark:text-neutral-400' />
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            type='file'
            accept='image/png,image/jpeg,image/svg+xml,image/webp'
            className='hidden'
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleLogoSelect(f);
            }}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <DarkField
            label='Business name'
            value={businessName}
            onChange={setBusinessName}
            placeholder='Your brand name'
          />
          <DarkField
            label='Website (optional)'
            value={website}
            onChange={setWebsite}
            placeholder='https://'
            icon={
              <Globe className='h-4 w-4 text-neutral-500 dark:text-neutral-400' />
            }
          />
        </div>

        {/* Social URLs */}
        <div>
          <div className='mb-3 flex items-center justify-between'>
            <Label className='text-neutral-600 dark:text-neutral-300'>
              Social profiles{" "}
              <span className='text-neutral-500 dark:text-neutral-400'>
                (any one if you don&apos;t have a website)
              </span>
            </Label>
          </div>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            {(
              [
                {
                  key: "facebook",
                  label: "Facebook",
                  icon: <FacebookBrand className='h-5 w-5' />,
                  color: "#0866FF",
                  placeholder: "facebook.com/yourpage",
                },
                {
                  key: "instagram",
                  label: "Instagram",
                  icon: <InstagramBrand className='h-5 w-5' />,
                  color: "#E4405F",
                  placeholder: "instagram.com/yourbrand",
                },
                {
                  key: "linkedin",
                  label: "LinkedIn",
                  icon: <LinkedinBrand className='h-5 w-5' />,
                  color: "#0A66C2",
                  placeholder: "linkedin.com/company/...",
                },
                {
                  key: "youtube",
                  label: "YouTube",
                  icon: <YoutubeBrand className='h-5 w-5' />,
                  color: "#FF0000",
                  placeholder: "youtube.com/@yourchannel",
                },
                {
                  key: "twitter",
                  label: "X / Twitter",
                  icon: <XBrand className='h-4 w-4' />,
                  color: "#ffffff",
                  placeholder: "x.com/yourhandle",
                },
              ] as const
            ).map((s) => (
              <SocialField
                key={s.key}
                label={s.label}
                icon={s.icon}
                color={s.color}
                placeholder={s.placeholder}
                value={socials[s.key] || ""}
                onChange={(v) =>
                  setSocials((prev) => ({ ...prev, [s.key]: v }))
                }
              />
            ))}
          </div>
        </div>

        <div className='flex gap-3 pt-4'>
          <Button
            variant='ghost'
            onClick={onBack}
            className='flex-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:text-white dark:hover:bg-white/5'
          >
            ← Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isUploading}
            className='flex-1 bg-indigo-600 font-medium text-neutral-900 hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90 disabled:bg-neutral-200 disabled:text-neutral-500 dark:text-neutral-400 dark:text-white dark:disabled:bg-white/10'
          >
            Continue
            <ArrowRight className='ml-1 h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DarkField({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <Label className='mb-2 block text-neutral-600 dark:text-neutral-300'>
        {label}
      </Label>
      <div className='relative'>
        {icon && (
          <span className='absolute top-1/2 left-3 -translate-y-1/2'>
            {icon}
          </span>
        )}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-12 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-cyan-400/40 focus-visible:ring-cyan-400/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500",
            icon ? "pl-9" : ""
          )}
        />
      </div>
    </div>
  );
}

function SocialField({
  label,
  icon,
  color,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className='mb-1.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400'>
        <span style={{ color }}>{icon}</span>
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='h-11 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-cyan-400/40 focus-visible:ring-cyan-400/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-500 dark:text-white dark:placeholder:text-neutral-500'
      />
    </div>
  );
}
