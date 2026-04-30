"use client";

import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

interface VideoCard {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  username: string;
  profilePic: string;
  verified: boolean;
}

const videos: VideoCard[] = [
  {
    id: "1",
    videoUrl:
      "https://cdn.leonardo.ai/users/61f1539d-5ab8-4ced-be93-ceaf0ba315c2/generations/1f0e3eed-52a5-6bd0-a90c-dee3f3ca5cea/veo-3.1-fast-generate-preview_CUTE_3D_CLAYMATION_STYLE_DETAILED_MINIATURE_WORLD_SOFT_PLASTICINE_TEXTURE_CINEMA-0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/61f1539d-5ab8-4ced-be93-ceaf0ba315c2/generations/1f0e3eed-52a5-6bd0-a90c-dee3f3ca5cea/veo-3.1-fast-generate-preview_CUTE_3D_CLAYMATION_STYLE_DETAILED_MINIATURE_WORLD_SOFT_PLASTICINE_TEXTURE_CINEMA-0.jpg?w=512",
    username: "kia_dances",
    profilePic: "https://ext.same-assets.com/3322540528/489297333.jpeg",
    verified: true,
  },
  {
    id: "2",
    videoUrl:
      "https://cdn.leonardo.ai/users/eb55f8d8-cffe-4f8b-a8fb-15f532dc5ab3/generations/ba7951da-d947-4611-9b4c-28485f71144b/segments/1:1:1/motion2Fast_body_slowly_turns_muscles_subtly_contract_with_del_0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/eb55f8d8-cffe-4f8b-a8fb-15f532dc5ab3/generations/ba7951da-d947-4611-9b4c-28485f71144b/segments/1:1:1/motion2Fast_body_slowly_turns_muscles_subtly_contract_with_del_0.jpg?w=512",
    username: "sarah_rides",
    profilePic: "https://ext.same-assets.com/3322540528/490832111.png",
    verified: true,
  },
  {
    id: "3",
    videoUrl:
      "https://framerusercontent.com/assets/DXWg7xZQ9FVGADXcu1YyaoKGc.mp4",
    thumbnailUrl: "",
    username: "tennis_tips",
    profilePic: "https://ext.same-assets.com/3322540528/3139708538.png",
    verified: true,
  },
  {
    id: "4",
    videoUrl:
      "https://cdn.leonardo.ai/users/88cdadb0-927c-4bb1-9105-25c34458a6c8/generations/1f0df4ba-abb7-6ac0-8ff2-82fc40c2c088/kling-video-o-1_Cinematic_medium_shot_of_three_Roman_street_characters_a_heavy-set_butcher_in_an-0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/88cdadb0-927c-4bb1-9105-25c34458a6c8/generations/1f0df4ba-abb7-6ac0-8ff2-82fc40c2c088/kling-video-o-1_Cinematic_medium_shot_of_three_Roman_street_characters_a_heavy-set_butcher_in_an-0.jpg?w=512",
    username: "kudo_charlie",
    profilePic: "https://ext.same-assets.com/3322540528/2300361184.png",
    verified: true,
  },
  {
    id: "5",
    videoUrl:
      "https://cdn.leonardo.ai/users/4e43734b-5b24-4439-bf03-493b2b884434/generations/1f0e0a95-9cf7-6b70-9d10-bc5c556c151b/kling-2.6_A_hyper-realistic_AI-generated_ASMR_video_shot_in_macro_perspective._A_razor-sha-0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/4e43734b-5b24-4439-bf03-493b2b884434/generations/1f0e0a95-9cf7-6b70-9d10-bc5c556c151b/kling-2.6_A_hyper-realistic_AI-generated_ASMR_video_shot_in_macro_perspective._A_razor-sha-0.jpg?w=512",
    username: "hillary_trevor",
    profilePic:
      "https://i.pinimg.com/736x/5f/5f/3c/5f5f3c82349c1dd8552ffa7e97423fb2.jpg",
    verified: true,
  },
  {
    id: "6",
    videoUrl:
      "https://framerusercontent.com/assets/fuVrP45UYEBoOfcLoix1DwuHo.mp4 ",
    thumbnailUrl: "https://ext.same-assets.com/3322540528/108827404.jpeg",
    username: "li_wei",
    profilePic:
      "https://i.pinimg.com/736x/74/3d/88/743d88dd2675cd87baa1b560f500c69c.jpg",
    verified: true,
  },
  {
    id: "7",
    videoUrl:
      "https://cdn.leonardo.ai/users/c3f006ed-7910-47f9-9918-9bd067156534/generations/c789bb82-0939-4825-b659-e1a8ea0656af/c789bb82-0939-4825-b659-e1a8ea0656af.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/c3f006ed-7910-47f9-9918-9bd067156534/generations/c789bb82-0939-4825-b659-e1a8ea0656af/c789bb82-0939-4825-b659-e1a8ea0656af.png?w=512",
    username: "golf_with_jess",
    profilePic: "https://ext.same-assets.com/3322540528/88222209.png",
    verified: true,
  },
  {
    id: "8",
    videoUrl:
      "https://cdn.leonardo.ai/users/8ff3af02-0eb3-442b-af5f-6266be661fef/generations/1f0e41aa-b754-6f80-9119-11f0c6259841/veo-3.1-fast-generate-preview_A_confident_Black_woman_with_sleek_bob-length_hair_flawless_glowing_skin_soft_gl-0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/8ff3af02-0eb3-442b-af5f-6266be661fef/generations/1f0e41aa-b754-6f80-9119-11f0c6259841/veo-3.1-fast-generate-preview_A_confident_Black_woman_with_sleek_bob-length_hair_flawless_glowing_skin_soft_gl-0.jpg?w=512",
    username: "zoe_gardens",
    profilePic: "https://ext.same-assets.com/3322540528/108827404.jpeg",
    verified: true,
  },
];

