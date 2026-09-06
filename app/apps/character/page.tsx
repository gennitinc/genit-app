"use client";

import { ModelSelector } from "@/components/inspire/model-selector";
import LandingPageBanner from "@/components/landing/landing-banner";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { PremiumInput } from "@/components/ui/premium-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import withAuth from "@/helper/hoc/withAuth";
import { cn } from "@/lib/utils";
import { Model } from "@/types/inspire";
import { LoadingFileLoader } from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { imageGenApi, presenterApi } from "@/utils/inspire-api";
import {
  Check,
  CircleFadingArrowUp,
  Download,
  HistoryIcon,
  Loader2,
  Plus,
  SaveIcon,
  Sparkles,
  Trash2,
  Upload,
  User,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import React, { useCallback, useEffect, useState } from "react";

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
    "list"
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

        setPresenters(avatars);
      } else {
        setPresenters([]);
      }
    } catch (e) {
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
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div className='scroll-container flex flex-1 flex-col overflow-auto will-change-scroll'>
        <TopNavWithAurora />
        <div
          id='main-content'
          className='mr-2 ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
        >
          <main className='flex-grow pt-12'>
            <div className='animate-fadeInUp mb-10 px-2 text-center md:px-4'>
              <h1 className='text-2xl font-semibold tracking-tight lg:text-4xl'>
                <LocalizedText text={"Character"} />
                <span className='from-primary to-accent ml-1 bg-gradient-to-r bg-clip-text text-transparent'>
                  <LocalizedText text={"Creation"} />
                </span>
              </h1>
              <p
                className='text-muted-foreground animate-fadeInUp my-2 text-sm md:text-lg'
                style={{ animationDelay: "0.2s" }}
              >
                <LocalizedText text={"Create and manage your AI Characters"} />
              </p>
            </div>

            <div className='relative w-full border-y border-black/5 dark:border-white/10'>
              <GridPattern
                width={30}
                height={30}
                className='absolute inset-0 z-0 opacity-50'
              />

              <section className='relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 py-10 md:grid-cols-[1fr_1.4fr] lg:gap-16'>
                {/* Left: Controls */}
                <div className='space-y-6 overflow-hidden rounded-lg border border-black/5 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/5 dark:bg-[#141415]/80'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <label className='text-muted-foreground text-xs font-bold uppercase'>
                        <LocalizedText text={"Presenter Name"} />
                      </label>
                      <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='e.g. Sarah J.'
                        className='focus:ring-primary/20 w-full rounded-lg border-none bg-black/5 px-4 py-2 text-sm transition-all outline-none focus:ring-2 dark:bg-white/5'
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-muted-foreground text-xs font-bold uppercase'>
                        <LocalizedText text={"Gender"} />
                      </label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className='h-9 w-full rounded-lg border-none bg-black/5 px-4 dark:bg-white/5'>
                          <SelectValue placeholder='Select Gender' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='unisex'>
                            <LocalizedText text={"Unisex"} />
                          </SelectItem>
                          <SelectItem value='male'>
                            <LocalizedText text={"Male"} />
                          </SelectItem>
                          <SelectItem value='female'>
                            <LocalizedText text={"Female"} />
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={(v: any) => setActiveTab(v)}
                    className='w-full'
                  >
                    <TabsList className='mb-4 grid w-full grid-cols-2'>
                      <TabsTrigger
                        value='upload'
                        className='flex items-center gap-2'
                      >
                        <Upload size={14} /> <LocalizedText text={"Upload"} />
                      </TabsTrigger>
                      <TabsTrigger
                        value='ai'
                        className='flex items-center gap-2'
                      >
                        <Sparkles size={14} />{" "}
                        <LocalizedText text={"AI Generate"} />
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value='upload' className='space-y-4'>
                      <label className='hover:border-primary/50 flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-black/10 bg-black/5 transition-colors dark:border-white/10 dark:bg-white/5'>
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            className='h-full w-full rounded-lg object-cover'
                            alt=''
                          />
                        ) : (
                          <div className='text-muted-foreground flex flex-col items-center gap-2'>
                            <Upload size={24} />
                            <span className='text-xs font-medium'>
                              <LocalizedText text={"Click to upload image"} />
                            </span>
                          </div>
                        )}
                        <input
                          type='file'
                          onChange={handleFileChange}
                          className='hidden'
                          accept='image/*'
                        />
                      </label>
                    </TabsContent>

                    <TabsContent value='ai' className='space-y-4'>
                      <ModelSelector
                        type='image'
                        selectedModel={selectedModel}
                        onSelectModel={setSelectedModel}
                      />
                      <div className='space-y-2'>
                        <PremiumInput
                          value={prompt}
                          onChange={setPrompt}
                          onSubmit={handleAIGenerate}
                          isGenerating={isGenerating}
                          placeholder="Describe the person's look, ethnicity, clothing..."
                          minHeight='50px'
                        />
                      </div>
                      <Button
                        onClick={handleAIGenerate}
                        disabled={isGenerating}
                        className='h-fit w-full bg-gradient-to-r from-blue-500 to-cyan-500'
                      >
                        {isGenerating ? (
                          <LoadingFileLoader size={20} />
                        ) : (
                          <Sparkles className='mr-2' size={16} />
                        )}
                        {isGenerating ? "Generating..." : "Generate Candidate"}
                      </Button>
                    </TabsContent>
                  </Tabs>

                  {(previewUrl || generatedImgUrl) && (
                    <Button
                      onClick={handleCreatePresenter}
                      disabled={isCreating}
                      className='text-md h-fit w-full'
                    >
                      {isCreating ? (
                        <LoadingFileLoader size={20} />
                      ) : (
                        <SaveIcon className='mr-2' />
                      )}
                      <LocalizedText text={"Save as Presenter"} />
                    </Button>
                  )}
                </div>

                {/* Right: List / Preview */}
                <div className='flex h-full min-h-[500px] flex-col'>
                  <div className='mb-6 flex justify-start'>
                    <div className='flex rounded-xl bg-black/5 p-1 dark:bg-white/5'>
                      <button
                        onClick={() => setRightActiveTab("list")}
                        className={cn(
                          "rounded-lg px-4 py-2 text-xs font-bold transition-all",
                          rightActiveTab === "list"
                            ? "bg-white shadow dark:bg-neutral-800"
                            : "text-muted-foreground"
                        )}
                      >
                        <LocalizedText text={"My Presenters"} />
                      </button>
                      <button
                        onClick={() => setRightActiveTab("preview")}
                        disabled={!generatedImgUrl && !previewUrl}
                        className={cn(
                          "rounded-lg px-4 py-2 text-xs font-bold transition-all",
                          rightActiveTab === "preview"
                            ? "bg-white shadow dark:bg-neutral-800"
                            : "text-muted-foreground"
                        )}
                      >
                        <LocalizedText text={"Preview"} />
                      </button>
                    </div>
                  </div>

                  {rightActiveTab === "list" ? (
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                      {loadingPresenters ? (
                        [1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className='aspect-square animate-pulse rounded-lg bg-black/5 dark:bg-white/5'
                          />
                        ))
                      ) : presenters.length > 0 ? (
                        presenters.map((p) => (
                          <div className='group relative'>
                            <button
                              // onClick={onSelect}
                              className={cn(
                                "relative w-full overflow-hidden rounded-lg transition-all"
                                // isSelected
                                //   ? "ring-2 ring-neutral-900 dark:ring-neutral-100"
                                //   : "ring-1 ring-neutral-200 dark:ring-neutral-800",
                              )}
                            >
                              <div className='aspect-[3/4] w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800'>
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className='h-full w-full object-cover object-top'
                                />
                              </div>
                              <div className='absolute right-0 bottom-0 left-0 bg-neutral-900/80 p-1.5 backdrop-blur-sm dark:bg-neutral-100/80'>
                                <p className='truncate text-center text-sm font-medium text-white dark:text-neutral-900'>
                                  {p.name}
                                </p>
                              </div>
                            </button>

                            <div className='absolute top-1.5 right-1.5 flex gap-2'>
                              <button
                                // onClick={() => handleDeletePresenter(p._id)}
                                className='flex h-6 w-6 items-center justify-center rounded bg-white/90 text-neutral-600 opacity-0 backdrop-blur-sm transition-colors group-hover:opacity-100 hover:text-green-600 dark:bg-neutral-800/90 dark:text-neutral-400 dark:hover:text-green-400'
                                title='Download avatar'
                              >
                                <Download className='h-3 w-3' />
                              </button>
                              <button
                                onClick={() => handleDeletePresenter(p._id)}
                                className='flex h-6 w-6 items-center justify-center rounded bg-white/90 text-neutral-600 opacity-0 backdrop-blur-sm transition-colors group-hover:opacity-100 hover:text-red-600 dark:bg-neutral-800/90 dark:text-neutral-400 dark:hover:text-red-400'
                                title='Delete avatar'
                              >
                                <Trash2 className='h-3 w-3' />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='text-muted-foreground col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20'>
                          <User size={48} className='mb-4 opacity-20' />
                          <p className='text-sm font-medium'>
                            <LocalizedText text={"No presenters yet"} />
                          </p>
                          <p className='text-xs'>
                            <LocalizedText
                              text={"Create your first one on the left"}
                            />
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='flex flex-1 flex-col items-center justify-center'>
                      <div className='relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-black/5 shadow-2xl dark:border-white/10'>
                        <img
                          src={generatedImgUrl || previewUrl || ""}
                          className='h-full w-full object-cover'
                          alt='Preview'
                        />
                        {isGenerating && (
                          <div className='absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
                            <LoadingFileLoader size={20} />
                          </div>
                        )}
                      </div>
                      <p className='text-muted-foreground mt-4 text-xs italic'>
                        <LocalizedText text={"Current Candidate Preview"} />
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
