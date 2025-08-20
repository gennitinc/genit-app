"use client";

import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import { ProfileSchema, ProfileSchemaType } from "@/types/profile-schema";
import { formatSocialLink } from "@/utils/format-socials";

interface UseEditProfileProps {
  initialData: ProfileSchemaType;
  onSave: (data: FormData) => Promise<boolean> | boolean;
}

interface UseEditProfileReturn {
  formData: ProfileSchemaType;
  errors: Record<string, string>;
  isValid: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  handleInputChange: (field: string, value: string) => void;
  handleImageUpload: (
    field: "metadata.userdp" | "metadata.coverPhotoUrl",
    file: File
  ) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  displayValue: (value: string | null | undefined) => string;
  getPlaceholder: (platform: string) => string;
}

export function useEditProfile({
  initialData,
  onSave,
}: UseEditProfileProps): UseEditProfileReturn {
  const [formData, setFormData] = useState<ProfileSchemaType>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate form data using Zod
  const validateForm = useCallback(
    (data: ProfileSchemaType): Record<string, string> => {
      try {
        ProfileSchema.parse(data);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const field = err.path.join(".");
            fieldErrors[field] = err.message;
          });
          return fieldErrors;
        }
        return {};
      }
    },
    []
  );

  // Check if form is valid
  const isValid = Object.keys(validateForm(formData)).length === 0;

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => {
        const newData = { ...prev };
        console.log(validateForm(newData));
        if (field.includes(".")) {
          const parts = field.split(".");
          if (parts[0] === "metadata") {
            newData.metadata = {
              isCreator: newData.metadata?.isCreator ?? false,
              coverPhotoUrl: newData.metadata?.coverPhotoUrl ?? "",
              userdp: newData.metadata?.userdp ?? "",
              about: newData.metadata?.about ?? "",
              socials: {
                linkedin: newData.metadata?.socials?.linkedin ?? "",
                x: newData.metadata?.socials?.x ?? "",
                github: newData.metadata?.socials?.github ?? "",
                instagram: newData.metadata?.socials?.instagram ?? "",
              },
            };

            if (parts[1] === "about") {
              newData.metadata!.about = value;
            } else if (parts[1] === "isCreator") {
              newData.metadata!.isCreator = Boolean(value);
            } else if (parts[1] === "socials") {
              if (
                parts[2] === "x" ||
                parts[2] === "instagram" ||
                parts[2] === "github" ||
                parts[2] === "linkedin"
              ) {
                newData.metadata.socials = {
                  ...newData.metadata.socials,
                  [parts[2]]: value || "",
                };
              }
            }
          }
        } else {
          (newData as any)[field] = value;
        }

        return newData;
      });

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const handleImageUpload = useCallback(
    (field: "metadata.userdp" | "metadata.coverPhotoUrl", file: File) => {
      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => {
        if (field === "metadata.userdp") {
          return {
            ...prev,
            metadata: {
              isCreator: prev.metadata?.isCreator ?? false,
              coverPhotoUrl: prev.metadata?.coverPhotoUrl ?? null,
              coverImagePreview: prev.metadata?.coverImagePreview,
              about: prev.metadata?.about ?? "",
              userdp: file,
              userdpPreview: previewUrl,
              socials: {
                linkedin: prev.metadata?.socials?.linkedin ?? "",
                x: prev.metadata?.socials?.x ?? "",
                github: prev.metadata?.socials?.github ?? "",
                instagram: prev.metadata?.socials?.instagram ?? "",
              },
            },
          };
        } else if (field === "metadata.coverPhotoUrl") {
          return {
            ...prev,
            metadata: {
              isCreator: prev.metadata?.isCreator ?? false,
              coverPhotoUrl: file,
              coverImagePreview: previewUrl,
              about: prev.metadata?.about ?? "",
              userdp: prev.metadata?.userdp ?? null,
              userdpPreview: prev.metadata?.userdpPreview,
              socials: {
                linkedin: prev.metadata?.socials?.linkedin ?? "",
                x: prev.metadata?.socials?.x ?? "",
                github: prev.metadata?.socials?.github ?? "",
                instagram: prev.metadata?.socials?.instagram ?? "",
              },
            },
          };
        }
        return prev;
      });
    },
    []
  );

  const handleSave = useCallback(async () => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();

      // Append basic fields
      formDataToSend.append("username", formData.username);
      formDataToSend.append("metadata.about", formData.metadata?.about || "");
      formDataToSend.append(
        "metadata.isCreator",
        String(formData.metadata?.isCreator || false)
      );

      // Append social links - always append empty strings for empty values
      const socials = formData.metadata?.socials || {};
      for (const [key, value] of Object.entries(socials)) {
        const socialValue = value || "";
        formDataToSend.append(
          `metadata.socials.${key}`,
          socialValue ? formatSocialLink(key, socialValue) : ""
        );
      }

      // Append files if they exist
      if (formData.metadata?.userdp instanceof File) {
        formDataToSend.append("metadata.userdp", formData.metadata.userdp);
      }
      if (formData.metadata?.coverPhotoUrl instanceof File) {
        formDataToSend.append(
          "metadata.coverPhotoUrl",
          formData.metadata.coverPhotoUrl
        );
      }

      const success = await onSave(formDataToSend);
      if (!success) {
        console.error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, onSave]);

  const handleCancel = useCallback(() => {
    if (formData.metadata?.userdpPreview) {
      URL.revokeObjectURL(formData.metadata.userdpPreview);
    }
    if (formData.metadata?.coverImagePreview) {
      URL.revokeObjectURL(formData.metadata.coverImagePreview);
    }
    setFormData(initialData);
    setErrors({});
  }, [
    initialData,
    formData.metadata?.userdpPreview,
    formData.metadata?.coverImagePreview,
  ]);

  const displayValue = useCallback(
    (value: string | null | undefined): string => {
      if (!value) return "";
      return value.replace(/^https?:\/\//, "");
    },
    []
  );

  const getPlaceholder = useCallback((platform: string): string => {
    switch (platform) {
      case "x":
        return "https://x.com/username";
      case "instagram":
        return "https://instagram.com/username";
      case "github":
        return "https://github.com/username";
      case "linkedin":
        return "https://linkedin.com/in/username";
      default:
        return "";
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup preview URLs on unmount
      if (formData.metadata?.userdpPreview) {
        URL.revokeObjectURL(formData.metadata.userdpPreview);
      }
      if (formData.metadata?.coverImagePreview) {
        URL.revokeObjectURL(formData.metadata.coverImagePreview);
      }
    };
  }, [formData.metadata?.userdpPreview, formData.metadata?.coverImagePreview]);

  return {
    formData,
    errors,
    isValid,
    isLoading,
    setIsLoading,
    handleInputChange,
    handleImageUpload,
    handleSave,
    handleCancel,
    displayValue,
    getPlaceholder,
  };
}