const VideoCard = ({ video }: { video: VideoCard }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play().catch(() => {
              // Auto-play failed, which is expected in some browsers
            });
          } else {
            videoElement.pause();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className='group border-primary/10 relative isolate flex flex-col overflow-hidden rounded-none border bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04),0_0_0_1px_hsl(var(--primary)/10%)] md:row-span-2 xl:row-span-2 dark:bg-neutral-900'>
      {/* Top gradient line */}
      <div
        style={
          {
            // @ts-ignore
            "--background": "#ffffff",
            "--color": "rgba(0, 0, 0, 0.2)",
            "--height": "1px",
            "--width": "5px",
            "--fade-stop": "90%",
            "--offset": "200px",
            "--color-dark": "rgba(255, 255, 255, 0.2)",
            // @ts-ignore
            maskComposite: "exclude",
          } as React.CSSProperties
        }
        className='absolute top-0 left-[calc(var(--offset)/2*-1)] z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
      ></div>

      {/* Bottom gradient line */}
      <div
        style={
          {
            // @ts-ignore
            "--background": "#ffffff",
            "--color": "rgba(0, 0, 0, 0.2)",
            "--height": "1px",
            "--width": "5px",
            "--fade-stop": "90%",
            "--offset": "200px",
            "--color-dark": "rgba(255, 255, 255, 0.2)",
            // @ts-ignore
            maskComposite: "exclude",
          } as React.CSSProperties
        }
        className='absolute top-auto bottom-0 left-[calc(var(--offset)/2*-1)] z-30 h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
      ></div>

      {/* Left gradient line */}
      <div
        style={
          {
            // @ts-ignore
            "--background": "#ffffff",
            "--color": "rgba(0, 0, 0, 0.2)",
            "--height": "5px",
            "--width": "1px",
            "--fade-stop": "90%",
            "--offset": "80px",
            "--color-dark": "rgba(255, 255, 255, 0.2)",
            // @ts-ignore
            maskComposite: "exclude",
          } as React.CSSProperties
        }
        className='absolute top-[calc(var(--offset)/2*-1)] left-0 z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
      ></div>

      {/* Right gradient line */}
      <div
        style={
          {
            // @ts-ignore
            "--background": "#ffffff",
            "--color": "rgba(0, 0, 0, 0.2)",
            "--height": "5px",
            "--width": "1px",
            "--fade-stop": "90%",
            "--offset": "80px",
            "--color-dark": "rgba(255, 255, 255, 0.2)",
            // @ts-ignore
            maskComposite: "exclude",
          } as React.CSSProperties
        }
        className='absolute top-[calc(var(--offset)/2*-1)] right-0 left-auto z-30 h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask-composite:exclude] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]'
      ></div>
      <div className='relative aspect-[9/12] w-full'>
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          className='h-full w-full object-cover'
          muted
          playsInline
          loop
          autoPlay
          preload='auto'
        />
        {/* Gradient overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
      </div>

      {/* Profile info at bottom */}
      <div className='absolute right-0 bottom-0 left-0 flex items-center gap-2 p-3'>
        <div className='relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border-2 border-white'>
          <Image
            src={video.profilePic}
            alt={video.username}
            width={32}
            height={32}
            className='h-full w-full object-cover'
          />
        </div>
        <span className='truncate text-sm font-medium text-white'>
          {video.username}
        </span>
        {video.verified && (
          <Image
            src='https://ext.same-assets.com/3322540528/871220803.png'
            alt='Verified'
            width={14}
            height={14}
            className='flex-shrink-0'
          />
        )}
      </div>
    </div>
  );
};

const LandingCommunityVideos = () => {
  return (
    <section className='relative mb-10 px-2 md:px-12 lg:px-20 xl:px-24'>
      <div className='relative z-10 mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-12 space-y-4 text-center md:mb-16'>
          <h2 className='text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl'>
            Creator community showcase
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl px-2 text-base md:text-base'>
            Discover AI-generated content from our talented community of
            creators.
          </p>

          <Link
            href='/community'
            className='text-muted-foreground mx-auto flex w-fit max-w-2xl items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-base shadow-lg shadow-black/5 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:bg-white/20 md:text-base dark:bg-white/5 dark:hover:bg-white/10'
          >
            <span>View All</span>
            <ArrowRightIcon className='h-4 w-4' />
          </Link>
        </div>

        {/* Video Grid - Masonry Layout */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .masonry-grid {
                column-count: 2;
                column-gap: 1rem;
              }
              @media (min-width: 1024px) {
                .masonry-grid {
                  column-count: 4;
                }
              }
            `,
          }}
        />
        <div className='masonry-grid px-2 md:px-12 lg:px-20 xl:px-24'>
          {videos.map((video) => (
            <div key={video.id} className='mb-4 break-inside-avoid'>
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingCommunityVideos;
