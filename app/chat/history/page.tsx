"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { useRef } from "react";
import withAuth from "@/helper/hoc/withAuth";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Clock,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Archive,
  ChevronRight,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/context/AuthenticatedContext";
import { apiResponse } from "@/utils/apiResponse";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import AccountActionModal from "@/components/user/account-action-modal";
import { ProjectActionModal } from "@/components/user/project-action-moda";


interface Project {
  _id: string;
  title: string;
  status: string;
  userId: string;
  userName: string;
  messages: Array<{
    role: string;
    type: string;
    parts: Array<{
      type: string;
      text?: string;
    }>;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

function ChatHistoryPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useUserContext();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiResponse.get("/project/myprojects");

      if (response.status == 200) {
        setProjects(response.data.projects || []);
      } else {
        setError("Failed to fetch projects");
      }
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      setError(error.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAllProjects();
    }
  }, [user?._id]);

  // Format timestamp to relative time
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  // Get the last message from a project
  const getLastMessage = (project: Project) => {
    if (!project.messages || project.messages.length === 0) {
      return "No messages yet";
    }

    const lastMessage = project.messages[project.messages.length - 1];
    const textPart = lastMessage.parts?.find(
      (part) => part.type === "text" && part.text
    );
    return textPart?.text || "No text content";
  };

  // Navigate to project chat
  const handleProjectClick = (projectId: string) => {
    router.push(`/chat/${projectId}`);
  };

  // Handle project actions
  const handleArchiveProject = async (projectId: string) => {
    // TODO: Implement archive functionality
    console.log("Archive project:", projectId);
  };

  const handleDeleteProject = async (projectId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete project:", projectId);
    setIsDeletingProject(true);

    try {
      
      const response = await apiResponse.delete(`/project/${projectId}`);

      if (response.status == 200) {
        setIsDeletingProject(false);
        setActiveProject(null);
        toast("Operation Completed", {
          description: "project and resources has been deleted successfully",
        });
        setIsDeleteModalOpen(false)
      } else {
      }
    } catch (error) {
      
    }
  };

  return (
    <div className="flex relative w-full h-screen overflow-hidden bg-white dark:bg-black">
      <Toaster />
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container"
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <div className="flex-1 p-4 lg:p-8">
          {/* Centered container with custom width for desktop */}
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                  Chat History
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your recent conversations
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAllProjects}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "" : ""}`} />
                Refresh
              </Button>
            </div>

            {/* Chat History List */}
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-16">
                  <Loader className="animate-spin rounded-full h-8 w-8 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    Loading conversations...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    Error loading conversations
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAllProjects}
                  >
                    Try Again
                  </Button>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    No conversations yet
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Start a new conversation to see it here
                  </p>
                </div>
              ) : (
                projects.map((project) => (
                  <Card
                    key={project._id}
                    className="hover:shadow-sm hover:border-border/60 transition-all duration-200 cursor-pointer group border-border/40"
                    onClick={() => handleProjectClick(project._id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors mb-1">
                            {project.title}
                          </h3>

                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                            {getLastMessage(project)}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(project.updatedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {project.messages?.length || 0}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-100 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                disabled={true}
                                className="cursor-not-allowed"
                                onClick={() =>
                                  handleArchiveProject(project._id)
                                }
                              >
                                <Archive className="h-3 w-3 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDeleteModalOpen(true);
                                  setActiveProject(project);
                                  // handleDeleteProject(project._id);
                                }}
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-100 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ProjectActionModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          handleDeleteProject(String(activeProject?._id));
        }}
        loading={isDeletingProject}
        title="Project account"
        description="This action will removes this project, assets, and history. This cannot be undone."
        confirmLabel="Delete Project"
        variant="destructive"
      />
    </div>
  );
}

export default withAuth(ChatHistoryPage);
