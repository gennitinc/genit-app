"use client";

import { LocalizedText } from "@/components/localized-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileScriptIcon, CodeIcon, File02Icon, Folder01Icon, ZapIcon, ComputerTerminal01Icon, Layers01Icon, CheckmarkCircle02Icon, SourceCodeIcon, ArrowRight02Icon, ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";

interface StatusUpdate {
  type: string;
  message: string;
  progress: number;
}

interface GenerationUIProps {
  statusUpdate: StatusUpdate | null;
  isGenerating: boolean;
  generatedFiles: any[];
  onNavigateToCode?: () => void;
}

// File type icons mapping
const fileIcons: Record<string, React.ReactNode> = {
  js: <HugeiconsIcon icon={FileScriptIcon} className='h-4 w-4 text-yellow-500' />,
  jsx: <HugeiconsIcon icon={FileScriptIcon} className='h-4 w-4 text-blue-500' />,
  ts: <HugeiconsIcon icon={FileScriptIcon} className='h-4 w-4 text-blue-600' />,
  tsx: <HugeiconsIcon icon={FileScriptIcon} className='h-4 w-4 text-blue-500' />,
  css: <HugeiconsIcon icon={FileScriptIcon} className='h-4 w-4 text-purple-500' />,
  html: <HugeiconsIcon icon={FileScriptIcon} className='h-4 w-4 text-orange-500' />,
  json: <HugeiconsIcon icon={CodeIcon} className='h-4 w-4 text-green-500' />,
  md: <HugeiconsIcon icon={File02Icon} className='h-4 w-4 text-gray-500' />,
};

