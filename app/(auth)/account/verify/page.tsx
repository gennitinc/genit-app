"use client";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from "notistack";

import Loading from "@/utils/Loading";
import VerifyEmailComp from "@/components/auth/VerifyEmail";


const VerifyEmail = () => {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[100dvh] overflow-hidden w-full bg-black">
          <Loading />
        </div>
      }
    >
      <VerifyEmailComp />
    </React.Suspense>
  );
};

export default VerifyEmail;
