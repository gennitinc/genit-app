"use client";

import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { Button } from "@/components/ui/button";
import { useComposioToolkits, useIntegrations } from "@/hooks/use-integrations";
import {
  isComposioConnectionLink,
  resolveComposioToolkit,
} from "@/lib/plugin-connection-link";
import { CheckCircle2, Loader2, Plug } from "lucide-react";
import {
  type AnchorHTMLAttributes,
  Children,
  type ReactNode,
  isValidElement,
  useMemo,
  useState,
} from "react";

type MarkdownAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  node?: unknown;
};

function childText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      return isValidElement<{ children?: ReactNode }>(child)
        ? childText(child.props.children)
        : "";
    })
    .join("");
}

/** Turns Composio authorization links in assistant Markdown into live controls. */
export function PluginConnectionLink({
  node: _node,
  children,
  href,
  ...anchorProps
}: MarkdownAnchorProps) {
  const label = childText(children).trim();
  const isConnection = isComposioConnectionLink(label, href);

  if (!isConnection) {
    return (
      <a href={href} {...anchorProps}>
        {children}
      </a>
    );
  }

  return <PluginConnectionControl label={label} href={href} {...anchorProps} />;
}

function PluginConnectionControl({
  label,
  href,
  ...anchorProps
}: Omit<MarkdownAnchorProps, "children" | "node"> & { label: string }) {
  const { data: catalog = [], isLoading: catalogLoading } =
    useComposioToolkits();
  const { integrations, isLoading: integrationsLoading } = useIntegrations();
  const [open, setOpen] = useState(false);
  const [justConnected, setJustConnected] = useState(false);

  const knownToolkits = useMemo(() => {
    const fromConnections = integrations.flatMap((integration) => {
      const slug = integration.metadata?.toolkitSlug;
      if (typeof slug !== "string" || !slug) return [];
      const name = integration.metadata?.toolkitName;
      return [{ slug, name: typeof name === "string" && name ? name : slug }];
    });
    return [...catalog, ...fromConnections];
  }, [catalog, integrations]);

  const toolkit = resolveComposioToolkit(label, knownToolkits);
  const connected =
    justConnected ||
    Boolean(
      toolkit &&
      integrations.some(
        (integration) =>
          integration.status === "active" &&
          integration.metadata?.toolkitSlug === toolkit.slug
      )
    );

  const waiting = catalogLoading || integrationsLoading;

  if (!toolkit) {
    if (waiting) {
      return (
        <Button className='my-2 w-fit' size='sm' disabled>
          <Loader2 className='animate-spin' />
          Checking connection…
        </Button>
      );
    }

    // The live catalog can occasionally lag a newly released toolkit. Keep
    // the provider URL usable, but preserve the same button treatment.
    return (
      <Button asChild className='my-2 w-fit active:scale-[0.97]' size='sm'>
        <a
          href={href}
          {...anchorProps}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Plug />
          {label}
        </a>
      </Button>
    );
  }

  return (
    <>
      <Button
        type='button'
        size='sm'
        variant={connected ? "secondary" : "default"}
        className='my-2 w-fit transition-transform active:scale-[0.97] disabled:opacity-100'
        disabled={connected}
        aria-label={connected ? `${toolkit.name} connected` : label}
        onClick={() => setOpen(true)}
      >
        {connected ? <CheckCircle2 /> : <Plug />}
        {connected ? "Connected" : `Connect ${toolkit.name}`}
      </Button>
      <ConnectDialog
        open={open}
        onOpenChange={setOpen}
        platform='composio'
        platformName={toolkit.name}
        platformDescription={`Connect ${toolkit.name} securely through Composio.`}
        Icon={Plug}
        glow='rgba(79, 70, 229, 0.7)'
        appSlug={toolkit.slug}
        onConnected={() => {
          setJustConnected(true);
          setOpen(false);
        }}
      />
    </>
  );
}
