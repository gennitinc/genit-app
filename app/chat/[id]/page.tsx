"use client";
import { ChatLayout } from "@/components/layout/chat-layout";
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useProjectDesign } from "@/context/DesignProject";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/utils/Loading";
import withAuth from "@/helper/hoc/withAuth";

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
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <Loading />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-black p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Error Loading Project</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button 
          onClick={() => fetchProject(projectId)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90"
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
