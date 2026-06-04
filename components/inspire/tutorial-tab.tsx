"use client";

import { toast } from "@/hooks/use-toast";
import { Tutorial } from "@/types/inspire";
import { tutorialApi } from "@/utils/inspire-api";
import { ExternalLink, Loader2, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface TutorialTabProps {
  type?: "image" | "video" | "general";
}

export function TutorialTab({ type = "general" }: TutorialTabProps) {
  const [featuredTutorial, setFeaturedTutorial] = useState<Tutorial | null>(
    null
  );
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
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    );
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  if (loading) {
    return (
      <section className='p-4'>
        <div className='flex min-h-[60vh] flex-col items-center justify-center'>
          <Loader2 className='mb-3 h-6 w-6 animate-spin text-neutral-400 dark:text-neutral-500' />
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            Loading tutorials
          </p>
        </div>
      </section>
    );
  }

  if (!featuredTutorial && tutorials.length === 0) {
    return (
      <section className='p-4'>
        <div className='flex min-h-[60vh] flex-col items-center justify-center text-center'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800'>
            <PlayCircle className='h-8 w-8 text-neutral-400 dark:text-neutral-500' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-neutral-900 dark:text-white'>
            No tutorials available
          </h3>
          <p className='mb-6 max-w-sm text-sm text-neutral-500 dark:text-neutral-400'>
            Tutorials are being added regularly. Check back soon!
          </p>
          <a
            href='https://www.youtube.com/@genit-tutorials'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
          >
            Visit YouTube Channel
            <ExternalLink className='h-4 w-4' />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className='p-4 px-0'>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h2 className='mb-1 text-lg font-semibold text-neutral-900 dark:text-white'>
            Learn How to Use
          </h2>
          <p className='text-sm text-neutral-500 dark:text-neutral-400'>
            Watch tutorials to get started quickly
          </p>
        </div>
        <a
          href='https://www.youtube.com/@genit-tutorials'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-1.5 text-sm font-medium text-cyan-500 transition-colors hover:text-cyan-600'
        >
          View All
          <ExternalLink className='h-4 w-4' />
        </a>
      </div>

      {/* Featured Tutorial Video */}
      {featuredTutorial && (
        <div className='mb-6 space-y-4'>
          <div className='relative aspect-video overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800'>
            <iframe
              width='100%'
              height='100%'
              src={getYouTubeEmbedUrl(
                featuredTutorial.videoUrl,
                featuredTutorial.youtubeId
              )}
              title={featuredTutorial.title}
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='absolute inset-0 h-full w-full'
            />
          </div>

          <div>
            <h3 className='mb-2 text-base font-semibold text-neutral-900 dark:text-white'>
              {featuredTutorial.title}
            </h3>
            <p className='mb-4 text-sm text-neutral-600 dark:text-neutral-400'>
              {featuredTutorial.description}
            </p>
          </div>
        </div>
      )}

      {/* Additional Tutorial Links */}
      {tutorials.length > 0 && (
        <div className='space-y-2'>
          <h4 className='mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
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
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-center gap-3 rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800'
              >
                <div
                  className={`h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <PlayCircle className='h-6 w-6 text-white' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium text-neutral-900 transition-colors group-hover:text-cyan-500 dark:text-white'>
                    {tutorial.title}
                  </p>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                    {tutorial.duration}
                  </p>
                </div>
                <ExternalLink className='h-4 w-4 text-neutral-400 transition-colors group-hover:text-cyan-500' />
              </a>
            );
          })}
        </div>
      )}

      {/* View All Button */}
      <a
        href='https://www.youtube.com/@genit-tutorials'
        target='_blank'
        rel='noopener noreferrer'
        className='mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition-all hover:from-cyan-600 hover:to-blue-600'
      >
        <PlayCircle className='h-5 w-5' />
        View All Tutorials on YouTube
        <ExternalLink className='h-4 w-4' />
      </a>
    </section>
  );
}
