"use client";

import { StepBrandDna } from "./_components/step-brand-dna";
import { StepImport } from "./_components/step-import";
import { StepQuestions } from "./_components/step-questions";
import {
  BrandData,
  OnboardingStep,
  SocialPlatform,
  SocialUrls,
  emptyBrand,
} from "./_components/types";
import { Logo } from "@/components/logo";
import { useUserContext } from "@/context/AuthenticatedContext";
import Loading from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useState } from "react";

const STEP_ORDER: OnboardingStep[] = ["import", "dna", "questions"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, fetchCurrentUser } = useUserContext();

  const [step, setStep] = useState<OnboardingStep>("import");
  const [brand, setBrand] = useState<BrandData>(emptyBrand);
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if onboarding already complete; hydrate brand from server otherwise.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/signin");
      return;
    }
    const o = user.onboarding;
    if (
      o &&
      typeof o === "object" &&
      (o.onboardingCompleted || o.onboardingSkipped)
    ) {
      router.replace("/chat");
      return;
    }
    if (o && typeof o === "object") {
      const socials: SocialUrls = {};
      if (Array.isArray(o.socialMediaUrls)) {
        for (const entry of o.socialMediaUrls) {
          if (entry?.platform && entry?.url) {
            socials[entry.platform as SocialPlatform] = entry.url;
          }
        }
      }
      setBrand((prev) => ({
        ...prev,
        companyWebsite: o.companyWebsite || "",
        businessName: o.businessName || "",
        businessBio: o.businessBio || "",
        industry: o.industry || "",
        brandLogo: o.brandLogo || "",
        ogImage: o.ogImage || "",
        brandColors: o.brandColors || [],
        primaryColor: o.primaryColor || "",
        secondaryColor: o.secondaryColor || "",
        fontHeadline: o.fontHeadline || "",
        fontBody: o.fontBody || "",
        aboutUs: o.aboutUs || "",
        mission: o.mission || "",
        vision: o.vision || "",
        slogan: o.slogan || "",
        values: o.values || [],
        voiceTone: o.voiceTone || [],
        role: o.role || "",
        hearAboutUs: o.hearAboutUs || "",
        socials,
      }));
      if (
        o.onboardingStep &&
        STEP_ORDER.includes(o.onboardingStep as OnboardingStep)
      ) {
        setStep(o.onboardingStep as OnboardingStep);
      }
    }
    setHydrated(true);
  }, [user, authLoading, router]);

  const updateBrand = useCallback((patch: Partial<BrandData>) => {
    setBrand((prev) => ({ ...prev, ...patch }));
  }, []);

  const persist = useCallback(
    async (
      patch: Partial<BrandData> & {
        onboardingStep?: OnboardingStep;
        onboardingCompleted?: boolean;
        onboardingSkipped?: boolean;
      }
    ) => {
      const socialMediaUrls = patch.socials
        ? JSON.stringify(
            Object.entries(patch.socials)
              .filter(([, url]) => !!url)
              .map(([platform, url]) => ({ platform, url }))
          )
        : undefined;
      const {
        socials: _drop,
        screenshot: _drop2,
        source: _drop3,
        ...rest
      } = patch;
      const payload = {
        ...rest,
        values: patch.values ? JSON.stringify(patch.values) : undefined,
        voiceTone: patch.voiceTone
          ? JSON.stringify(patch.voiceTone)
          : undefined,
        brandColors: patch.brandColors
          ? JSON.stringify(patch.brandColors)
          : undefined,
        socialMediaUrls,
      };
      await apiResponse.post("/auth/onboarding/save", payload);
    },
    []
  );

  const handleImportComplete = useCallback(
    async (imported: BrandData) => {
      setBrand(imported);
      try {
        await persist({ ...imported, onboardingStep: "dna" });
      } catch (err) {
        console.error("persist after import failed", err);
      }
      setStep("dna");
    },
    [persist]
  );

  const handleDnaContinue = useCallback(async () => {
    try {
      await persist({ ...brand, onboardingStep: "questions" });
      setStep("questions");
    } catch (err) {
      console.error("persist DNA failed", err);
      toast.error("Could not save brand DNA. Try again.");
    }
  }, [brand, persist]);

  const handleSkip = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await persist({ onboardingSkipped: true });
      await fetchCurrentUser();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      toast.success("You can complete this later from settings.");
      router.replace("/chat");
    } catch (err) {
      console.error("skip onboarding failed", err);
      toast.error("Could not skip onboarding. Try again.");
      setIsSubmitting(false);
    }
  }, [persist, fetchCurrentUser, router]);

  const handleFinish = useCallback(
    async ({ role, hearAboutUs }: { role: string; hearAboutUs: string }) => {
      setIsSubmitting(true);
      try {
        await persist({
          ...brand,
          role,
          hearAboutUs,
          onboardingStep: "questions",
          onboardingCompleted: true,
        });
        await fetchCurrentUser();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        toast.success("You're all set!");
        router.replace("/chat");
      } catch (err) {
        console.error("finish failed", err);
        toast.error("Could not finish onboarding. Try again.");
        setIsSubmitting(false);
      }
    },
    [brand, persist, fetchCurrentUser, router]
  );

  const progress = useMemo(
    () => ((STEP_ORDER.indexOf(step) + 1) / STEP_ORDER.length) * 100,
    [step]
  );

  if (authLoading || !hydrated) {
    return (
      <div className='flex h-screen items-center justify-center bg-white dark:bg-black'>
        <Loading />
      </div>
    );
  }

  return (
    <div className='bg-background text-foreground relative min-h-screen'>
      {/* Ambient brand glow background (subtle, works on both themes) */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(6,182,212,0.10) 0%, transparent 60%), radial-gradient(50% 40% at 90% 10%, rgba(59,130,246,0.10) 0%, transparent 60%)",
        }}
      />
      <header className='bg-background/70 sticky top-0 z-10 backdrop-blur'>
        <div className='border-border mx-auto flex h-14 max-w-5xl items-center justify-between border-b px-4'>
          <Link href='/' className='z-40 flex items-center'>
            <Logo className='h-12 w-12 flex-shrink-0' />
            <span
              className={`text-foreground text-xl font-semibold transition-colors duration-300`}
            >
              Genit
            </span>
          </Link>
          <div className='flex w-40 items-center gap-2'>
            <div className='bg-muted h-1.5 flex-1 overflow-hidden rounded-full'>
              <div
                className='onb-animate-in onb-stagger-3 h-full bg-indigo-600 font-medium text-white hover:bg-indigo-700'
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className='onb-animate-in onb-stagger-3 text-muted-foreground text-xs tabular-nums'>
              {STEP_ORDER.indexOf(step) + 1}/{STEP_ORDER.length}
            </span>
          </div>
        </div>
      </header>

      {step === "import" && (
        <StepImport
          onComplete={handleImportComplete}
          onSkip={handleSkip}
          isSkipping={isSubmitting}
        />
      )}

      {step === "dna" && (
        <StepBrandDna
          brand={brand}
          onChange={updateBrand}
          onContinue={handleDnaContinue}
          onBack={() => setStep("import")}
        />
      )}

      {step === "questions" && (
        <StepQuestions
          initialRole={brand.role}
          initialHear={brand.hearAboutUs}
          onSubmit={handleFinish}
          onBack={() => setStep("dna")}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
