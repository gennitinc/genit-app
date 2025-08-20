"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  FileText,
  Folder,
  CheckCircle,
  FileCode,
  ChevronDown,
  Terminal,
  Layers,
  Zap,
  ArrowRight,
  Cpu,
  Braces,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
const fileIcons: Record<string, JSX.Element> = {
  js: <FileCode className="h-4 w-4 text-yellow-500" />,
  jsx: <FileCode className="h-4 w-4 text-blue-500" />,
  ts: <FileCode className="h-4 w-4 text-blue-600" />,
  tsx: <FileCode className="h-4 w-4 text-blue-500" />,
  css: <FileCode className="h-4 w-4 text-purple-500" />,
  html: <FileCode className="h-4 w-4 text-orange-500" />,
  json: <Braces className="h-4 w-4 text-green-500" />,
  md: <FileText className="h-4 w-4 text-gray-500" />,
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
      fileIcons[extension] || <FileText className="h-4 w-4 text-gray-500" />
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
        className={`flex items-center gap-2 py-2 px-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
          level > 0 ? "ml-4" : ""
        }`}
      >
        {file.type === "folder" ? (
          <Folder className="h-4 w-4 text-blue-500" />
        ) : (
          getFileIcon(file.name)
        )}
        <span className="text-sm font-medium text-muted-foreground flex-1 truncate">
          {file.name}
        </span>
        {file.type === "file" && (
          <Badge
            variant="outline"
            className="text-xs font-mono bg-muted-foreground/10"
          >
            {file.name.split(".").pop()?.toUpperCase()}
          </Badge>
        )}
      </motion.div>
    ));
  };

  return (
    <div className="h-full w-full flex flex-col bg-muted-foreground/10">
      <ScrollArea className="flex-1">
        <div className="max-w-3xl w-full mx-auto p-8">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {/* Header with custom spinner */}
                <div className="relative flex flex-col items-center">
                  {/* Custom spinner */}
                  <div className="relative w-14 h-14 mb-6">
                    {/* Outer spinning ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />

                    {/* Middle spinning ring */}
                    <motion.div
                      className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 border-l-purple-500"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />

                    {/* Inner spinning ring */}
                    <motion.div
                      className="absolute inset-4 rounded-full border-4 border-transparent border-b-teal-500 border-r-teal-500"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
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

                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Creating Your Application
                  </h2>
                  <p className="text-muted-foreground/50 mt-3 text-center max-w-lg">
                    Our AI is crafting your custom application with modern
                    technologies and best practices
                  </p>
                </div>

                {/* Status Card */}
                <Card className="overflow-hidden border-0 shadow-lg bg-background">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          >
                            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </motion.div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                            {getStatusMessage()}
                          </h3>
                          <p className="text-sm text-muted-foreground/50">
                            {Math.round(animationProgress)}% complete
                          </p>
                        </div>
                      </div>

                      {/* Progress bar with animated gradient */}
                      <div className="relative h-2 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"
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
                    <div className="border-t border-border">
                      <div className="grid grid-cols-3 divide-x divide-border">
                        {[
                          {
                            icon: Terminal,
                            title: "Analyzing",
                            desc: "Processing request",
                            step: 1,
                          },
                          {
                            icon: Layers,
                            title: "Generating",
                            desc: "Creating files",
                            step: 2,
                          },
                          {
                            icon: CheckCircle,
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
                              <div className="flex flex-col items-center">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                                    isComplete
                                      ? "bg-green-100 dark:bg-green-900/30"
                                      : isActive
                                      ? "bg-blue-100 dark:bg-blue-900/30"
                                      : "bg-muted-foreground/10"
                                  )}
                                >
                                  <step.icon
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
                                    "font-medium text-sm transition-colors",
                                    isActive
                                      ? "text-muted-foreground"
                                      : "text-muted-foreground/50"
                                  )}
                                >
                                  {step.title}
                                </h3>
                                <p className="text-xs text-muted-foreground/50 mt-1">
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
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-24 h-24 mx-auto bg-muted-foreground/10 rounded-full flex items-center justify-center">
                  <Code2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Ready to Create
                  </h2>
                  <p className="text-muted-foreground/50">
                    Start a conversation to generate your application
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
              className="mt-8 overflow-hidden rounded-xl border border-border bg-background shadow-sm"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">
                      Generated Files
                    </h3>
                    <p className="text-xs text-muted-foreground/50">
                      {generatedFiles.length} files created
                    </p>
                  </div>
                </div>

                {onNavigateToCode && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onNavigateToCode}
                    className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>View Code</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div className="p-2">
                <div className="rounded-md border border-border bg-muted-foreground/10 overflow-hidden">
                  <div className="max-h-60 overflow-y-auto divide-y divide-border">
                    {renderFileStructure(generatedFiles)}
                  </div>

                  {generatedFiles.length > maxFilesToShow && (
                    <div className="border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllFiles(!showAllFiles)}
                        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground/50 hover:bg-muted-foreground/10"
                      >
                        {showAllFiles ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5" />
                            <span>Show Less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5" />
                            <span>Show All {generatedFiles.length} Files</span>
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
