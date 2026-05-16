"use client";

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
  { id: "side-hustle", label: "Side hustle", icon: Zap },
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
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
      <div className="text-center mb-10">
        <h1 className="onb-animate-in onb-stagger-1 mt-4 lg:mt-16 text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Two quick questions
        </h1>
        <p className="onb-animate-in onb-stagger-2 mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
          So we can personalize your experience.
        </p>
      </div>

      <div className="onb-animate-in onb-stagger-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] p-6 md:p-10 space-y-10">
        <Section
          number={1}
          title="What best describes you?"
          options={ROLES}
          value={role}
          onChange={setRole}
        />
        <Section
          number={2}
          title="How did you hear about us?"
          options={HEAR_OPTIONS}
          value={hear}
          onChange={setHear}
        />
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/5"
        >
          ← Back
        </Button>
        <Button
          onClick={() => onSubmit({ role, hearAboutUs: hear })}
          disabled={!canSubmit || isSubmitting}
          className="px-10 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 font-medium disabled:bg-neutral-200 dark:disabled:bg-white/10 disabled:text-neutral-500"
        >
          {isSubmitting ? "Saving..." : "Get Started"}
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
  number,
  title,
  options,
  value,
  onChange,
}: {
  number: number;
  title: string;
  options: OptionDef[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="size-7 rounded-full bg-cyan-400/10 ring-1 ring-cyan-300/30 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-sm font-medium">
          {number}
        </span>
        <h3 className="font-medium text-neutral-900 dark:text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "flex items-center gap-3 h-14 px-4 rounded-md border transition-all text-left",
                active
                  ? "border-cyan-300/50 bg-cyan-400/10 ring-1 ring-cyan-300/30"
                  : "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] hover:border-cyan-300/30 hover:bg-neutral-100 dark:hover:bg-white/[0.05]"
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0",
                  active ? "text-cyan-700 dark:text-cyan-300" : "text-neutral-500 dark:text-neutral-400"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  active ? "text-neutral-900 dark:text-white" : "text-neutral-800 dark:text-neutral-200"
                )}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
