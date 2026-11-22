"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { RocketIcon, Megaphone01Icon, ZapIcon, Briefcase01Icon, Building03Icon, ChartIncreaseIcon, SourceCodeIcon, PaintBoardIcon, MoreHorizontalIcon, TwitterIcon, Facebook01Icon, Linkedin01Icon, UserCircleIcon, UserGroupIcon, YoutubeIcon, InstagramIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";

interface StepQuestionsProps {
  initialRole: string;
  initialHear: string;
  onSubmit: (data: { role: string; hearAboutUs: string }) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const ROLES = [
  { id: "founder", label: "Founder", icon: RocketIcon },
  { id: "marketing", label: "Marketing", icon: Megaphone01Icon },
  { id: "side-hustle", label: "Side Hustle", icon: ZapIcon },
  { id: "freelancer", label: "Freelancer", icon: Briefcase01Icon },
  { id: "agency", label: "Agency", icon: Building03Icon },
  { id: "sales", label: "Sales", icon: ChartIncreaseIcon },
  { id: "developer", label: "Developer", icon: SourceCodeIcon },
  { id: "designer", label: "Designer", icon: PaintBoardIcon },
  { id: "other", label: "Other", icon: MoreHorizontalIcon },
];

const HEAR_OPTIONS = [
  { id: "twitter", label: "X (Twitter)", icon: TwitterIcon },
  { id: "facebook", label: "Facebook", icon: Facebook01Icon },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin01Icon },
  { id: "tiktok", label: "TikTok", icon: UserCircleIcon },
  { id: "google", label: "Google", icon: ChartIncreaseIcon },
  { id: "friend", label: "Friend", icon: UserGroupIcon },
  { id: "youtube", label: "YouTube", icon: YoutubeIcon },
  { id: "instagram", label: "Instagram", icon: InstagramIcon },
  { id: "other", label: "Other", icon: MoreHorizontalIcon },
];

export function StepQuestions({
  initialRole,
  initialHear,
  onSubmit,
  onBack,
  isSubmitting,
}: StepQuestionsProps) {
  const [role, setRole] = useState(initialRole);
  const [hear, setHear] = useState(initialHear);

  const canSubmit = !!role && !!hear;

  return (
    <div className='mx-auto w-full max-w-3xl px-6 py-12'>
      {/* Header */}
      <div className='mx-auto mb-16 max-w-md text-center'>
        <h1 className='text-3xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-white'>
          <LocalizedText text={"Tell us a little about yourself"} />
        </h1>

        <p className='mt-3 text-sm text-neutral-500 md:text-base dark:text-neutral-400'>
          <LocalizedText text={"This helps us tailor your experience."} />
        </p>
      </div>

      {/* Questions */}
      <div className='space-y-12'>
        <Section
          title='What best describes you?'
          options={ROLES}
          value={role}
          onChange={setRole}
        />

        <Section
          title='How did you find us?'
          options={HEAR_OPTIONS}
          value={hear}
          onChange={setHear}
        />
      </div>

      {/* Actions */}
      <div className='mt-16 flex items-center justify-between'>
        <Button
          variant='ghost'
          onClick={onBack}
          disabled={isSubmitting}
          className='text-neutral-600 dark:text-neutral-400'
        >
          <LocalizedText text={"Back"} />
        </Button>

        <Button
          onClick={() => onSubmit({ role, hearAboutUs: hear })}
          disabled={!canSubmit || isSubmitting}
          className='bg-cyan-600 px-6 text-white hover:bg-cyan-700'
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}

interface OptionDef {
  id: string;
  label: string;
  icon: IconSvgElement;
}

function Section({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: OptionDef[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <section>
      <h2 className='mb-4 text-sm font-medium text-neutral-900 dark:text-white'>
        {title}
      </h2>

      <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.id;

          return (
            <button
              key={opt.id}
              type='button'
              onClick={() => onChange(opt.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                active
                  ? "border-cyan-500 ring-2 ring-cyan-500/15"
                  : "border-neutral-200 hover:border-neutral-400 dark:border-white/10 dark:hover:border-white/20"
              )}
            >
              <HugeiconsIcon icon={Icon} className={cn("size-4 shrink-0 text-neutral-500")} />

              <span className={cn("text-sm font-medium")}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
