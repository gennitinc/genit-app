// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useUserContext } from "@/context/AuthenticatedContext";
// import { apiResponse } from "@/utils/apiResponse";
// import { PremiumInput } from "@/components/ui/premium-input";
// import { voiceApi, audioGenApi, modelApi } from "@/utils/inspire-api";
// import { Voice, Model } from "@/types/inspire";

// // ─── Main Page ────────────────────────────────────────────────────────────────
// import {
//   Loader2,
//   Image as ImageIcon,
//   Wand2,
//   History,
//   Users,
//   ViewIcon,
//   BookOpen,
//   LayoutDashboard,
//   Trash,
//   Plus,
//   Minus,
// } from "lucide-react";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import withAuth from "@/helper/hoc/withAuth";
// import { AppSidebar } from "@/components/layout/app-sidebar";
// import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
// import { toast } from "sonner";
// import {
//   ASPECT_RATIOS,
//   AspectRatioCard,
// } from "@/components/video/resolution-selector";

// export type ImageStyle =
//   | "realistic"
//   | "anime"
//   | "digitalArt"
//   | "oilPainting"
//   | "watercolor"
//   | "threeDRrender";

// function TextToSpeechPage() {
//   const router = useRouter();
//   const { user } = useUserContext();
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const searchParams = useSearchParams();

//   const projectId = searchParams.get("projectId");
//   const urlContentTab = searchParams.get("tab") as
//     | "preview"
//     | "history"
//     | "community"
//     | "templates"
//     | "tutorial"
//     | null;

//   const [selectedResolution, setSelectedResolution] =
//     useState<Resolution>("1080p");
//   const [selectedAspectRatio, setSelectedAspectRatio] =
//     useState<AspectRatio>("1:1");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [loadingProject, setLoadingProject] = useState(false);

//   const [generatedImages, setGeneratedImages] = useState<
//     {
//       id: string;
//       url: string;
//       thumbnail: string;
//       aspectRatio: AspectRatio;
//       resolution: Resolution;
//       prompt: string;
//       style: ImageStyle;
//       createdAt: string;
//       generatedImageId?: string;
//       referenceImageUrls?: string[];
//     }[]
//   >([]);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [selectedImageStyle, setSelectedImageStyle] =
//     useState<ImageStyle>("realistic");
//   const [imageCount, setImageCount] = useState(1);
//   const [selectedImageModel, setSelectedImageModel] = useState<Model | null>(
//     null,
//   );

//   const [prompt, setPrompt] = useState("");
//   const [promptImages, setPromptImages] = useState<File[]>([]);
//   const [promptImagePreviews, setPromptImagePreviews] = useState<string[]>([]);

//   const [activeContentTab, setActiveContentTab] = useState<
//     "community" | "preview" | "history" | "templates" | "tutorial"
//   >(urlContentTab || "community");
//   const [isResultsDrawerOpen, setIsResultsDrawerOpen] = useState(false);

//   const updateContentTab = useCallback(
//     (tab: "preview" | "history" | "community" | "templates" | "tutorial") => {
//       setActiveContentTab(tab);
//       const urlParams = new URLSearchParams(searchParams.toString());
//       urlParams.set("tab", tab);
//       if (projectId) urlParams.set("projectId", projectId);
//       router.replace(`/apps/image-generation?${urlParams.toString()}`, {
//         scroll: false,
//       });
//     },
//     [searchParams, router, projectId],
//   );

//   // Fetch project data if projectId is provided
//   useEffect(() => {
//     const fetchProject = async () => {
//       if (!projectId || !user?._id) return;

//       try {
//         setLoadingProject(true);
//         const endpoint = `/inspire/generate/image/${projectId}`;
//         const response = await apiResponse.get(endpoint, {
//           withCredentials: true,
//         });

//         if (response.status === 200 && response.data.success) {
//           const project = response.data.project;
//           const image = {
//             id: project._id || project.id,
//             generatedImageId: project._id || project.id,
//             url: project.url,
//             thumbnail: project.thumbnail || project.url,
//             aspectRatio: (project.aspectRatio || "16:9") as AspectRatio,
//             resolution: (project.resolution || "1080p") as Resolution,
//             prompt: project.prompt || "",
//             style: (project.style || "realistic") as ImageStyle,
//             createdAt: project.createdAt || new Date().toISOString(),
//             referenceImageUrls: project.referenceImageUrls || [],
//           };

