"use client";
import { ChatLayout } from "@/components/layout/chat-layout";
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useProjectDesign } from "@/context/DesignProject";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/utils/Loading";
import withAuth from "@/helper/hoc/withAuth";

const ChatIdPage = () => {
  const { fetchProject, isLoadingProject, error } = useProjectDesign();
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

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <Loading />
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
