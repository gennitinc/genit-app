"use client";

import React, { useState, useEffect, useCallback } from "react";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  HistoryIcon,
  Trash2,
  X,
  Upload,
  User,
  Loader2,
  Wand2,
  Check,
  Plus,
  SaveIcon,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridPattern } from "@/components/ui/grid-pattern";
import { apiResponse } from "@/utils/apiResponse";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import withAuth from "@/helper/hoc/withAuth";
import { ModelSelector } from "@/components/inspire/model-selector";
import { Model } from "@/types/inspire";
import { imageGenApi, presenterApi } from "@/utils/inspire-api";
import { Toaster } from "@/components/ui/sonner";
import { PremiumInput } from "@/components/ui/premium-input";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Presenter {
  _id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  gender: string;
  category: string;
  isPublic: boolean;
  status: string;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PresenterPage = () => {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [loadingPresenters, setLoadingPresenters] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "ai">("upload");
  const [rightActiveTab, setRightActiveTab] = useState<"list" | "preview">(
    "list",
  );

  // Create Form State
  const [name, setName] = useState("");
  const [gender, setGender] = useState("female");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // AI Gen State
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);

  // Fetch Presenters
  const loadPresenters = useCallback(async () => {
    setLoadingPresenters(true);
    try {
      const userResponse = await presenterApi.getAll({ userId: "me" });

      if (userResponse.success && userResponse.data) {
        // Only show avatars created by this user (userId matches)
        // Filter out any admin-created avatars as a safety measure
        const avatars = Array.isArray(userResponse?.data)
          ? userResponse.data
              .filter((p) => !p?.admin)
              .map((p) => ({
                ...p,
                thumbnailUrl: p.thumbnailUrl ?? "",
              }))
          : [];

        console.log("av", avatars);

        setPresenters(avatars);
      } else {
        setPresenters([]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load presenters");
    } finally {
      setLoadingPresenters(false);
    }
  }, []);

  useEffect(() => {
    loadPresenters();
  }, [loadPresenters]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selected = e.target.files[0];
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleCreatePresenter = async () => {
    if (!name || !gender || (!file && !generatedImgUrl)) {
      toast.error("Please provide name, gender and an image");
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("gender", gender);

      if (file) {
        formData.append("image", file);
      } else if (generatedImgUrl) {
        // Convert URL to blob
        const response = await fetch(generatedImgUrl);
        const blob = await response.blob();
        const f = new File([blob], "presenter.jpg", { type: "image/jpeg" });
        formData.append("image", f);
      }

      const res = await apiResponse.post("/inspire/presenters", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Presenter added successfully!");
        setName("");
        setFile(null);
        setPreviewUrl(null);
        setGeneratedImgUrl(null);
        loadPresenters();
        setRightActiveTab("list");
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to add presenter");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!prompt.trim() || !selectedModel) {
      toast.error("Please provide a prompt and select a model");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await imageGenApi.generate({
        prompt: `Professional headshot of a person, ${prompt}`,
        modelId: selectedModel._id,
        aspectRatio: "1:1",
        resolution: "1080p",
        imageCount: 1,
      });

      if (res.success && res.data.images?.[0]) {
        setGeneratedImgUrl(res.data.images[0].url);
        setRightActiveTab("preview");
      }
    } catch (e) {
      toast.error("AI Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeletePresenter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this presenter?")) return;
    try {
      await apiResponse.delete(`/inspire/presenters/${id}`, {
        withCredentials: true,
      });
      toast.success("Deleted");
      setPresenters((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex relative w-full h-[100dvh] overflow-hidden bg-white dark:bg-black">
      <Toaster />
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container">
        <TopNavWithAurora />
        <div id="main-content" className="flex-1">
          <main className="flex-grow pt-12">
            <div className="text-center animate-fadeInUp mb-10 px-2 md:px-4">
              <h1 className="font-semibold tracking-tight text-2xl lg:text-4xl">
                Character
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-1">
                  Creation
                </span>
              </h1>
              <p
                className="my-2 text-muted-foreground text-sm md:text-lg animate-fadeInUp"
                style={{ animationDelay: "0.2s" }}
              >
                Create and manage your AI Characters
              </p>
            </div>

            <div className="relative w-full border-y border-black/5 dark:border-white/10">
              <GridPattern
                width={30}
                height={30}
                className="absolute inset-0 z-0 opacity-50"
              />

              <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 lg:gap-16 items-start relative z-10">
                {/* Left: Controls */}
                <div className="bg-white/80 dark:bg-[#141415]/80 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">
                        Presenter Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah J."
                        className="w-full bg-black/5 dark:bg-white/5 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">
                        Gender
                      </label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="w-full bg-black/5 dark:bg-white/5 border-none h-9 rounded-lg px-4">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unisex">Unisex</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={(v: any) => setActiveTab(v)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger
                        value="upload"
                        className="flex items-center gap-2"
                      >
                        <Upload size={14} /> Upload
                      </TabsTrigger>
                      <TabsTrigger
                        value="ai"
                        className="flex items-center gap-2"
                      >
                        <Sparkles size={14} /> AI Generate
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                      <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors bg-black/5 dark:bg-white/5">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            className="h-full w-full object-cover rounded-2xl"
                            alt=""
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload size={24} />
                            <span className="text-xs font-medium">
                              Click to upload image
                            </span>
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </TabsContent>

                    <TabsContent value="ai" className="space-y-4">
                      <ModelSelector
                        type="image"
                        selectedModel={selectedModel}
                        onSelectModel={setSelectedModel}
                      />
                      <div className="space-y-2">
                        <PremiumInput
                          value={prompt}
                          onChange={setPrompt}
                          onSubmit={handleAIGenerate}
                          isGenerating={isGenerating}
                          placeholder="Describe the person's look, ethnicity, clothing..."
                          minHeight="50px"
                        />
                      </div>
                      <Button
                        onClick={handleAIGenerate}
                        disabled={isGenerating}
                        className="w-full h-fit bg-gradient-to-r from-blue-500 to-cyan-500"
                      >
                        {isGenerating ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Sparkles className="mr-2" size={16} />
                        )}
                        {isGenerating ? "Generating..." : "Generate Candidate"}
                      </Button>
                    </TabsContent>
                  </Tabs>

                  {(previewUrl || generatedImgUrl) && (
                    <Button
                      onClick={handleCreatePresenter}
                      disabled={isCreating}
                      className="w-full h-fit text-md"
                    >
                      {isCreating ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <SaveIcon className="mr-2" />
                      )}
                      Save as Presenter
                    </Button>
                  )}
                </div>

                {/* Right: List / Preview */}
                <div className="flex flex-col h-full min-h-[500px]">
                  <div className="flex justify-start mb-6">
                    <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl">
                      <button
                        onClick={() => setRightActiveTab("list")}
                        className={cn(
                          "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                          rightActiveTab === "list"
                            ? "bg-white dark:bg-neutral-800 shadow"
                            : "text-muted-foreground",
                        )}
                      >
                        My Presenters
                      </button>
                      <button
                        onClick={() => setRightActiveTab("preview")}
                        disabled={!generatedImgUrl && !previewUrl}
                        className={cn(
                          "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                          rightActiveTab === "preview"
                            ? "bg-white dark:bg-neutral-800 shadow"
                            : "text-muted-foreground",
                        )}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {rightActiveTab === "list" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {loadingPresenters ? (
                        [1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse"
                          />
                        ))
                      ) : presenters.length > 0 ? (
                        presenters.map((p) => (
                          <div className="relative group">
                            <button
                              // onClick={onSelect}
                              className={cn(
                                "relative overflow-hidden rounded-lg transition-all w-full",
                                // isSelected
                                //   ? "ring-2 ring-neutral-900 dark:ring-neutral-100"
                                //   : "ring-1 ring-neutral-200 dark:ring-neutral-800",
                              )}
                            >
                              <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="h-full w-full object-cover object-top"
                                />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-neutral-900/80 dark:bg-neutral-100/80 backdrop-blur-sm">
                                <p className="text-sm font-medium text-white dark:text-neutral-900 text-center truncate">
                                  {p.name}
                                </p>
                              </div>
                            </button>

                            <div className="absolute top-1.5 right-1.5 flex gap-2">
                              <button
                                // onClick={() => handleDeletePresenter(p._id)}
                                className=" w-6 h-6 rounded flex items-center justify-center transition-colors text-neutral-600 dark:text-neutral-400 hover:text-green-600 dark:hover:text-green-400 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                                title="Download avatar"
                              >
                                <Download className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeletePresenter(p._id)}
                                className=" w-6 h-6 rounded flex items-center justify-center transition-colors text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                                title="Delete avatar"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-3xl">
                          <User size={48} className="mb-4 opacity-20" />
                          <p className="text-sm font-medium">
                            No presenters yet
                          </p>
                          <p className="text-xs">
                            Create your first one on the left
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="relative max-w-sm w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10">
                        <img
                          src={generatedImgUrl || previewUrl || ""}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                        {isGenerating && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <Loader2
                              className="animate-spin text-white"
                              size={48}
                            />
                          </div>
                        )}
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground italic">
                        Current Candidate Preview
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default withAuth(PresenterPage);
