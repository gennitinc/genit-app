// utils/inspire-api.ts
import { apiResponse } from "./apiResponse";
import {
  ImageGenTemplatesResponse,
  VideoGenTemplatesResponse,
  CommunityContentResponse,
  CommunityContent,
  CommunityContentSubmission,
  TutorialsResponse,
  Tutorial,
  CommunityQueryParams,
  TemplateQueryParams,
  TutorialQueryParams,
  ApiResponse,
  Presenter,
  PresenterResponse,
  Voice,
  VoiceResponse,
  CloneVoiceRequest,
  Model,
  ModelResponse,
  GenerateVideoRequest,
  GenerateVideoResponse,
} from "@/types/inspire";

export const imageGenTemplatesApi = {
  /**
   * Get all image generation templates grouped by category
   */
  getAll: async (
    params?: TemplateQueryParams
  ): Promise<ImageGenTemplatesResponse> => {
    const response = await apiResponse.get(`/inspire/templates/image`, {
      params,
    });
    return response.data;
  },

  /**
   * Get templates by category
   */
  getByCategory: async (category: string, page = 1, limit = 20) => {
    const response = await apiResponse.get(
      `/inspire/templates/image/category/${category}`,
      { params: { page, limit } }
    );
    return response.data;
  },

  /**
   * Get a single template by ID
   */
  getById: async (id: string) => {
    const response = await apiResponse.get(`/inspire/templates/image/${id}`);
    return response.data;
  },

  /**
   * Get available categories
   */
  getCategories: async () => {
    const response = await apiResponse.get(
      `/inspire/templates/image/categories`
    );
    return response.data;
  },

  /**
   * Track template usage
   */
  trackUsage: async (id: string) => {
    const response = await apiResponse.post(
      `/inspire/templates/image/${id}/use`
    );
    return response.data;
  },
};

// ============================================
// Video Generation Templates API
// ============================================

export const videoGenTemplatesApi = {
  /**
   * Get all video generation templates grouped by category
   */
  getAll: async (
    params?: TemplateQueryParams
  ): Promise<VideoGenTemplatesResponse> => {
    const response = await apiResponse.get(`/inspire/templates/video`, {
      params,
    });
    return response.data;
  },

  /**
   * Get templates by category
   */
  getByCategory: async (category: string, page = 1, limit = 20) => {
    const response = await apiResponse.get(
      `/inspire/templates/video/category/${category}`,
      { params: { page, limit } }
    );
    return response.data;
  },

  /**
   * Get a single template by ID
   */
  getById: async (id: string) => {
    const response = await apiResponse.get(`/inspire/templates/video/${id}`);
    return response.data;
  },

  /**
   * Get available categories
   */
  getCategories: async () => {
    const response = await apiResponse.get(
      `/inspire/templates/video/categories`
    );
    return response.data;
  },

  /**
   * Track template usage
   */
  trackUsage: async (id: string) => {
    const response = await apiResponse.post(
      `/inspire/templates/video/${id}/use`
    );
    return response.data;
  },
};

// ============================================
// Community Content API
// ============================================

export const communityApi = {
  /**
   * Get community content (images or videos)
   */
  getContent: async (
    params?: CommunityQueryParams
  ): Promise<CommunityContentResponse> => {
    const response = await apiResponse.get(`/inspire/community`, { params });
    return response.data;
  },

  /**
   * Get a single content item by ID
   */
  getById: async (id: string): Promise<ApiResponse<CommunityContent>> => {
    const response = await apiResponse.get(`/inspire/community/${id}`);
    return response.data;
  },

  /**
   * Submit content to community (requires auth)
   */
  submit: async (data: CommunityContentSubmission) => {
    const response = await apiResponse.post(`/inspire/community`, data);
    return response.data;
  },

  /**
   * Like/unlike content (requires auth)
   */
  toggleLike: async (
    id: string
  ): Promise<ApiResponse<{ liked: boolean; likes: number }>> => {
    const response = await apiResponse.post(`/inspire/community/${id}/like`);
    return response.data;
  },

  /**
   * Increment share count
   */
  trackShare: async (id: string) => {
    const response = await apiResponse.post(`/inspire/community/${id}/share`);
    return response.data;
  },

  /**
   * Get user's own content (requires auth)
   */
  getUserContent: async (type?: "image" | "video", page = 1, limit = 20) => {
    const response = await apiResponse.get(`/inspire/community/user/me`, {
      params: { type, page, limit },
    });
    return response.data;
  },

  /**
   * Delete user's own content (requires auth)
   */
  delete: async (id: string) => {
    const response = await apiResponse.delete(`/inspire/community/${id}`);
    return response.data;
  },
};

