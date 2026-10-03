"use client";

import { PluginLogo } from "../plugin-logo";
import { AgentButton, AgentCard } from "./agent-card";
import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { LocalizedText } from "@/components/localized-text";
import { useComposioToolkits } from "@/hooks/use-integrations";
import type { AgentIntegrationRequired } from "@/lib/agents-api";
import { resolveComposioToolkit } from "@/lib/plugin-connection-link";
import { ArrowRight, CheckCircle2, Plug, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function ConnectIntegrationInline({
  required,
  onConnected,
}: {
  required: AgentIntegrationRequired;
  onConnected?: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [resuming, setResuming] = useState(false);
  const { data: toolkits = [] } = useComposioToolkits();
  const toolkit =
    toolkits.find((item) => item.slug === required.toolkitSlug) ||
    resolveComposioToolkit(required.platformName, toolkits);
  // First-class platforms (Google Calendar, Gmail, etc.) must use their native
  // OAuth route because their agent tools read native Integration records.
  // Only dynamic plugin requests carry a toolkitSlug and use Composio.
  const toolkitSlug = required.toolkitSlug;
  const pluginName = toolkit?.name || required.platformName;
  const resumeChat = async () => {
    if (!onConnected || resuming) return;
    setResuming(true);
    try {
      await onConnected();
    } catch {
      toast.error(`${pluginName} is connected, but the chat could not resume`, {
        description: "Click Continue chat to retry.",
      });
    } finally {
      setResuming(false);
    }
  };

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
          <span>
            Connect securely
            {toolkitSlug ? " through Composio" : ` to ${pluginName}`}.
          </span>
        </div>
        <div className='mt-3'>
          {connected ? (
            <div className='flex flex-wrap items-center gap-2'>
              <AgentButton type='button' variant='secondary' disabled>
                <CheckCircle2 className='h-3.5 w-3.5' />
                <LocalizedText text={"Connected"} />
              </AgentButton>
              <AgentButton
                type='button'
                variant='primary'
                disabled={resuming}
                onClick={() => void resumeChat()}
              >
                <LocalizedText
                  text={resuming ? "Continuing…" : "Continue chat"}
                />
              </AgentButton>
            </div>
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
          void resumeChat();
        }}
      />
    </>
  );
}
