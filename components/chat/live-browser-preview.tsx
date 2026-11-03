"use client";

import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  ChevronDown,
  CircleCheck,
  ExternalLink,
  Hand,
  Monitor,
  RectangleHorizontal,
  RectangleVertical,
  RotateCw,
  ShieldAlert,
  Smartphone,
  SquareTerminal,
  Tablet,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

type LiveTab = { id: string; url: string; title: string; active: boolean };
type LiveState = {
  url: string;
  title: string;
  tabs: LiveTab[];
  controller: "agent" | "user";
  handoffReason?: string;
  device?: LiveDevice;
  landscape?: boolean;
  pageStatus?: { kind: string; reason: string; provider?: string };
  verificationCleared?: boolean;
};
type LiveDevice = "desktop" | "tablet" | "mobile";

const DEVICES: {
  id: LiveDevice;
  label: string;
  description: string;
  icon: typeof Monitor;
}[] = [
  {
    id: "desktop",
    label: "Desktop",
    description: "Fits the preview",
    icon: Monitor,
  },
  {
    id: "tablet",
    label: "Tablet",
    description: "iPad Mini · 768 × 1024",
    icon: Tablet,
  },
  {
    id: "mobile",
    label: "Mobile",
    description: "iPhone 15 Pro · 393 × 659",
    icon: Smartphone,
  },
];
type LiveStatus =
  "connecting" | "live" | "reconnecting" | "starting" | "closed";

