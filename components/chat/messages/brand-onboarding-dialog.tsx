"use client";

import { StepBrandDna } from "@/app/(auth)/onboarding/_components/step-brand-dna";
import { StepImport } from "@/app/(auth)/onboarding/_components/step-import";
import { StepQuestions } from "@/app/(auth)/onboarding/_components/step-questions";
import {
  BrandData,
  OnboardingStep,
  SocialPlatform,
  SocialUrls,
  emptyBrand,
} from "@/app/(auth)/onboarding/_components/types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Organization,
  useUserContext,
} from "@/context/AuthenticatedContext";
import { apiResponse } from "@/utils/apiResponse";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STEP_ORDER: OnboardingStep[] = ["import", "dna", "questions"];

interface BrandOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * `"create-org"`: collect brand data and hand it to onCreateOrg() — no
   * intermediate writes (used by the sidebar's Create-organization flow).
   *
   * `"edit-org"`: hydrate from the active org, persist every step into
   * that same org via updateOrganization(). Used when re-importing brand
   * data for an existing organization.
   *
   * `"user-onboarding"` (default): legacy behavior — read/write through
   * the user's Onboarding document. Used for the first-time onboarding.
   */
  mode?: "user-onboarding" | "create-org" | "edit-org";
  onCreateOrg?: (brand: BrandData) => Promise<void>;
}

