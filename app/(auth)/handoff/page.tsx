"use client";

import { getAuthRedirect, withAuthRedirect } from "@/lib/auth-redirect";
import Loading from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import cookie from "js-cookie";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const SESSION_DAYS = 30;

/**
 * The mobile app opens web-only pages (like the AI chat) here with a
 * single-use code. Swapping it for a session keeps tokens out of URLs.
 */
function Handoff() {
  const params = useSearchParams();
  const next = getAuthRedirect(params);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    // The code is single-use, so never send it twice (Strict Mode runs effects twice).
    if (started.current) return;
    started.current = true;
    const code = params.get("code");
    if (!code) {
      window.location.replace(withAuthRedirect("/signin", next));
      return;
    }
    apiResponse
      .post<{ token: string }>("auth/handoff-exchange", { code })
      .then(({ data }) => {
        cookie.set("genituToken", data.token, {
          expires: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
        });
        // A full load, so the app starts with the new session.
        window.location.replace(next);
      })
      .catch(() => setFailed(true));
  }, [params, next]);

  if (failed) {
    return (
      <div className='flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-white px-6 text-center dark:bg-black'>
        <p className='text-lg font-semibold'>This link has expired</p>
        <p className='text-muted-foreground text-sm'>
          Open it again from the Genit app, or sign in here.
        </p>
        <a
          className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white'
          href={withAuthRedirect("/signin", next)}
        >
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className='flex min-h-[100dvh] w-full items-center justify-center bg-white dark:bg-black'>
      <Loading />
    </div>
  );
}

export default function HandoffPage() {
  return (
    <React.Suspense
      fallback={
        <div className='flex min-h-[100dvh] w-full items-center justify-center bg-white dark:bg-black'>
          <Loading />
        </div>
      }
    >
      <Handoff />
    </React.Suspense>
  );
}
