"use client";

import { BrandOnboardingDialog } from "./brand-onboarding-dialog";
import { LocalizedText } from "@/components/localized-text";
import { Switch } from "@/components/ui/switch";
import { Organization, useUserContext } from "@/context/AuthenticatedContext";
import { ProjectDesignContext } from "@/context/DesignProject";
import { cn } from "@/lib/utils";
import { Download, Gauge, Sparkles } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "genit:brandIdentityEnabled";
const COST_MODE_STORAGE_KEY = "genit:chatCostMode";

export type ChatCostMode = "economy" | "balanced" | "quality";

export function useBrandIdentityEnabled() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setEnabled(stored === "true");

    const storageListener = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setEnabled(e.newValue === "true");
      }
    };
    window.addEventListener("storage", storageListener);

    const customListener = (e: Event) => {
      const customEvent = e as CustomEvent;
      setEnabled(customEvent.detail === "true");
    };
    window.addEventListener(STORAGE_KEY, customListener);

    return () => {
      window.removeEventListener("storage", storageListener);
      window.removeEventListener(STORAGE_KEY, customListener);
    };
  }, []);

  const update = (next: boolean) => {
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    window.dispatchEvent(
      new CustomEvent(STORAGE_KEY, { detail: String(next) })
    );
  };

  return [enabled, update] as const;
}

export function useChatCostMode() {
  const [mode, setMode] = useState<ChatCostMode>("economy");

  useEffect(() => {
    const stored = localStorage.getItem(COST_MODE_STORAGE_KEY);
    if (stored === "economy" || stored === "balanced" || stored === "quality") {
      setMode(stored);
    }
  }, []);

  const update = (next: ChatCostMode) => {
    setMode(next);
    localStorage.setItem(COST_MODE_STORAGE_KEY, next);
  };

  return [mode, update] as const;
}

type BrandView = {
  businessName?: string;
  brandLogo?: string;
  businessBio?: string;
  industry?: string;
  brandColors?: string[];
  slogan?: string;
  voiceTone?: string[];
  mission?: string;
  vision?: string;
  aboutUs?: string;
  values?: string[];
};