// The live browser page runs on the API server inside this iframe. It draws
// only the page itself (plus devtools); this component is its browser
// chrome and talks to it over postMessage.
export function LiveBrowserPreview({
  url,
  displayUrl,
}: {
  url: string;
  displayUrl?: string;
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const { resolvedTheme } = useTheme();
  const [state, setState] = React.useState<LiveState | null>(null);
  const [status, setStatus] = React.useState<LiveStatus>("connecting");
  const [devtools, setDevtools] = React.useState({ open: false, errors: 0 });
  const [address, setAddress] = React.useState(displayUrl || "");
  const [editing, setEditing] = React.useState(false);

  const liveOrigin = React.useMemo(() => {
    try {
      return new URL(url).origin;
    } catch {
      return "";
    }
  }, [url]);

  // Built once per session URL: changing src would reload the live view.
  const initial = React.useRef({ displayUrl, theme: resolvedTheme });
  const src = React.useMemo(() => {
    try {
      const next = new URL(url);
      next.searchParams.set("chrome", "0");
      next.searchParams.set("host", window.location.origin);
      if (initial.current.theme)
        next.searchParams.set("theme", initial.current.theme);
      if (initial.current.displayUrl)
        next.searchParams.set("start", initial.current.displayUrl);
      return next.toString();
    } catch {
      return url;
    }
  }, [url]);

  const post = React.useCallback(
    (message: Record<string, unknown>) => {
      iframeRef.current?.contentWindow?.postMessage(
        { source: "genit-host", ...message },
        liveOrigin || "*"
      );
    },
    [liveOrigin]
  );
  const command = (payload: Record<string, unknown>) =>
    post({ type: "command", command: payload });

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (liveOrigin && event.origin !== liveOrigin) return;
      const data = event.data;
      if (!data || data.source !== "genit-live") return;
      if (data.type === "state" && data.state) setState(data.state);
      else if (data.type === "status") setStatus(data.status);
      else if (data.type === "devtools")
        setDevtools({ open: !!data.open, errors: Number(data.errors) || 0 });
      else if (data.type === "ready" && resolvedTheme)
        post({ type: "theme", theme: resolvedTheme });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [liveOrigin, post, resolvedTheme]);

  React.useEffect(() => {
    if (resolvedTheme) post({ type: "theme", theme: resolvedTheme });
  }, [resolvedTheme, post]);

  const currentUrl =
    state?.url && state.url !== "about:blank" ? state.url : displayUrl || "";
  React.useEffect(() => {
    if (!editing) setAddress(currentUrl);
  }, [currentUrl, editing]);

  const userInControl = state?.controller === "user";
  const tabs = state?.tabs || [];
  const device: LiveDevice = state?.device || "desktop";
  const currentDevice =
    DEVICES.find((item) => item.id === device) || DEVICES[0];
  const disabled = status !== "live";

  return (
    <div className='bg-muted/90 flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-zinc-200 shadow-2xl dark:border-zinc-800/50'>
      {/* Three segments: window controls, a centered address pill, and agent
          tools. The grid keeps the pill centered whatever the sides hold. */}
      <div className='bg-background/95 @container grid h-12 shrink-0 grid-cols-[minmax(max-content,1fr)_minmax(0,auto)_minmax(max-content,1fr)] items-center gap-2 border-b px-3 backdrop-blur-sm'>
        <div className='flex min-w-0 items-center gap-0.5'>
          <div className='hidden items-center space-x-1.5 pr-2.5 pl-1 @md:flex'>
            <span className='h-2.5 w-2.5 rounded-full bg-red-400' />
            <span className='h-2.5 w-2.5 rounded-full bg-yellow-400' />
            <span className='h-2.5 w-2.5 rounded-full bg-green-400' />
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='h-7 w-7 shrink-0 p-0'
            title='Back'
            disabled={disabled}
            onClick={() => command({ type: "back" })}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-7 w-7 shrink-0 p-0'
            title='Forward'
            disabled={disabled}
            onClick={() => command({ type: "forward" })}
          >
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>

        <div className='bg-muted/60 flex min-w-0 items-center gap-0.5 rounded-lg border p-0.5'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                disabled={disabled}
                title={`Device: ${currentDevice.label}`}
                aria-label={`Device: ${currentDevice.label}`}
                className='h-7 shrink-0 gap-0.5 rounded-md px-1.5'
              >
                <currentDevice.icon
                  className={cn(
                    "h-3.5 w-3.5",
                    state?.landscape && device !== "desktop" && "rotate-90"
                  )}
                />
                <ChevronDown className='text-muted-foreground h-3 w-3' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center' className='w-60'>
              <DropdownMenuLabel className='text-muted-foreground text-xs font-normal'>
                <LocalizedText text={"Device"} />
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={device}
                onValueChange={(value) =>
                  command({
                    type: "device",
                    device: value,
                    landscape: value === "desktop" ? false : !!state?.landscape,
                  })
                }
              >
                {DEVICES.map(({ id, label, description, icon: Icon }) => (
                  <DropdownMenuRadioItem
                    key={id}
                    value={id}
                    className='gap-2.5'
                  >
                    <Icon className='text-muted-foreground h-4 w-4' />
                    <div className='flex flex-col'>
                      <span className='text-sm'>
                        <LocalizedText text={label} />
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        {description}
                      </span>
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className='text-muted-foreground text-xs font-normal'>
                <LocalizedText text={"Orientation"} />
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={state?.landscape ? "landscape" : "portrait"}
                onValueChange={(value) =>
                  command({
                    type: "device",
                    device,
                    landscape: value === "landscape",
                  })
                }
              >
                <DropdownMenuRadioItem
                  value='portrait'
                  disabled={device === "desktop"}
                  className='gap-2.5'
                >
                  <RectangleVertical className='text-muted-foreground h-4 w-4' />
                  <LocalizedText text={"Portrait"} />
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value='landscape'
                  disabled={device === "desktop"}
                  className='gap-2.5'
                >
                  <RectangleHorizontal className='text-muted-foreground h-4 w-4' />
                  <LocalizedText text={"Landscape"} />
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant='ghost'
            size='sm'
            className='h-7 w-7 shrink-0 rounded-md p-0'
            title='Reload'
            disabled={disabled}
            onClick={() => command({ type: "reload" })}
          >
            <RotateCw className='h-3.5 w-3.5' />
          </Button>
          <form
            className='w-[38cqw] max-w-[26rem] min-w-[5rem] shrink'
            onSubmit={(event) => {
              event.preventDefault();
              if (address.trim()) command({ type: "navigate", url: address });
              setEditing(false);
              (document.activeElement as HTMLElement | null)?.blur();
            }}
          >
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              onFocus={(event) => {
                setEditing(true);
                event.target.select();
              }}
              onBlur={() => setEditing(false)}
              disabled={disabled}
              spellCheck={false}
              title={currentUrl}
              aria-label='Live browser URL'
              placeholder='Search or enter address'
              className={cn(
                "h-7 w-full truncate rounded-md border border-transparent bg-transparent px-2.5 text-xs outline-none disabled:opacity-60",
                "hover:bg-background/60 focus:bg-background focus:border-blue-500",
                editing ? "text-left" : "text-center"
              )}
            />
          </form>
          <Button
            asChild={!!currentUrl}
            variant='ghost'
            size='sm'
            disabled={!currentUrl}
            className='h-7 w-7 shrink-0 rounded-md p-0'
          >
            {currentUrl ? (
              <a
                href={currentUrl}
                target='_blank'
                rel='noreferrer'
                title='Open in new tab'
              >
                <ExternalLink className='h-3.5 w-3.5' />
              </a>
            ) : (
              <ExternalLink className='h-3.5 w-3.5' />
            )}
          </Button>
        </div>

        <div className='flex min-w-0 items-center justify-end gap-0.5'>
          <Button
            variant='ghost'
            size='sm'
            disabled={disabled}
            title={userInControl ? "Hand back to agent" : "Take control"}
            aria-label={userInControl ? "Hand back to agent" : "Take control"}
            aria-pressed={userInControl}
            className={cn(
              "h-7 w-7 shrink-0 p-0",
              userInControl && "bg-muted text-foreground"
            )}
            onClick={() =>
              command({
                type: "control",
                controller: userInControl ? "agent" : "user",
              })
            }
          >
            {userInControl ? (
              <Bot className='h-3.5 w-3.5' />
            ) : (
              <Hand className='h-3.5 w-3.5' />
            )}
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className={cn(
              "relative h-7 w-7 shrink-0 p-0",
              devtools.open && "bg-muted text-foreground"
            )}
            title='Console & network'
            onClick={() => post({ type: "devtools" })}
          >
            <SquareTerminal className='h-3.5 w-3.5' />
            {devtools.errors > 0 && !devtools.open && (
              <span className='absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] leading-none text-white'>
                {devtools.errors > 9 ? "9+" : devtools.errors}
              </span>
            )}
          </Button>
        </div>
      </div>

      {tabs.length > 1 && (
        <div className='bg-background/95 flex shrink-0 gap-1 overflow-x-auto border-b px-3 py-1.5'>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              role='button'
              tabIndex={0}
              title={tab.url}
              onClick={() => command({ type: "tab", id: tab.id })}
              onKeyDown={(event) => {
                if (event.key === "Enter") command({ type: "tab", id: tab.id });
              }}
              className={cn(
                "flex h-7 max-w-52 shrink-0 cursor-pointer items-center gap-1 rounded-md border pr-1 pl-2.5 text-xs",
                tab.active
                  ? "bg-muted border-blue-500/60"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span className='truncate'>
                {tab.title || tab.url || "New tab"}
              </span>
              <button
                type='button'
                title='Close tab'
                className='hover:bg-background rounded p-0.5'
                onClick={(event) => {
                  event.stopPropagation();
                  command({ type: "close-tab", id: tab.id });
                }}
              >
                <X className='h-3 w-3' />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Human-in-the-loop status. Verification pages are completed by the
          person in this live view; the agent only waits and re-checks. */}
      {state?.pageStatus?.kind === "verification_required" ? (
        <div className='border-border bg-muted/40 text-foreground flex shrink-0 items-center gap-3 border-b px-4 py-2 text-xs'>
          <ShieldAlert className='text-muted-foreground h-4 w-4 shrink-0' />
          <p className='flex-1'>
            {state.pageStatus.reason}.{" "}
            {userInControl ? (
              <LocalizedText text="Complete it in the browser below, then reply “I'm done” in the chat." />
            ) : (
              <LocalizedText text="The agent can't do this for you. Take control to complete it yourself." />
            )}
          </p>
          {!userInControl && (
            <Button
              size='sm'
              variant='outline'
              className='h-7 text-xs'
              onClick={() => command({ type: "control", controller: "user" })}
            >
              <Hand className='h-3.5 w-3.5' />
              <LocalizedText text={"Take control"} />
            </Button>
          )}
        </div>
      ) : userInControl && state?.verificationCleared ? (
        <div className='border-border bg-muted/40 text-foreground flex shrink-0 items-center gap-3 border-b px-4 py-2 text-xs'>
          <CircleCheck className='text-muted-foreground h-4 w-4 shrink-0' />
          <p className='flex-1'>
            <LocalizedText text="Verification passed. Reply “I'm done” in the chat so the agent can continue." />
          </p>
        </div>
      ) : (
        userInControl &&
        state?.handoffReason && (
          <div className='border-border bg-muted/40 text-foreground flex shrink-0 items-center gap-3 border-b px-4 py-2 text-xs'>
            <Hand className='text-muted-foreground h-4 w-4 shrink-0' />
            <p className='flex-1'>
              <LocalizedText text={"The agent needs your help:"} />{" "}
              {state.handoffReason}.{" "}
              <LocalizedText text="Reply “I'm done” in the chat when finished." />
            </p>
          </div>
        )
      )}

      <div className='min-h-0 flex-1 overflow-hidden bg-black'>
        <iframe
          ref={iframeRef}
          src={src}
          title='Live browser'
          className='block size-full border-0'
          sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads'
          allow='clipboard-read; clipboard-write'
        />
      </div>
    </div>
  );
}

export function isLiveBrowserUrl(url?: string) {
  return !!url && url.includes("/agents/browser/live/");
}
