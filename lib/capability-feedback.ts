export function isCapabilityUnavailable(...messages: (string | undefined)[]) {
  return /currently exposes no|does not provide .+ events|cannot listen for|selected (event|action) is not available|no connected app capability matches/i.test(
    messages.filter(Boolean).join(" ")
  );
}
