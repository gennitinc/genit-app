"use client";
import { ChatLayout } from "@/components/layout/chat-layout";
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
        <Loading />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-white p-4 text-center dark:bg-black'>
        <h2 className='mb-2 text-xl font-semibold'>Error Loading Project</h2>
        <p className='text-muted-foreground mb-4'>{error}</p>
        <button
          onClick={() => fetchProject(projectId)}
          className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <ChatLayout />
    </div>
  );
};

export default withAuth(ChatIdPage);
