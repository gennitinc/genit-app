"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Presenter } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { presenterApi } from "@/utils/inspire-api";
import { Check, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

interface PresenterSelectorProps {
  selectedPresenter: Presenter | null;
  onSelectPresenter: (presenter: Presenter | null) => void;
  onDrawerClose?: () => void;
}

function PresenterCard({
  presenter,
  isSelected,
  onSelect,
  onDelete,
  showDelete = false,
}: {
  presenter: Presenter;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}) {
  const imageUrl = presenter.imageUrl || presenter.image;
  return (
    <div className='group relative'>
      <button
        onClick={onSelect}
        className={cn(
          "relative w-full overflow-hidden rounded-lg transition-all",
          isSelected
            ? "ring-2 ring-neutral-900 dark:ring-neutral-100"
            : "ring-1 ring-neutral-200 dark:ring-neutral-800"
        )}
      >
        <div className='aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800'>
          <img
            src={imageUrl}
            alt={presenter.name}
            className='h-full w-full object-cover object-top'
          />
        </div>
        <div className='absolute right-0 bottom-0 left-0 bg-neutral-900/80 p-1.5 backdrop-blur-sm dark:bg-neutral-100/80'>
          <p className='truncate text-center text-[10px] font-medium text-white dark:text-neutral-900'>
            {presenter.name}
          </p>
        </div>
        {isSelected && (
          <div className='absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-100'>
            <Check className='h-2.5 w-2.5 text-white dark:text-neutral-900' />
          </div>
        )}
      </button>
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className='absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded bg-white/90 text-neutral-600 opacity-0 backdrop-blur-sm transition-colors group-hover:opacity-100 hover:text-red-600 dark:bg-neutral-800/90 dark:text-neutral-400 dark:hover:text-red-400'
          title='Delete avatar'
        >
          <Trash2 className='h-3 w-3' />
        </button>
      )}
    </div>
  );
}

function PresenterGrid({
  presenters,
  selectedPresenter,
  onSelectPresenter,
  onDeletePresenter,
  showDelete = false,
  columns = 3,
}: {
  presenters: Presenter[];
  selectedPresenter: Presenter | null;
  onSelectPresenter: (presenter: Presenter) => void;
  onDeletePresenter?: (presenter: Presenter) => void;
  showDelete?: boolean;
  columns?: number;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 3 && "grid-cols-4",
        columns === 4 && "grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
      )}
    >
      {presenters.map((presenter) => {
        const presenterId = presenter._id || presenter.id;
        const selectedId = selectedPresenter?._id || selectedPresenter?.id;
        return (
          <PresenterCard
            key={presenterId}
            presenter={presenter}
            isSelected={
              !!selectedPresenter &&
              !!presenterId &&
              !!selectedId &&
              selectedId === presenterId
            }
            onSelect={() => onSelectPresenter(presenter)}
            onDelete={
              onDeletePresenter ? () => onDeletePresenter(presenter) : undefined
            }
            showDelete={showDelete}
          />
        );
      })}
    </div>
  );
}

