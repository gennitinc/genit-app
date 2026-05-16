"use client";

import {
  FacebookBrand,
  InstagramBrand,
  LinkedinBrand,
  XBrand,
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Organization, useUserContext } from "@/context/AuthenticatedContext";
import { useToast } from "@/hooks/use-toast";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import {
  ImageIcon,
  Loader2,
  Palette,
  Plus,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SocialPlatform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "twitter"
  | "tiktok";

type SocialUrls = Partial<Record<SocialPlatform, string>>;

interface BrandForm {
  businessName: string;
  companyWebsite: string;
  businessBio: string;
  industry: string;
  brandLogo: string;
  brandColors: string[];
  primaryColor: string;
  secondaryColor: string;
  fontHeadline: string;
  fontBody: string;
  aboutUs: string;
  mission: string;
  vision: string;
  slogan: string;
  values: string[];
  voiceTone: string[];
  socials: SocialUrls;
}

const emptyBrandForm: BrandForm = {
  businessName: "",
  companyWebsite: "",
  businessBio: "",
  industry: "",
  brandLogo: "",
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
  socials: {},
};

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
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    placeholder: string;
  }
> = {
  facebook: {
    label: "Facebook",
    icon: FacebookBrand,
    placeholder: "facebook.com/yourpage",
  },
  instagram: {
    label: "Instagram",
    icon: InstagramBrand,
    placeholder: "instagram.com/yourbrand",
  },
  linkedin: {
    label: "LinkedIn",
    icon: LinkedinBrand,
    placeholder: "linkedin.com/company/...",
  },
  youtube: {
    label: "YouTube",
    icon: YoutubeBrand,
    placeholder: "youtube.com/@yourchannel",
  },
  twitter: {
    label: "X / Twitter",
    icon: XBrand,
    placeholder: "x.com/yourhandle",
  },
  tiktok: {
    label: "TikTok",
    icon: Sparkles,
    placeholder: "tiktok.com/@you",
  },
};