// ============================================
// Creator Profile API
// ============================================

export const creatorApi = {
  /**
   * Get creator profile by username
   */
  getProfile: async (username: string) => {
    const response = await apiResponse.get(`/inspire/creator/${username}`);
    return response.data;
  },

  /**
   * Get creator's published content
   */
  getContent: async (
    username: string,
    type?: "image" | "video",
    page = 1,
    limit = 50
  ) => {
    const response = await apiResponse.get(`/inspire/creator/${username}/content`, {
      params: { type, page, limit },
    });
    return response.data;
  },

  /**
   * Follow/Unfollow a creator (requires auth)
   */
  follow: async (creatorId: string) => {
    const response = await apiResponse.post(`/inspire/creator/${creatorId}/follow`);
    return response.data;
  },

  /**
   * Check follow status (requires auth)
   */
  getFollowStatus: async (creatorId: string) => {
    const response = await apiResponse.get(
      `/inspire/creator/${creatorId}/follow-status`
    );
    return response.data;
  },

  /**
   * Track content view
   */
  trackView: async (contentId: string) => {
    const response = await apiResponse.post(`/inspire/content/${contentId}/view`);
    return response.data;
  },

  /**
   * Update creator profile (bio, socials, cover photo, profile pic)
   */
  updateProfile: async (data: {
    bio?: string;
    socials?: {
      instagram?: string;
      twitter?: string;
      github?: string;
      linkedin?: string;
      facebook?: string;
      youtube?: string;
      dribbble?: string;
      behance?: string;
      tiktok?: string;
    };
    coverPhoto?: File;
    profilePic?: File;
  }) => {
    const formData = new FormData();
    if (data.bio !== undefined) {
      formData.append("bio", data.bio);
    }
    if (data.socials) {
      formData.append("socials", JSON.stringify(data.socials));
    }
    if (data.coverPhoto) {
      formData.append("coverPhoto", data.coverPhoto);
    }
    if (data.profilePic) {
      formData.append("profilePic", data.profilePic);
    }

    const response = await apiResponse.put(`/inspire/creator/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  },
};

// ============================================
// Tutorial API
// ============================================

export const tutorialApi = {
  /**
   * Get tutorials by type
   */
  getAll: async (params?: TutorialQueryParams): Promise<TutorialsResponse> => {
    const response = await apiResponse.get(`/inspire/tutorials`, { params });
    return response.data;
  },

  /**
   * Get featured tutorial
   */
  getFeatured: async (
    type?: "image" | "video" | "general"
  ): Promise<ApiResponse<Tutorial>> => {
    const response = await apiResponse.get(`/inspire/tutorials/featured`, {
      params: { type },
    });
    return response.data;
  },

  /**
   * Get a single tutorial by ID
   */
  getById: async (id: string): Promise<ApiResponse<Tutorial>> => {
    const response = await apiResponse.get(`/inspire/tutorials/${id}`);
    return response.data;
  },
};

// ============================================
// Presenter/Avatar API
// ============================================

export const presenterApi = {
  /**
   * Get all presenters
   */
  getAll: async (params?: {
    category?: string;
    gender?: "male" | "female";
    userId?: "me" | string;
    admin?: string;
  }): Promise<PresenterResponse> => {
    const response = await apiResponse.get(`/inspire/presenters`, {
      params,
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Get a single presenter by ID
   */
  getById: async (id: string): Promise<ApiResponse<Presenter>> => {
    const response = await apiResponse.get(`/inspire/presenters/${id}`);
    return response.data;
  },

  /**
   * Create a custom presenter (requires auth)
   */
  create: async (data: {
    name: string;
    gender: "male" | "female";
    category?: "popular" | "new" | "custom";
    image: File;
  }): Promise<ApiResponse<Presenter>> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("gender", data.gender);
    if (data.category) formData.append("category", data.category);
    formData.append("image", data.image);

    const response = await apiResponse.post(`/inspire/presenters`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Update presenter (requires auth)
   */
  update: async (
    id: string,
    data: {
      name?: string;
      category?: string;
      isPublic?: boolean;
      image?: File;
    }
  ): Promise<ApiResponse<Presenter>> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.category) formData.append("category", data.category);
    if (data.isPublic !== undefined)
      formData.append("isPublic", String(data.isPublic));
    if (data.image) formData.append("image", data.image);

    const response = await apiResponse.put(
      `/inspire/presenters/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  },

  /**
   * Delete presenter (requires auth)
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiResponse.delete(`/inspire/presenters/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Track presenter usage
   */
  trackUsage: async (id: string): Promise<ApiResponse<Presenter>> => {
    const response = await apiResponse.post(`/inspire/presenters/${id}/use`);
    return response.data;
  },
};

// ============================================
// Voice API
// ============================================

export const voiceApi = {
  /**
   * Get all voices
   */
  getAll: async (params?: {
    category?: "ai" | "cloned";
    language?: string;
    gender?: "male" | "female";
    userId?: "me" | string;
    admin?: string;
  }): Promise<VoiceResponse> => {
    const response = await apiResponse.get(`/inspire/voices`, {
      params,
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Get a single voice by ID
   */
  getById: async (id: string): Promise<ApiResponse<Voice>> => {
    const response = await apiResponse.get(`/inspire/voices/${id}`);
    return response.data;
  },

  /**
   * Create voice (admin only - requires auth)
   */
  create: async (data: {
    name: string;
    language: string;
    accent: string;
    gender: "male" | "female";
    category?: "ai" | "cloned";
    provider?: string;
    providerVoiceId?: string;
    audio: File;
  }): Promise<ApiResponse<Voice>> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("language", data.language);
    formData.append("accent", data.accent);
    formData.append("gender", data.gender);
    if (data.category) formData.append("category", data.category);
    if (data.provider) formData.append("provider", data.provider);
    if (data.providerVoiceId)
      formData.append("providerVoiceId", data.providerVoiceId);
    formData.append("audio", data.audio);

    const response = await apiResponse.post(`/inspire/voices`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Clone voice from audio recording (requires auth)
   */
  clone: async (data: CloneVoiceRequest): Promise<ApiResponse<Voice>> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("language", data.language);
    formData.append("accent", data.accent);
    formData.append("gender", data.gender);
    formData.append("audio", data.audioFile);

    const response = await apiResponse.post(`/inspire/voices/clone`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Update voice (requires auth)
   */
  update: async (
    id: string,
    data: {
      name?: string;
      language?: string;
      accent?: string;
      isPublic?: boolean;
      audio?: File;
    }
  ): Promise<ApiResponse<Voice>> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.language) formData.append("language", data.language);
    if (data.accent) formData.append("accent", data.accent);
    if (data.isPublic !== undefined)
      formData.append("isPublic", String(data.isPublic));
    if (data.audio) formData.append("audio", data.audio);

    const response = await apiResponse.put(`/inspire/voices/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Delete voice (requires auth)
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiResponse.delete(`/inspire/voices/${id}`);
    return response.data;
  },

  /**
   * Track voice usage
   */
  trackUsage: async (id: string): Promise<ApiResponse<Voice>> => {
    const response = await apiResponse.post(`/inspire/voices/${id}/use`);
    return response.data;
  },

  /**
   * Update voice status (for processing completion)
   */
  updateStatus: async (
    id: string,
    status: "active" | "inactive" | "pending" | "processing",
    providerVoiceId?: string
  ): Promise<ApiResponse<Voice>> => {
    const response = await apiResponse.put(`/inspire/voices/${id}/status`, {
      status,
      providerVoiceId,
    });
    return response.data;
  },
};

// ============================================
// Model API
// ============================================

export const modelApi = {
  /**
   * Get all models
   */
  getAll: async (params?: {
    type?: "image" | "video";
  }): Promise<ModelResponse> => {
    const response = await apiResponse.get(`/inspire/models`, { params });
    return response.data;
  },

  /**
   * Get a single model by ID
   */
  getById: async (id: string): Promise<ApiResponse<Model>> => {
    const response = await apiResponse.get(`/inspire/models/${id}`);
    return response.data;
  },

  /**
   * Get default model for type
   */
  getDefault: async (type: "image" | "video"): Promise<ApiResponse<Model>> => {
    const response = await apiResponse.get(`/inspire/models/default/${type}`);
    return response.data;
  },

  /**
   * Track model usage
   */
  trackUsage: async (id: string): Promise<ApiResponse<Model>> => {
    const response = await apiResponse.post(`/inspire/models/${id}/use`);
    return response.data;
  },

  /**
   * Create a new model (Admin only)
   */
  create: async (
    data: {
      name: string;
      type: "image" | "video";
      provider: string;
      modelId: string;
      description?: string;
      isDefault?: boolean;
      isPremium?: boolean;
      capabilities?: {
        supportsAspectRatio?: boolean;
        supportsStyle?: boolean;
        maxResolution?: string;
        supportedAspectRatios?: string[];
      };
      status?: "active" | "inactive" | "beta";
    },
    iconFile?: File
  ): Promise<ApiResponse<Model>> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("provider", data.provider);
    formData.append("modelId", data.modelId);
    if (data.description) formData.append("description", data.description);
    if (data.isDefault !== undefined)
      formData.append("isDefault", String(data.isDefault));
    if (data.isPremium !== undefined)
      formData.append("isPremium", String(data.isPremium));
    if (data.status) formData.append("status", data.status);
    if (data.capabilities) {
      formData.append("capabilities", JSON.stringify(data.capabilities));
    }
    if (iconFile) {
      formData.append("icon", iconFile);
    }

    const response = await apiResponse.post(`/inspire/models`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Update a model (Admin only)
   */
  update: async (
    id: string,
    data: {
      name?: string;
      provider?: string;
      modelId?: string;
      description?: string;
      isDefault?: boolean;
      isPremium?: boolean;
      capabilities?: {
        supportsAspectRatio?: boolean;
        supportsStyle?: boolean;
        maxResolution?: string;
        supportedAspectRatios?: string[];
      };
      status?: "active" | "inactive" | "beta";
    },
    iconFile?: File
  ): Promise<ApiResponse<Model>> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.provider) formData.append("provider", data.provider);
    if (data.modelId) formData.append("modelId", data.modelId);
    if (data.description !== undefined)
      formData.append("description", data.description);
    if (data.isDefault !== undefined)
      formData.append("isDefault", String(data.isDefault));
    if (data.isPremium !== undefined)
      formData.append("isPremium", String(data.isPremium));
    if (data.status) formData.append("status", data.status);
    if (data.capabilities) {
      formData.append("capabilities", JSON.stringify(data.capabilities));
    }
    if (iconFile) {
      formData.append("icon", iconFile);
    }

    const response = await apiResponse.put(`/inspire/models/${id}`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Delete a model (Admin only)
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiResponse.delete(`/inspire/models/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};

// ============================================
// Image Generation API
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

export interface GenerateImageResponse {
  success: boolean;
  data: {
    images: Array<{
      url: string;
      name: string;
      id?: string;
    }>;
    model: {
      id: string;
      name: string;
      provider: string;
    };
  };
  message: string;
}

export const imageGenApi = {
  /**
   * Generate image(s) using AI
   */
  generate: async (
    data: GenerateImageRequest,
    files?: File[]
  ): Promise<GenerateImageResponse> => {
    const formData = new FormData();

    // Append text fields
    formData.append("prompt", data.prompt);
    if (data.modelId) formData.append("modelId", data.modelId);
    if (data.aspectRatio) formData.append("aspectRatio", data.aspectRatio);
    if (data.resolution) formData.append("resolution", data.resolution);
    if (data.style) formData.append("style", data.style);
    if (data.imageCount) formData.append("imageCount", String(data.imageCount));
    if (data.referenceImages && data.referenceImages.length > 0) {
      formData.append("referenceImages", JSON.stringify(data.referenceImages));
    }

    // Append files
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await apiResponse.post(
      `/inspire/generate/image`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

// ============================================
// Video Generation API
// ============================================

export const videoGenApi = {
  /**
   * Generate video(s) using AI
   */
  generate: async (
    data: GenerateVideoRequest,
    files?: {
      startFrame?: File;
      endFrame?: File;
      imageInput?: File;
      referenceImages?: File[];
    }
  ): Promise<GenerateVideoResponse> => {
    const formData = new FormData();

    // Append text fields
    formData.append("prompt", data.prompt);
    if (data.modelId) formData.append("modelId", data.modelId);
    if (data.aspectRatio) formData.append("aspectRatio", data.aspectRatio);
    if (data.resolution) formData.append("resolution", data.resolution);
    if (data.duration) formData.append("duration", String(data.duration));
    if (data.startFrameUrl)
      formData.append("startFrameUrl", data.startFrameUrl);
    if (data.endFrameUrl) formData.append("endFrameUrl", data.endFrameUrl);
    if (data.referenceImages && data.referenceImages.length > 0) {
      formData.append("referenceImages", JSON.stringify(data.referenceImages));
    }

    // Append files
    if (files) {
      if (files.startFrame) {
        formData.append("startFrame", files.startFrame);
      }
      if (files.endFrame) {
        formData.append("endFrame", files.endFrame);
      }
      if (files.imageInput) {
        formData.append("imageInput", files.imageInput);
      }
      if (files.referenceImages && files.referenceImages.length > 0) {
        files.referenceImages.forEach((file) => {
          formData.append("files", file);
        });
      }
    }

    const response = await apiResponse.post(
      `/inspire/generate/video`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Upload reference image from URL
   */
  uploadReferenceImageFromUrl: async (imageUrl: string) => {
    const response = await apiResponse.post(
      `/inspire/generate/video/upload-reference-image`,
      { imageUrl },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },
};

// ============================================
// Template/Inspiration API
// ============================================

export interface PublishToInspirationRequest {
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: "image" | "video";
  prompt?: string;
  category?: string;
  tags?: string[];
  title?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export const templateApi = {
  /**
   * Publish content from chat to inspiration/templates (requires auth)
   */
  publishToInspiration: async (
    data: PublishToInspirationRequest
  ): Promise<ApiResponse<{ id: string; assetId: string }>> => {
    try {
      const response = await apiResponse.post(`/templates/publish`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      // If it's a 409 conflict (already published), return the error response
      if (error?.response?.status === 409) {
        return error.response.data;
      }
      // Re-throw other errors
      throw error;
    }
  },
};

// ============================================
// React Query Hooks (optional, if using react-query)
// ============================================

// If you're using React Query, you can add custom hooks here
// Example:
// export const useImageGenTemplates = (params?: TemplateQueryParams) => {
//   return useQuery({
//     queryKey: ['imageGenTemplates', params],
//     queryFn: () => imageGenTemplatesApi.getAll(params),
//   });
// };
