export function isCapabilityUnavailable(...errorCodes: (string | undefined)[]) {
  return errorCodes.includes("genit_feature_missing");
}
