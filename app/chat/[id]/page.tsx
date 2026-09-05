"use client";

import { ChatLayout } from "@/components/layout/chat-layout";
import { LocalizedText } from "@/components/localized-text";
import { Toaster } from "@/components/ui/sonner";
import { useProjectDesign } from "@/context/DesignProject";
import withAuth from "@/helper/hoc/withAuth";
import Loading from "@/utils/Loading";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ChatIdPage = () => {
  const { fetchProject, isLoadingProject, error, project } = useProjectDesign();
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  useEffect(() => {
    if (!projectId) {
      router.push("/chat");
      return;
    }

    fetchProject(projectId);
  }, [projectId, fetchProject, router]);

  if (isLoadingProject || (!project && !error)) {
    return (
      <div className='flex h-screen items-center justify-center bg-white dark:bg-black'>
        <Loading size={12} />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-white p-4 text-center dark:bg-black'>
        <h2 className='mb-2 text-xl font-semibold'>
          <LocalizedText text={"Error Loading Project"} />
        </h2>
        <p className='text-muted-foreground mb-4'>{error}</p>
        <button
          onClick={() => fetchProject(projectId)}
          className='text-primary-foreground rounded-md bg-indigo-600 px-4 py-2 transition-colors hover:bg-indigo-600 hover:bg-indigo-700 hover:bg-indigo-700/90'
        >
          <LocalizedText text={"Retry"} />
        </button>
      </div>
    );
  }

  return (
    <div className=''>
      <Toaster />
      <ChatLayout />
    </div>
  );
};

export default withAuth(ChatIdPage);
