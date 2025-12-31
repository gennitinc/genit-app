"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";

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
      "https://videocdn.cdnpk.net/videos/a14f0141-106e-5b9b-8ea1-09855c9b7d6b/vertical/previews/clear/large.mp4?token=exp=1767183372~hmac=f9b30f175af0609214c483f0345e0fa6c8d0ac36c5d0ec529bae6915fcacf165",
    thumbnailUrl:
      "https://videocdn.cdnpk.net/videos/a14f0141-106e-5b9b-8ea1-09855c9b7d6b/vertical/thumbnails/large.jpg?uid=R18196923&ga=GA1.1.280172149.1766570238&item_id=3442041&w=740&q=80",
    username: "kia_dances",
    profilePic: "https://ext.same-assets.com/3322540528/489297333.jpeg",
    verified: true,
  },
  {
    id: "2",
    videoUrl:
      "https://pikaso.cdnpk.net/private/production/2117418280/8cdd6e72-262b-43b0-8a12-11f61216be4c-0.mp4",
    thumbnailUrl: "https://ext.same-assets.com/3322540528/490832111.png",
    username: "sarah_rides",
    profilePic: "https://ext.same-assets.com/3322540528/490832111.png",
    verified: true,
  },
  {
    id: "3",
    videoUrl:
      "https://framerusercontent.com/assets/DXWg7xZQ9FVGADXcu1YyaoKGc.mp4",
    thumbnailUrl: "https://ext.same-assets.com/3322540528/3139708538.png",
    username: "tennis_tips",
    profilePic: "https://ext.same-assets.com/3322540528/3139708538.png",
    verified: true,
  },
  {
    id: "4",
    videoUrl:
      "https://cdn.leonardo.ai/users/37a39c36-57a7-40df-bae2-6f98f6a0ac57/generations/a792d013-1c23-4b07-b34b-e7b11cdd4824/segments/2:4:1/Lucid_Origin_professional_photo_of_a_wine_glass_filled_with_a__1.jpg",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/37a39c36-57a7-40df-bae2-6f98f6a0ac57/generations/a792d013-1c23-4b07-b34b-e7b11cdd4824/segments/2:4:1/Lucid_Origin_professional_photo_of_a_wine_glass_filled_with_a__1.jpg",
    username: "business_chats",
    profilePic: "https://ext.same-assets.com/3322540528/2300361184.png",
    verified: true,
  },
  {
    id: "5",
    videoUrl:
      "https://videocdn.cdnpk.net/videos/61a80d6e-fe1f-5120-8e84-b597da1c45f2/horizontal/previews/clear/large.mp4?token=exp=1767184248~hmac=15e0317b6e14269cb74251a0d7278ead9fa8a711a6b96dce3f437946f35ad38c",
    thumbnailUrl:
      "https://videocdn.cdnpk.net/videos/61a80d6e-fe1f-5120-8e84-b597da1c45f2/horizontal/thumbnails/large.jpg?uid=R18196923&amp;ga=GA1.1.280172149.1766570238&amp;item_id=3549438&amp;w=740&amp;q=80",
    username: "tennis_tips",
    profilePic: "https://ext.same-assets.com/3322540528/3139708538.png",
    verified: true,
  },
  {
    id: "6",
    videoUrl:
      "https://framerusercontent.com/assets/fuVrP45UYEBoOfcLoix1DwuHo.mp4 ",
    thumbnailUrl: "https://ext.same-assets.com/3322540528/108827404.jpeg",
    username: "zoe_gardens",
    profilePic: "https://ext.same-assets.com/3322540528/108827404.jpeg",
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
    <div className="group relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="relative aspect-[9/12] w-full">
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          className="w-full h-full object-cover"
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Profile info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden flex-shrink-0">
          <Image
            src={video.profilePic}
            alt={video.username}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-white text-sm font-medium truncate">
          {video.username}
        </span>
        {video.verified && (
          <Image
            src="https://ext.same-assets.com/3322540528/871220803.png"
            alt="Verified"
            width={14}
            height={14}
            className="flex-shrink-0"
          />
        )}
      </div>
    </div>
  );
};

const LandingCommunityVideos = () => {
  return (
    <section className="relative mb-28 px-2 md:px-12 lg:px-20 xl:px-24">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Creator community showcase
          </h2>
          <p className="text-base md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Discover AI-generated content from our talented community of
            creators.
          </p>
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
        <div className="masonry-grid px-2 md:px-12 lg:px-20 xl:px-24">
          {videos.map((video) => (
            <div key={video.id} className="break-inside-avoid mb-4">
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingCommunityVideos;
