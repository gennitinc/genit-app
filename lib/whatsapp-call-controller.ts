"use client";

import {
  type CallSession,
  acceptCall,
  createConversationCall,
  endConversationCall,
  rejectCall,
} from "@/lib/inbox-api";

// The agent's browser is the WhatsApp call's media endpoint. Meta only relays
// SDP through the Graph API, so no SIP gateway is needed: we produce the
// offer (outbound) or answer (inbound) here and the server forwards it.

export type CallPhase =
  | "idle"
  | "connecting"
  | "ringing"
  | "incoming"
  | "answering"
  | "active"
  | "ended";

export type CallState = {
  phase: CallPhase;
  call?: CallSession;
  customerName?: string;
  muted: boolean;
  connectedAt?: number;
  endedStatus?: CallSession["status"];
  error?: string;
};

const ICE_SERVERS: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
const TERMINAL = new Set(["declined", "missed", "ended", "failed"]);

export function browserCanCall() {
  return (
    typeof window !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof RTCPeerConnection !== "undefined"
  );
}

export function callCustomerName(call?: CallSession) {
  return typeof call?.conversation === "object"
    ? call.conversation.customerName || call.conversation.customerHandle
    : undefined;
}

function errorMessage(error: any) {
  return (
    error?.response?.data?.message ||
    (error?.name === "NotAllowedError"
      ? "Microphone access was blocked. Allow it in the browser to call."
      : error?.message) ||
    "The call could not be completed."
  );
}

// Meta takes one complete SDP (no trickle ICE), so wait for gathering.
function waitForIceGathering(pc: RTCPeerConnection, timeoutMs = 4_000) {
  return new Promise<void>((resolve) => {
    if (pc.iceGatheringState === "complete") return resolve();
    const done = () => {
      clearTimeout(timer);
      pc.removeEventListener("icegatheringstatechange", check);
      resolve();
    };
    const check = () => pc.iceGatheringState === "complete" && done();
    const timer = setTimeout(done, timeoutMs);
    pc.addEventListener("icegatheringstatechange", check);
  });
}

function waitForConnection(pc: RTCPeerConnection, timeoutMs = 8_000) {
  return new Promise<void>((resolve) => {
    const settled = () =>
      ["connected", "failed", "closed"].includes(pc.connectionState);
    if (settled()) return resolve();
    const done = () => {
      clearTimeout(timer);
      pc.removeEventListener("connectionstatechange", check);
      resolve();
    };
    const check = () => settled() && done();
    const timer = setTimeout(done, timeoutMs);
    pc.addEventListener("connectionstatechange", check);
  });
}

class WhatsAppCallController {
  private state: CallState = { phase: "idle", muted: false };
  private listeners = new Set<() => void>();
  private pc?: RTCPeerConnection;
  private stream?: MediaStream;
  private audio?: HTMLAudioElement;
  private applyingAnswer = false;
  private attempt = 0;
  private resetTimer?: ReturnType<typeof setTimeout>;
  // Incoming calls this browser declined or failed to answer.
  private dismissed = new Set<string>();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  get busy() {
    return !["idle", "ended"].includes(this.state.phase);
  }

