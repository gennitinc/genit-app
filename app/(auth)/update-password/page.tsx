"use client";
import { UpdatePasswordComp } from "@/components/auth/updatepassword";
import React from "react";

// import Loading from "@/utils/Loading";

function Page() {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[100dvh] overflow-hidden w-full bg-black">
          {/* <Loading /> */}
        </div>
      }
    >
      <UpdatePasswordComp />
    </React.Suspense>
  );
}

export default Page;
