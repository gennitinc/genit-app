"use client";
import { UpdatePasswordComp } from "@/components/auth/updatepassword";
import React from "react";

// import Loading from "@/utils/Loading";

function Page() {
  return (
    <React.Suspense
      fallback={
        <div className='flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-black'>
          {/* <Loading /> */}
        </div>
      }
    >
      <UpdatePasswordComp />
    </React.Suspense>
  );
}

export default Page;