export function PresenterSelector({
  selectedPresenter,
  onSelectPresenter,
  onDrawerClose,
}: PresenterSelectorProps) {
  const { user } = useUserContext();
  const isAuthenticated = !!user;
  const [activeTab, setActiveTab] = useState<
    "popular" | "my-avatar" | "upload"
  >("popular");
  const [isOpen, setIsOpen] = useState(false);
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [userPresenters, setUserPresenters] = useState<Presenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState("");
  const [avatarGender, setAvatarGender] = useState<"male" | "female">("male");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch popular presenters on initial load
  useEffect(() => {
    const fetchPopularPresenters = async () => {
      try {
        setLoading(true);
        const popularResponse = await presenterApi.getAll({
          category: "popular",
        });

        if (popularResponse.success && popularResponse.data) {
          // Show admin-created avatars and public avatars in "AI Avatar" section
          // Filter to ensure we only show admin avatars or public non-user avatars
          const aiAvatars = popularResponse.data.filter(
            (p) => p.admin || (p.isPublic && !p.userId)
          );
          setPresenters(aiAvatars);
        }
      } catch (error) {
        console.error("Error fetching presenters:", error);
        toast({
          title: "Error",
          description: "Failed to load presenters. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPresenters();
  }, []);

  // Switch to popular tab if user is not authenticated and my-avatar or upload is active
  useEffect(() => {
    if (
      (activeTab === "my-avatar" || activeTab === "upload") &&
      !isAuthenticated
    ) {
      setActiveTab("popular");
    }
  }, [isAuthenticated, activeTab]);

  // Fetch user's own avatars when "My Avatar" tab is active
  useEffect(() => {
    if (activeTab === "my-avatar" && isAuthenticated) {
      const fetchUserPresenters = async () => {
        try {
          setLoading(true);
          const userResponse = await presenterApi.getAll({ userId: "me" });

          if (userResponse.success && userResponse.data) {
            // Only show avatars created by this user (userId matches)
            // Filter out any admin-created avatars as a safety measure
            const userOwnedAvatars = userResponse.data.filter((p) => !p.admin);
            setUserPresenters(userOwnedAvatars);
          } else {
            setUserPresenters([]);
          }
        } catch (error) {
          console.error("Error fetching user presenters:", error);
          // Silently fail if user is not authenticated
          if (error && typeof error === "object" && "response" in error) {
            const httpError = error as { response?: { status?: number } };
            if (
              httpError.response?.status === 401 ||
              httpError.response?.status === 403
            ) {
              // User not authenticated - clear user presenters
              setUserPresenters([]);
              return;
            }
          }

          toast({
            title: "Error",
            description: "Failed to load your avatars. Please try again.",
            variant: "destructive",
          });

          setUserPresenters([]);
        } finally {
          setLoading(false);
        }
      };

      fetchUserPresenters();
    } else if (activeTab === "my-avatar" && !isAuthenticated) {
      // Clear user presenters if user is not authenticated
      setUserPresenters([]);
      setLoading(false);
    }
  }, [activeTab, isAuthenticated]);

  const handleSelectPresenter = async (presenter: Presenter) => {
    // Only one avatar can be selected at a time
    // This will replace any previously selected presenter
    onSelectPresenter(presenter);
    onDrawerClose?.(); // Close drawer on mobile after selection

    // Track usage
    try {
      await presenterApi.trackUsage(presenter._id || presenter.id || "");
    } catch (error) {
      // Continue even if tracking fails
    }

    setIsOpen(false);
  };

  const handleDeletePresenter = async (presenter: Presenter) => {
    if (!confirm(`Are you sure you want to delete "${presenter.name}"?`)) {
      return;
    }

    try {
      const presenterId = presenter._id || presenter.id || "";
      const response = await presenterApi.delete(presenterId);

      if (response.success) {
        // Remove from user presenters list
        setUserPresenters((prev) =>
          prev.filter((p) => (p._id || p.id) !== presenterId)
        );

        // If this was the selected presenter, clear selection
        if (
          selectedPresenter?._id === presenter._id ||
          selectedPresenter?.id === presenter.id
        ) {
          // Clear the selection
          onSelectPresenter(null);
        }

        toast({
          title: "Success",
          description: "Avatar deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete avatar",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error deleting presenter:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to delete avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload avatars",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Set default name from filename
    const defaultName = file.name.split(".")[0] || "Custom Avatar";
    setAvatarName(defaultName);
    setAvatarGender("male");
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    if (!avatarName.trim()) {
      toast({
        title: "Validation error",
        description: "Please provide a name for your avatar",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const response = await presenterApi.create({
        name: avatarName.trim(),
        gender: avatarGender,
        category: "custom",
        image: selectedFile,
      });

      if (response.success && response.data) {
        const newPresenter = response.data;

        // Refresh user presenters list
        try {
          const userResponse = await presenterApi.getAll({ userId: "me" });
          if (userResponse.success && userResponse.data) {
            const userOwnedAvatars = userResponse.data.filter((p) => !p.admin);
            setUserPresenters(userOwnedAvatars);
          }
        } catch (error) {
          // Continue even if refresh fails
          setUserPresenters((prev) => [newPresenter, ...prev]);
        }

        onSelectPresenter(newPresenter);
        toast({
          title: "Success",
          description: "Avatar uploaded successfully",
        });

        // Reset form
        setSelectedFile(null);
        setFilePreview(null);
        setAvatarName("");
        setAvatarGender("male");

        // Switch to "My Avatar" tab to show the uploaded avatar
        setActiveTab("my-avatar");
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description:
          error?.response?.data?.message || "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const MoreButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className='group relative flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100 transition-all hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:border-neutral-500'
    >
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700'>
        <Plus className='h-4 w-4 text-neutral-600 dark:text-neutral-300' />
      </div>
      <p className='text-xs font-medium text-neutral-600 dark:text-neutral-400'>
        View More
      </p>
    </button>
  );

  const FullPresenterList = () => (
    <div className='space-y-4'>
      {/* Tabs */}
      <div className='flex gap-2 border-b border-neutral-200 dark:border-neutral-700'>
        <button
          onClick={() => setActiveTab("popular")}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "popular"
              ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
              : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
          )}
        >
          AI Avatar
        </button>
        {isAuthenticated && (
          <>
            <button
              onClick={() => setActiveTab("my-avatar")}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "my-avatar"
                  ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
              )}
            >
              My Avatar
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "upload"
                  ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
              )}
            >
              Upload
            </button>
          </>
        )}
      </div>

      {activeTab === "popular" && (
        <div className='max-h-[60vh] overflow-y-auto pr-2'>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <LoadingFileLoader size={16} />
            </div>
          ) : presenters.length === 0 ? (
            <div className='py-8 text-center text-sm text-neutral-500 dark:text-neutral-400'>
              No presenters available
            </div>
          ) : (
            <PresenterGrid
              presenters={presenters}
              selectedPresenter={selectedPresenter}
              onSelectPresenter={handleSelectPresenter}
              columns={4}
            />
          )}
        </div>
      )}

      {activeTab === "my-avatar" && (
        <div className='space-y-4 py-6'>
          {!isAuthenticated ? (
            <div className='py-8 text-center'>
              <p className='mb-4 text-sm text-neutral-500 dark:text-neutral-400'>
                Please sign in to view your avatars
              </p>
            </div>
          ) : loading ? (
            <div className='flex items-center justify-center py-8'>
              <LoadingFileLoader size={16} />
            </div>
          ) : (
            <>
              {/* User's Custom Avatars */}
              {userPresenters.length > 0 ? (
                <div>
                  <h4 className='mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                    My Avatars
                  </h4>
                  <PresenterGrid
                    presenters={userPresenters}
                    selectedPresenter={selectedPresenter}
                    onSelectPresenter={handleSelectPresenter}
                    onDeletePresenter={handleDeletePresenter}
                    showDelete={true}
                    columns={4}
                  />
                </div>
              ) : (
                <div className='py-4 text-center'>
                  <p className='text-sm text-neutral-500 dark:text-neutral-400'>
                    You haven't uploaded any avatars yet
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "upload" && (
        <div className='space-y-4 py-6'>
          {!isAuthenticated ? (
            <div className='py-8 text-center'>
              <p className='mb-4 text-sm text-neutral-500 dark:text-neutral-400'>
                Please sign in to upload avatars
              </p>
            </div>
          ) : (
            <>
              {/* Upload Section */}
              <div className='mb-4 text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700'>
                  <Upload className='h-5 w-5 text-neutral-600 dark:text-neutral-300' />
                </div>
                <h4 className='text-sm font-medium text-neutral-900 dark:text-white'>
                  Upload Your Avatar
                </h4>
                <p className='mt-1 text-xs text-neutral-500 dark:text-neutral-400'>
                  Select an image to create your custom avatar
                </p>
              </div>

              {/* File Input */}
              {!selectedFile && (
                <div className='flex flex-col items-center gap-3'>
                  <label className='w-full'>
                    <input
                      type='file'
                      accept='image/jpeg,image/jpg,image/png,image/webp'
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      disabled={uploading}
                    />
                    <span className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'>
                      <Upload className='h-4 w-4' />
                      Select Image
                    </span>
                  </label>
                </div>
              )}

              {/* Form Fields After File Selection */}
              {selectedFile && filePreview && (
                <div className='w-full space-y-3'>
                  {/* Image Preview */}
                  <div className='flex flex-col gap-2 md:flex-row md:items-center'>
                    <div className='h-16 w-16 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800'>
                      <img
                        src={filePreview}
                        alt='Preview'
                        className='h-full max-h-full w-full max-w-full object-cover'
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                        Avatar Name *
                      </label>
                      <input
                        type='text'
                        value={avatarName}
                        onChange={(e) => setAvatarName(e.target.value)}
                        placeholder='e.g., John, Sarah'
                        className='w-full rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-white'
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  {/* Gender Selection */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                      Gender *
                    </label>
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={() => setAvatarGender("male")}
                        disabled={uploading}
                        className={cn(
                          "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          avatarGender === "male"
                            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                          uploading && "cursor-not-allowed opacity-50"
                        )}
                      >
                        Male
                      </button>
                      <button
                        type='button'
                        onClick={() => setAvatarGender("female")}
                        disabled={uploading}
                        className={cn(
                          "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          avatarGender === "female"
                            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                          uploading && "cursor-not-allowed opacity-50"
                        )}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                        setAvatarName("");
                        setAvatarGender("male");
                      }}
                      disabled={uploading}
                      className='flex-1 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={handleUploadAvatar}
                      disabled={uploading || !avatarName.trim()}
                      className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
                    >
                      {uploading ? (
                        <>
                          <LoadingFileLoader size={16} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Upload className='h-4 w-4' />
                          Save Avatar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className='space-y-4'>
      {/* Tabs */}
      <div className='flex gap-2 border-b border-neutral-200 dark:border-neutral-700'>
        <button
          onClick={() => setActiveTab("popular")}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "popular"
              ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
              : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
          )}
        >
          AI Avatar
        </button>
        {isAuthenticated && (
          <>
            <button
              onClick={() => setActiveTab("my-avatar")}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "my-avatar"
                  ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
              )}
            >
              My Avatar
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "upload"
                  ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
              )}
            >
              Upload
            </button>
          </>
        )}
      </div>

      {/* Presenter Grid */}
      {activeTab === "popular" && (
        <div className='space-y-3'>
          <h3 className='text-sm font-medium text-neutral-500 dark:text-neutral-400'>
            Choose avatar
          </h3>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <LoadingFileLoader size={16} />
            </div>
          ) : presenters.length === 0 ? (
            <div className='py-8 text-center text-sm text-neutral-500 dark:text-neutral-400'>
              No presenters available
            </div>
          ) : (
            <div className='grid grid-cols-4 gap-2'>
              {presenters.slice(0, 5).map((presenter) => {
                const presenterId = presenter._id || presenter.id;
                const selectedId =
                  selectedPresenter?._id || selectedPresenter?.id;
                return (
                  <PresenterCard
                    key={presenterId}
                    presenter={presenter}
                    isSelected={
                      !!selectedPresenter &&
                      !!presenterId &&
                      !!selectedId &&
                      selectedId === presenterId
                    }
                    onSelect={() => handleSelectPresenter(presenter)}
                  />
                );
              })}
              <MoreButton />
            </div>
          )}
        </div>
      )}

      {activeTab === "my-avatar" && (
        <div className='space-y-4 py-4'>
          {!isAuthenticated ? (
            <div className='py-4 text-center'>
              <p className='mb-4 text-sm text-neutral-500 dark:text-neutral-400'>
                Please sign in to view your avatars
              </p>
            </div>
          ) : loading ? (
            <div className='flex items-center justify-center py-8'>
              <LoadingFileLoader size={16} />
            </div>
          ) : (
            <>
              {/* User's Custom Avatars */}
              {userPresenters.length > 0 ? (
                <div>
                  <h4 className='mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                    My Avatars
                  </h4>
                  <div className='grid grid-cols-4 gap-2'>
                    {userPresenters.map((presenter) => {
                      const presenterId = presenter._id || presenter.id;
                      const selectedId =
                        selectedPresenter?._id || selectedPresenter?.id;
                      return (
                        <PresenterCard
                          key={presenterId}
                          presenter={presenter}
                          isSelected={
                            !!selectedPresenter &&
                            !!presenterId &&
                            !!selectedId &&
                            selectedId === presenterId
                          }
                          onSelect={() => handleSelectPresenter(presenter)}
                          onDelete={() => handleDeletePresenter(presenter)}
                          showDelete={true}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className='py-4 text-center'>
                  <p className='text-sm text-neutral-500 dark:text-neutral-400'>
                    You haven't uploaded any avatars yet
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "upload" && (
        <div className='space-y-4 py-4'>
          {!isAuthenticated ? (
            <div className='py-4 text-center'>
              <p className='mb-4 text-sm text-neutral-500 dark:text-neutral-400'>
                Please sign in to upload avatars
              </p>
            </div>
          ) : (
            <>
              {/* Upload Section */}
              <div className='mb-4 text-center'>
                <div className='mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700'>
                  <Upload className='h-4 w-4 text-neutral-600 dark:text-neutral-300' />
                </div>
                <h4 className='text-sm font-medium text-neutral-900 dark:text-white'>
                  Upload Your Avatar
                </h4>
                <p className='mt-1 text-xs text-neutral-500 dark:text-neutral-400'>
                  Select an image to create your custom avatar
                </p>
              </div>

              {/* File Input */}
              {!selectedFile && (
                <div className='flex flex-col items-center gap-3'>
                  <label className='w-full'>
                    <input
                      type='file'
                      accept='image/jpeg,image/jpg,image/png,image/webp'
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      disabled={uploading}
                    />
                    <span className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'>
                      <Upload className='h-4 w-4' />
                      Select Image
                    </span>
                  </label>
                </div>
              )}

              {/* Form Fields After File Selection */}
              {selectedFile && filePreview && (
                <div className='w-full space-y-3'>
                  {/* Image Preview */}
                  <div className='flex flex-col gap-2 md:flex-row md:items-center'>
                    <div className='h-16 w-16 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800'>
                      <img
                        src={filePreview}
                        alt='Preview'
                        className='h-full max-h-full w-full max-w-full object-cover'
                      />
                    </div>
                    {/* Avatar Name Input */}
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                        Avatar Name *
                      </label>
                      <input
                        type='text'
                        value={avatarName}
                        onChange={(e) => setAvatarName(e.target.value)}
                        placeholder='e.g., John, Sarah'
                        className='w-full rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-white'
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  {/* Gender Selection */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                      Gender *
                    </label>
                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={() => setAvatarGender("male")}
                        disabled={uploading}
                        className={cn(
                          "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          avatarGender === "male"
                            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                          uploading && "cursor-not-allowed opacity-50"
                        )}
                      >
                        Male
                      </button>
                      <button
                        type='button'
                        onClick={() => setAvatarGender("female")}
                        disabled={uploading}
                        className={cn(
                          "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          avatarGender === "female"
                            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                          uploading && "cursor-not-allowed opacity-50"
                        )}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                        setAvatarName("");
                        setAvatarGender("male");
                      }}
                      disabled={uploading}
                      className='flex-1 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={handleUploadAvatar}
                      disabled={uploading || !avatarName.trim()}
                      className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
                    >
                      {uploading ? (
                        <>
                          <LoadingFileLoader size={16} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Upload className='h-4 w-4' />
                          Save Avatar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Dialog for Desktop */}
      {isDesktop ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className='max-w-3xl'>
            <DialogHeader>
              <DialogTitle>Select Avatar</DialogTitle>
              {/* <DialogDescription>
                Choose an AI avatar or upload your own
              </DialogDescription> */}
            </DialogHeader>
            <FullPresenterList />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className='max-h-[85vh]'>
            <DrawerHeader>
              <DrawerTitle>Select Avatar</DrawerTitle>
              {/* <DrawerDescription>
                Choose an AI avatar or upload your own
              </DrawerDescription> */}
            </DrawerHeader>
            <div className='px-4 pb-6'>
              <FullPresenterList />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
