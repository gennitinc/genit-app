// types/inspire.ts
export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16" | "auto";
export type Resolution = "1080p" | "720p" | "480p" | "4K";

// ============================================
// Image Generation Template Types
// ============================================

export type ImageGenCategory =
  | "featured"
  | "artistic"
  | "photography"
  | "portrait"
  | "landscape"
  | "abstract"
  | "anime"
  | "3d"
  | "illustration"
  | "other";

export interface ImageGenTemplate {
  _id: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  category: ImageGenCategory;
  tags: string[];
  style?: string;
  aspectRatio?: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    generationParams?: GenerationParams;
    [key: string]: any;
  };
}

export interface ImageGenTemplateGroup {
  id: string;
  title: string;
  templates: ImageGenTemplate[];
}

// ============================================
// Video Generation Template Types
// ============================================

export type VideoGenCategory =
  | "featured"
  | "cinematic"
  | "animation"
  | "effects"
  | "transitions"
  | "character"
  | "nature"
  | "urban"
  | "abstract"
  | "holiday"
  | "other";

export interface VideoGenTemplate {
  _id: string;
  title: string;
  prompt: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: VideoGenCategory;
  tags: string[];
  duration?: string;
  aspectRatio?: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    generationParams?: GenerationParams;
    [key: string]: any;
  };
}

export interface VideoGenTemplateGroup {
  id: string;
  title: string;
  templates: VideoGenTemplate[];
}

// ============================================
// Community Content Types
// ============================================

export type ContentType = "image" | "video";
export type ContentStatus = "pending" | "approved" | "rejected" | "featured";

