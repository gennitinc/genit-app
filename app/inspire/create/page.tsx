"use client";

import { LoadingFileLoader } from "@/utils/Loading";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * This page has been deprecated and split into:
 * - /apps/image-generation
 * - /apps/video-generation
 *
 * We redirect users based on the 'mode' query parameter.
 */
export default function CreateRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    const params = searchParams.toString();
    const target =
      mode === "ai-video-gen"
        ? `/apps/video-generation${params ? `?${params}` : ""}`
        : `/apps/image-generation${params ? `?${params}` : ""}`;

    router.replace(target);
  }, [router, searchParams, mode]);

  return (
    <div className='flex h-screen w-full items-center justify-center bg-white dark:bg-black'>
      <div className='flex flex-col items-center gap-4'>
        <LoadingFileLoader size={16} />
        <p className='text-muted-foreground text-sm font-medium'>
          Redirecting to newer app experience...
        </p>
      </div>
    </div>
  );
}
