"use client";

import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";

const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

type Props = {
  loading: boolean;
  loadingContent: React.ReactNode;
  onIdToken: (idToken: string) => void;
  onError: () => void;
};

/**
 * Google-rendered button, the only sign-in flow in the browser that returns an
 * ID token. `useGoogleLogin` only gives an access token, which the server can't
 * verify as proof of identity.
 */
export function GoogleSignInButton({
  loading,
  loadingContent,
  onIdToken,
  onError,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const available = containerRef.current?.offsetWidth ?? MAX_WIDTH;
    setWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, available)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex min-h-[44px] w-full items-center justify-center"
    >
      {loading ? (
        <Button type="button" variant="outline" className="w-full py-5" disabled>
          {loadingContent}
        </Button>
      ) : (
        width > 0 && (
          <GoogleLogin
            text="continue_with"
            logo_alignment="center"
            size="large"
            theme="outline"
            width={width}
            onSuccess={({ credential }) => {
              if (credential) onIdToken(credential);
              else onError();
            }}
            onError={onError}
          />
        )
      )}
    </div>
  );
}
