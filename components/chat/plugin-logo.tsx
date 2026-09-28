"use client";

import { useComposioToolkits } from "@/hooks/use-integrations";
import { resolveComposioToolkit } from "@/lib/plugin-connection-link";
import { Plug } from "lucide-react";
import { useState } from "react";

export function PluginLogo({
  icon,
  label,
  slug,
  compact = false,
}: {
  icon?: string;
  label: string;
  slug?: string;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const { data: toolkits = [] } = useComposioToolkits();
  const toolkit =
    toolkits.find((item) => item.slug === slug) ||
    resolveComposioToolkit(label, toolkits);
  const logo = icon || toolkit?.logo;

  return (
    <span
      className={
        compact
          ? "bg-background flex size-5 shrink-0 items-center justify-center overflow-hidden rounded border border-black/10"
          : "border-border/70 bg-background flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
      }
    >
      {logo && !failed ? (
        <img
          src={logo}
          alt={`${label} logo`}
          className={
            compact ? "size-4 object-contain" : "size-7 object-contain"
          }
          onError={() => setFailed(true)}
        />
      ) : (
        <Plug
          className={
            compact
              ? "text-muted-foreground size-3"
              : "text-muted-foreground size-5"
          }
          aria-label={`${label} plugin`}
        />
      )}
    </span>
  );
}

export function PluginName({
  name,
  slug,
  icon,
}: {
  name: string;
  slug?: string;
  icon?: string;
}) {
  return (
    <span className='inline-flex items-center gap-1.5'>
      <PluginLogo icon={icon} label={name} slug={slug} compact />
      <span>{name}</span>
    </span>
  );
}
