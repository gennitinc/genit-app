export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export enum GenerationStatus {
  PENDING = "pending",
  GENERATING = "generating",
  GENERATED = "generated",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum ProjectStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
  DELETED = "deleted",
}

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface IMessagePart {
  type: "text" | "media";
  text?: string;
  url?: string;
  mediaType?: MediaType;
}

export interface IFeedback {
  id: string;
  userId?: string;
  userName?: string;
  type: "like" | "dislike" | "comment";
  comment?: string;
  timestamp: Date;
}

export interface IGenerationItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  status: GenerationStatus;
  text?: string;
}

export interface IGenerationGroup {
  id: string;
  title: string;
  timestamp: Date;
  isLatest: boolean;
  isViewing: boolean;
  isCollapsed: boolean;
  items: IGenerationItem[];
}

export interface IMessage {
  _id: string;
  role: MessageRole;
  type: "user" | "ai";
  analysis?: string;
  totalTime?: number;
  versionId?: string;
  metadata?: Record<string, any>;
  parts: IMessagePart[];
  generationGroups?: IGenerationGroup[];
  feedback?: {
    like?: number;
    dislike?: number;
    comment?: number;
    userReaction?: "like" | "dislike" | null;
  };
  createdAt: Date;
}

export interface IProjectAnalytics {
  totalMessages: number;
  totalGenerations: number;
  totalFeedback: number;
  likes: number;
  dislikes: number;
  views: number;
}

export interface ICollaborator {
  userId: string;
  userName: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: Date;
  lastActiveAt?: Date;
}

export interface IDesignProject {
  _id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  userId: string;
  userName: string;
  category?: string;
  orientation?: string;
  customSize?: {
    width: string;
    height: string;
  };
  collaborators: ICollaborator[];
  messages: IMessage[];
  analytics: IProjectAnalytics;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectDesignContext {
  project: IDesignProject | null;
  setProject: React.Dispatch<React.SetStateAction<IDesignProject | null>>;

  generations: any[];
  setGenerations: React.Dispatch<React.SetStateAction<any[]>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isGenerating: boolean;
  isLoadingProject: boolean;
  clearError: () => void;
  resetGenerationState: () => void;
  createProject: (
    value: string,
    attachedFile?: any,
    selectedFiles?: string[],
    designTypeId?: string,
    orientation?: string | null,
    customSize?: { width: string; height: string } | null
  ) => Promise<{ type: boolean; message: string; id?: string }>;
  fetchProject: (projectId: string) => Promise<{
    success: boolean;
    error?: "not_found" | "unauthorized" | "server_error";
  }>;

  toggleGeneration: (id: string) => void;
  retryLoading: (id: string) => void;
  handleLocalStorageDraft: (project: IDesignProject) => void;
  editMessage: (
    messageId: string,
    updatedContent: string,
    files: File[] | null,
    projectId: string
  ) => Promise<void>;
  deleteMessage: (messageId: string) => void;
  addReaction: (
    messageId: string,
    type: "like" | "dislike" | "comment"
  ) => void;
  removeReaction: (
    messageId: string,
    type: "like" | "dislike" | "comment"
  ) => void;
  handleGenerationItemClick: (generationId: string) => void;

  generateMessage: (
    messageContent: string,
    files: File[] | null,
    projectId: string,
    selectedFiles?: string[]
  ) => Promise<void>;

  isLiveMode: boolean;
  isMobile: boolean;
  isDrawerOpen: boolean;

  userAvatar: string;
  userName: string;

  isUserPopoverOpen: boolean;
  setIsUserPopoverOpen: (open: boolean) => void;

  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  generatingForMessageId: string | null;
  isVisibilityDialogOpen: boolean;
  setIsVisibilityDialogOpen: (open: boolean) => void;

  chatVisibility: string;
  setChatVisibility: (visibility: string) => void;

  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  setIsMobile: (isMobile: boolean) => void;

  inputValue: string;
  setInputValue: (value: string) => void;

  attachedFiles: any[];
  setAttachedFiles: React.Dispatch<React.SetStateAction<any[]>>;

  selectedFiles: string[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>;

  fileLoadingStates: { [key: string]: boolean };
  setFileLoadingStates: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;

  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;

  dragCounter: number;
  setDragCounter: (counter: number) => void;

  showScrollButton: boolean;
  setShowScrollButton: (show: boolean) => void;

  streamingFiles: Set<string>;
  streamingContent: string;
  streamingAnalysis: string;
  isGeneratingImage: boolean;
  handleInput: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handlePaste: () => void;

  processFiles: (files: File[]) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;

  scrollToBottom: () => void;
  autoResize: () => void;

  clearInput: () => void;
  removeAttachedFile: (index: number) => void;
  messages: any[];
  status: any;
  setMessages: any;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}
