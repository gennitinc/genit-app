"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  type CallCapabilities,
  type CallSession,
  type InboxConversation,
  type WhatsAppTemplate,
  createConversationCall,
  endConversationCall,
  fetchConversationCalls,
  fetchConversationWhatsAppTemplates,
  requestConversationCallPermission,
} from "@/lib/inbox-api";
import { Loader2, Phone, Video } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const EMPTY_CAPABILITIES: CallCapabilities = {
  meetingLink: { available: false },
  whatsappNative: {
    available: false,
    permissionGranted: false,
    gatewayConfigured: false,
  },
};

function errorMessage(error: any) {
  return (
    error?.response?.data?.message || error?.message || "Call operation failed"
  );
}

export function CallDialog({
  conversation,
  open,
  onOpenChange,
}: {
  conversation: InboxConversation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [capabilities, setCapabilities] = useState(EMPTY_CAPABILITIES);
  const [calls, setCalls] = useState<CallSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [permissionTemplates, setPermissionTemplates] = useState<
    WhatsAppTemplate[]
  >([]);
  const [permissionTemplateId, setPermissionTemplateId] = useState("");
  const replyWindowClosed =
    conversation.platform === "whatsapp" &&
    (!conversation.metadata?.lastInboundAt ||
      Date.now() - Date.parse(String(conversation.metadata.lastInboundAt)) >
        24 * 60 * 60 * 1000);

  const refresh = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await fetchConversationCalls(conversation._id);
      setCapabilities(result.capabilities);
      setCalls(result.calls);
      if (
        !silent &&
        conversation.platform === "whatsapp" &&
        result.capabilities.whatsappNative.available &&
        !result.capabilities.whatsappNative.permissionGranted
      ) {
        const templates = await fetchConversationWhatsAppTemplates(
          conversation._id
        ).catch(() => []);
        const eligible = templates.filter((template) =>
          template.components?.some(
            (component) =>
              String(component.type || "").toLowerCase() ===
              "call_permission_request"
          )
        );
        setPermissionTemplates(eligible);
        setPermissionTemplateId((current) => current || eligible[0]?.id || "");
      }
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    void refresh();
    const interval = window.setInterval(() => void refresh(true), 5_000);
    return () => window.clearInterval(interval);
  }, [open, conversation._id]);

  const create = async (
    mode: "meeting_link" | "whatsapp_native",
    callType: "audio" | "video",
    meetingProvider?: "google_meet" | "microsoft_teams"
  ) => {
    setBusy(true);
    try {
      const call = await createConversationCall(conversation._id, {
        mode,
        callType,
        meetingProvider,
        message: message.trim() || undefined,
      });
      setCalls((current) => [call, ...current]);
      toast.success(
        mode === "meeting_link"
          ? "Call invitation sent"
          : "WhatsApp call started"
      );
      if (call.joinUrl)
        window.open(call.joinUrl, "_blank", "noopener,noreferrer");
      setMessage("");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const requestPermission = async () => {
    setBusy(true);
    try {
      const template = permissionTemplates.find(
        (item) => item.id === permissionTemplateId
      );
      const call = await requestConversationCallPermission(conversation._id, {
        message: message.trim() || undefined,
        template:
          replyWindowClosed && template
            ? {
                name: template.name,
                language: template.language || "en_US",
              }
            : undefined,
      });
      setCalls((current) => [call, ...current]);
      toast.success("WhatsApp call permission request sent");
      setMessage("");
      await refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const end = async (call: CallSession) => {
    setBusy(true);
    try {
      const updated = await endConversationCall(call._id);
      setCalls((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );
      toast.success("Call ended");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Call {conversation.customerName}</DialogTitle>
          <DialogDescription>
            Send a Google Meet or Microsoft Teams invitation on this channel, or
            use native WhatsApp voice calling when the number and customer
            permission allow it.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className='flex h-40 items-center justify-center'>
            <Loader2 className='text-muted-foreground h-5 w-5 animate-spin' />
          </div>
        ) : (
          <div className='space-y-4'>
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder='Optional invitation or permission context'
              maxLength={500}
            />

            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='rounded-xl border p-4'>
                <div className='mb-1 flex items-center gap-2 font-medium'>
                  <Video className='h-4 w-4' /> Meeting link
                </div>
                <p className='text-muted-foreground mb-4 text-xs'>
                  Creates a meeting and sends its link through{" "}
                  {conversation.platform}.
                </p>
                <div className='flex gap-2'>
                  {capabilities.meetingLink.providers?.includes(
                    "google_meet"
                  ) && (
                    <Button
                      size='sm'
                      disabled={busy}
                      onClick={() =>
                        void create("meeting_link", "video", "google_meet")
                      }
                    >
                      Google Meet
                    </Button>
                  )}
                  {capabilities.meetingLink.providers?.includes(
                    "microsoft_teams"
                  ) && (
                    <Button
                      size='sm'
                      variant='outline'
                      disabled={busy}
                      onClick={() =>
                        void create("meeting_link", "video", "microsoft_teams")
                      }
                    >
                      Teams
                    </Button>
                  )}
                </div>
                {!capabilities.meetingLink.available && (
                  <p className='mt-2 text-xs text-amber-600'>
                    Connect Google Meet or reconnect Outlook with Teams meeting
                    permission.
                  </p>
                )}
              </div>

              <div className='rounded-xl border p-4'>
                <div className='mb-1 flex items-center gap-2 font-medium'>
                  <Phone className='h-4 w-4' /> WhatsApp native
                </div>
                <p className='text-muted-foreground mb-4 text-xs'>
                  Voice calling through WhatsApp Business Calling. Customer
                  permission is mandatory.
                </p>
                {!capabilities.whatsappNative.available ? (
                  <p className='text-xs text-amber-600'>
                    {capabilities.whatsappNative.reason}
                  </p>
                ) : !capabilities.whatsappNative.permissionGranted ? (
                  <div className='space-y-2'>
                    {replyWindowClosed && permissionTemplates.length > 0 && (
                      <select
                        className='border-input bg-background h-9 w-full rounded-md border px-2 text-xs'
                        value={permissionTemplateId}
                        onChange={(event) =>
                          setPermissionTemplateId(event.target.value)
                        }
                      >
                        {permissionTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} · {template.language}
                          </option>
                        ))}
                      </select>
                    )}
                    <Button
                      size='sm'
                      disabled={
                        busy ||
                        (replyWindowClosed && permissionTemplates.length === 0)
                      }
                      onClick={() => void requestPermission()}
                    >
                      Request permission
                    </Button>
                    {replyWindowClosed && permissionTemplates.length === 0 && (
                      <p className='text-xs text-amber-600'>
                        The 24-hour window is closed. Create an approved
                        WhatsApp template with a call permission request
                        component first.
                      </p>
                    )}
                  </div>
                ) : (
                  <Button
                    size='sm'
                    disabled={
                      busy || !capabilities.whatsappNative.gatewayConfigured
                    }
                    onClick={() => void create("whatsapp_native", "audio")}
                  >
                    Start voice call
                  </Button>
                )}
                {capabilities.whatsappNative.available &&
                  !capabilities.whatsappNative.gatewayConfigured && (
                    <p className='mt-2 text-xs text-amber-600'>
                      A SIP/WebRTC call gateway must be configured to carry
                      audio.
                    </p>
                  )}
              </div>
            </div>

            {calls.length > 0 && (
              <div>
                <p className='mb-2 text-sm font-medium'>Recent calls</p>
                <div className='max-h-40 space-y-2 overflow-y-auto'>
                  {calls.map((call) => (
                    <div
                      key={call._id}
                      className='flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2 text-xs dark:bg-zinc-900'
                    >
                      <div className='min-w-0'>
                        <p>
                          {call.mode === "meeting_link"
                            ? call.metadata?.meetingProvider ===
                              "microsoft_teams"
                              ? "Microsoft Teams"
                              : "Google Meet"
                            : "WhatsApp voice"}{" "}
                          · {call.callType}
                        </p>
                        <p
                          className={
                            call.status === "failed"
                              ? "truncate text-red-600"
                              : "text-muted-foreground"
                          }
                          title={call.error}
                        >
                          {call.status.replaceAll("_", " ")}
                          {call.error ? ` · ${call.error}` : ""}
                        </p>
                      </div>
                      <div className='flex shrink-0 gap-1'>
                        {call.joinUrl &&
                          !["ended", "failed"].includes(call.status) && (
                            <Button
                              asChild
                              size='sm'
                              variant='ghost'
                              className='h-7 px-2'
                            >
                              <a
                                href={call.joinUrl}
                                target='_blank'
                                rel='noreferrer'
                              >
                                Join
                              </a>
                            </Button>
                          )}
                        {["invited", "ringing", "answered"].includes(
                          call.status
                        ) && (
                          <Button
                            size='sm'
                            variant='ghost'
                            className='h-7 px-2 text-red-600'
                            disabled={busy}
                            onClick={() => void end(call)}
                          >
                            End
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