export function GenerationUI({
  statusUpdate,
  isGenerating,
  generatedFiles,
  onNavigateToCode,
}: GenerationUIProps) {
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const maxFilesToShow = 5;

  // Animate progress even when no status update
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setAnimationProgress((prev) => {
          // If we have a real progress value, use that instead
          if (statusUpdate?.progress) return statusUpdate.progress;
          // Otherwise animate from 0 to 95 (never complete)
          return prev < 95 ? prev + 0.5 : prev;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setAnimationProgress(100);
    }
  }, [isGenerating, statusUpdate]);

  const getStatusMessage = () => {
    if (!statusUpdate) return "Initializing...";
    return statusUpdate.message;
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    return (
      fileIcons[extension] || <HugeiconsIcon icon={File02Icon} className='h-4 w-4 text-gray-500' />
    );
  };

  const renderFileStructure = (files: any[], level = 0) => {
    const filesToShow = showAllFiles ? files : files.slice(0, maxFilesToShow);

    return filesToShow.map((file, index) => (
      <motion.div
        key={`${file.name}-${index}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`hover:bg-muted-foreground/10 flex items-center gap-2 rounded-md px-2 py-2 transition-colors ${
          level > 0 ? "ml-4" : ""
        }`}
      >
        {file.type === "folder" ? (
          <HugeiconsIcon icon={Folder01Icon} className='h-4 w-4 text-blue-500' />
        ) : (
          getFileIcon(file.name)
        )}
        <span className='text-muted-foreground flex-1 truncate text-sm font-medium'>
          {file.name}
        </span>
        {file.type === "file" && (
          <Badge
            variant='outline'
            className='bg-muted-foreground/10 font-mono text-xs'
          >
            {file.name.split(".").pop()?.toUpperCase()}
          </Badge>
        )}
      </motion.div>
    ));
  };

  return (
    <div className='bg-muted-foreground/10 flex h-full w-full flex-col'>
      <ScrollArea className='flex-1'>
        <div className='mx-auto w-full max-w-3xl p-8'>
          <AnimatePresence mode='wait'>
            {isGenerating ? (
              <motion.div
                key='generating'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='space-y-10'
              >
                {/* Header with custom spinner */}
                <div className='relative flex flex-col items-center'>
                  {/* Custom spinner */}
                  <div className='relative mb-6 h-14 w-14'>
                    {/* Outer spinning ring */}
                    <motion.div
                      className='absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500'
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />

                    {/* Middle spinning ring */}
                    <motion.div
                      className='absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 border-l-purple-500'
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />

                    {/* Inner spinning ring */}
                    <motion.div
                      className='absolute inset-4 rounded-full border-4 border-transparent border-r-teal-500 border-b-teal-500'
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />

                    {/* Center icon */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        {/* <Cpu className="h4 w-4 text-blue-600 dark:text-blue-400" /> */}
                      </motion.div>
                    </div>
                  </div>

                  <h2 className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400'>
                    <LocalizedText text={"Creating Your Application"} />
                  </h2>
                  <p className='text-muted-foreground/50 mt-3 max-w-lg text-center'>
                    <LocalizedText
                      text={
                        "Our AI is crafting your custom application with modern technologies and best practices"
                      }
                    />
                  </p>
                </div>

                {/* Status Card */}
                <Card className='bg-background overflow-hidden border-0 shadow-lg'>
                  <CardContent className='p-0'>
                    <div className='p-6'>
                      <div className='mb-4 flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          >
                            <HugeiconsIcon icon={ZapIcon} className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                          </motion.div>
                        </div>
                        <div>
                          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                            {getStatusMessage()}
                          </h3>
                          <p className='text-muted-foreground/50 text-sm'>
                            {Math.round(animationProgress)}
                            <LocalizedText text={"% complete"} />
                          </p>
                        </div>
                      </div>

                      {/* Progress bar with animated gradient */}
                      <div className='bg-muted-foreground/10 relative h-2 w-full overflow-hidden rounded-full'>
                        <motion.div
                          className='absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500'
                          style={{ width: `${animationProgress}%` }}
                          animate={{
                            backgroundPosition: [
                              "0% 50%",
                              "100% 50%",
                              "0% 50%",
                            ],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                      </div>
                    </div>

                    {/* Generation Steps */}
                    <div className='border-border border-t'>
                      <div className='divide-border grid grid-cols-3 divide-x'>
                        {[
                          {
                            icon: ComputerTerminal01Icon,
                            title: "Analyzing",
                            desc: "Processing request",
                            step: 1,
                          },
                          {
                            icon: Layers01Icon,
                            title: "Generating",
                            desc: "Creating files",
                            step: 2,
                          },
                          {
                            icon: CheckmarkCircle02Icon,
                            title: "Finalizing",
                            desc: "Optimizing code",
                            step: 3,
                          },
                        ].map((step, index) => {
                          const isActive = animationProgress > index * 33;
                          const isComplete =
                            animationProgress > (index + 1) * 33;

                          return (
                            <div
                              key={step.title}
                              className={cn(
                                "p-4 text-center transition-colors",
                                isActive
                                  ? "bg-blue-50/50 dark:bg-blue-900/10"
                                  : "bg-transparent"
                              )}
                            >
                              <div className='flex flex-col items-center'>
                                <div
                                  className={cn(
                                    "mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                                    isComplete
                                      ? "bg-green-100 dark:bg-green-900/30"
                                      : isActive
                                        ? "bg-blue-100 dark:bg-blue-900/30"
                                        : "bg-muted-foreground/10"
                                  )}
                                >
                                  <HugeiconsIcon icon={step.icon}
                                    className={cn(
                                      "h-5 w-5 transition-colors",
                                      isComplete
                                        ? "text-green-600 dark:text-green-400"
                                        : isActive
                                          ? "text-blue-600 dark:text-blue-400"
                                          : "text-gray-400 dark:text-gray-500"
                                    )}
                                  />
                                </div>
                                <h3
                                  className={cn(
                                    "text-sm font-medium transition-colors",
                                    isActive
                                      ? "text-muted-foreground"
                                      : "text-muted-foreground/50"
                                  )}
                                >
                                  {step.title}
                                </h3>
                                <p className='text-muted-foreground/50 mt-1 text-xs'>
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key='empty'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='space-y-6 text-center'
              >
                <div className='bg-muted-foreground/10 mx-auto flex h-24 w-24 items-center justify-center rounded-full'>
                  <HugeiconsIcon icon={SourceCodeIcon} className='text-muted-foreground h-12 w-12' />
                </div>
                <div className='space-y-2'>
                  <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                    <LocalizedText text={"Ready to Create"} />
                  </h2>
                  <p className='text-muted-foreground/50'>
                    <LocalizedText
                      text={"Start a conversation to generate your application"}
                    />
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Files Preview */}
          {generatedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='border-border bg-background mt-8 overflow-hidden rounded-xl border shadow-sm'
            >
              <div className='border-border flex items-center justify-between border-b p-4'>
                <div className='flex items-center gap-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
                    <HugeiconsIcon icon={Layers01Icon} className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <h3 className='text-muted-foreground font-medium'>
                      <LocalizedText text={"Generated Files"} />
                    </h3>
                    <p className='text-muted-foreground/50 text-xs'>
                      {generatedFiles.length}{" "}
                      <LocalizedText text={"files created"} />
                    </p>
                  </div>
                </div>

                {onNavigateToCode && (
                  <Button
                    variant='default'
                    size='sm'
                    onClick={onNavigateToCode}
                    className='gap-1 bg-blue-600 text-white hover:bg-blue-700'
                  >
                    <HugeiconsIcon icon={SourceCodeIcon} className='h-3.5 w-3.5' />
                    <span>
                      <LocalizedText text={"View Code"} />
                    </span>
                    <HugeiconsIcon icon={ArrowRight02Icon} className='h-3.5 w-3.5' />
                  </Button>
                )}
              </div>

              <div className='p-2'>
                <div className='border-border bg-muted-foreground/10 overflow-hidden rounded-md border'>
                  <div className='divide-border max-h-60 divide-y overflow-y-auto'>
                    {renderFileStructure(generatedFiles)}
                  </div>

                  {generatedFiles.length > maxFilesToShow && (
                    <div className='border-border border-t'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setShowAllFiles(!showAllFiles)}
                        className='text-muted-foreground/50 hover:bg-muted-foreground/10 flex w-full items-center justify-center gap-1 py-2 text-xs'
                      >
                        {showAllFiles ? (
                          <>
                            <HugeiconsIcon icon={ArrowUp01Icon} className='h-3.5 w-3.5' />
                            <span>
                              <LocalizedText text={"Show Less"} />
                            </span>
                          </>
                        ) : (
                          <>
                            <HugeiconsIcon icon={ArrowDown01Icon} className='h-3.5 w-3.5' />
                            <span>
                              <LocalizedText text={"Show All"} />
                              {generatedFiles.length}{" "}
                              <LocalizedText text={"Files"} />
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
