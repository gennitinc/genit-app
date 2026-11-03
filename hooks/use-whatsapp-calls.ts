"use client";

import { inboxLiveCallsQueryKey } from "@/hooks/use-inbox";
import { fetchLiveCalls } from "@/lib/inbox-api";
import { whatsappCallController } from "@/lib/whatsapp-call-controller";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useSyncExternalStore } from "react";

/**
 * Feeds live WhatsApp call state into the browser call controller. Socket
 * events invalidate the query instantly; polling is the fallback for events
 * emitted on another server instance or while the socket was down.
 */
export function useWhatsAppCalls() {
  const state = useSyncExternalStore(
    whatsappCallController.subscribe,
    whatsappCallController.getSnapshot,
    whatsappCallController.getSnapshot
  );
  const inCall = !["idle", "ended"].includes(state.phase);
  const { data: calls } = useQuery({
    queryKey: inboxLiveCallsQueryKey,
    queryFn: fetchLiveCalls,
    refetchInterval: inCall ? 2_000 : 5_000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!calls) return;
    const current = whatsappCallController.getSnapshot().call;
    const mine = current && calls.find((call) => call._id === current._id);
    if (mine) void whatsappCallController.sync(mine);
    else if (current) whatsappCallController.dropIncoming(current._id);
    const incoming = calls.find(
      (call) =>
        call.direction === "inbound" &&
        call.status === "ringing" &&
        call.metadata?.transport !== "gateway" &&
        !call.metadata?.claimedBy
    );
    if (incoming) whatsappCallController.ring(incoming);
  }, [calls]);

  useEffect(() => {
    if (!inCall) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [inCall]);

  return state;
}