export function BrandOnboardingDialog({
  open,
  onOpenChange,
  mode = "user-onboarding",
  onCreateOrg,
}: BrandOnboardingDialogProps) {
  const { user, fetchCurrentUser, updateOrganization } = useUserContext();
  const [step, setStep] = useState<OnboardingStep>("import");
  const [brand, setBrand] = useState<BrandData>(emptyBrand);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCreateOrg = mode === "create-org";
  const isEditOrg = mode === "edit-org";

  const activeOrg: Organization | null = useMemo(() => {
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

  // Hydrate brand once per open-transition. Reads user/activeOrg/mode via
  // refs so context updates (e.g. an unrelated setuser elsewhere) can't
  // re-trigger this effect mid-flow and reset `step` back to "import".
  const hydrationCtxRef = useRef({ user, activeOrg, isCreateOrg, isEditOrg });
  useEffect(() => {
    hydrationCtxRef.current = { user, activeOrg, isCreateOrg, isEditOrg };
  });

  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!open) {
      hydratedRef.current = false;
      return;
    }
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    // Defensive: if anything has already moved us past the import screen
    // (e.g. a remount that preserved step via parent state, or a stale-effect
    // race), don't smash it back to "import".
    if (stepRef.current !== "import") return;

    const {
      user: u,
      activeOrg: org,
      isCreateOrg: createMode,
      isEditOrg: editMode,
    } = hydrationCtxRef.current;

    if (createMode) {
      setBrand(emptyBrand);
      setStep("import");
      setIsSubmitting(false);
      return;
    }

    if (editMode && org) {
      const socials: SocialUrls = {};
      if (Array.isArray(org.socialMediaUrls)) {
        for (const entry of org.socialMediaUrls) {
          if (entry?.platform && entry?.url) {
            socials[entry.platform as SocialPlatform] = entry.url;
          }
        }
      }
      setBrand({
        ...emptyBrand,
        companyWebsite: org.businessWebsite || "",
        businessName: org.businessName || "",
        businessBio: org.businessBio || "",
        industry: org.industry || "",
        brandLogo: org.businessLogo || "",
        brandColors: org.brandColors || [],
        primaryColor: org.primaryColor || "",
        secondaryColor: org.secondaryColor || "",
        fontHeadline: org.fontHeadline || "",
        fontBody: org.fontBody || "",
        aboutUs: org.aboutUs || "",
        mission: org.mission || "",
        vision: org.vision || "",
        slogan: org.slogan || "",
        values: org.values || [],
        voiceTone: org.voiceTone || [],
        socials,
      });
      setStep("import");
      setIsSubmitting(false);
      return;
    }

    const o = u?.onboarding;
    if (o) {
      const socials: SocialUrls = {};
      if (Array.isArray(o.socialMediaUrls)) {
        for (const entry of o.socialMediaUrls) {
          if (entry?.platform && entry?.url) {
            socials[entry.platform as SocialPlatform] = entry.url;
          }
        }
      }
      setBrand({
        ...emptyBrand,
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
      });
    } else {
      setBrand(emptyBrand);
    }
    setStep("import");
    setIsSubmitting(false);
  }, [open]);

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

  // edit-org persistence: write directly to the active org via the
  // organization endpoint, so brand edits don't pollute the user's
  // onboarding doc and don't depend on derivedFromOnboarding.
  const persistOrg = useCallback(
    async (next: BrandData) => {
      if (!activeOrg?._id) return;
      await updateOrganization(activeOrg._id, {
        businessName: next.businessName,
        businessBio: next.businessBio,
        businessWebsite: next.companyWebsite,
        industry: next.industry,
        businessLogo: next.brandLogo,
        brandColors: next.brandColors,
        primaryColor: next.primaryColor,
        secondaryColor: next.secondaryColor,
        fontHeadline: next.fontHeadline,
        fontBody: next.fontBody,
        aboutUs: next.aboutUs,
        mission: next.mission,
        vision: next.vision,
        slogan: next.slogan,
        values: next.values,
        voiceTone: next.voiceTone,
        socialMediaUrls: Object.entries(next.socials)
          .filter(([, url]) => !!url?.trim())
          .map(([platform, url]) => ({ platform, url: url!.trim() })),
      });
    },
    [activeOrg?._id, updateOrganization]
  );

  const handleImportComplete = useCallback(
    async (imported: BrandData) => {
      setBrand(imported);
      // edit-org defers all writes to handleFinish so a re-import that's
      // abandoned mid-flow doesn't overwrite the live organization.
      if (!isCreateOrg && !isEditOrg) {
        try {
          await persist({ ...imported, onboardingStep: "dna" });
        } catch (err) {
          console.error("persist after import failed", err);
        }
      }
      setStep("dna");
    },
    [persist, isCreateOrg, isEditOrg]
  );

  const handleDnaContinue = useCallback(async () => {
    if (isCreateOrg || isEditOrg) {
      setStep("questions");
      return;
    }
    try {
      await persist({ ...brand, onboardingStep: "questions" });
      setStep("questions");
    } catch (err) {
      console.error("persist DNA failed", err);
      toast.error("Could not save brand DNA. Try again.");
    }
  }, [brand, persist, isCreateOrg, isEditOrg]);

  const handleFinish = useCallback(
    async ({ role, hearAboutUs }: { role: string; hearAboutUs: string }) => {
      setIsSubmitting(true);
      try {
        const finalBrand = { ...brand, role, hearAboutUs };
        if (isCreateOrg) {
          if (!onCreateOrg) {
            throw new Error(
              "onCreateOrg handler is required in create-org mode"
            );
          }
          await onCreateOrg(finalBrand);
          // Caller owns the success toast/close — they know if creation succeeded.
        } else if (isEditOrg) {
          await persistOrg(finalBrand);
          toast.success("Brand identity saved!");
          onOpenChange(false);
        } else {
          await persist({
            ...finalBrand,
            onboardingStep: "questions",
            onboardingCompleted: true,
          });
          await fetchCurrentUser();
          toast.success("Brand identity saved!");
          onOpenChange(false);
        }
      } catch (err: any) {
        console.error("finish failed", err);
        if (isCreateOrg) {
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              "Could not create organization. Try again."
          );
        } else {
          toast.error("Could not save brand. Try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      brand,
      persist,
      persistOrg,
      fetchCurrentUser,
      onOpenChange,
      isCreateOrg,
      isEditOrg,
      onCreateOrg,
    ]
  );

  const updateBrand = useCallback((patch: Partial<BrandData>) => {
    setBrand((prev) => ({ ...prev, ...patch }));
  }, []);

  const progress = useMemo(
    () => ((STEP_ORDER.indexOf(step) + 1) / STEP_ORDER.length) * 100,
    [step]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[92vh] w-[95vw] gap-0 overflow-hidden p-0 sm:max-w-5xl rounded-2lx'>
        <div className='bg-background/70 sticky top-0 z-10 flex items-center gap-4 border-b px-4 py-3 backdrop-blur'>
          <p className='text-foreground text-sm font-medium'>
            Brand setup
          </p>
          <div className='ml-auto flex w-40 items-center gap-2'>
            <div className='bg-muted h-1.5 flex-1 overflow-hidden rounded-full'>
              <div
                className='h-full bg-linear-to-r from-cyan-500 to-blue-500'
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className='text-muted-foreground text-xs tabular-nums'>
              {STEP_ORDER.indexOf(step) + 1}/{STEP_ORDER.length}
            </span>
          </div>
        </div>

        <div className='max-h-[calc(92vh-3.5rem)] overflow-y-auto'>
          {step === "import" && (
            <StepImport onComplete={handleImportComplete} />
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
      </DialogContent>
    </Dialog>
  );
}
