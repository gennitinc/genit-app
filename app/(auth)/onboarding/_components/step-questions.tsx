"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Code2,
  Facebook,
  Instagram,
  Linkedin,
  Megaphone,
  MoreHorizontal,
  Palette,
  Rocket,
  TrendingUp,
  Twitter,
  UserRound,
  Users,
  Youtube,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface StepQuestionsProps {
  initialRole: string;
  initialHear: string;
  onSubmit: (data: { role: string; hearAboutUs: string }) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const ROLES = [
  { id: "founder", label: "Founder", icon: Rocket },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "side-hustle", label: "Side Hustle", icon: Zap },
  { id: "freelancer", label: "Freelancer", icon: Briefcase },
  { id: "agency", label: "Agency", icon: Building2 },
  { id: "sales", label: "Sales", icon: TrendingUp },
  { id: "developer", label: "Developer", icon: Code2 },
  { id: "designer", label: "Designer", icon: Palette },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

const HEAR_OPTIONS = [
  { id: "twitter", label: "X (Twitter)", icon: Twitter },
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "tiktok", label: "TikTok", icon: UserRound },
  { id: "google", label: "Google", icon: TrendingUp },
  { id: "friend", label: "Friend", icon: Users },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "other", label: "Other", icon: MoreHorizontal },
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
  icon: React.ComponentType<{ className?: string }>;
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
              <Icon className={cn("size-4 shrink-0 text-neutral-500")} />

              <span className={cn("text-sm font-medium")}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
