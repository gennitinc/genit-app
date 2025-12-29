"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { apiResponse } from "@/utils/apiResponse";
import { creatorApi } from "@/utils/inspire-api";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Users,
  Heart,
  Eye,
  Check,
  Instagram,
  Twitter,
  Github,
  Linkedin,
  Loader2,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  Settings,
  Camera,
  X,
  Plus,
  Trash2,
  Share2,
  Copy,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CommunityContent } from "@/types/inspire";
import { CreatorProfileContent } from "@/components/creator/creator-profile-content";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { useIsMobile } from "@/components/ui/use-mobile";

interface CreatorProfile {
  _id: string;
  username: string;
  email: string;
  userdp: string;
  isVerified: boolean;
  followers: number;
  following: number;
  bio?: string;
  coverPhoto?: string;
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
  stats: {
    totalPosts: number;
    totalLikes: number;
    totalViews: number;
  };
}

export default function CreatorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useUserContext();
  const username = params.username as string;
  const isMobile = useIsMobile();

  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [content, setContent] = useState<{
    images: CommunityContent[];
    videos: CommunityContent[];
  }>({ images: [], videos: [] });
  const [contentLoading, setContentLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsBio, setSettingsBio] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [settingsSocials, setSettingsSocials] = useState({
    instagram: "",
    twitter: "",
    github: "",
    linkedin: "",
    facebook: "",
    youtube: "",
    dribbble: "",
    behance: "",
    tiktok: "",
  });
  const [selectedSocials, setSelectedSocials] = useState<string[]>([]);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const socialMediaOptions = [
    {
      key: "instagram",
      label: "Instagram",
      placeholder: "https://instagram.com/username",
    },
    {
      key: "twitter",
      label: "Twitter/X",
      placeholder: "https://x.com/username",
    },
    {
      key: "github",
      label: "GitHub",
      placeholder: "https://github.com/username",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/username",
    },
    {
      key: "facebook",
      label: "Facebook",
      placeholder: "https://facebook.com/username",
    },
    {
      key: "youtube",
      label: "YouTube",
      placeholder: "https://youtube.com/@username",
    },
    {
      key: "dribbble",
      label: "Dribbble",
      placeholder: "https://dribbble.com/username",
    },
    {
      key: "behance",
      label: "Behance",
      placeholder: "https://behance.net/username",
    },
    {
      key: "tiktok",
      label: "TikTok",
      placeholder: "https://tiktok.com/@username",
    },
  ];

  useEffect(() => {
    fetchProfile();
    fetchContent();
  }, [username]);

  useEffect(() => {
    if (profile && currentUser) {
      checkFollowingStatus();
    }
  }, [profile, currentUser]);

  // Set document title when profile is loaded
  useEffect(() => {
    if (profile) {
      const title = `${profile.username}${profile.isVerified ? "" : ""} | Gennit Creator Profile`;
      document.title = title;
    } else if (!loading) {
      document.title = "Creator Not Found | Gennit";
    }
  }, [profile, loading]);

  useEffect(() => {
    if (profile) {
      setSettingsBio(profile.bio || "");
      const socials = {
        instagram: profile.socials?.instagram || "",
        twitter: profile.socials?.twitter || "",
        github: profile.socials?.github || "",
        linkedin: profile.socials?.linkedin || "",
        facebook: profile.socials?.facebook || "",
        youtube: profile.socials?.youtube || "",
        dribbble: profile.socials?.dribbble || "",
        behance: profile.socials?.behance || "",
        tiktok: profile.socials?.tiktok || "",
      };
      setSettingsSocials(socials);
      // Initialize selected socials based on existing data
      const selected = Object.entries(socials)
        .filter(([_, value]) => value && value.trim() !== "")
        .map(([key]) => key);
      setSelectedSocials(selected);
    }
  }, [profile]);

  const handleAddSocial = (socialKey: string) => {
    if (selectedSocials.length < 4 && !selectedSocials.includes(socialKey)) {
      setSelectedSocials([...selectedSocials, socialKey]);
    }
  };

  const handleRemoveSocial = (socialKey: string) => {
    setSelectedSocials(selectedSocials.filter((key) => key !== socialKey));
    setSettingsSocials({
      ...settingsSocials,
      [socialKey]: "",
    });
  };

  const availableSocials = socialMediaOptions.filter(
    (option) => !selectedSocials.includes(option.key)
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await creatorApi.getProfile(username);

      if (response.success) {
        setProfile(response.data);
        setIsFollowing(response.data.isFollowing || false);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load creator profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      setContentLoading(true);
      const response = await creatorApi.getContent(username);

      if (response.success) {
        setContent({
          images: response.data.images || [],
          videos: response.data.videos || [],
        });
      }
    } catch (error: any) {
      console.error("Error fetching content:", error);
    } finally {
      setContentLoading(false);
    }
  };

  const checkFollowingStatus = async () => {
    if (!currentUser || !profile) return;

    try {
      const response = await creatorApi.getFollowStatus(profile._id);

      if (response.success) {
        setIsFollowing(response.data.isFollowing);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser || !profile) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow creators",
        variant: "destructive",
      });
      return;
    }

    if (currentUser._id === profile._id) {
      return;
    }

    try {
      setFollowing(true);
      const response = await creatorApi.follow(profile._id);

      if (response.success) {
        setIsFollowing(!isFollowing);
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                followers: isFollowing
                  ? prev.followers - 1
                  : prev.followers + 1,
              }
            : null
        );
        toast({
          title: isFollowing ? "Unfollowed" : "Following",
          description: isFollowing
            ? `You unfollowed ${profile.username}`
            : `You're now following ${profile.username}`,
        });
      }
    } catch (error: any) {
      console.error("Error following/unfollowing:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setFollowing(false);
    }
  };

  const handleCoverPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !isOwnProfile) return;

    try {
      setIsUploadingCover(true);
      const response = await creatorApi.updateProfile({
        coverPhoto: file,
      });

      if (response.success) {
        setProfile((prev) =>
          prev ? { ...prev, coverPhoto: response.data.coverPhoto } : null
        );
        toast({
          title: "Success",
          description: "Cover photo updated successfully",
        });
      }
    } catch (error: any) {
      console.error("Error uploading cover photo:", error);
      toast({
        title: "Error",
        description: "Failed to upload cover photo",
        variant: "destructive",
      });
    } finally {
      setIsUploadingCover(false);
      if (coverPhotoInputRef.current) {
        coverPhotoInputRef.current.value = "";
      }
    }
  };

  const handleProfilePicUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !isOwnProfile) return;

    try {
      setIsUploadingProfile(true);
      const response = await creatorApi.updateProfile({
        profilePic: file,
      });

      if (response.success) {
        setProfile((prev) =>
          prev ? { ...prev, userdp: response.data.userdp } : null
        );
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      }
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploadingProfile(false);
      if (profilePicInputRef.current) {
        profilePicInputRef.current.value = "";
      }
    }
  };

  const handleSaveSettings = async () => {
    if (!isOwnProfile) return;

    try {
      setIsSavingSettings(true);
      // Only include selected socials, set others to empty string
      const socialsToSave: typeof settingsSocials = {
        instagram: "",
        twitter: "",
        github: "",
        linkedin: "",
        facebook: "",
        youtube: "",
        dribbble: "",
        behance: "",
        tiktok: "",
      };

      selectedSocials.forEach((key) => {
        const value = settingsSocials[key as keyof typeof settingsSocials];
        if (value && value.trim() !== "") {
          socialsToSave[key as keyof typeof socialsToSave] = value;
        }
      });

      const response = await creatorApi.updateProfile({
        bio: settingsBio,
        socials: socialsToSave,
      });

      if (response.success) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                bio: settingsBio,
                socials: socialsToSave,
              }
            : null
        );
        setIsSettingsOpen(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Creator not found
        </h1>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === profile._id;
  const fallbackCoverPhoto =
    "https://media.istockphoto.com/id/1949882446/nl/vector/teal-orange-grainy-background-banner-noise-texture-glowing-color-gradient-vibrant-dark.jpg?s=612x612&w=0&k=20&c=f9vVJ6k8ocbbqkBBt6WG_xlCa96s6_dBVXL5g6qakvI=";

  // Share functionality
  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/creator/${username}`
      : "";
  const shareText = `Follow ${profile?.username} on Gennit - Check out their amazing AI-generated content!`;
  const shareTitle = `${profile?.username} on Gennit`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopiedLink(true);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to clipboard.",
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(profileUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(shareTitle);

    let shareUrl = "";
    switch (platform) {
      case "x":
      case "twitter":
        shareUrl = `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <LandingNavbar />

      {/* Profile Header Card - Desktop */}
      <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 lg:pt-8 lg:pb-8 w-full lg:mt-10">
        <div className=" rounded-t-xl shadow-xs overflow-hidden">
          {/* Banner/Cover Photo - Full width with top border only */}
          <div className="relative h-40 md:h-40 w-full border-t border-neutral-200 dark:border-neutral-800">
            <img
              src={profile.coverPhoto || fallbackCoverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                imageRendering: "-webkit-optimize-contrast",
              }}
            />

            {/* Back Button - Top Left */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => router.push("/community")}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors z-10 cursor-pointer"
                  aria-label="Back to community"
                >
                  <svg
                    fill="currentColor"
                    height="200px"
                    width="200px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 26.676 26.676"
                    xmlSpace="preserve"
                    className="w-5 h-5 text-neutral-700 dark:text-neutral-300"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <path d="M26.105,21.891c-0.229,0-0.439-0.131-0.529-0.346l0,0c-0.066-0.156-1.716-3.857-7.885-4.59 c-1.285-0.156-2.824-0.236-4.693-0.25v4.613c0,0.213-0.115,0.406-0.304,0.508c-0.188,0.098-0.413,0.084-0.588-0.033L0.254,13.815 C0.094,13.708,0,13.528,0,13.339c0-0.191,0.094-0.365,0.254-0.477l11.857-7.979c0.175-0.121,0.398-0.129,0.588-0.029 c0.19,0.102,0.303,0.295,0.303,0.502v4.293c2.578,0.336,13.674,2.33,13.674,11.674c0,0.271-0.191,0.508-0.459,0.562 C26.18,21.891,26.141,21.891,26.105,21.891z" />{" "}
                        <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                        <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
                        <g> </g> <g> </g> <g> </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back to Community</p>
              </TooltipContent>
            </Tooltip>

            {/* Cover Photo Upload Button */}
            {isOwnProfile && (
              <div className="absolute bottom-4 right-4">
                <input
                  ref={coverPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => coverPhotoInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="w-10 h-10 rounded-full bg-black/70 hover:bg-black/80 flex items-center justify-center transition-colors"
                >
                  {isUploadingCover ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-6 mt-4">
            {/* Profile Picture and Settings Row (Mobile/Tablet) */}
            <div className="relative md:hidden -mt-16 mb-4">
              {/* Profile Picture - Centered */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    {profile.userdp ? (
                      <img
                        src={profile.userdp}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Profile Pic Upload Button */}
                  {isOwnProfile && (
                    <div className="absolute bottom-0 right-0">
                      <input
                        ref={profilePicInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => profilePicInputRef.current?.click()}
                        disabled={isUploadingProfile}
                        className="w-10 h-10 rounded-full bg-black/70 hover:bg-black/80 flex items-center justify-center transition-colors z-10"
                      >
                        {isUploadingProfile ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Share and Settings Buttons (Mobile/Tablet - Icon Only) - Positioned at top right */}
              {isMobile && (
                <div className="absolute top-2 right-0 z-20 flex gap-2">
                  {/* Share Button (Mobile) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 mt-14"
                      >
                        <Share2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={handleCopyLink}>
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedLink ? "Copied!" : "Copy Link"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("x")}>
                        <X className="w-4 h-4 mr-2" />
                        Share on X
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("facebook")}>
                        <Facebook className="w-4 h-4 mr-2" />
                        Share on Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                        <Linkedin className="w-4 h-4 mr-2" />
                        Share on LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Share on WhatsApp
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Settings Button (Mobile) */}
                  {isOwnProfile && (
                    <Drawer
                      open={isSettingsOpen}
                      onOpenChange={setIsSettingsOpen}
                    >
                      <DrawerTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-800 mt-14"
                        >
                          <Settings className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="max-h-[85dvh]">
                        <DrawerHeader>
                          <DrawerTitle>Edit Profile</DrawerTitle>
                        </DrawerHeader>
                        <div className="px-4 pb-4 overflow-y-auto">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Bio
                              </label>
                              <textarea
                                value={settingsBio}
                                onChange={(e) => setSettingsBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none"
                                maxLength={115}
                              />
                              <p className="text-xs text-neutral-500 mt-1">
                                {settingsBio.length}/115
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Social Media Links (Max 4)
                              </label>
                              <div className="space-y-3">
                                {/* Selected Socials */}
                                {selectedSocials.map((socialKey) => {
                                  const social = socialMediaOptions.find(
                                    (opt) => opt.key === socialKey
                                  );
                                  if (!social) return null;
                                  return (
                                    <div key={socialKey} className="flex gap-2">
                                      <div className="flex-1">
                                        <label className="text-xs text-neutral-500 mb-1 block">
                                          {social.label}
                                        </label>
                                        <Input
                                          type="url"
                                          value={
                                            settingsSocials[
                                              socialKey as keyof typeof settingsSocials
                                            ]
                                          }
                                          onChange={(e) =>
                                            setSettingsSocials({
                                              ...settingsSocials,
                                              [socialKey]: e.target.value,
                                            })
                                          }
                                          placeholder={social.placeholder}
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                          handleRemoveSocial(socialKey)
                                        }
                                        className="mt-6 h-9 w-9 shrink-0"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  );
                                })}

                                {/* Add Social Button */}
                                {selectedSocials.length < 4 &&
                                  availableSocials.length > 0 && (
                                    <div>
                                      <Select onValueChange={handleAddSocial}>
                                        <SelectTrigger className="w-full">
                                          <Plus className="w-4 h-4 mr-2" />
                                          <SelectValue placeholder="Add social media" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {availableSocials.map((option) => (
                                            <SelectItem
                                              key={option.key}
                                              value={option.key}
                                            >
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                {selectedSocials.length >= 4 && (
                                  <p className="text-xs text-neutral-500">
                                    Maximum of 4 social media links allowed
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <DrawerFooter>
                          <div className="flex justify-end gap-2 w-full">
                            <Button
                              variant="outline"
                              onClick={() => setIsSettingsOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveSettings}
                              disabled={isSavingSettings}
                            >
                              {isSavingSettings ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              Save
                            </Button>
                          </div>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:flex-row md:items-start md:justify-between gap-6">
              {/* Left: Profile Picture and Info */}
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Profile Picture */}
                <div className="relative -mt-20">
                  <div className="w-40 h-40 rounded-full border-4 border-white dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    {profile.userdp ? (
                      <img
                        src={profile.userdp}
                        alt={profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-20 h-20 text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Profile Pic Upload Button */}
                  {isOwnProfile && (
                    <div className="absolute bottom-0 right-0">
                      <input
                        ref={profilePicInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => profilePicInputRef.current?.click()}
                        disabled={isUploadingProfile}
                        className="w-10 h-10 rounded-full bg-black/70 hover:bg-black/80 flex items-center justify-center transition-colors"
                      >
                        {isUploadingProfile ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 mt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                      {profile.username}
                    </h1>
                    {profile.isVerified && (
                      <svg
                        viewBox="0 0 22 22"
                        aria-label="Verified account"
                        role="img"
                        className="w-6 h-6 flex-shrink-0"
                        data-testid="icon-verified"
                        fill="#3b82f6"
                      >
                        <g>
                          <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                        </g>
                      </svg>
                    )}
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  {/* Stats and Social Links Container - Desktop */}
                  <div className="flex flex-row justify-between items-center gap-4 mb-4 w-full">
                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-neutral-500" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          <span className="font-bold">{profile.followers}</span>{" "}
                          followers
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-neutral-500" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          <span className="font-bold">{profile.following}</span>{" "}
                          following
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-neutral-500" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          <span className="font-bold">
                            {profile.stats.totalPosts}
                          </span>{" "}
                          posts
                        </span>
                      </div>
                    </div>

                    {/* Social Links */}
                    {(profile.socials?.instagram ||
                      profile.socials?.twitter ||
                      profile.socials?.github ||
                      profile.socials?.linkedin ||
                      profile.socials?.facebook ||
                      profile.socials?.youtube ||
                      profile.socials?.dribbble ||
                      profile.socials?.behance ||
                      profile.socials?.tiktok) && (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Follow me on
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {profile.socials?.instagram && (
                            <a
                              href={profile.socials.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                              title="Instagram"
                            >
                              <Instagram className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                            </a>
                          )}
                          {profile.socials?.twitter && (
                            <a
                              href={profile.socials.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                              title="Twitter/X"
                            >
                              <Twitter className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                            </a>
                          )}
                          {profile.socials?.github && (
                            <a
                              href={profile.socials.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                              title="GitHub"
                            >
                              <Github className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                            </a>
                          )}
                          {profile.socials?.linkedin && (
                            <a
                              href={profile.socials.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                              title="LinkedIn"
                            >
                              <Linkedin className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                            </a>
                          )}
                          {profile.socials?.facebook && (
                            <a
                              href={profile.socials.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                              title="Facebook"
                            >
                              <svg
                                className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </a>
                          )}
                          {profile.socials?.youtube && (
                            <a
                              href={profile.socials.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                              title="YouTube"
                            >
                              <svg
                                className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                            </a>
                          )}
                          {profile.socials?.dribbble && (
                            <a
                              href={profile.socials.dribbble}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                              title="Dribbble"
                            >
                              <svg
                                className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 2.224 2.006 4.811 2.006 6.387 0 1.103-.183 2.16-.512 3.07 2.52-.78 4.549-2.923 5.142-5.597-.57-.542-1.252-1.422-1.252-1.422zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.12-7.86 6.12 1.663 1.158 3.915 1.863 6.519 1.863 1.785 0 3.397-.366 4.597-1.233zm-9.791-4.403c1.205-.524 3.05-.986 4.908-.986.07 0 .15.008.22.013-1.024 3.528-2.378 6.652-3.986 8.876-1.214-1.67-1.142-4.05-.142-7.903zM2.344 15.6c1.266 1.988 3.375 3.302 5.757 3.884-.536-1.877-1.185-3.74-1.948-5.565-.33-.06-.66-.112-.99-.15-1.048-.096-1.948-.14-2.82-.14-.49 0-.973.027-1.44.08.18 1.2.7 2.4 1.44 3.89zm18.24-3.93c.58 1.084.95 2.28.95 3.55 0 2.5-1.135 4.745-2.92 6.245-1.24-.883-2.673-1.65-4.292-2.256 1.27-1.638 2.29-3.599 2.963-5.703.22-.07.44-.14.66-.2 1.21-.18 2.4-.405 3.57-.68.05-.36.07-.72.07-1.08 0-.25-.02-.5-.03-.75-.18-.12-.43-.28-.67-.45-.25-.18-.5-.35-.75-.52zm-4.28 3.16c-.28 1.193-.75 2.34-1.38 3.407a10.772 10.772 0 0 1-3.05-.894c.93-2.37 1.66-4.835 2.16-7.27.12-.6.22-1.19.3-1.77 2.34.42 4.7.98 6.97 1.68-.4.9-.84 1.76-1.32 2.58-.48.82-1 1.62-1.54 2.39-.18.24-.36.48-.55.7-.19.22-.38.43-.58.63z" />
                              </svg>
                            </a>
                          )}
                          {profile.socials?.behance && (
                            <a
                              href={profile.socials.behance}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                              title="Behance"
                            >
                              <svg
                                className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.12 1.185.12 2.07H12.855c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4.588h-6.147c.09 2.544 2.529 2.544 3.074 2.544 2.835 0 3.074-2.544.073-2.544zM0 11h4.021v2.151H0V11zm6.057-1.192c-1.49 0-2.688-1.21-2.688-2.701C3.369 5.816 4.558 4.605 6.057 4.605c1.49 0 2.688 1.21 2.688 2.701 0 1.491-1.198 2.701-2.688 2.701zm-1.36-3.536c.495 0 .891.402.891.899 0 .496-.396.899-.891.899-.495 0-.891-.403-.891-.899 0-.497.396-.899.891-.899z" />
                              </svg>
                            </a>
                          )}
                          {profile.socials?.tiktok && (
                            <a
                              href={profile.socials.tiktok}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                              title="TikTok"
                            >
                              <svg
                                className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Share, Settings/Follow Button (Desktop) */}
              <div className="flex items-start gap-3">
                {/* Share Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Share2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedLink ? "Copied!" : "Copy Link"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("x")}>
                      <X className="w-4 h-4 mr-2" />
                      Share on X
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook")}>
                      <Facebook className="w-4 h-4 mr-2" />
                      Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                      <Linkedin className="w-4 h-4 mr-2" />
                      Share on LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Share on WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {isOwnProfile && !isMobile ? (
                  <Dialog
                    open={isSettingsOpen}
                    onOpenChange={setIsSettingsOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="px-4 py-2 rounded-lg "
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[80dvh] overflow-y-auto [&>button]:hidden">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Bio
                          </label>
                          <textarea
                            value={settingsBio}
                            onChange={(e) => setSettingsBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none"
                            maxLength={115}
                          />
                          <p className="text-xs text-neutral-500 mt-1">
                            {settingsBio.length}/115
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Social Media Links (Max 4)
                          </label>
                          <div className="space-y-3">
                            {/* Selected Socials */}
                            {selectedSocials.map((socialKey) => {
                              const social = socialMediaOptions.find(
                                (opt) => opt.key === socialKey
                              );
                              if (!social) return null;
                              return (
                                <div key={socialKey} className="flex gap-2">
                                  <div className="flex-1">
                                    <label className="text-xs text-neutral-500 mb-1 block">
                                      {social.label}
                                    </label>
                                    <Input
                                      type="url"
                                      value={
                                        settingsSocials[
                                          socialKey as keyof typeof settingsSocials
                                        ]
                                      }
                                      onChange={(e) =>
                                        setSettingsSocials({
                                          ...settingsSocials,
                                          [socialKey]: e.target.value,
                                        })
                                      }
                                      placeholder={social.placeholder}
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveSocial(socialKey)
                                    }
                                    className="mt-6 h-9 w-9 shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              );
                            })}

                            {/* Add Social Button */}
                            {selectedSocials.length < 4 &&
                              availableSocials.length > 0 && (
                                <div>
                                  <Select onValueChange={handleAddSocial}>
                                    <SelectTrigger className="w-full">
                                      <Plus className="w-4 h-4 mr-2" />
                                      <SelectValue placeholder="Add social media" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableSocials.map((option) => (
                                        <SelectItem
                                          key={option.key}
                                          value={option.key}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            {selectedSocials.length >= 4 && (
                              <p className="text-xs text-neutral-500">
                                Maximum of 4 social media links allowed
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveSettings}
                            disabled={isSavingSettings}
                          >
                            {isSavingSettings ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Save
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    onClick={handleFollow}
                    disabled={following}
                    className={cn(
                      "px-6 py-2 rounded-lg font-medium transition-colors",
                      isFollowing
                        ? "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                        : "bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900"
                    )}
                  >
                    {following ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isFollowing ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                )}
              </div>
            </div>
            {/* End Desktop Layout */}

            {/* Mobile/Tablet: Centered Content */}
            <div className="md:hidden flex flex-col items-center text-center">
              {/* Username and Verification */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {profile.username}
                </h1>
                {profile.isVerified && (
                  <svg
                    viewBox="0 0 22 22"
                    aria-label="Verified account"
                    role="img"
                    className="w-5 h-5 flex-shrink-0"
                    data-testid="icon-verified"
                    fill="#3b82f6"
                  >
                    <g>
                      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                    </g>
                  </svg>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl">
                  {profile.bio}
                </p>
              )}

              {/* Stats and Social Links Container - Mobile/Tablet */}
              <div className="flex flex-col items-center gap-4 mb-4 w-full">
                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      <span className="font-bold">{profile.followers}</span>{" "}
                      followers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      <span className="font-bold">{profile.following}</span>{" "}
                      following
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      <span className="font-bold">
                        {profile.stats.totalPosts}
                      </span>{" "}
                      posts
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                {(profile.socials?.instagram ||
                  profile.socials?.twitter ||
                  profile.socials?.github ||
                  profile.socials?.linkedin ||
                  profile.socials?.facebook ||
                  profile.socials?.youtube ||
                  profile.socials?.dribbble ||
                  profile.socials?.behance ||
                  profile.socials?.tiktok) && (
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Follow me on
                    </p>
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                      {profile.socials?.instagram && (
                        <a
                          href={profile.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                          title="Instagram"
                        >
                          <Instagram className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        </a>
                      )}
                      {profile.socials?.twitter && (
                        <a
                          href={profile.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                          title="Twitter/X"
                        >
                          <Twitter className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        </a>
                      )}
                      {profile.socials?.github && (
                        <a
                          href={profile.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        </a>
                      )}
                      {profile.socials?.linkedin && (
                        <a
                          href={profile.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                        </a>
                      )}
                      {profile.socials?.facebook && (
                        <a
                          href={profile.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                          title="Facebook"
                        >
                          <svg
                            className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      )}
                      {profile.socials?.youtube && (
                        <a
                          href={profile.socials.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                          title="YouTube"
                        >
                          <svg
                            className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </a>
                      )}
                      {profile.socials?.dribbble && (
                        <a
                          href={profile.socials.dribbble}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                          title="Dribbble"
                        >
                          <svg
                            className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 2.224 2.006 4.811 2.006 6.387 0 1.103-.183 2.16-.512 3.07 2.52-.78 4.549-2.923 5.142-5.597-.57-.542-1.252-1.422-1.252-1.422zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.12-7.86 6.12 1.663 1.158 3.915 1.863 6.519 1.863 1.785 0 3.397-.366 4.597-1.233zm-9.791-4.403c1.205-.524 3.05-.986 4.908-.986.07 0 .15.008.22.013-1.024 3.528-2.378 6.652-3.986 8.876-1.214-1.67-1.142-4.05-.142-7.903zM2.344 15.6c1.266 1.988 3.375 3.302 5.757 3.884-.536-1.877-1.185-3.74-1.948-5.565-.33-.06-.66-.112-.99-.15-1.048-.096-1.948-.14-2.82-.14-.49 0-.973.027-1.44.08.18 1.2.7 2.4 1.44 3.89zm18.24-3.93c.58 1.084.95 2.28.95 3.55 0 2.5-1.135 4.745-2.92 6.245-1.24-.883-2.673-1.65-4.292-2.256 1.27-1.638 2.29-3.599 2.963-5.703.22-.07.44-.14.66-.2 1.21-.18 2.4-.405 3.57-.68.05-.36.07-.72.07-1.08 0-.25-.02-.5-.03-.75-.18-.12-.43-.28-.67-.45-.25-.18-.5-.35-.75-.52zm-4.28 3.16c-.28 1.193-.75 2.34-1.38 3.407a10.772 10.772 0 0 1-3.05-.894c.93-2.37 1.66-4.835 2.16-7.27.12-.6.22-1.19.3-1.77 2.34.42 4.7.98 6.97 1.68-.4.9-.84 1.76-1.32 2.58-.48.82-1 1.62-1.54 2.39-.18.24-.36.48-.55.7-.19.22-.38.43-.58.63z" />
                          </svg>
                        </a>
                      )}
                      {profile.socials?.behance && (
                        <a
                          href={profile.socials.behance}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                          title="Behance"
                        >
                          <svg
                            className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.12 1.185.12 2.07H12.855c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4.588h-6.147c.09 2.544 2.529 2.544 3.074 2.544 2.835 0 3.074-2.544.073-2.544zM0 11h4.021v2.151H0V11zm6.057-1.192c-1.49 0-2.688-1.21-2.688-2.701C3.369 5.816 4.558 4.605 6.057 4.605c1.49 0 2.688 1.21 2.688 2.701 0 1.491-1.198 2.701-2.688 2.701zm-1.36-3.536c.495 0 .891.402.891.899 0 .496-.396.899-.891.899-.495 0-.891-.403-.891-.899 0-.497.396-.899.891-.899z" />
                          </svg>
                        </a>
                      )}
                      {profile.socials?.tiktok && (
                        <a
                          href={profile.socials.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                          title="TikTok"
                        >
                          <svg
                            className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sticky top-0 z-50 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex gap-8 pt-2 pb-4">
            <button
              onClick={() => {
                // Use requestAnimationFrame to prevent hanging
                requestAnimationFrame(() => {
                  setActiveTab("images");
                });
              }}
              disabled={contentLoading}
              className={cn(
                "px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "images"
                  ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                  : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300",
                contentLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Images ({content.images.length})
              </div>
            </button>
            <button
              onClick={() => {
                // Use requestAnimationFrame to prevent hanging
                requestAnimationFrame(() => {
                  setActiveTab("videos");
                });
              }}
              disabled={contentLoading}
              className={cn(
                "px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "videos"
                  ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                  : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300",
                contentLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos ({content.videos.length})
              </div>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <CreatorProfileContent
          content={activeTab === "images" ? content.images : content.videos}
          contentType={activeTab}
          loading={contentLoading}
        />
      </div>

      <LandingFooter />
    </div>
  );
}