//           setGeneratedImages([image]);
//           setSelectedImageIndex(0);
//           setPrompt(project.prompt || "");
//           if (project.aspectRatio) setSelectedAspectRatio(project.aspectRatio);
//           if (project.resolution) setSelectedResolution(project.resolution);
//           if (project.style) setSelectedImageStyle(project.style);
//           updateContentTab("preview");
//         }
//       } catch (error: any) {
//         console.error("Error fetching project:", error);
//         toast("Could not load project data");
//       } finally {
//         setLoadingProject(false);
//       }
//     };

//     fetchProject();
//   }, [projectId, user?._id]);

//   const handleLoadFromHistory = useCallback(
//     (image: {
//       _id: string;
//       imageData: {
//         url: string;
//         thumbnail: string;
//         prompt: string;
//         aspectRatio: string;
//         resolution: string;
//         style?: string;
//         referenceImageUrls?: string[];
//       };
//       createdAt: string;
//     }) => {
//       const { imageData } = image;
//       const loadedImage = {
//         id: image._id,
//         generatedImageId: image._id,
//         url: imageData.url,
//         thumbnail: imageData.thumbnail || imageData.url,
//         aspectRatio: (imageData.aspectRatio || "1:1") as AspectRatio,
//         resolution: (imageData.resolution || "1080p") as Resolution,
//         prompt: imageData.prompt || "",
//         style: (imageData.style || "realistic") as ImageStyle,
//         createdAt: image.createdAt || new Date().toISOString(),
//         referenceImageUrls: imageData.referenceImageUrls || [],
//       };

//       setGeneratedImages([loadedImage]);
//       setSelectedImageIndex(0);
//       setPrompt(imageData.prompt || "");
//       if (imageData.aspectRatio)
//         setSelectedAspectRatio(imageData.aspectRatio as AspectRatio);
//       if (imageData.resolution)
//         setSelectedResolution(imageData.resolution as Resolution);
//       if (imageData.style) setSelectedImageStyle(imageData.style as ImageStyle);
//       updateContentTab("preview");
//     },
//     [updateContentTab],
//   );

//   const handleGenerate = async () => {
//     if (!prompt.trim()) {
//       toast("Please enter a prompt");
//       return;
//     }

//     if (!selectedImageModel) {
//       toast("Please select an image model");
//       return;
//     }

//     setIsGenerating(true);
//     updateContentTab("preview");

//     try {
//       const files: File[] = [...promptImages];

//       const response = await imageGenApi.generate(
//         {
//           prompt: prompt.trim(),
//           modelId: selectedImageModel._id,
//           aspectRatio: selectedAspectRatio,
//           resolution: selectedResolution,
//           style: selectedImageStyle,
//           imageCount: imageCount,
//         },
//         files.length > 0 ? files : undefined,
//       );

//       if (response.success && response.data.images) {
//         const newImages = response.data.images.map((img, index) => ({
//           id: img.id || `img-${Date.now()}-${index}`,
//           generatedImageId: img.id || undefined,
//           url: img.url,
//           thumbnail: img.url,
//           aspectRatio: selectedAspectRatio,
//           resolution: selectedResolution,
//           prompt: prompt.trim(),
//           style: selectedImageStyle,
//           createdAt: new Date().toISOString(),
//           referenceImageUrls:
//             promptImages.length > 0
//               ? promptImagePreviews
//               : (img as any).referenceImageUrls || [],
//         }));