export function BrandIdentityPanel({ disabled }: { disabled?: boolean } = {}) {
  const { user } = useUserContext();
  const projectContext = useContext(ProjectDesignContext);
  const [localEnabled, setLocalEnabled] = useBrandIdentityEnabled();
  const [localCostMode, setLocalCostMode] = useChatCostMode();

  const enabled = projectContext
    ? projectContext.brandIdentityEnabled
    : localEnabled;
  const setEnabled = projectContext
    ? projectContext.setBrandIdentityEnabled
    : setLocalEnabled;
  const costMode = projectContext ? projectContext.chatCostMode : localCostMode;
  const setCostMode = projectContext
    ? projectContext.setChatCostMode
    : setLocalCostMode;

  const [isImportOpen, setIsImportOpen] = useState(false);

  // Prefer the current organization (the source of truth for brand);
  // fall back to onboarding data for legacy users who haven't been migrated yet.
  const o: BrandView | undefined = useMemo(() => {
    const org: Organization | null =
      user?.currentOrganization && typeof user.currentOrganization === "object"
        ? user.currentOrganization
        : user?.business && typeof user.business === "object"
          ? (user.business as Organization)
          : null;

    if (org) {
      return {
        businessName: org.businessName,
        brandLogo: org.businessLogo,
        businessBio: org.businessBio,
        industry: org.industry,
        brandColors: org.brandColors,
        slogan: org.slogan,
        voiceTone: org.voiceTone,
        mission: org.mission,
        vision: org.vision,
        aboutUs: org.aboutUs,
        values: org.values,
      };
    }

    const ob = user?.onboarding;
    if (!ob) return undefined;
    return {
      businessName: ob.businessName,
      brandLogo: ob.brandLogo,
      businessBio: ob.businessBio,
      industry: ob.industry,
      brandColors: ob.brandColors,
      slogan: ob.slogan,
      voiceTone: ob.voiceTone,
      mission: ob.mission,
      vision: ob.vision,
      aboutUs: ob.aboutUs,
      values: ob.values,
    };
  }, [user?.currentOrganization, user?.business, user?.onboarding]);

  const hasBrandData =
    !!o &&
    (!!o.businessName ||
      !!o.brandLogo ||
      !!o.aboutUs ||
      !!o.slogan ||
      !!(o.brandColors && o.brandColors.length));

  // If the panel has an active org context, re-import edits should land
  // on that org instead of the user's onboarding doc — so switching org and
  // editing the brand keeps things in sync.
  const activeOrg: Organization | null =
    user?.currentOrganization && typeof user.currentOrganization === "object"
      ? user.currentOrganization
      : user?.business && typeof user.business === "object"
        ? (user.business as Organization)
        : null;
  const hasActiveOrg = !!activeOrg;
  const dialogMode = hasActiveOrg ? "edit-org" : "user-onboarding";
  const canReimport = hasActiveOrg
    ? !!user?._id && activeOrg?.owner === user._id
    : true;

  if (!o || !hasBrandData) {
    return (
      <>
        <div className='rounded-lg border border-dashed border-neutral-300 p-4 text-center dark:border-white/10'>
          <Sparkles className='text-primary mx-auto mb-2 h-5 w-5' />
          <p className='text-foreground text-sm font-medium'>
            <LocalizedText text={"No brand identity yet"} />
          </p>
          <p className='text-muted-foreground mt-1 text-xs'>
            <LocalizedText
              text={
                "Import your brand to give genit your voice, colors, and logo."
              }
            />
          </p>
          <button
            type='button'
            onClick={() => setIsImportOpen(true)}
            className='text-primary-foreground mt-3 inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium transition-opacity hover:bg-indigo-700 hover:opacity-90'
          >
            <Download className='h-3 w-3' />
            <LocalizedText text={"Import Brand"} />
          </button>
        </div>
        <BrandOnboardingDialog
          open={isImportOpen}
          onOpenChange={setIsImportOpen}
          mode={dialogMode}
        />
      </>
    );
  }

  return (
    <div className='flex h-full min-h-0 flex-col overflow-hidden'>
      <BrandOnboardingDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        mode={dialogMode}
      />

      <div className='custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pt-4 pb-6'>
        {/* Toggle row */}
        <div className='bg-muted/40 flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-3 py-2.5 dark:border-white/10'>
          <div className='min-w-0'>
            <p className='text-foreground text-xs font-semibold'>
              <LocalizedText text={"Apply brand identity"} />
            </p>
            <p className='text-muted-foreground mt-0.5 text-[10px] leading-tight'>
              {enabled
                ? "genit will use your brand's voice, colors, and assets."
                : "Generations will ignore your brand identity."}
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            disabled={disabled}
            aria-label='Toggle brand identity'
          />
        </div>

        <div className='bg-muted/40 rounded-lg border border-neutral-200 px-3 py-2.5 dark:border-white/10'>
          <div className='mb-2 flex items-center gap-2'>
            <Gauge className='text-muted-foreground h-3.5 w-3.5' />
            <p className='text-foreground text-xs font-semibold'>
              <LocalizedText text={"AI cost mode"} />
            </p>
          </div>
          <div className='grid grid-cols-3 gap-1 rounded-md bg-white p-1 dark:bg-black/30'>
            {(
              [
                ["economy", "Economy"],
                ["balanced", "Balanced"],
                ["quality", "Quality"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type='button'
                onClick={() => setCostMode(value)}
                className={cn(
                  "h-8 rounded px-1 text-[10px] font-medium transition-colors",
                  costMode === value
                    ? "bg-indigo-600 text-white"
                    : "text-muted-foreground hover:bg-neutral-100 dark:hover:bg-white/10"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "space-y-4 transition-opacity",
            !enabled && "pointer-events-none opacity-50"
          )}
        >
          {/* Header: logo + name + bio */}
          <div className='flex items-start gap-3'>
            {o.brandLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={o.brandLogo}
                alt={o.businessName || "Brand logo"}
                className='border-border h-12 w-12 shrink-0 rounded-lg border bg-white object-contain p-1'
              />
            ) : (
              <div className='bg-muted text-muted-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-semibold'>
                {(o.businessName || "B").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className='min-w-0 flex-1'>
              {o.businessName && (
                <p className='text-foreground truncate text-sm font-semibold'>
                  {o.businessName}
                </p>
              )}
              {o.industry && (
                <p className='text-muted-foreground truncate text-[11px]'>
                  {o.industry}
                </p>
              )}
              {o.businessBio && (
                <p className='text-muted-foreground mt-1 line-clamp-2 text-[11px] leading-snug'>
                  {o.businessBio}
                </p>
              )}
            </div>
          </div>

          {/* Brand colors */}
          {!!o.brandColors?.length && (
            <Section label='Brand colors'>
              <div className='flex flex-wrap gap-1.5'>
                {o.brandColors.slice(0, 8).map((hex, i) => (
                  <div
                    key={`${hex}-${i}`}
                    className='border-border h-6 w-6 rounded-md border'
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Slogan */}
          {o.slogan && (
            <Section label='Slogan'>
              <p className='text-foreground text-xs italic'>"{o.slogan}"</p>
            </Section>
          )}

          {/* Voice & tone */}
          {!!o.voiceTone?.length && (
            <Section label='Voice & tone'>
              <div className='flex flex-wrap gap-1.5'>
                {o.voiceTone.map((tone) => (
                  <span
                    key={tone}
                    className='bg-muted text-foreground rounded-full px-2 py-0.5 text-[10px] font-medium'
                  >
                    {tone}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Mission */}
          {o.mission && (
            <Section label='Mission'>
              <p className='text-muted-foreground line-clamp-3 text-xs leading-snug'>
                {o.mission}
              </p>
            </Section>
          )}

          {/* Vision */}
          {o.vision && (
            <Section label='Vision'>
              <p className='text-muted-foreground line-clamp-3 text-xs leading-snug'>
                {o.vision}
              </p>
            </Section>
          )}

          {/* About */}
          {o.aboutUs && (
            <Section label='About'>
              <p className='text-muted-foreground line-clamp-4 text-xs leading-snug'>
                {o.aboutUs}
              </p>
            </Section>
          )}

          {/* Values */}
          {!!o.values?.length && (
            <Section label='Values'>
              <div className='flex flex-wrap gap-1.5'>
                {o.values.map((v) => (
                  <span
                    key={v}
                    className='border-border text-foreground rounded-full border px-2 py-0.5 text-[10px]'
                  >
                    {v}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      <div className='border-border/70 sticky bottom-0 flex items-center justify-between gap-3 border-t bg-white/90 px-4 py-3 backdrop-blur-xl dark:bg-black/90'>
        <Link
          href='/user/settings?tab=brand'
          target='_blank'
          className='inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-xs font-medium text-white transition-colors hover:bg-indigo-700'
        >
          <LocalizedText text={"Edit Brand"} />
        </Link>
        {canReimport && (
          <button
            type='button'
            onClick={() => setIsImportOpen(true)}
            className='text-muted-foreground hover:text-foreground inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-neutral-200 px-3 text-xs font-medium transition-colors hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-white/5'
          >
            <Download className='h-3.5 w-3.5' />
            <LocalizedText text={"Re-import Brand"} />
          </button>
        )}
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className='text-muted-foreground mb-1.5 text-[10px] font-semibold tracking-wider uppercase'>
        {label}
      </p>
      {children}
    </div>
  );
}
