"use client";
import VerifyEmailComp from "@/components/auth/VerifyEmail";
import Loading from "@/utils/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";

const VerifyEmail = () => {
  return (
    <React.Suspense
      fallback={
        <div className='flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-white dark:bg-black'>
          <Loading />
        </div>
      }
    >
      <VerifyEmailComp />
    </React.Suspense>
  );
};

export default VerifyEmail;
