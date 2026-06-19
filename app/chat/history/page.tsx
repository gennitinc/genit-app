"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import AccountActionModal from "@/components/user/account-action-modal";
import { ProjectActionModal } from "@/components/user/project-action-moda";
import { useUserContext } from "@/context/AuthenticatedContext";
import withAuth from "@/helper/hoc/withAuth";
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import {
  Archive,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Loader,
  MessageSquare,
  MoreHorizontal,
  Presentation,
  Search,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";

interface Project {
  _id: string;
  title: string;
  status: string;
  userId: string;
  userName: string;
  category?: string;
  type?: string;
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputVal, setSearchInputVal] = useState("");
  const [isRestored, setIsRestored] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestFetchRef = useRef(0);
  const activeOrgId =
    (user?.currentOrganization && typeof user.currentOrganization === "object"
      ? (user.currentOrganization as any)._id
      : user?.currentOrganization) ||
    (user?.business && typeof user.business === "object"
      ? (user.business as any)._id
      : user?.business);

  const fetchAllProjects = useCallback(
    async (
      pageNumber: number = 1,
      append: boolean = false,
      searchVal: string = searchQuery
    ) => {
      const fetchId = ++latestFetchRef.current;

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError(null);
        }

        // Build query parameters
        const params = new URLSearchParams();
        params.append("type", "chat");
        if (searchVal) {
          params.append("search", searchVal);
        }
        params.append("page", pageNumber.toString());
        params.append("limit", "10");
        if (activeOrgId) {
          params.append("orgId", String(activeOrgId));
        }

        const response = await apiResponse.get(
          `/project/myprojects?${params.toString()}`
        );

        if (fetchId !== latestFetchRef.current) return;

        if (response.status == 200) {
          const newProjects = response.data.projects || [];
          const pagination = response.data.pagination;

          if (append) {
            setProjects((prev) => [...prev, ...newProjects]);
          } else {
            setProjects(newProjects);
          }

          setHasMore(pagination?.hasNextPage || false);
          setPage(pageNumber);
        } else {
          setError("Failed to fetch projects");
        }
      } catch (error: any) {
        if (fetchId !== latestFetchRef.current) return;
        console.error("Error fetching projects:", error);
        setError(error.response?.data?.message || "Failed to fetch projects");
      } finally {
        if (fetchId === latestFetchRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [activeOrgId, searchQuery]
  );

  // Load more projects when scrolling
  const loadMoreProjects = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchAllProjects(page + 1, true, searchQuery);
    }
  }, [loadingMore, hasMore, page, fetchAllProjects, searchQuery]);

  // Load state from sessionStorage on mount (if organization matches)
  useEffect(() => {
    const cachedOrgId = sessionStorage.getItem("genit_history_orgId_v2");
    const activeOrgIdStr = activeOrgId ? String(activeOrgId) : null;

    if (activeOrgIdStr && cachedOrgId === activeOrgIdStr) {
      const cachedProjects = sessionStorage.getItem(
        "genit_history_projects_v2"
      );
      const cachedPage = sessionStorage.getItem("genit_history_page_v2");
      const cachedHasMore = sessionStorage.getItem("genit_history_hasMore_v2");
      const cachedSearchQuery = sessionStorage.getItem(
        "genit_history_searchQuery_v2"
      );
      const cachedScrollTop = sessionStorage.getItem(
        "genit_history_scrollTop_v2"
      );

      if (cachedProjects) {
        try {
          setProjects(JSON.parse(cachedProjects));
          if (cachedPage) setPage(parseInt(cachedPage, 10));
          if (cachedHasMore) setHasMore(cachedHasMore === "true");
          if (cachedSearchQuery) {
            setSearchQuery(cachedSearchQuery);
            setSearchInputVal(cachedSearchQuery);
          }

          setLoading(false);
          setIsRestored(true);

          // Wait for the next tick to ensure DOM is rendered, then scroll
          setTimeout(() => {
            if (scrollContainerRef.current && cachedScrollTop) {
              scrollContainerRef.current.scrollTop = parseInt(
                cachedScrollTop,
                10
              );
            }
          }, 100);
          return;
        } catch (e) {
          console.error("Failed to parse cached history state", e);
        }
      }
    }

    // If cache does not exist or organization mismatched, start fresh
    setProjects([]);
    setPage(1);
    setHasMore(true);
    setSearchQuery("");
    setSearchInputVal("");
    setIsRestored(true);
  }, []); // Run ONLY on mount!

  const lastOrgIdRef = useRef<string | null>(null);

  // Switch organizations cleanly and fetch fresh chats
  useEffect(() => {
    if (!activeOrgId || !isRestored) return;

    const orgIdStr = String(activeOrgId);

    // Ignore initial mount setting
    if (lastOrgIdRef.current === null) {
      lastOrgIdRef.current = orgIdStr;
      return;
    }

    // If organization actually changed
    if (lastOrgIdRef.current !== orgIdStr) {
      lastOrgIdRef.current = orgIdStr;

      // Clear cache
      sessionStorage.removeItem("genit_history_orgId_v2");
      sessionStorage.removeItem("genit_history_projects_v2");
      sessionStorage.removeItem("genit_history_page_v2");
      sessionStorage.removeItem("genit_history_hasMore_v2");
      sessionStorage.removeItem("genit_history_searchQuery_v2");
      sessionStorage.removeItem("genit_history_scrollTop_v2");

      // Reset state
      setProjects([]);
      setPage(1);
      setHasMore(true);
      setSearchQuery("");
      setSearchInputVal("");

      // Fetch fresh
      fetchAllProjects(1, false, "");
    }
  }, [activeOrgId, isRestored, fetchAllProjects]);

  // Sync state to sessionStorage when state updates (but only after restoring on mount)
  useEffect(() => {
    if (isRestored && activeOrgId) {
      sessionStorage.setItem("genit_history_orgId_v2", String(activeOrgId));
      sessionStorage.setItem(
        "genit_history_projects_v2",
        JSON.stringify(projects)
      );
      sessionStorage.setItem("genit_history_page_v2", page.toString());
      sessionStorage.setItem("genit_history_hasMore_v2", String(hasMore));
      sessionStorage.setItem("genit_history_searchQuery_v2", searchQuery);
    }
  }, [projects, page, hasMore, searchQuery, isRestored, activeOrgId]);

  // Fetch projects when searchQuery changes (unless on initial mount restoration)
  useEffect(() => {
    if (isRestored && user?._id) {
      const cachedSearchQuery =
        sessionStorage.getItem("genit_history_searchQuery_v2") || "";
      const isInitialRestore =
        projects.length > 0 && searchQuery === cachedSearchQuery;
      if (!isInitialRestore) {
        setPage(1);
        setProjects([]);
        setHasMore(true);
        fetchAllProjects(1, false, searchQuery);
      }
    }
  }, [searchQuery, isRestored, user?._id, activeOrgId, fetchAllProjects]);

  // Initial fetch if nothing was restored from sessionStorage
  useEffect(() => {
    if (isRestored && user?._id && projects.length === 0 && !searchQuery) {
      fetchAllProjects(1, false, "");
    }
  }, [isRestored, user?._id, projects.length, searchQuery, fetchAllProjects]);

  // Handle scroll to load more and save scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      // Save scroll top to sessionStorage
      sessionStorage.setItem(
        "genit_history_scrollTop_v2",
        scrollTop.toString()
      );

      // Load more when user is 200px from bottom
      if (
        scrollHeight - scrollTop - clientHeight < 200 &&
        hasMore &&
        !loadingMore
      ) {
        loadMoreProjects();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, loadMoreProjects]);

  // Clean up search debouncing timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInputVal(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(val);
    }, 400);
  };

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
    const projectType = project.type || project.category;

    // For image/video/presentation projects, show prompt or title
    if (projectType === "ai-image-gen" && (project as any).imageData?.prompt) {
      return (project as any).imageData.prompt;
    }
    if (projectType === "ai-video-gen" && (project as any).videoData?.prompt) {
      return (project as any).videoData.prompt;
    }
    if (projectType === "presentations" || projectType === "presentation") {
      return `Presentation with ${(project as any).presentationData?.outline?.length || 0} slides`;
    }

    // For chat projects, show last message
    if (!project.messages || project.messages.length === 0) {
      return "No messages yet";
    }

    const lastMessage = project.messages[project.messages.length - 1];
    const textPart = lastMessage.parts?.find(
      (part) => part.type === "text" && part.text
    );
    return textPart?.text || "No text content";
  };

  // Projects are already filtered on the server, so we can use them directly
  const filteredProjects = projects;

  // Navigate to project based on type
  const handleProjectClick = (project: Project) => {
    const projectType = project.type || project.category;

    if (projectType === "ai-image-gen") {
      router.push(`/inspire/create?mode=ai-image-gen&projectId=${project._id}`);
    } else if (projectType === "ai-video-gen") {
      router.push(`/inspire/create?mode=ai-video-gen&projectId=${project._id}`);
    } else if (
      projectType === "presentations" ||
      projectType === "presentation"
    ) {
      router.push(`/presentation/${project._id}/studio`);
    } else {
      // Default to chat
      router.push(`/chat/${project._id}`);
    }
  };

  // Handle project actions
  const handleArchiveProject = async (projectId: string) => {
    try {
      const response = await apiResponse.patch(
        `/project/${projectId}/archive`,
        { archive: true },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update the projects array by removing the archived project
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId)
        );
        toast.success("Project archived successfully");
      } else {
        toast.error("Failed to archive project");
      }
    } catch (error: any) {
      console.error("Error archiving project:", error);
      toast.error(error.response?.data?.message || "Failed to archive project");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setIsDeletingProject(true);

    try {
      const response = await apiResponse.delete(`/project/${projectId}`);

      if (response.status == 200) {
        // Update the projects array by removing the deleted project
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId)
        );
        setIsDeletingProject(false);
        setActiveProject(null);
        toast("Operation Completed", {
          description: "project and resources has been deleted successfully",
        });
        setIsDeleteModalOpen(false);
      } else {
        setIsDeletingProject(false);
        toast.error("Failed to delete project");
      }
    } catch (error: any) {
      console.error("Error deleting project:", error);
      setIsDeletingProject(false);
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div
        ref={scrollContainerRef}
        className='scroll-container flex flex-1 flex-col overflow-auto will-change-scroll'
      >
        <TopNavWithAurora
          scrollContainerRef={
            scrollContainerRef as React.RefObject<HTMLDivElement>
          }
        />
        <div className='flex-1 rounded-t-2xl border-2 border-b-0 p-4 lg:p-8'>
          {/* Centered container with custom width for desktop */}
          <div className='mx-auto max-w-4xl'>
            {/* Header */}
            <div className='mb-6'>
              <div className='mb-4 flex items-center justify-between'>
                <div>
                  <h1 className='text-foreground mb-1 text-2xl font-semibold'>
                    History
                  </h1>
                  <p className='text-muted-foreground text-sm'>
                    Your recent projects and conversations
                  </p>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setPage(1);
                    setHasMore(true);
                    setProjects([]);
                    fetchAllProjects(1, false, searchQuery);
                  }}
                  disabled={loading}
                  className='gap-2'
                >
                  <RefreshCw
                    className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>

              {/* Search Bar */}
              <div className='relative mb-4 w-full'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  type='text'
                  value={searchInputVal}
                  onChange={handleSearchChange}
                  placeholder='Search projects by title or prompt...'
                  className='h-10 w-full border border-zinc-200 bg-zinc-50 pr-9 pl-9 dark:border-zinc-800 dark:bg-zinc-950'
                />
                {searchInputVal && (
                  <button
                    onClick={() => {
                      setSearchInputVal("");
                      setSearchQuery("");
                    }}
                    className='absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                  >
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            </div>

            {/* Chat History List */}
            <div className='space-y-2'>
              {loading ? (
                <div className='py-16 text-center'>
                  <Loader className='mx-auto mb-3 h-8 w-8 animate-spin rounded-full' />
                  <h3 className='text-foreground mb-1 text-sm font-medium'>
                    Loading conversations...
                  </h3>
                </div>
              ) : error ? (
                <div className='py-16 text-center'>
                  <MessageSquare className='text-muted-foreground mx-auto mb-3 h-8 w-8' />
                  <h3 className='text-foreground mb-1 text-sm font-medium'>
                    Error loading conversations
                  </h3>
                  <p className='text-muted-foreground mb-3 text-xs'>{error}</p>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setPage(1);
                      setHasMore(true);
                      setProjects([]);
                      fetchAllProjects(1, false, searchQuery);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className='py-16 text-center'>
                  <MessageSquare className='text-muted-foreground mx-auto mb-3 h-8 w-8' />
                  <h3 className='text-foreground mb-1 text-sm font-medium'>
                    {searchQuery
                      ? "No results found"
                      : "No projects or conversations yet"}
                  </h3>
                  <p className='text-muted-foreground text-xs'>
                    {searchQuery
                      ? "Try searching for a different term"
                      : "Start a conversation, generate an image/video, or create a presentation to see it here"}
                  </p>
                </div>
              ) : (
                <>
                  {filteredProjects.map((project) => (
                    <Card
                      key={project._id}
                      className='hover:border-border/60 group border-border/40 cursor-pointer transition-all duration-200 hover:shadow-sm'
                      onClick={() => handleProjectClick(project)}
                    >
                      <CardContent className='p-3'>
                        <div className='flex items-start justify-between'>
                          <div className='min-w-0 flex-1'>
                            <h3 className='text-foreground group-hover:text-primary mb-1 truncate text-sm font-medium transition-colors'>
                              {project.title}
                            </h3>

                            <p className='text-muted-foreground mb-2 line-clamp-1 text-xs'>
                              {getLastMessage(project)}
                            </p>

                            <div className='text-muted-foreground flex flex-wrap items-center gap-3 text-xs'>
                              <div className='flex items-center gap-1'>
                                <Clock className='h-3 w-3' />
                                {formatTimestamp(
                                  project.updatedAt || project.createdAt
                                )}
                              </div>
                              <div className='flex items-center gap-1'>
                                <MessageSquare className='h-3 w-3' />
                                {(project.messages?.length || 0) +
                                  ((project as any).agentRunCount || 0)}
                              </div>
                            </div>
                          </div>

                          <div className='ml-3 flex items-center gap-1'>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-6 w-6 p-0 opacity-100 transition-opacity group-hover:opacity-100'
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className='h-3 w-3' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                {(project.type === "chat" || !project.type) && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleArchiveProject(project._id);
                                      }}
                                    >
                                      <Archive className='mr-2 h-3 w-3' />
                                      Archive
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className='text-destructive'
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDeleteModalOpen(true);
                                        setActiveProject(project);
                                      }}
                                    >
                                      <Trash2 className='mr-2 h-3 w-3' />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {(project.type === "ai-image-gen" ||
                                  project.type === "ai-video-gen" ||
                                  project.type === "presentations") && (
                                  <DropdownMenuItem
                                    className='text-destructive'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // TODO: Implement delete for image/video/presentation projects
                                      toast.info(
                                        "Delete functionality coming soon for this project type"
                                      );
                                    }}
                                  >
                                    <Trash2 className='mr-2 h-3 w-3' />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <ChevronRight className='text-muted-foreground h-4 w-4 opacity-100 transition-opacity group-hover:opacity-100' />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {loadingMore && (
                    <div className='py-8 text-center'>
                      <Loader className='text-muted-foreground mx-auto mb-2 h-6 w-6 animate-spin rounded-full' />
                      <p className='text-muted-foreground text-xs'>
                        Loading more...
                      </p>
                    </div>
                  )}
                  {!hasMore && filteredProjects.length > 0 && (
                    <div className='py-8 text-center'>
                      <p className='text-muted-foreground text-xs'>
                        No more projects to load
                      </p>
                    </div>
                  )}
                </>
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
        title='Project account'
        description='This action will removes this project, assets, and history. This cannot be undone.'
        confirmLabel='Delete Project'
        variant='destructive'
      />
    </div>
  );
}

export default withAuth(ChatHistoryPage);
