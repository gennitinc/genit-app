"use client";

import { useState, useEffect } from "react";
import { ExternalLink, PlayCircle, Loader2 } from "lucide-react";
import { tutorialApi } from "@/utils/inspire-api";
import { Tutorial } from "@/types/inspire";
import { toast } from "@/hooks/use-toast";

interface TutorialTabProps {
  type?: "image" | "video" | "general";
}

export function TutorialTab({ type = "general" }: TutorialTabProps) {
  const [featuredTutorial, setFeaturedTutorial] = useState<Tutorial | null>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        
        // Fetch featured tutorial
        const featuredResponse = await tutorialApi.getFeatured(type);
        let featuredId: string | null = null;
        if (featuredResponse.success && featuredResponse.data) {
          setFeaturedTutorial(featuredResponse.data);
          featuredId = featuredResponse.data._id;
        }

        // Fetch additional tutorials
        const tutorialsResponse = await tutorialApi.getAll({ type, limit: 5 });
        if (tutorialsResponse.success && tutorialsResponse.data) {
          // Filter out the featured tutorial from the list
          const filtered = tutorialsResponse.data.filter(
            (t) => t._id !== featuredId
          );
          setTutorials(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching tutorials:", error);
        toast({
          title: "Error",
          description: "Failed to load tutorials. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, [type]);

  const getYouTubeEmbedUrl = (url: string, youtubeId?: string) => {
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}`;
    }
    // Try to extract YouTube ID from URL
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  if (loading) {
  return (
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 text-neutral-400 dark:text-neutral-500 animate-spin mb-3" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading tutorials
        </p>
        </div>
      </section>
    );
  }

  if (!featuredTutorial && tutorials.length === 0) {
    return (
      <section className="p-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <PlayCircle className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            No tutorials available
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
            Tutorials are being added regularly. Check back soon!
          </p>
          <a
            href="https://www.youtube.com/@gennit-tutorials"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-medium text-white dark:text-neutral-900 transition-colors inline-flex items-center gap-2"
          >
            Visit YouTube Channel
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 px-0">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            Learn How to Use
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Watch tutorials to get started quickly
          </p>
        </div>
        <a
          href="https://www.youtube.com/@gennit-tutorials"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-cyan-500 hover:text-cyan-600 transition-colors"
        >
          View All
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Featured Tutorial Video */}
      {featuredTutorial && (
        <div className="space-y-4 mb-6">
          <div className="relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(featuredTutorial.videoUrl, featuredTutorial.youtubeId)}
              title={featuredTutorial.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
              {featuredTutorial.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              {featuredTutorial.description}
            </p>
          </div>
        </div>
      )}

      {/* Additional Tutorial Links */}
      {tutorials.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
            More Tutorials
          </h4>
          
          {tutorials.map((tutorial, index) => {
            const gradients = [
              "from-cyan-400 to-blue-500",
              "from-purple-400 to-pink-500",
              "from-orange-400 to-red-500",
              "from-green-400 to-emerald-500",
            ];
            const gradient = gradients[index % gradients.length];

            return (
              <a
                key={tutorial._id}
                href={tutorial.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                    {tutorial.title}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {tutorial.duration}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-cyan-500 transition-colors" />
              </a>
            );
          })}
        </div>
      )}

      {/* View All Button */}
      <a
        href="https://www.youtube.com/@gennit-tutorials"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all"
      >
        <PlayCircle className="w-5 h-5" />
        View All Tutorials on YouTube
        <ExternalLink className="w-4 h-4" />
      </a>
    </section>
  );
}
