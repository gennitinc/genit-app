// "use client";

// import { useProjectContext } from "@/context/Chat-Context";
// import { memo, useMemo } from "react";
// import { ProjectPreviewPanel } from "@/components/preview";
// import { DevEnvironment } from "@/components/devEnvironment";
// import {
//   GeneratingPreview,
//   defaultAILoadingStates,
// } from "@/components/preview";
// // Removed SandboxPreview import - using ProjectPreviewPanel instead

// export function useRightPanel() {
//   const {
//     isLiveMode,
//     isGenerating,
//     projectInfo,
//     deploymentUrl,
//     completeCodebase,
//     selectedDevFile,
//     isDevModeOpen,
//   } = useProjectContext();

//   // Debug logging
//   console.log("🔍 [RIGHT_PANEL_DEBUG]", {
//     isLiveMode,
//     isGenerating,
//     selectedDevFile: !!selectedDevFile,
//     isDevModeOpen,
//     hasProjectInfo: !!projectInfo,
//     hasSandboxUrl: !!projectInfo?.sandboxUrl,
//     hasDeploymentUrl: !!projectInfo?.deploymentUrl,
//   });

//   const RightPanelContent = useMemo(() => {
//     return () => (
//       <div className="transition-all duration-500 ease-in-out h-full">
//         {/* Show dev environment when a file is selected from version tree */}
//         {selectedDevFile && isDevModeOpen ? (
//           <DevEnvironment
//             projectInfo={projectInfo}
//             // completeCodebase={completeCodebase}
//           />
//         ) : isGenerating && isLiveMode ? (
//           // Show GeneratingPreview when generating and in preview mode
//           <main className="flex min-h-[40vh] flex-col items-center justify-center p-24">
//             <GeneratingPreview
//               loadingStates={defaultAILoadingStates}
//               isGenerating={isGenerating}
//               duration={1500} // Faster cycling for better UX
//               loop={true}
//             />
//           </main>
//         ) : !isLiveMode ? (
//           // Show dev environment when in dev mode (during generation or not)
//           <DevEnvironment
//             projectInfo={projectInfo}
//             // completeCodebase={completeCodebase}
//           />
//         ) : isLiveMode ? (
//           <ProjectPreviewPanel
//             src={projectInfo?.sandboxUrl || projectInfo?.deploymentUrl}
//             title={projectInfo?.title || "Project Preview"}
//             projectInfo={projectInfo}
//           />
//         ) : (
//           <DevEnvironment
//             projectInfo={projectInfo}
//             // completeCodebase={completeCodebase}
//           />
//         )}
//       </div>
//     );
//   }, [
//     selectedDevFile,
//     isDevModeOpen,
//     isLiveMode,
//     isGenerating,
//     projectInfo,
//     deploymentUrl,
//   ]);

//   const getPanelTitle = () => {
//     if (selectedDevFile && isDevModeOpen) {
//       return `Code Editor - ${selectedDevFile}`;
//     }
//     if (isGenerating && isLiveMode) {
//       return "Generating Preview...";
//     }
//     if (isGenerating && !isLiveMode) {
//       return "Development Environment (Generating...)";
//     }
//     if (isLiveMode) {
//       return projectInfo?.title
//         ? `${projectInfo.title} - Live Preview`
//         : "Live Preview";
//     }
//     return projectInfo?.title
//       ? `${projectInfo.title} - Dev Environment`
//       : "Development Environment";
//   };

//   const getPanelIcon = () => {
//     if (selectedDevFile && isDevModeOpen) {
//       return "code";
//     }
//     if (isGenerating && isLiveMode) {
//       return "spinner";
//     }
//     return isLiveMode ? "monitor" : "code";
//   };

//   return {
//     RightPanelContent,
//     getPanelTitle,
//     getPanelIcon,
//   };
// }
