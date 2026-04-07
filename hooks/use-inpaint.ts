"use client";

import { useState } from "react";
import { toast } from "sonner";
import { apiResponse } from "@/utils/apiResponse";

interface InpaintArgs {
  projectId: string;
  originalImageUrl: string;
  prompt: string;
  maskBlob: Blob;
  generationGroupId?: string;
}

export function useInpaint() {
  const [isInpainting, setIsInpainting] = useState(false);

  const inpaint = async ({
    projectId,
    originalImageUrl,
    prompt,
    maskBlob,
    generationGroupId,
  }: InpaintArgs) => {
    setIsInpainting(true);
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("originalImageUrl", originalImageUrl);
    if (generationGroupId) {
      formData.append("generationGroupId", generationGroupId);
    }
    
    // Create a file from the blob
    const maskFile = new File([maskBlob], "mask.png", { type: "image/png" });
    formData.append("files", maskFile);

    try {
      // Use the configured apiResponse axios instance
      const response = await apiResponse.post(
        `/project/${projectId}/inpaint`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Inpainting started...");
      return response.data;
    } catch (error: any) {
      console.error("Inpaint error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Inpaint failed";
      toast.error("Inpaint failed", {
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsInpainting(false);
    }
  };

  return { inpaint, isInpainting };
}