  private set(patch: Partial<CallState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  private async openPeer() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
      video: false,
    });
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    const audio = new Audio();
    audio.autoplay = true;
    pc.ontrack = (event) => {
      audio.srcObject = event.streams[0] || new MediaStream([event.track]);
      void audio.play().catch(() => undefined);
    };
    pc.onconnectionstatechange = () => {
      if (pc === this.pc && pc.connectionState === "failed")
        void this.fail("The audio connection dropped.");
    };
    this.pc = pc;
    this.stream = stream;
    this.audio = audio;
    return pc;
  }

  private setMicrophone(enabled: boolean) {
    this.stream?.getAudioTracks().forEach((track) => (track.enabled = enabled));
  }

  private teardown() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.pc?.close();
    if (this.audio) this.audio.srcObject = null;
    this.pc = this.stream = this.audio = undefined;
    this.applyingAnswer = false;
  }

  private finish(status: CallSession["status"], error?: string) {
    this.teardown();
    this.set({ phase: "ended", endedStatus: status, error });
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => {
      if (this.state.phase === "ended")
        this.set({ phase: "idle", call: undefined, error: undefined });
    }, 3_000);
  }

  private async fail(message: string) {
    const call = this.state.call;
    this.finish("failed", message);
    if (call) await endConversationCall(call._id).catch(() => undefined);
  }

  async startOutbound(conversationId: string, customerName: string) {
    if (this.busy) throw new Error("Finish the current call first.");
    const attempt = ++this.attempt;
    clearTimeout(this.resetTimer);
    this.set({
      phase: "connecting",
      call: undefined,
      customerName,
      muted: false,
      connectedAt: undefined,
      endedStatus: undefined,
      error: undefined,
    });
    try {
      const pc = await this.openPeer();
      await pc.setLocalDescription(await pc.createOffer());
      await waitForIceGathering(pc);
      const call = await createConversationCall(conversationId, {
        mode: "whatsapp_native",
        callType: "audio",
        sdp: pc.localDescription!.sdp,
      });
      if (attempt !== this.attempt) {
        // The agent hung up while the call was being placed.
        await endConversationCall(call._id).catch(() => undefined);
        return call;
      }
      this.set({ phase: "ringing", call });
      await this.sync(call);
      return call;
    } catch (error) {
      if (attempt === this.attempt) {
        this.teardown();
        this.set({ phase: "idle", error: errorMessage(error) });
      }
      throw new Error(errorMessage(error));
    }
  }

  ring(call: CallSession) {
    if (this.busy || this.dismissed.has(call._id) || !call.metadata?.offerSdp)
      return;
    clearTimeout(this.resetTimer);
    this.set({
      phase: "incoming",
      call,
      customerName: callCustomerName(call) || "WhatsApp caller",
      muted: false,
      connectedAt: undefined,
      endedStatus: undefined,
      error: undefined,
    });
  }

  async answer() {
    const call = this.state.call;
    const offer = call?.metadata?.offerSdp;
    if (this.state.phase !== "incoming" || !call || !offer) return;
    const attempt = ++this.attempt;
    this.set({ phase: "answering" });
    try {
      const pc = await this.openPeer();
      // Meta: send media only after accept succeeds, or the caller's first
      // words are clipped.
      this.setMicrophone(false);
      await pc.setRemoteDescription({ type: "offer", sdp: offer });
      await pc.setLocalDescription(await pc.createAnswer());
      await waitForIceGathering(pc);
      await acceptCall(call._id, {
        stage: "pre_accept",
        sdp: pc.localDescription!.sdp,
      });
      await waitForConnection(pc);
      const accepted = await acceptCall(call._id, { stage: "accept" });
      if (attempt !== this.attempt) return;
      this.setMicrophone(!this.state.muted);
      this.set({ phase: "active", call: accepted, connectedAt: Date.now() });
    } catch (error) {
      this.dismissed.add(call._id);
      if (attempt === this.attempt) {
        this.teardown();
        this.set({ phase: "idle", call: undefined, error: errorMessage(error) });
      }
      throw new Error(errorMessage(error));
    }
  }

  /** An incoming call vanished from the live list (it timed out). */
  dropIncoming(callId: string) {
    if (this.state.phase === "incoming" && this.state.call?._id === callId)
      this.set({ phase: "idle", call: undefined });
  }

  async decline() {
    const call = this.state.call;
    if (this.state.phase !== "incoming" || !call) return;
    this.dismissed.add(call._id);
    this.set({ phase: "idle", call: undefined });
    await rejectCall(call._id).catch(() => undefined);
  }

  async hangup() {
    const call = this.state.call;
    this.attempt++;
    this.finish("ended");
    if (call) await endConversationCall(call._id).catch(() => undefined);
  }

  toggleMute() {
    const muted = !this.state.muted;
    if (this.state.phase === "active" || this.state.phase === "ringing")
      this.setMicrophone(!muted);
    this.set({ muted });
  }

  /** Apply the server's view of this browser's call (socket or polling). */
  async sync(call: CallSession) {
    const current = this.state.call;
    if (!current || current._id !== call._id) return;

    if (this.state.phase === "incoming") {
      // The caller hung up or a teammate picked up first.
      if (call.status !== "ringing" || call.metadata?.claimedBy)
        this.set({ phase: "idle", call: undefined });
      return;
    }

    const answer = call.metadata?.remoteAnswerSdp;
    const pc = this.pc;
    if (
      pc &&
      call.direction === "outbound" &&
      answer &&
      !pc.remoteDescription &&
      !this.applyingAnswer
    ) {
      this.applyingAnswer = true;
      try {
        await pc.setRemoteDescription({ type: "answer", sdp: answer });
      } catch {
        return this.fail("WhatsApp returned an audio answer we could not use.");
      }
    }

    if (TERMINAL.has(call.status)) {
      if (this.state.phase !== "ended") this.finish(call.status, call.error);
      return;
    }
    if (call.status === "answered" && this.state.phase === "ringing")
      this.set({ phase: "active", call, connectedAt: Date.now() });
  }
}

export const whatsappCallController = new WhatsAppCallController();
