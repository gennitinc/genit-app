"use client";

import { PluginLogo } from "../plugin-logo";
import { AgentButton, AgentCard } from "./agent-card";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { LocalizedText } from "@/components/localized-text";
import { useComposioToolkits } from "@/hooks/use-integrations";
import type { AgentIntegrationRequired } from "@/lib/agents-api";
import { resolveComposioToolkit } from "@/lib/plugin-connection-link";
import { ArrowRight, CheckCircle2, Plug, ShieldCheck } from "lucide-react";
import { useState } from "react";

// Use the same Composio verification and connection refresh flow as Plugins.
export function ConnectIntegrationInline({
  required,
  onConnected,
}: {
  required: AgentIntegrationRequired;
  onConnected?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const { data: toolkits = [] } = useComposioToolkits();
  const toolkit =
    toolkits.find((item) => item.slug === required.toolkitSlug) ||
    resolveComposioToolkit(required.platformName, toolkits);
  const toolkitSlug = required.toolkitSlug || toolkit?.slug;
  const pluginName = toolkit?.name || required.platformName;

  return (
    <>
      <AgentCard
        icon={<Plug className='h-3.5 w-3.5' />}
        title='Connection required'
        meta={
          <span className='flex items-center gap-1.5'>
            <PluginLogo icon={toolkit?.logo} label={pluginName} compact />
            <span>{pluginName}</span>
          </span>
        }
        tone='neutral'
      >
        <div className='text-foreground text-sm font-medium'>
          <LocalizedText text={"Connect"} /> {pluginName}{" "}
          <LocalizedText text={"to continue"} />
        </div>
        <p className='text-muted-foreground mt-1 text-[12.5px] leading-relaxed'>
          {required.reason}
        </p>
        <div className='text-muted-foreground mt-2 flex items-center gap-1.5 text-[11px]'>
          <ShieldCheck className='h-3 w-3' />
          <span>Connect securely through Composio.</span>
        </div>
        <div className='mt-3'>
          {connected ? (
            <AgentButton type='button' variant='secondary' disabled>
              <CheckCircle2 className='h-3.5 w-3.5' />
              <LocalizedText text={"Connected"} />
            </AgentButton>
          ) : (
            <AgentButton
              type='button'
              variant='primary'
              onClick={() => setOpen(true)}
            >
              <PluginLogo icon={toolkit?.logo} label={pluginName} compact />
              <LocalizedText text={"Connect"} /> {pluginName}
              <ArrowRight className='h-3 w-3' />
            </AgentButton>
          )}
        </div>
      </AgentCard>
      <ConnectDialog
        open={open}
        onOpenChange={setOpen}
        platform={required.platform}
        platformName={pluginName}
        platformDescription={required.reason}
        Icon={Plug}
        iconUrl={toolkit?.logo}
        glow='rgba(99, 102, 241, 0.7)'
        appSlug={toolkitSlug}
        onConnected={() => {
          setConnected(true);
          setOpen(false);
          onConnected?.();
        }}
      />
    </>
  );
}