//         setGeneratedImages((prev) => [...newImages, ...prev]);
//         setSelectedImageIndex(0);
//         toast(`Successfully generated ${newImages.length} image(s)`);
//       } else {
//         throw new Error(response.message || "Failed to generate image");
//       }
//     } catch (error: any) {
//       console.error("Generation error:", error);
//       const creditsRemaining = user?.creditsRemaining ?? 0;
//       if (creditsRemaining <= 10) {
//         const isBasic = String(user?.userPlan) === "Basic";
//         toast.error(`Low Credits`, {
//           description: `You have ${creditsRemaining} credits remaining.`,
//           action: {
//             label: isBasic ? "Upgrade" : "Buy Credits",
//             onClick: () =>
//               router.push(isBasic ? "/pricing" : "/user/settings?tab=billing"),
//           },
//         });
//       } else {
//         toast.error(error.message || "Generation failed");
//       }
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <div className="flex relative w-full h-[100dvh] overflow-hidden bg-white dark:bg-black">
//       <Toaster />
//       <AppSidebar />
//       <div className="flex-1 flex flex-col overflow-auto will-change-scroll scroll-container">
//         <TopNavWithAurora />
//         <div id="main-content" className="flex-1 mt-10 lg:mt-0">
//           <>
//             <meta charSet="UTF-8" />
//             <meta
//               name="viewport"
//               content="width=device-width, initial-scale=1.0"
//             />
//             <title>Typecast – Turn Any Scripts Into Expressive AI Voices</title>
//             <link
//               href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap"
//               rel="stylesheet"
//             />
//             <style
//               dangerouslySetInnerHTML={{
//                 __html:
//                   '\n  [data-state="active"][data-tab-trigger] {\n    border-bottom-color: #111827;\n    color: #111827;\n  }\n  .accordion-content[data-state="open"] {\n    display: block;\n  }\n  .accordion-content[data-state="closed"] {\n    display: none;\n  }\n  .accordion-trigger[data-state="open"] svg {\n    transform: rotate(180deg);\n  }\n  .toggle-knob {\n    transition: left 0.3s ease;\n  }\n  [aria-pressed="true"] .toggle-knob {\n    left: calc(100% - 30px);\n  }\n',
//               }}
//             />
//             {/* ===================== TOOLBAR ===================== */}
//             <div className="border-b border-gray-150 shrink-0">
//               <div className="overflow-x-auto">
//                 <div className="w-full max-w-[900px] mx-auto">
//                   <div className="flex divide-x divide-gray-150">
//                     {/* Smart Emotion */}
//                     <div className="px-2 flex flex-col gap-1 py-2">
//                       <div className="text-xs font-medium text-gray-500">
//                         Smart Emotion
//                       </div>
//                       <button
//                         type="button"
//                         aria-pressed="false"
//                         onclick="this.setAttribute('aria-pressed', this.getAttribute('aria-pressed')==='true'?'false':'true')"
//                         className="relative flex h-8 w-[66px] items-center rounded-lg p-0.5 bg-gray-200 aria-pressed:bg-gradient-to-r aria-pressed:from-pink-500 aria-pressed:via-orange-300 aria-pressed:to-orange-400 transition-all duration-300"
//                       >
//                         <div className="toggle-knob absolute flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-sm left-[2px]">
//                           <svg
//                             className="w-5 h-5 text-gray-500"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//                             />
//                           </svg>
//                         </div>
//                       </button>
//                     </div>
//                     {/* Emotion */}
//                     <div className="px-2 flex flex-col gap-1 py-2">
//                       <div className="text-xs font-medium text-gray-500">
//                         Emotion
//                       </div>
//                       <button
//                         type="button"
//                         className="inline-flex items-center justify-between w-[110px] px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 transition-colors"
//                       >
//                         <span className="flex-1 text-left truncate">None</span>
//                         <svg
//                           className="w-4 h-4 text-gray-500 ml-1 shrink-0"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             stroke="currentColor"
//                             strokeWidth={2}
//                             strokeLinecap="round"
//                             d="M6 9l6 6 6-6"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                     {/* Speed */}
//                     <div className="px-2 flex flex-col gap-1 py-2">
//                       <div className="text-xs font-medium text-gray-500">
//                         Speed
//                       </div>
//                       <button
//                         type="button"
//                         className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 transition-colors min-w-[60px]"
//                       >
//                         1.0x
//                       </button>
//                     </div>
//                     {/* Dynamics */}
//                     <div className="px-2 flex flex-col gap-1 py-2">
//                       <div className="text-xs font-medium text-gray-500">
//                         Dynamics
//                       </div>
//                       <div className="flex items-center gap-1.5">
//                         <button
//                           type="button"
//                           aria-label="Regenerate Voice"
//                           className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
//                         >
//                           <svg
//                             className="w-5 h-5 text-gray-600"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               strokeLinecap="round"
//                               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                             />
//                           </svg>
//                         </button>
//                         <button
//                           type="button"
//                           aria-label="Pitch"
//                           className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
//                         >
//                           <svg
//                             className="w-5 h-5 text-gray-600"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               strokeLinecap="round"
//                               d="M3 18l4-8 4 4 4-6 4 4"
//                             />
//                           </svg>
//                         </button>
//                         <button
//                           type="button"
//                           aria-label="Intonation"
//                           className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
//                         >
//                           <svg
//                             className="w-5 h-5 text-gray-600"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               strokeLinecap="round"
//                               d="M3 10c5-6 9 6 14 0"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                     {/* Pronunciation */}
//                     <div className="px-2 flex flex-col gap-1 py-2">
//                       <div className="text-xs font-medium text-gray-500">
//                         Pronunciation
//                       </div>
//                       <button
//                         type="button"
//                         aria-label="Custom Pronunciation"
//                         className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
//                       >
//                         <svg
//                           className="w-5 h-5 text-gray-600"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                     {/* Add Pause */}
//                     <div className="px-2 flex flex-col gap-1 py-2">
//                       <div className="text-xs font-medium text-gray-500">
//                         Add Pause
//                       </div>
//                       <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1 w-[95px]">
//                         <input
//                           type="text"
//                           inputMode="decimal"
//                           defaultValue="0.3s"
//                           className="flex-1 min-w-0 bg-transparent text-sm outline-none text-gray-800 px-1"
//                         />
//                         <button
//                           type="button"
//                           className="text-xs font-medium text-gray-700 px-1.5 py-0.5 hover:bg-gray-200 rounded transition-colors"
//                         >
//                           Add
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* ===================== EDITOR ===================== */}
//             <div className="flex grow justify-center overflow-y-auto overflow-x-hidden">
//               <div className="flex h-full w-full max-w-[900px] flex-col">
//                 <div className="relative flex w-full max-w-[684px] flex-1">
//                   <div
//                     role="textbox"
//                     aria-multiline="true"
//                     contentEditable="true"
//                     className="w-full rounded bg-white py-2 focus-visible:outline-none focus-visible:shadow-none"
//                   >
//                     <div className="group relative px-2 flex flex-col pt-2">
//                       <div contentEditable="false" className="select-none">
//                         <button
//                           type="button"
//                           aria-expanded="true"
//                           aria-haspopup="dialog"
//                           className="relative flex items-center gap-2 h-8 px-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
//                         >
//                           <div className="flex items-center gap-1">
//                             <div className="relative h-8 w-8 rounded-md overflow-hidden bg-gray-200 shrink-0">
//                               <img
//                                 alt="Paige"
//                                 className="w-full h-full object-cover"
//                                 src="https://static2.typecast.ai/c/241219_paige/paige_ui256.webp"
//                               />
//                             </div>
//                             <span className="text-sm font-medium text-gray-900 max-w-[100px] truncate md:max-w-[200px]">
//                               Paige
//                             </span>
//                           </div>
//                           <svg
//                             className="w-4 h-4 text-gray-600 md:rotate-270"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               stroke="currentColor"
//                               strokeWidth={2}
//                               strokeLinecap="round"
//                               d="M6 9l6 6 6-6"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                       <p className="border-l border-gray-200 ml-4 py-2 pl-7 text-gray-400 italic">
//                         Type your script here.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* ===================== EXAMPLES BAR ===================== */}
//             <div className="max-h-23 relative mx-auto w-full max-w-[900px] overflow-y-auto px-3 md:static md:mb-10 md:max-h-none md:overflow-y-visible">
//               <div className="sticky top-0 mb-3 bg-white">
//                 <span className="text-sm font-medium text-zinc-500">
//                   Get started with examples
//                 </span>
//               </div>
//               <div className="mb-3 flex flex-wrap gap-2">
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium text-neutral-800 cursor-pointer"
//                 >
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
//                     <path
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       strokeLinecap="round"
//                       d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                     />
//                   </svg>
//                   Tell a bedtime story
//                 </button>
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium text-neutral-800 cursor-pointer"
//                 >
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
//                     <circle
//                       cx={12}
//                       cy={12}
//                       r={9}
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                     />
//                     <path
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       strokeLinecap="round"
//                       d="M8 12h8M12 8v8"
//                     />
//                   </svg>
//                   Introduce a podcast panel
//                 </button>
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium text-neutral-800 cursor-pointer"
//                 >
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
//                     <path
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       strokeLinecap="round"
//                       d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"
//                     />
//                   </svg>
//                   Record a business voicemail
//                 </button>
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium text-neutral-800 cursor-pointer"
//                 >
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
//                     <path
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       strokeLinecap="round"
//                       d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                   Create a training session
//                 </button>
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium text-neutral-800 cursor-pointer"
//                 >
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
//                     <path
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       strokeLinecap="round"
//                       d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
//                     />
//                   </svg>
//                   Teach the alphabet
//                 </button>
//                 <button
//                   type="button"
//                   className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium text-neutral-800 cursor-pointer"
//                 >
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
//                     <circle
//                       cx={12}
//                       cy={12}
//                       r={3}
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                     />
//                     <path
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                       d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
//                     />
//                   </svg>
//                   Dub a Sci-Fi movie scene
//                 </button>
//               </div>
//             </div>
//             {/* ===================== PLAYER ===================== */}
//             <div className="flex shrink justify-center border-t">
//               <div className="w-[900px]">
//                 <div className="flex items-center justify-between px-4 py-3 gap-4">
//                   <span className="text-sm text-gray-500">0:00 / 0:00</span>
//                   <div className="flex items-center gap-3">
//                     <button
//                       type="button"
//                       aria-label="backward"
//                       className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100 transition-colors"
//                     >
//                       <svg
//                         className="w-7 h-7 text-gray-700"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       aria-label="Play"
//                       disabled=""
//                       className="h-9 w-9 rounded-full overflow-hidden active:opacity-90 disabled:opacity-50"
//                     >
//                       <div className="flex h-full w-full items-center justify-center bg-orange-500">
//                         <svg
//                           className="w-6 h-6 text-white"
//                           viewBox="0 0 24 24"
//                           fill="currentColor"
//                         >
//                           <path d="M8 5v14l11-7z" />
//                         </svg>
//                       </div>
//                     </button>
//                     <button
//                       type="button"
//                       aria-label="forward"
//                       className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100 transition-colors"
//                     >
//                       <svg
//                         className="w-7 h-7 text-gray-700"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           d="M13 5l7 7-7 7M5 5l7 7-7 7"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                   <div className="flex-1 flex items-center">
//                     <div className="w-full h-2 bg-gray-100 rounded-sm" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* ===================== VOICE SELECTOR PANEL ===================== */}
//             <div className="fixed left-[120px] top-[142px] z-50 min-w-max">
//               <div className="min-w-[550px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
//                 {/* Tabs */}
//                 <div className="flex border-b-2 border-gray-200 h-[50px] w-full">
//                   <button
//                     type="button"
//                     data-tab-trigger=""
//                     data-state="active"
//                     className="flex-1 h-full flex items-center justify-center text-sm font-medium cursor-pointer border-b-2 border-gray-900 text-gray-900 transition-colors"
//                   >
//                     Explore
//                   </button>
//                   <button
//                     type="button"
//                     data-tab-trigger=""
//                     className="flex-1 h-full flex items-center justify-center text-sm font-medium cursor-pointer border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors gap-1.5"
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
//                     </svg>
//                     Saved
//                   </button>
//                 </div>
//                 {/* Explore Panel */}
//                 <div className="flex flex-col px-4 pb-0 pt-3 max-h-[400px] min-h-[400px]">
//                   {/* Filter tags */}
//                   <div className="flex items-center gap-2">
//                     <ul className="flex flex-1 gap-1 overflow-x-auto text-sm font-medium">
//                       <li>
//                         <button
//                           type="button"
//                           className="border border-gray-200 h-7 cursor-pointer text-nowrap rounded-lg bg-gray-50 px-2 hover:bg-gray-100 transition-colors"
//                         >
//                           #Kid
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           type="button"
//                           className="border border-gray-200 h-7 cursor-pointer text-nowrap rounded-lg bg-gray-50 px-2 hover:bg-gray-100 transition-colors"
//                         >
//                           #Elder
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           type="button"
//                           className="border border-gray-200 h-7 cursor-pointer text-nowrap rounded-lg bg-gray-50 px-2 hover:bg-gray-100 transition-colors"
//                         >
//                           #Audiobook
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           type="button"
//                           className="border border-gray-200 h-7 cursor-pointer text-nowrap rounded-lg bg-gray-50 px-2 hover:bg-gray-100 transition-colors"
//                         >
//                           #News
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           type="button"
//                           className="border border-gray-200 h-7 cursor-pointer text-nowrap rounded-lg bg-gray-50 px-2 hover:bg-gray-100 transition-colors"
//                         >
//                           #Ads
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           type="button"
//                           className="border border-gray-200 h-7 cursor-pointer text-nowrap rounded-lg bg-gray-50 px-2 hover:bg-gray-100 transition-colors"
//                         >
//                           #Anime
//                         </button>
//                       </li>
//                     </ul>
//                     <button
//                       type="button"
//                       aria-label="show filter"
//                       className="inline-flex items-center justify-center w-6 h-6"
//                     >
//                       <svg
//                         className="w-5 h-5 text-gray-600 cursor-pointer"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           d="M3 4h18M7 12h10M11 20h2"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       type="button"
//                       aria-label="show search"
//                       className="inline-flex items-center justify-center w-6 h-6"
//                     >
//                       <svg
//                         className="w-5 h-5 text-gray-600 cursor-pointer"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                   {/* Voice list */}
//                   <div className="mt-3 min-h-[280px] overflow-auto pb-4">
//                     {/* Voice Clone Banner */}
//                     <section
//                       role="button"
//                       tabIndex={0}
//                       className="relative flex cursor-pointer items-center gap-3.5 rounded-lg p-2 transition-colors hover:bg-gray-50 border border-dashed border-gray-200 mb-3 pr-4"
//                     >
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-900">
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"
//                           />
//                         </svg>
//                       </div>
//                       <div className="flex flex-1 flex-col overflow-hidden">
//                         <h2 className="text-sm font-medium text-gray-900 w-full">
//                           Clone Your Voice
//                         </h2>
//                         <p className="text-xs text-gray-600 w-full">
//                           Create your voice clone in a minute!
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-1.5 text-gray-900">
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             d="M9 18l6-6-6-6"
//                           />
//                         </svg>
//                       </div>
//                     </section>
//                     <div className="mb-1 ml-1 text-xs font-medium text-gray-600">
//                       Current voice
//                     </div>
//                     {/* Current voice sticky header */}
//                     <div className="sticky top-0 z-10 bg-white">
//                       <div className="flex items-center gap-2 pb-2 pl-2 pr-3 pt-2">
//                         <div className="relative shrink-0">
//                           <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-200">
//                             <img
//                               alt="Paige"
//                               className="w-full h-full object-cover"
//                               src="https://static2.typecast.ai/c/241219_paige/paige_ui256.webp"
//                             />
//                           </div>
//                           <svg
//                             className="w-4 h-4 absolute -bottom-1 -right-1"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                           >
//                             <circle
//                               cx={12}
//                               cy={12}
//                               r={10}
//                               fill="#111"
//                               stroke="white"
//                               strokeWidth="1.5"
//                             />
//                             <path
//                               stroke="white"
//                               strokeWidth={2}
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M7 12l3.5 3.5L17 9"
//                             />
//                           </svg>
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
//                             <span className="text-sm font-medium text-gray-900 truncate">
//                               Paige
//                             </span>
//                             <div className="hidden h-3 w-px bg-gray-300 md:block" />
//                             <span className="text-xs text-gray-700 whitespace-nowrap">
//                               Used in 1 places
//                             </span>
//                           </div>
//                         </div>
//                         <button
//                           disabled=""
//                           type="button"
//                           className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
//                         >
//                           Select voice to replace all
//                         </button>
//                       </div>
//                       <hr className="my-2 border-gray-100" />
//                     </div>
//                     <div className="mb-1 ml-1 text-xs font-medium text-gray-600">
//                       Recently used (2)
//                     </div>
//                     {/* Voice item: Paige (active) */}
//                     <ul>
//                       <li className="relative flex h-[50px] min-h-[50px] w-full rounded-lg pl-1 pr-3 hover:bg-black/5 transition-colors">
//                         <div className="flex-1 relative flex cursor-pointer items-center pl-1">
//                           <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-200">
//                             <img
//                               alt="Paige"
//                               className="w-full h-full object-cover"
//                               src="https://static2.typecast.ai/c/241219_paige/paige_ui256.webp"
//                             />
//                           </div>
//                           <svg
//                             className="w-4 h-4 absolute bottom-0.5 left-7"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                           >
//                             <circle
//                               cx={12}
//                               cy={12}
//                               r={10}
//                               fill="#111"
//                               stroke="white"
//                               strokeWidth="1.5"
//                             />
//                             <path
//                               stroke="white"
//                               strokeWidth={2}
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M7 12l3.5 3.5L17 9"
//                             />
//                           </svg>
//                           <div className="ml-3 flex shrink flex-col w-3/5 md:w-fit">
//                             <span className="text-sm font-medium text-gray-900 line-clamp-1 break-all">
//                               Paige
//                             </span>
//                             <div className="flex items-center text-xs text-gray-600 gap-1">
//                               <span>#Conversational</span>
//                               <span className="text-gray-300">|</span>
//                               <span>English +5</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex cursor-pointer items-center gap-1">
//                           <button className="flex p-2">
//                             <svg
//                               className="w-4 h-4 text-gray-500"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 stroke="currentColor"
//                                 strokeWidth="1.5"
//                                 d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
//                               />
//                             </svg>
//                           </button>
//                           <button
//                             type="button"
//                             aria-label="play sample voice"
//                             className="flex items-center justify-center m-2"
//                           >
//                             <svg
//                               className="w-4 h-4 text-gray-600"
//                               viewBox="0 0 24 24"
//                               fill="currentColor"
//                             >
//                               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
//                             </svg>
//                           </button>
//                           <button className="rounded-md px-1 py-0 hover:bg-gray-100 transition-colors">
//                             <svg
//                               className="w-4 h-4 text-gray-500"
//                               fill="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle cx={12} cy={5} r="1.5" />
//                               <circle cx={12} cy={12} r="1.5" />
//                               <circle cx={12} cy={19} r="1.5" />
//                             </svg>
//                           </button>
//                         </div>
//                       </li>
//                       {/* Voice item: Callan */}
//                       <li className="relative flex h-[50px] min-h-[50px] w-full rounded-lg pl-1 pr-3 hover:bg-black/5 transition-colors">
//                         <div className="flex-1 relative flex cursor-pointer items-center pl-1">
//                           <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-200">
//                             <img
//                               alt="Callan"
//                               className="w-full h-full object-cover"
//                               src="https://static2.typecast.ai/c/240202_callan/callan_ui256.webp"
//                             />
//                           </div>
//                           <div className="ml-3 flex shrink flex-col w-3/5 md:w-fit">
//                             <span className="text-sm font-medium text-gray-900 line-clamp-1 break-all">
//                               Callan
//                             </span>
//                             <div className="flex items-center text-xs text-gray-600 gap-1">
//                               <span>#Documentary</span>
//                               <span className="text-gray-300">|</span>
//                               <span>English +5</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex cursor-pointer items-center gap-1">
//                           <button className="flex p-2">
//                             <svg
//                               className="w-4 h-4 text-gray-500"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 stroke="currentColor"
//                                 strokeWidth="1.5"
//                                 d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
//                               />
//                             </svg>
//                           </button>
//                           <button
//                             type="button"
//                             aria-label="play sample voice"
//                             className="flex items-center justify-center m-2"
//                           >
//                             <svg
//                               className="w-4 h-4 text-gray-600"
//                               viewBox="0 0 24 24"
//                               fill="currentColor"
//                             >
//                               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
//                             </svg>
//                           </button>
//                           <button className="rounded-md px-1 py-0 hover:bg-gray-100 transition-colors">
//                             <svg
//                               className="w-4 h-4 text-gray-500"
//                               fill="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle cx={12} cy={5} r="1.5" />
//                               <circle cx={12} cy={12} r="1.5" />
//                               <circle cx={12} cy={19} r="1.5" />
//                             </svg>
//                           </button>
//                         </div>
//                       </li>
//                     </ul>
//                     <hr className="my-2 border-gray-100" />
//                     <div className="mb-1 ml-1 text-xs font-medium text-gray-600">
//                       Find your voice character (707)
//                     </div>
//                     {/* Sample voices from library */}
//                     <ul>
//                       <li className="relative flex h-[50px] min-h-[50px] w-full rounded-lg pl-1 pr-3 hover:bg-black/5 transition-colors">
//                         <div className="flex-1 relative flex cursor-pointer items-center pl-1">
//                           <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-200">
//                             <img
//                               alt="Vanessa"
//                               className="w-full h-full object-cover"
//                               src="https://static2.typecast.ai/data/actor/886b7a41-3191-4f29-9759-4b7105063420.webp"
//                             />
//                           </div>
//                           <div className="ml-3 flex shrink flex-col">
//                             <span className="text-sm font-medium text-gray-900 line-clamp-1">
//                               Vanessa
//                             </span>
//                             <div className="flex items-center text-xs text-gray-600 gap-1">
//                               <span>#Audiobook/Storytelling</span>
//                               <span className="text-gray-300">|</span>
//                               <span>Trial</span>
//                               <span className="text-gray-300">|</span>
//                               <span>English +5</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex cursor-pointer items-center gap-1">
//                           <button className="flex p-2">
//                             <svg
//                               className="w-4 h-4 text-gray-500"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 stroke="currentColor"
//                                 strokeWidth="1.5"
//                                 d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
//                               />
//                             </svg>
//                           </button>
//                           <button
//                             type="button"
//                             className="flex items-center justify-center m-2"
//                           >
//                             <svg
//                               className="w-4 h-4 text-gray-600"
//                               viewBox="0 0 24 24"
//                               fill="currentColor"
//                             >
//                               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
//                             </svg>
//                           </button>
//                           <button className="rounded-md px-1 hover:bg-gray-100 transition-colors">
//                             <svg
//                               className="w-4 h-4 text-gray-500"
//                               fill="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle cx={12} cy={5} r="1.5" />
//                               <circle cx={12} cy={12} r="1.5" />
//                               <circle cx={12} cy={19} r="1.5" />
//                             </svg>
//                           </button>
//                         </div>
//                       </li>
//                       <li className="relative flex h-[50px] min-h-[50px] w-full rounded-lg pl-1 pr-3 hover:bg-black/5 transition-colors">
//                         <div className="flex-1 relative flex cursor-pointer items-center pl-1">
//                           <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-200">
//                             <img
//                               alt="Jackson"
//                               className="w-full h-full object-cover"
//                               src="https://static2.typecast.ai/c/250123_jackson/jackson_ui256.webp"
//                             />
//                           </div>
//                           <div className="ml-3 flex shrink flex-col">
//                             <span className="text-sm font-medium text-gray-900 line-clamp-1">
//                               Jackson
//                             </span>
//                             <div className="flex items-center text-xs text-gray-600 gap-1">
//                               <span>#Conversational</span>
//                               <span className="text-gray-300">|</span>
//                               <span>Trial</span>
//                               <span className="text-gray-300">|</span>
//                               <span>English +5</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex cursor-pointer items-center gap-1">
//                           <button className="flex p-2">
//                             <svg
//                               className="w-4 h-4 text-gray-500"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 stroke="currentColor"
//                                 strokeWidth="1.5"
//                                 d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
//                               />
//                             </svg>
//                           </button>
//                           <button
//                             type="button"
//                             className="flex items-center justify-center m-2"
//                           >
//                             <svg
//                               className="w-4 h-4 text-gray-600"
//                               viewBox="0 0 24 24"
//                               fill="currentColor"
//                             >
//                               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
//                             </svg>
//                           </button>
//                           <button className="rounded-md px-1 hover:bg-gray-100 transition-colors">
//                             <svg
//                               className="w-4 h-4 text-gray-500"
//                               fill="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle cx={12} cy={5} r="1.5" />
//                               <circle cx={12} cy={12} r="1.5" />
//                               <circle cx={12} cy={19} r="1.5" />
//                             </svg>
//                           </button>
//                         </div>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="button"
//               aria-label="Scroll to top"
//               onclick="window.scrollTo({top:0,behavior:'smooth'})"
//               className="fixed bottom-3 right-3 lg:bottom-[120px] lg:right-[150px] z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50 transition-colors"
//             >
//               <svg
//                 className="w-4 h-4 text-black rotate-180"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   d="M6 9l6 6 6-6"
//                 />
//               </svg>
//             </button>
//           </>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default withAuth(ImageGenerationPage);