export interface Author {
  id?: string;
  name: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface GenerationParams {
  // Common
  prompt: string;
  modelId?: string;
  aspectRatio?: string;
  resolution?: string;

  // Image specific
  style?: string;
  imageCount?: number;

  // Video specific
  presenterId?: string;
  voiceId?: string;
  duration?: number;
  startFrameUrl?: string;
  endFrameUrl?: string;
  referenceImageUrls?: string[];
}

export interface CommunityContent {
  id: string;
  contentType: ContentType;
  title?: string;
  prompt: string;
  negativePrompt?: string;
  thumbnailUrl: string;
  mediaUrl: string;
  videoUrl?: string;
  aspectRatio?: string;
  style?: string;
  resolution?: string;
  duration?: string;
  // Generation parameters for recreation
  modelId?: string;
  presenterId?: string;
  voiceId?: string;
  startFrameUrl?: string;
  endFrameUrl?: string;
  referenceImageUrls?: string[];
  imageCount?: number;
  generatedImageId?: string;
  generatedVideoId?: string;
  likes: number;
  views: number;
  shares: number;
  isFeatured: boolean;
  isLiked?: boolean; // Whether current user has liked this content
  createdAt: string;
  author: Author;
  metadata?: {
    generationParams?: GenerationParams;
    [key: string]: any;
  };
}

export interface CommunityContentSubmission {
  contentType: ContentType;
  generatedImageId?: string; // ID of the generated image to publish
  generatedVideoId?: string; // ID of the generated video to publish
  title?: string;
  prompt: string;
  negativePrompt?: string;
  thumbnailUrl: string;
  mediaUrl: string;
  videoUrl?: string;
  aspectRatio?: string;
  style?: string;
  resolution?: string;
  duration?: string;
  startFrameUrl?: string; // Start frame image URL (for video)
  endFrameUrl?: string; // End frame image URL (for video)
  referenceImageUrls?: string[]; // Reference images for style/context
  tags?: string[];
  isPublic?: boolean;
}

// ============================================
// Tutorial Types
// ============================================

export type TutorialType = "image" | "video" | "general";

export interface Tutorial {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  youtubeId?: string;
  duration: string;
  type: TutorialType;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
  viewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pagination: Pagination;
}

export interface ImageGenTemplatesResponse {
  success: boolean;
  data: ImageGenTemplateGroup[];
}

export interface VideoGenTemplatesResponse {
  success: boolean;
  data: VideoGenTemplateGroup[];
}

export interface CommunityContentResponse {
  success: boolean;
  data: PaginatedResponse<CommunityContent>;
}

export interface TutorialsResponse {
  success: boolean;
  data: Tutorial[];
}

// ============================================
// Query Parameters Types
// ============================================

export interface CommunityQueryParams {
  type?: ContentType;
  page?: number;
  limit?: number;
  sort?: "recent" | "popular" | "trending";
  featured?: boolean;
}

export interface TemplateQueryParams {
  category?: string;
  featured?: boolean;
  limit?: number;
}

export interface TutorialQueryParams {
  type?: TutorialType;
  featured?: boolean;
  limit?: number;
}

// ============================================
// Presenter/Avatar Types
// ============================================

export type PresenterCategory = "popular" | "new" | "custom";

export interface Presenter {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  imageUrl: string;
  image?: string; // For backward compatibility
  thumbnailUrl?: string;
  category: PresenterCategory;
  gender: "male" | "female";
  userId?: string;
  admin?: boolean; // Indicates if this is an admin-created avatar
  isPublic: boolean;
  usageCount: number;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface PresenterResponse {
  success: boolean;
  data: Presenter[];
  count?: number;
}

// ============================================
// Voice Types
// ============================================

export interface Voice {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  language: string;
  gender: "male" | "female";
  accent: string;
  imageUrl: string;
  sampleUrl: string;
  provider?: string;
  providerVoiceId?: string;
  category: "ai" | "cloned";
  userId?: string;
  admin?: boolean; // Indicates if this is an admin-created voice
  isPublic: boolean;
  usageCount: number;
  status: "active" | "inactive" | "pending" | "processing";
  createdAt: string;
  updatedAt: string;
}

export interface VoiceResponse {
  success: boolean;
  data: Voice[];
  count?: number;
}

export interface ElevenLabsVoice {
  id: string;
  name: string;
  category?: string;
  description?: string;
  previewUrl?: string;
  labels: Record<string, string>;
}

export interface CloneVoiceRequest {
  name: string;
  language: string;
  accent: string;
  gender: "male" | "female";
  audioFile: File;
}

// ============================================
// Model Types
// ============================================

export type ModelType =
  "general" | "image" | "video" | "audio" | "text" | "social" | "docs";

export interface Model {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  type: ModelType;
  provider: string;
  modelId: string;
  description?: string;
  icon?: string; // SVG icon string or URL
  isDefault: boolean;
  isPremium: boolean;
  capabilities: {
    supportsAspectRatio?: boolean;
    supportsStyle?: boolean;
    supportsVideoReference?: boolean;
    supportsSubjectReference?: boolean;
    supportedDurationsSeconds?: number[];
    documentationUrl?: string;
    maxResolution?: string;
    supportedAspectRatios?: string[];
  };
  status: "active" | "inactive" | "beta";
  usageCount: number;
  allowCustomAudio?: boolean; // For video models: allow custom audio/voice selection
  createdAt: string;
  updatedAt: string;
}

export interface ModelResponse {
  success: boolean;
  data: Model[];
  count?: number;
}

// ============================================
// Image Generation Request/Response Types
// ============================================

export interface GenerateImageRequest {
  prompt: string;
  modelId?: string;
  aspectRatio?: string;
  resolution?: string;
  style?: string;
  imageCount?: number;
  referenceImages?: string[];
}

export interface GeneratedImageItem {
  url: string;
  name: string;
  id?: string;
  referenceImageUrls?: string[];
}

export interface GenerateImageResponse {
  success: boolean;
  message?: string;
  data: {
    images: GeneratedImageItem[];
  };
}

// ============================================
// Video Generation Request/Response Types
// ============================================

export interface GenerateVideoRequest {
  prompt: string;
  modelId?: string;
  aspectRatio?: string;
  resolution?: string;
  duration?: number;
  startFrameUrl?: string;
  endFrameUrl?: string;
  referenceImages?: string[];
  referenceVideoUrl?: string;
}

export interface GeneratedVideoItem {
  url: string;
  thumbnail: string;
  name: string;
  id?: string;
  duration?: number;
  startFrameUrl?: string;
  endFrameUrl?: string;
  referenceImageUrls?: string[];
  referenceVideoUrl?: string;
}

export interface GenerateVideoResponse {
  success: boolean;
  message?: string;
  data: {
    videos: GeneratedVideoItem[];
  };
}