export default function BrandSettings() {
  const { user, fetchCurrentUser, updateOrganization } = useUserContext();
  const { toast } = useToast();
  const logoRef = useRef<HTMLInputElement>(null);

  const currentOrg: Organization | null = useMemo(() => {
    if (
      user?.currentOrganization &&
      typeof user.currentOrganization === "object"
    ) {
      return user.currentOrganization;
    }
    if (user?.business && typeof user.business === "object") {
      return user.business as Organization;
    }
    return null;
  }, [user?.currentOrganization, user?.business]);

  const [form, setForm] = useState<BrandForm>(emptyBrandForm);
  const [initial, setInitial] = useState<BrandForm>(emptyBrandForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Hydrate from the current organization (fallback to onboarding for legacy data)
  useEffect(() => {
    const o = user?.onboarding;
    const org = currentOrg;
    if (!o && !org) return;
    const socials: SocialUrls = {};
    const sourceSocials = org?.socialMediaUrls || o?.socialMediaUrls;
    if (Array.isArray(sourceSocials)) {
      for (const entry of sourceSocials) {
        if (entry?.platform && entry?.url) {
          socials[entry.platform as SocialPlatform] = entry.url;
        }
      }
    }
    const next: BrandForm = {
      businessName: org?.businessName || o?.businessName || "",
      companyWebsite: org?.businessWebsite || o?.companyWebsite || "",
      businessBio: org?.businessBio || o?.businessBio || "",
      industry: org?.industry || o?.industry || "",
      brandLogo: org?.businessLogo || o?.brandLogo || "",
      brandColors: org?.brandColors || o?.brandColors || [],
      primaryColor: org?.primaryColor || o?.primaryColor || "",
      secondaryColor: org?.secondaryColor || o?.secondaryColor || "",
      fontHeadline: org?.fontHeadline || o?.fontHeadline || "",
      fontBody: org?.fontBody || o?.fontBody || "",
      aboutUs: org?.aboutUs || o?.aboutUs || "",
      mission: org?.mission || o?.mission || "",
      vision: org?.vision || o?.vision || "",
      slogan: org?.slogan || o?.slogan || "",
      values: org?.values || o?.values || [],
      voiceTone: org?.voiceTone || o?.voiceTone || [],
      socials,
    };
    setForm(next);
    setInitial(next);
  }, [currentOrg, user?.onboarding]);

  const update = <K extends keyof BrandForm>(key: K, value: BrandForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const colors = useMemo(
    () =>
      form.brandColors && form.brandColors.length > 0
        ? form.brandColors
        : [form.primaryColor, form.secondaryColor].filter(Boolean),
    [form.brandColors, form.primaryColor, form.secondaryColor]
  );

  const setColorAt = (idx: number, value: string) => {
    const next = [...colors];
    next[idx] = value;
    update("brandColors", next);
    if (idx === 0) update("primaryColor", value);
    if (idx === 1) update("secondaryColor", value);
  };

  const addColor = () => {
    if (colors.length >= 6) return;
    update("brandColors", [...colors, "#22D3EE"]);
  };

  const removeColor = (idx: number) => {
    const next = colors.filter((_, i) => i !== idx);
    update("brandColors", next);
    if (idx === 0) update("primaryColor", next[0] || "");
    if (idx === 1) update("secondaryColor", next[1] || "");
  };

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial]
  );

  const handleLogoSelect = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Logo too large",
        description: "Pick a file under 5MB.",
        variant: "destructive",
      });
      return;
    }
    if (!currentOrg?._id) {
      toast({
        title: "No organization selected",
        description: "Select or create an organization first.",
        variant: "destructive",
      });
      return;
    }
    setIsUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("logo", file);
      const { data } = await apiResponseFileUpload.post(
        `/orgs/${currentOrg._id}/logo`,
        fd
      );
      if (data?.businessLogo) {
        update("brandLogo", data.businessLogo);
        await fetchCurrentUser();
        toast({ title: "Logo updated" });
      }
    } catch {
      toast({
        title: "Could not upload logo",
        variant: "destructive",
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!currentOrg?._id) {
      toast({
        title: "No organization selected",
        description: "Select or create an organization first.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      const socialMediaUrls = Object.entries(form.socials)
        .filter(([, url]) => !!url?.trim())
        .map(([platform, url]) => ({ platform, url: url!.trim() }));

      await updateOrganization(currentOrg._id, {
        businessName: form.businessName,
        businessWebsite: form.companyWebsite,
        businessBio: form.businessBio,
        industry: form.industry,
        businessLogo: form.brandLogo,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        fontHeadline: form.fontHeadline,
        fontBody: form.fontBody,
        aboutUs: form.aboutUs,
        mission: form.mission,
        vision: form.vision,
        slogan: form.slogan,
        brandColors: form.brandColors,
        values: form.values,
        voiceTone: form.voiceTone,
        socialMediaUrls,
      });
      setInitial(form);
      toast({ title: "Brand updated" });
    } catch (err: any) {
      toast({
        title: "Could not save changes",
        description: err?.response?.data?.message || err?.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => setForm(initial);

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Palette className='h-5 w-5' />
            Brand identity
          </CardTitle>
          <CardDescription>
            Update the logo, name, and one-line description we picked up during
            onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex flex-col gap-6 md:flex-row md:items-start'>
            <button
              type='button'
              onClick={() => logoRef.current?.click()}
              className='border-border bg-muted/40 hover:border-cyan-400/50 relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors md:size-32'
            >
              {form.brandLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.brandLogo}
                  alt='logo'
                  className='max-h-full max-w-full rounded-md bg-white object-contain p-2'
                />
              ) : (
                <div className='text-muted-foreground flex flex-col items-center gap-1'>
                  <ImageIcon className='size-6' />
                  <span className='text-xs'>Upload logo</span>
                </div>
              )}
              {isUploadingLogo && (
                <div className='bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-sm'>
                  <Loader2 className='size-6 animate-spin' />
                </div>
              )}
            </button>
            <input
              ref={logoRef}
              type='file'
              accept='image/png,image/jpeg,image/svg+xml,image/webp'
              className='hidden'
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleLogoSelect(f);
              }}
            />
            <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='businessName'>Business name</Label>
                <Input
                  id='businessName'
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='companyWebsite'>Website</Label>
                <Input
                  id='companyWebsite'
                  value={form.companyWebsite}
                  onChange={(e) => update("companyWebsite", e.target.value)}
                  placeholder='https://yoursite.com'
                />
              </div>
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='businessBio'>One-line description</Label>
                <Textarea
                  id='businessBio'
                  value={form.businessBio}
                  onChange={(e) => update("businessBio", e.target.value)}
                  rows={2}
                />
              </div>
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='industry'>Industry</Label>
                <Input
                  id='industry'
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  placeholder='e.g. SaaS, Apparel, Agency'
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual style</CardTitle>
          <CardDescription>
            Brand colors and font preferences. Used to generate on-brand assets.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-3'>
            <Label>Colors</Label>
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
                  className='border-border text-muted-foreground hover:border-cyan-400/50 hover:text-cyan-600 dark:hover:text-cyan-300 size-12 rounded-full border-2 border-dashed transition-colors flex items-center justify-center'
                >
                  <Plus className='size-4' />
                </button>
              )}
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FontSelect
              label='Headline font'
              value={form.fontHeadline}
              onChange={(v) => update("fontHeadline", v)}
            />
            <FontSelect
              label='Body font'
              value={form.fontBody}
              onChange={(v) => update("fontBody", v)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand DNA</CardTitle>
          <CardDescription>
            The narrative the AI uses when writing in your voice.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='aboutUs'>About us</Label>
            <Textarea
              id='aboutUs'
              rows={4}
              value={form.aboutUs}
              onChange={(e) => update("aboutUs", e.target.value)}
            />
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='mission'>Mission</Label>
              <Textarea
                id='mission'
                rows={3}
                value={form.mission}
                onChange={(e) => update("mission", e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='vision'>Vision</Label>
              <Textarea
                id='vision'
                rows={3}
                value={form.vision}
                onChange={(e) => update("vision", e.target.value)}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='slogan'>Slogan</Label>
            <Input
              id='slogan'
              value={form.slogan}
              onChange={(e) => update("slogan", e.target.value)}
              placeholder='Your tagline'
            />
          </div>
          <div className='space-y-2'>
            <Label>Values</Label>
            <ChipEditor
              values={form.values}
              onChange={(v) => update("values", v)}
              placeholder='Add a value'
            />
          </div>
          <div className='space-y-2'>
            <Label>Voice tone</Label>
            <NumberedList
              values={form.voiceTone}
              onChange={(v) => update("voiceTone", v)}
              placeholder='Add a tone word'
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social profiles</CardTitle>
          <CardDescription>
            Where can people find you online?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            {(Object.keys(SOCIAL_META) as SocialPlatform[]).map((key) => {
              const meta = SOCIAL_META[key];
              const Icon = meta.icon;
              return (
                <div key={key}>
                  <Label className='mb-1.5 flex items-center gap-1.5 text-xs'>
                    <Icon className='h-4 w-4' />
                    {meta.label}
                  </Label>
                  <Input
                    value={form.socials[key] || ""}
                    onChange={(e) =>
                      update("socials", {
                        ...form.socials,
                        [key]: e.target.value,
                      })
                    }
                    placeholder={meta.placeholder}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className='bg-background/80 sticky bottom-0 -mx-1 flex items-center justify-end gap-2 border-t py-3 backdrop-blur'>
        <Button
          variant='ghost'
          onClick={handleReset}
          disabled={!dirty || isSaving}
        >
          Reset
        </Button>
        <Button onClick={handleSave} disabled={!dirty || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Saving...
            </>
          ) : (
            <>
              <Save className='mr-2 h-4 w-4' />
              Save changes
            </>
          )}
        </Button>
      </div>
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
    <div className='space-y-2'>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='border-input bg-background h-10 w-full rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40'
        style={{ fontFamily: value || "inherit" }}
      >
        <option value=''>Select font</option>
        {options.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>
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
  onRemove: () => void;
}) {
  return (
    <div className='group relative flex flex-col items-center gap-1'>
      <label
        className='border-border relative size-12 cursor-pointer overflow-hidden rounded-full border'
        style={{ backgroundColor: value || "#cccccc" }}
      >
        <input
          type='color'
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className='absolute inset-0 cursor-pointer opacity-0'
        />
      </label>
      <button
        type='button'
        onClick={onRemove}
        className='bg-background ring-border absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full opacity-0 ring-1 transition-opacity group-hover:opacity-100'
      >
        <X className='size-2.5' />
      </button>
      <span className='text-muted-foreground font-mono text-[10px] uppercase'>
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
    if (!v || values.includes(v)) {
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
            className='border-border bg-muted/40 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm'
          >
            {v}
            <button
              type='button'
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className='hover:text-destructive'
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
        />
        <Button type='button' variant='outline' onClick={add}>
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
          <span className='text-muted-foreground w-5 text-sm'>{i + 1}.</span>
          <Input
            value={v}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type='button'
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            className='text-muted-foreground hover:text-destructive'
          >
            <X className='size-4' />
          </button>
        </div>
      ))}
      {values.length < max && (
        <button
          type='button'
          onClick={() => onChange([...values, ""])}
          className='text-primary inline-flex items-center gap-1 text-sm hover:underline'
        >
          <Plus className='size-3' /> {placeholder}
        </button>
      )}
    </div>
  );
}
