"use client";

import { SendIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MainContent } from "../layout/main-content";
import { IdeaSection } from "../layout/idea-section";

// Video data for Reels carousel
const reelsVideos = [
  {
    id: "1",
    videoUrl:
      "https://cdn.leonardo.ai/users/26ac8e01-36b5-47e7-b454-73e1f56828de/generations/f5c5461c-6f42-4518-aa35-1a4512dc1790/segments/1:1:1/motion2Fast_Korean_drama_emotional_scene_30yearold_Korean_woma_0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/26ac8e01-36b5-47e7-b454-73e1f56828de/generations/f5c5461c-6f42-4518-aa35-1a4512dc1790/segments/1:1:1/motion2Fast_Korean_drama_emotional_scene_30yearold_Korean_woma_0.jpg?w=512",
    username: "gennit_ai",
    profilePic: "https://picsum.photos/id/1027/150/150",
    location: "Product Commercial",
    likes: 92372,
    verified: true,
  },
  {
    id: "2",
    videoUrl:
      "https://cdn.leonardo.ai/users/578e674e-459e-4190-a8d2-1aed4b909bc8/generations/d3ff7032-d672-4ffc-82ac-3760ceb07a7a/segments/1:1:1/motion2Fast_A_lone_human_figure_in_a_space_suit_standing_still_0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/578e674e-459e-4190-a8d2-1aed4b909bc8/generations/d3ff7032-d672-4ffc-82ac-3760ceb07a7a/segments/1:1:1/motion2Fast_A_lone_human_figure_in_a_space_suit_standing_still_0.jpg?w=512",
    username: "brand_marketing",
    profilePic: "https://picsum.photos/id/64/150/150",
    location: "Brand Promo",
    likes: 45621,
    verified: true,
  },
  {
    id: "3",
    videoUrl:
      "https://cdn.leonardo.ai/users/8ff3af02-0eb3-442b-af5f-6266be661fef/generations/1f0e41aa-b754-6f80-9119-11f0c6259841/veo-3.1-fast-generate-preview_A_confident_Black_woman_with_sleek_bob-length_hair_flawless_glowing_skin_soft_gl-0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/8ff3af02-0eb3-442b-af5f-6266be661fef/generations/1f0e41aa-b754-6f80-9119-11f0c6259841/veo-3.1-fast-generate-preview_A_confident_Black_woman_with_sleek_bob-length_hair_flawless_glowing_skin_soft_gl-0.jpg?w=512",
    username: "product_showcase",
    profilePic: "https://picsum.photos/id/177/150/150",
    location: "Product Ad",
    likes: 78234,
    verified: true,
  },
];

const messages = [
  {
    type: "user",
    text: "Create a product image for a shoe design",
  },
  {
    type: "ai",
    text: "Here's your product image!",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop",
  },
  {
    type: "user",
    text: "Change the background to white and add a shadow",
  },
  {
    type: "ai",
    text: "Perfect! I've updated the background to white and added a subtle shadow for depth.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop",
  },
  {
    type: "user",
    text: "Can you make the shadow more dramatic?",
  },
  {
    type: "ai",
    text: "Absolutely! I've enhanced the shadow to make it more dramatic and eye-catching.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop",
  },
  {
    type: "user",
    text: "Now create a product image for Meta glasses",
  },
  {
    type: "ai",
    text: "Here's a sleek product image of Meta glasses!",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop",
  },
  {
    type: "user",
    text: "Add a futuristic tech background",
  },
  {
    type: "ai",
    text: "Great idea! I've added a futuristic tech background that complements the Meta glasses perfectly.",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop",
  },
  {
    type: "user",
    text: "Can you create variations with different angles?",
  },
  {
    type: "ai",
    text: "Sure! I've generated multiple angle variations for you to choose from.",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop",
  },
  {
    type: "user",
    text: "I love the side angle. Can you make it more premium looking?",
  },
  {
    type: "ai",
    text: "Perfect choice! I've enhanced the side angle with premium lighting and refined details.",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop",
  },
  {
    type: "user",
    text: "Generate a product image for a smartwatch",
  },
  {
    type: "ai",
    text: "Here's a professional product image of a smartwatch!",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop",
  },
  {
    type: "user",
    text: "Show it on a wrist with a minimalist background",
  },
  {
    type: "ai",
    text: "Perfect! I've created a lifestyle shot with the smartwatch on a wrist against a clean, minimalist background.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop",
  },
];

export function InputLandingMediaChat() {
  const placeholders = [
    "Create a product image for wireless headphones",
    "Generate a promotional video for my brand",
    "Design a social media post with AI",
    "Make an animated logo for my startup",
    "Create product images with different backgrounds",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="h-fit flex flex-col justify-center  items-center px-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

// Reels Carousel Component
const ReelsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            video.play().catch(() => {
              // Auto-play failed, which is expected in some browsers
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5,
        root: containerRef.current,
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reelsVideos.length);
    }, 5000); // Change video every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Scroll carousel to current index
  useEffect(() => {
    if (carouselRef.current) {
      const scrollPosition = currentIndex * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 p-4 h-full flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-sm max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <Image
            className="h-8 w-8 rounded-full object-cover"
            src={reelsVideos[currentIndex].profilePic}
            alt={reelsVideos[currentIndex].username}
            width={32}
            height={32}
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold antialiased block leading-tight text-foreground">
                {reelsVideos[currentIndex].username}
              </span>
              {reelsVideos[currentIndex].verified && (
                <Image
                  src="https://ext.same-assets.com/3322540528/871220803.png"
                  alt="Verified"
                  width={14}
                  height={14}
                  className="flex-shrink-0"
                />
              )}
            </div>
            <span className="text-muted-foreground text-xs block">
              {reelsVideos[currentIndex].location}
            </span>
          </div>
        </div>

        {/* Video Carousel */}
        <div ref={containerRef} className="relative overflow-hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  .reels-carousel::-webkit-scrollbar {
                    display: none;
                  }
                `,
              }}
            />
            {reelsVideos.map((video, index) => (
              <div
                key={video.id}
                className="min-w-full snap-center relative reels-carousel"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={video.videoUrl}
                  className="w-full aspect-[9/10] object-cover"
                  muted
                  playsInline
                  loop
                  preload="auto"
                  autoPlay
                />
                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                  {reelsVideos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/50"
                      }`}
                      aria-label={`Go to video ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mx-4 mt-3 mb-2">
          <div className="flex gap-5">
            <svg
              fill="currentColor"
              height={24}
              viewBox="0 0 48 48"
              width={24}
              className="text-foreground"
            >
              <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z" />
            </svg>
            <svg
              fill="currentColor"
              height={24}
              viewBox="0 0 48 48"
              width={24}
              className="text-foreground"
            >
              <path
                clipRule="evenodd"
                d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
                fillRule="evenodd"
              />
            </svg>
            <svg
              fill="currentColor"
              height={24}
              viewBox="0 0 48 48"
              width={24}
              className="text-foreground"
            >
              <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z" />
            </svg>
          </div>
          <div className="flex">
            <svg
              fill="currentColor"
              height={24}
              viewBox="0 0 48 48"
              width={24}
              className="text-foreground"
            >
              <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z" />
            </svg>
          </div>
        </div>
        <div className="font-semibold text-sm mx-4 mt-2 mb-4 text-foreground">
          {reelsVideos[currentIndex].likes.toLocaleString()} likes
        </div>
      </div>
    </div>
  );
};

const LandingHero = () => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState<{ [key: number]: string }>(
    {}
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [visibleMessages, streamingText, isTyping]);

  useEffect(() => {
    const totalMessages = messages.length;
    let currentIndex = 0;
    let timeoutIds: NodeJS.Timeout[] = [];
    let streamingInterval: NodeJS.Timeout | null = null;

    const streamText = (
      messageIndex: number,
      fullText: string,
      onComplete: () => void
    ) => {
      let currentChar = 0;
      setStreamingText((prev) => ({ ...prev, [messageIndex]: "" }));

      streamingInterval = setInterval(() => {
        if (currentChar < fullText.length) {
          setStreamingText((prev) => ({
            ...prev,
            [messageIndex]: fullText.substring(0, currentChar + 1),
          }));
          currentChar++;
        } else {
          if (streamingInterval) {
            clearInterval(streamingInterval);
            streamingInterval = null;
          }
          // Mark as complete and wait a bit before showing image and next message
          setTimeout(() => {
            setStreamingText((prev) => ({ ...prev, [messageIndex]: fullText }));
            onComplete();
          }, 500);
        }
      }, 30); // Stream one character every 30ms
    };

    const showNextMessage = () => {
      if (currentIndex >= totalMessages) {
        // Reset and restart after showing all messages
        setIsTyping(false);
        setVisibleMessages(0);
        setStreamingText({});
        currentIndex = 0;
        const resetTimeout = setTimeout(() => {
          showNextMessage();
        }, 2000);
        timeoutIds.push(resetTimeout);
        return;
      }

      const currentMessage = messages[currentIndex];

      // Show typing indicator for AI messages
      if (currentMessage.type === "ai") {
        setIsTyping(true);
        const typingTimeout = setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(currentIndex + 1);
          // Start streaming the AI response
          streamText(currentIndex, currentMessage.text, () => {
            // After streaming completes, wait a bit for image, then show next message
            const imageWait = currentMessage.image ? 1500 : 1000;
            const nextTimeout = setTimeout(() => {
              currentIndex++;
              showNextMessage();
            }, imageWait);
            timeoutIds.push(nextTimeout);
          });
        }, 1000); // Show typing for 1 second
        timeoutIds.push(typingTimeout);
      } else {
        // User message appears immediately
        setVisibleMessages(currentIndex + 1);
        currentIndex++;
        const nextTimeout = setTimeout(() => {
          showNextMessage();
        }, 2000); // Wait 2 seconds before next message
        timeoutIds.push(nextTimeout);
      }
    };

    // Start the animation after initial delay
    const initialTimeout = setTimeout(() => {
      showNextMessage();
    }, 800);
    timeoutIds.push(initialTimeout);

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
      if (streamingInterval) {
        clearInterval(streamingInterval);
      }
    };
  }, []);
  return (
    <section className="relative py-10 lg:py-0 lg:pb-16 px-2 md:px-12 lg:px-20 xl:px-24 w-screen overflow-x-hidden">
     
      <div className="relative w-full flex flex-col items-center justify-center">
        <svg
          width={960}
          height={960}
          viewBox="0 0 960 960"
          fill="none"
          className="pointer-events-none absolute top-0 opacity-25 hidden lg:block"
        >
          <mask
            id="mask0_4940_405685"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={960}
            height={960}
          >
            <rect
              width={960}
              height={960}
              fill="url(#paint0_radial_4940_405685)"
            />
          </mask>
          <g mask="url(#mask0_4940_405685)">
            <g clipPath="url(#clip0_4940_405685)">
              <mask id="path-3-inside-1_4940_405685" fill="white">
                <path d="M0 0H96V96H0V0Z" />
              </mask>
              <path
                d="M96 96V97H97V96H96ZM95 0V96H97V0H95ZM96 95H0V97H96V95Z"
                fill="#D0D5DD"
                mask="url(#path-3-inside-1_4940_405685)"
              />
              <mask id="path-5-inside-2_4940_405685" fill="white">
                <path d="M96 0H192V96H96V0Z" />
              </mask>
              <path
                d="M192 96V97H193V96H192ZM191 0V96H193V0H191ZM192 95H96V97H192V95Z"
                fill="#D0D5DD"
                mask="url(#path-5-inside-2_4940_405685)"
              />
              <mask id="path-7-inside-3_4940_405685" fill="white">
                <path d="M192 0H288V96H192V0Z" />
              </mask>
              <path
                d="M288 96V97H289V96H288ZM287 0V96H289V0H287ZM288 95H192V97H288V95Z"
                fill="#D0D5DD"
                mask="url(#path-7-inside-3_4940_405685)"
              />
              <mask id="path-9-inside-4_4940_405685" fill="white">
                <path d="M288 0H384V96H288V0Z" />
              </mask>
              <path
                d="M384 96V97H385V96H384ZM383 0V96H385V0H383ZM384 95H288V97H384V95Z"
                fill="#D0D5DD"
                mask="url(#path-9-inside-4_4940_405685)"
              />
              <mask id="path-11-inside-5_4940_405685" fill="white">
                <path d="M384 0H480V96H384V0Z" />
              </mask>
              <path
                d="M480 96V97H481V96H480ZM479 0V96H481V0H479ZM480 95H384V97H480V95Z"
                fill="#D0D5DD"
                mask="url(#path-11-inside-5_4940_405685)"
              />
              <mask id="path-13-inside-6_4940_405685" fill="white">
                <path d="M480 0H576V96H480V0Z" />
              </mask>
              <path
                d="M576 96V97H577V96H576ZM575 0V96H577V0H575ZM576 95H480V97H576V95Z"
                fill="#D0D5DD"
                mask="url(#path-13-inside-6_4940_405685)"
              />
              <mask id="path-15-inside-7_4940_405685" fill="white">
                <path d="M576 0H672V96H576V0Z" />
              </mask>
              <path
                d="M672 96V97H673V96H672ZM671 0V96H673V0H671ZM672 95H576V97H672V95Z"
                fill="#D0D5DD"
                mask="url(#path-15-inside-7_4940_405685)"
              />
              <mask id="path-17-inside-8_4940_405685" fill="white">
                <path d="M672 0H768V96H672V0Z" />
              </mask>
              <path
                d="M768 96V97H769V96H768ZM767 0V96H769V0H767ZM768 95H672V97H768V95Z"
                fill="#D0D5DD"
                mask="url(#path-17-inside-8_4940_405685)"
              />
              <mask id="path-19-inside-9_4940_405685" fill="white">
                <path d="M768 0H864V96H768V0Z" />
              </mask>
              <path
                d="M864 96V97H865V96H864ZM863 0V96H865V0H863ZM864 95H768V97H864V95Z"
                fill="#D0D5DD"
                mask="url(#path-19-inside-9_4940_405685)"
              />
              <mask id="path-21-inside-10_4940_405685" fill="white">
                <path d="M864 0H960V96H864V0Z" />
              </mask>
              <path
                d="M960 96V97H961V96H960ZM959 0V96H961V0H959ZM960 95H864V97H960V95Z"
                fill="#D0D5DD"
                mask="url(#path-21-inside-10_4940_405685)"
              />
              <mask id="path-23-inside-11_4940_405685" fill="white">
                <path d="M0 96H96V192H0V96Z" />
              </mask>
              <path
                d="M96 192V193H97V192H96ZM95 96V192H97V96H95ZM96 191H0V193H96V191Z"
                fill="#D0D5DD"
                mask="url(#path-23-inside-11_4940_405685)"
              />
              <mask id="path-25-inside-12_4940_405685" fill="white">
                <path d="M96 96H192V192H96V96Z" />
              </mask>
              <path
                d="M192 192V193H193V192H192ZM191 96V192H193V96H191ZM192 191H96V193H192V191Z"
                fill="#D0D5DD"
                mask="url(#path-25-inside-12_4940_405685)"
              />
              <mask id="path-27-inside-13_4940_405685" fill="white">
                <path d="M192 96H288V192H192V96Z" />
              </mask>
              <path d="M192 96H288V192H192V96Z" fill="#F2F4F7" />
              <path
                d="M288 192V193H289V192H288ZM287 96V192H289V96H287ZM288 191H192V193H288V191Z"
                fill="#D0D5DD"
                mask="url(#path-27-inside-13_4940_405685)"
              />
              <mask id="path-29-inside-14_4940_405685" fill="white">
                <path d="M288 96H384V192H288V96Z" />
              </mask>
              <path
                d="M384 192V193H385V192H384ZM383 96V192H385V96H383ZM384 191H288V193H384V191Z"
                fill="#D0D5DD"
                mask="url(#path-29-inside-14_4940_405685)"
              />
              <mask id="path-31-inside-15_4940_405685" fill="white">
                <path d="M384 96H480V192H384V96Z" />
              </mask>
              <path
                d="M480 192V193H481V192H480ZM479 96V192H481V96H479ZM480 191H384V193H480V191Z"
                fill="#D0D5DD"
                mask="url(#path-31-inside-15_4940_405685)"
              />
              <mask id="path-33-inside-16_4940_405685" fill="white">
                <path d="M480 96H576V192H480V96Z" />
              </mask>
              <path
                d="M576 192V193H577V192H576ZM575 96V192H577V96H575ZM576 191H480V193H576V191Z"
                fill="#D0D5DD"
                mask="url(#path-33-inside-16_4940_405685)"
              />
              <mask id="path-35-inside-17_4940_405685" fill="white">
                <path d="M576 96H672V192H576V96Z" />
              </mask>
              <path
                d="M672 192V193H673V192H672ZM671 96V192H673V96H671ZM672 191H576V193H672V191Z"
                fill="#D0D5DD"
                mask="url(#path-35-inside-17_4940_405685)"
              />
              <mask id="path-37-inside-18_4940_405685" fill="white">
                <path d="M672 96H768V192H672V96Z" />
              </mask>
              <path
                d="M768 192V193H769V192H768ZM767 96V192H769V96H767ZM768 191H672V193H768V191Z"
                fill="#D0D5DD"
                mask="url(#path-37-inside-18_4940_405685)"
              />
              <mask id="path-39-inside-19_4940_405685" fill="white">
                <path d="M768 96H864V192H768V96Z" />
              </mask>
              <path d="M768 96H864V192H768V96Z" fill="#F2F4F7" />
              <path
                d="M864 192V193H865V192H864ZM863 96V192H865V96H863ZM864 191H768V193H864V191Z"
                fill="#D0D5DD"
                mask="url(#path-39-inside-19_4940_405685)"
              />
              <mask id="path-41-inside-20_4940_405685" fill="white">
                <path d="M864 96H960V192H864V96Z" />
              </mask>
              <path
                d="M960 192V193H961V192H960ZM959 96V192H961V96H959ZM960 191H864V193H960V191Z"
                fill="#D0D5DD"
                mask="url(#path-41-inside-20_4940_405685)"
              />
              <mask id="path-43-inside-21_4940_405685" fill="white">
                <path d="M0 192H96V288H0V192Z" />
              </mask>
              <path d="M0 192H96V288H0V192Z" fill="#F2F4F7" />
              <path
                d="M96 288V289H97V288H96ZM95 192V288H97V192H95ZM96 287H0V289H96V287Z"
                fill="#D0D5DD"
                mask="url(#path-43-inside-21_4940_405685)"
              />
              <mask id="path-45-inside-22_4940_405685" fill="white">
                <path d="M96 192H192V288H96V192Z" />
              </mask>
              <path
                d="M192 288V289H193V288H192ZM191 192V288H193V192H191ZM192 287H96V289H192V287Z"
                fill="#D0D5DD"
                mask="url(#path-45-inside-22_4940_405685)"
              />
              <mask id="path-47-inside-23_4940_405685" fill="white">
                <path d="M192 192H288V288H192V192Z" />
              </mask>
              <path
                d="M288 288V289H289V288H288ZM287 192V288H289V192H287ZM288 287H192V289H288V287Z"
                fill="#D0D5DD"
                mask="url(#path-47-inside-23_4940_405685)"
              />
              <mask id="path-49-inside-24_4940_405685" fill="white">
                <path d="M288 192H384V288H288V192Z" />
              </mask>
              <path
                d="M384 288V289H385V288H384ZM383 192V288H385V192H383ZM384 287H288V289H384V287Z"
                fill="#D0D5DD"
                mask="url(#path-49-inside-24_4940_405685)"
              />
              <mask id="path-51-inside-25_4940_405685" fill="white">
                <path d="M384 192H480V288H384V192Z" />
              </mask>
              <path
                d="M480 288V289H481V288H480ZM479 192V288H481V192H479ZM480 287H384V289H480V287Z"
                fill="#D0D5DD"
                mask="url(#path-51-inside-25_4940_405685)"
              />
              <mask id="path-53-inside-26_4940_405685" fill="white">
                <path d="M480 192H576V288H480V192Z" />
              </mask>
              <path
                d="M576 288V289H577V288H576ZM575 192V288H577V192H575ZM576 287H480V289H576V287Z"
                fill="#D0D5DD"
                mask="url(#path-53-inside-26_4940_405685)"
              />
              <mask id="path-55-inside-27_4940_405685" fill="white">
                <path d="M576 192H672V288H576V192Z" />
              </mask>
              <path d="M576 192H672V288H576V192Z" fill="#F2F4F7" />
              <path
                d="M672 288V289H673V288H672ZM671 192V288H673V192H671ZM672 287H576V289H672V287Z"
                fill="#D0D5DD"
                mask="url(#path-55-inside-27_4940_405685)"
              />
              <mask id="path-57-inside-28_4940_405685" fill="white">
                <path d="M672 192H768V288H672V192Z" />
              </mask>
              <path
                d="M768 288V289H769V288H768ZM767 192V288H769V192H767ZM768 287H672V289H768V287Z"
                fill="#D0D5DD"
                mask="url(#path-57-inside-28_4940_405685)"
              />
              <mask id="path-59-inside-29_4940_405685" fill="white">
                <path d="M768 192H864V288H768V192Z" />
              </mask>
              <path
                d="M864 288V289H865V288H864ZM863 192V288H865V192H863ZM864 287H768V289H864V287Z"
                fill="#D0D5DD"
                mask="url(#path-59-inside-29_4940_405685)"
              />
              <mask id="path-61-inside-30_4940_405685" fill="white">
                <path d="M864 192H960V288H864V192Z" />
              </mask>
              <path
                d="M960 288V289H961V288H960ZM959 192V288H961V192H959ZM960 287H864V289H960V287Z"
                fill="#D0D5DD"
                mask="url(#path-61-inside-30_4940_405685)"
              />
              <mask id="path-63-inside-31_4940_405685" fill="white">
                <path d="M0 288H96V384H0V288Z" />
              </mask>
              <path
                d="M96 384V385H97V384H96ZM95 288V384H97V288H95ZM96 383H0V385H96V383Z"
                fill="#D0D5DD"
                mask="url(#path-63-inside-31_4940_405685)"
              />
              <mask id="path-65-inside-32_4940_405685" fill="white">
                <path d="M96 288H192V384H96V288Z" />
              </mask>
              <path
                d="M192 384V385H193V384H192ZM191 288V384H193V288H191ZM192 383H96V385H192V383Z"
                fill="#D0D5DD"
                mask="url(#path-65-inside-32_4940_405685)"
              />
              <mask id="path-67-inside-33_4940_405685" fill="white">
                <path d="M192 288H288V384H192V288Z" />
              </mask>
              <path
                d="M288 384V385H289V384H288ZM287 288V384H289V288H287ZM288 383H192V385H288V383Z"
                fill="#D0D5DD"
                mask="url(#path-67-inside-33_4940_405685)"
              />
              <mask id="path-69-inside-34_4940_405685" fill="white">
                <path d="M288 288H384V384H288V288Z" />
              </mask>
              <path
                d="M384 384V385H385V384H384ZM383 288V384H385V288H383ZM384 383H288V385H384V383Z"
                fill="#D0D5DD"
                mask="url(#path-69-inside-34_4940_405685)"
              />
              <mask id="path-71-inside-35_4940_405685" fill="white">
                <path d="M384 288H480V384H384V288Z" />
              </mask>
              <path
                d="M480 384V385H481V384H480ZM479 288V384H481V288H479ZM480 383H384V385H480V383Z"
                fill="#D0D5DD"
                mask="url(#path-71-inside-35_4940_405685)"
              />
              <mask id="path-73-inside-36_4940_405685" fill="white">
                <path d="M480 288H576V384H480V288Z" />
              </mask>
              <path
                d="M576 384V385H577V384H576ZM575 288V384H577V288H575ZM576 383H480V385H576V383Z"
                fill="#D0D5DD"
                mask="url(#path-73-inside-36_4940_405685)"
              />
              <mask id="path-75-inside-37_4940_405685" fill="white">
                <path d="M576 288H672V384H576V288Z" />
              </mask>
              <path
                d="M672 384V385H673V384H672ZM671 288V384H673V288H671ZM672 383H576V385H672V383Z"
                fill="#D0D5DD"
                mask="url(#path-75-inside-37_4940_405685)"
              />
              <mask id="path-77-inside-38_4940_405685" fill="white">
                <path d="M672 288H768V384H672V288Z" />
              </mask>
              <path
                d="M768 384V385H769V384H768ZM767 288V384H769V288H767ZM768 383H672V385H768V383Z"
                fill="#D0D5DD"
                mask="url(#path-77-inside-38_4940_405685)"
              />
              <mask id="path-79-inside-39_4940_405685" fill="white">
                <path d="M768 288H864V384H768V288Z" />
              </mask>
              <path
                d="M864 384V385H865V384H864ZM863 288V384H865V288H863ZM864 383H768V385H864V383Z"
                fill="#D0D5DD"
                mask="url(#path-79-inside-39_4940_405685)"
              />
              <mask id="path-81-inside-40_4940_405685" fill="white">
                <path d="M864 288H960V384H864V288Z" />
              </mask>
              <path d="M864 288H960V384H864V288Z" fill="#F2F4F7" />
              <path
                d="M960 384V385H961V384H960ZM959 288V384H961V288H959ZM960 383H864V385H960V383Z"
                fill="#D0D5DD"
                mask="url(#path-81-inside-40_4940_405685)"
              />
              <mask id="path-83-inside-41_4940_405685" fill="white">
                <path d="M0 384H96V480H0V384Z" />
              </mask>
              <path
                d="M96 480V481H97V480H96ZM95 384V480H97V384H95ZM96 479H0V481H96V479Z"
                fill="#D0D5DD"
                mask="url(#path-83-inside-41_4940_405685)"
              />
              <mask id="path-85-inside-42_4940_405685" fill="white">
                <path d="M96 384H192V480H96V384Z" />
              </mask>
              <path
                d="M192 480V481H193V480H192ZM191 384V480H193V384H191ZM192 479H96V481H192V479Z"
                fill="#D0D5DD"
                mask="url(#path-85-inside-42_4940_405685)"
              />
              <mask id="path-87-inside-43_4940_405685" fill="white">
                <path d="M192 384H288V480H192V384Z" />
              </mask>
              <path
                d="M288 480V481H289V480H288ZM287 384V480H289V384H287ZM288 479H192V481H288V479Z"
                fill="#D0D5DD"
                mask="url(#path-87-inside-43_4940_405685)"
              />
              <mask id="path-89-inside-44_4940_405685" fill="white">
                <path d="M288 384H384V480H288V384Z" />
              </mask>
              <path d="M288 384H384V480H288V384Z" fill="#F2F4F7" />
              <path
                d="M384 480V481H385V480H384ZM383 384V480H385V384H383ZM384 479H288V481H384V479Z"
                fill="#D0D5DD"
                mask="url(#path-89-inside-44_4940_405685)"
              />
              <mask id="path-91-inside-45_4940_405685" fill="white">
                <path d="M384 384H480V480H384V384Z" />
              </mask>
              <path
                d="M480 480V481H481V480H480ZM479 384V480H481V384H479ZM480 479H384V481H480V479Z"
                fill="#D0D5DD"
                mask="url(#path-91-inside-45_4940_405685)"
              />
              <mask id="path-93-inside-46_4940_405685" fill="white">
                <path d="M480 384H576V480H480V384Z" />
              </mask>
              <path
                d="M576 480V481H577V480H576ZM575 384V480H577V384H575ZM576 479H480V481H576V479Z"
                fill="#D0D5DD"
                mask="url(#path-93-inside-46_4940_405685)"
              />
              <mask id="path-95-inside-47_4940_405685" fill="white">
                <path d="M576 384H672V480H576V384Z" />
              </mask>
              <path
                d="M672 480V481H673V480H672ZM671 384V480H673V384H671ZM672 479H576V481H672V479Z"
                fill="#D0D5DD"
                mask="url(#path-95-inside-47_4940_405685)"
              />
              <mask id="path-97-inside-48_4940_405685" fill="white">
                <path d="M672 384H768V480H672V384Z" />
              </mask>
              <path
                d="M768 480V481H769V480H768ZM767 384V480H769V384H767ZM768 479H672V481H768V479Z"
                fill="#D0D5DD"
                mask="url(#path-97-inside-48_4940_405685)"
              />
              <mask id="path-99-inside-49_4940_405685" fill="white">
                <path d="M768 384H864V480H768V384Z" />
              </mask>
              <path
                d="M864 480V481H865V480H864ZM863 384V480H865V384H863ZM864 479H768V481H864V479Z"
                fill="#D0D5DD"
                mask="url(#path-99-inside-49_4940_405685)"
              />
              <mask id="path-101-inside-50_4940_405685" fill="white">
                <path d="M864 384H960V480H864V384Z" />
              </mask>
              <path
                d="M960 480V481H961V480H960ZM959 384V480H961V384H959ZM960 479H864V481H960V479Z"
                fill="#D0D5DD"
                mask="url(#path-101-inside-50_4940_405685)"
              />
              <mask id="path-103-inside-51_4940_405685" fill="white">
                <path d="M0 480H96V576H0V480Z" />
              </mask>
              <path d="M0 480H96V576H0V480Z" fill="#F2F4F7" />
              <path
                d="M96 576V577H97V576H96ZM95 480V576H97V480H95ZM96 575H0V577H96V575Z"
                fill="#D0D5DD"
                mask="url(#path-103-inside-51_4940_405685)"
              />
              <mask id="path-105-inside-52_4940_405685" fill="white">
                <path d="M96 480H192V576H96V480Z" />
              </mask>
              <path
                d="M192 576V577H193V576H192ZM191 480V576H193V480H191ZM192 575H96V577H192V575Z"
                fill="#D0D5DD"
                mask="url(#path-105-inside-52_4940_405685)"
              />
              <mask id="path-107-inside-53_4940_405685" fill="white">
                <path d="M192 480H288V576H192V480Z" />
              </mask>
              <path
                d="M288 576V577H289V576H288ZM287 480V576H289V480H287ZM288 575H192V577H288V575Z"
                fill="#D0D5DD"
                mask="url(#path-107-inside-53_4940_405685)"
              />
              <mask id="path-109-inside-54_4940_405685" fill="white">
                <path d="M288 480H384V576H288V480Z" />
              </mask>
              <path
                d="M384 576V577H385V576H384ZM383 480V576H385V480H383ZM384 575H288V577H384V575Z"
                fill="#D0D5DD"
                mask="url(#path-109-inside-54_4940_405685)"
              />
              <mask id="path-111-inside-55_4940_405685" fill="white">
                <path d="M384 480H480V576H384V480Z" />
              </mask>
              <path
                d="M480 576V577H481V576H480ZM479 480V576H481V480H479ZM480 575H384V577H480V575Z"
                fill="#D0D5DD"
                mask="url(#path-111-inside-55_4940_405685)"
              />
              <mask id="path-113-inside-56_4940_405685" fill="white">
                <path d="M480 480H576V576H480V480Z" />
              </mask>
              <path
                d="M576 576V577H577V576H576ZM575 480V576H577V480H575ZM576 575H480V577H576V575Z"
                fill="#D0D5DD"
                mask="url(#path-113-inside-56_4940_405685)"
              />
              <mask id="path-115-inside-57_4940_405685" fill="white">
                <path d="M576 480H672V576H576V480Z" />
              </mask>
              <path d="M576 480H672V576H576V480Z" fill="#F2F4F7" />
              <path
                d="M672 576V577H673V576H672ZM671 480V576H673V480H671ZM672 575H576V577H672V575Z"
                fill="#D0D5DD"
                mask="url(#path-115-inside-57_4940_405685)"
              />
              <mask id="path-117-inside-58_4940_405685" fill="white">
                <path d="M672 480H768V576H672V480Z" />
              </mask>
              <path
                d="M768 576V577H769V576H768ZM767 480V576H769V480H767ZM768 575H672V577H768V575Z"
                fill="#D0D5DD"
                mask="url(#path-117-inside-58_4940_405685)"
              />
              <mask id="path-119-inside-59_4940_405685" fill="white">
                <path d="M768 480H864V576H768V480Z" />
              </mask>
              <path
                d="M864 576V577H865V576H864ZM863 480V576H865V480H863ZM864 575H768V577H864V575Z"
                fill="#D0D5DD"
                mask="url(#path-119-inside-59_4940_405685)"
              />
              <mask id="path-121-inside-60_4940_405685" fill="white">
                <path d="M864 480H960V576H864V480Z" />
              </mask>
              <path
                d="M960 576V577H961V576H960ZM959 480V576H961V480H959ZM960 575H864V577H960V575Z"
                fill="#D0D5DD"
                mask="url(#path-121-inside-60_4940_405685)"
              />
              <mask id="path-123-inside-61_4940_405685" fill="white">
                <path d="M0 576H96V672H0V576Z" />
              </mask>
              <path
                d="M96 672V673H97V672H96ZM95 576V672H97V576H95ZM96 671H0V673H96V671Z"
                fill="#D0D5DD"
                mask="url(#path-123-inside-61_4940_405685)"
              />
              <mask id="path-125-inside-62_4940_405685" fill="white">
                <path d="M96 576H192V672H96V576Z" />
              </mask>
              <path
                d="M192 672V673H193V672H192ZM191 576V672H193V576H191ZM192 671H96V673H192V671Z"
                fill="#D0D5DD"
                mask="url(#path-125-inside-62_4940_405685)"
              />
              <mask id="path-127-inside-63_4940_405685" fill="white">
                <path d="M192 576H288V672H192V576Z" />
              </mask>
              <path
                d="M288 672V673H289V672H288ZM287 576V672H289V576H287ZM288 671H192V673H288V671Z"
                fill="#D0D5DD"
                mask="url(#path-127-inside-63_4940_405685)"
              />
              <mask id="path-129-inside-64_4940_405685" fill="white">
                <path d="M288 576H384V672H288V576Z" />
              </mask>
              <path
                d="M384 672V673H385V672H384ZM383 576V672H385V576H383ZM384 671H288V673H384V671Z"
                fill="#D0D5DD"
                mask="url(#path-129-inside-64_4940_405685)"
              />
              <mask id="path-131-inside-65_4940_405685" fill="white">
                <path d="M384 576H480V672H384V576Z" />
              </mask>
              <path
                d="M480 672V673H481V672H480ZM479 576V672H481V576H479ZM480 671H384V673H480V671Z"
                fill="#D0D5DD"
                mask="url(#path-131-inside-65_4940_405685)"
              />
              <mask id="path-133-inside-66_4940_405685" fill="white">
                <path d="M480 576H576V672H480V576Z" />
              </mask>
              <path
                d="M576 672V673H577V672H576ZM575 576V672H577V576H575ZM576 671H480V673H576V671Z"
                fill="#D0D5DD"
                mask="url(#path-133-inside-66_4940_405685)"
              />
              <mask id="path-135-inside-67_4940_405685" fill="white">
                <path d="M576 576H672V672H576V576Z" />
              </mask>
              <path
                d="M672 672V673H673V672H672ZM671 576V672H673V576H671ZM672 671H576V673H672V671Z"
                fill="#D0D5DD"
                mask="url(#path-135-inside-67_4940_405685)"
              />
              <mask id="path-137-inside-68_4940_405685" fill="white">
                <path d="M672 576H768V672H672V576Z" />
              </mask>
              <path
                d="M768 672V673H769V672H768ZM767 576V672H769V576H767ZM768 671H672V673H768V671Z"
                fill="#D0D5DD"
                mask="url(#path-137-inside-68_4940_405685)"
              />
              <mask id="path-139-inside-69_4940_405685" fill="white">
                <path d="M768 576H864V672H768V576Z" />
              </mask>
              <path
                d="M864 672V673H865V672H864ZM863 576V672H865V576H863ZM864 671H768V673H864V671Z"
                fill="#D0D5DD"
                mask="url(#path-139-inside-69_4940_405685)"
              />
              <mask id="path-141-inside-70_4940_405685" fill="white">
                <path d="M864 576H960V672H864V576Z" />
              </mask>
              <path
                d="M960 672V673H961V672H960ZM959 576V672H961V576H959ZM960 671H864V673H960V671Z"
                fill="#D0D5DD"
                mask="url(#path-141-inside-70_4940_405685)"
              />
              <mask id="path-143-inside-71_4940_405685" fill="white">
                <path d="M0 672H96V768H0V672Z" />
              </mask>
              <path
                d="M96 768V769H97V768H96ZM95 672V768H97V672H95ZM96 767H0V769H96V767Z"
                fill="#D0D5DD"
                mask="url(#path-143-inside-71_4940_405685)"
              />
              <mask id="path-145-inside-72_4940_405685" fill="white">
                <path d="M96 672H192V768H96V672Z" />
              </mask>
              <path
                d="M192 768V769H193V768H192ZM191 672V768H193V672H191ZM192 767H96V769H192V767Z"
                fill="#D0D5DD"
                mask="url(#path-145-inside-72_4940_405685)"
              />
              <mask id="path-147-inside-73_4940_405685" fill="white">
                <path d="M192 672H288V768H192V672Z" />
              </mask>
              <path
                d="M288 768V769H289V768H288ZM287 672V768H289V672H287ZM288 767H192V769H288V767Z"
                fill="#D0D5DD"
                mask="url(#path-147-inside-73_4940_405685)"
              />
              <mask id="path-149-inside-74_4940_405685" fill="white">
                <path d="M288 672H384V768H288V672Z" />
              </mask>
              <path d="M288 672H384V768H288V672Z" fill="#F2F4F7" />
              <path
                d="M384 768V769H385V768H384ZM383 672V768H385V672H383ZM384 767H288V769H384V767Z"
                fill="#D0D5DD"
                mask="url(#path-149-inside-74_4940_405685)"
              />
              <mask id="path-151-inside-75_4940_405685" fill="white">
                <path d="M384 672H480V768H384V672Z" />
              </mask>
              <path
                d="M480 768V769H481V768H480ZM479 672V768H481V672H479ZM480 767H384V769H480V767Z"
                fill="#D0D5DD"
                mask="url(#path-151-inside-75_4940_405685)"
              />
              <mask id="path-153-inside-76_4940_405685" fill="white">
                <path d="M480 672H576V768H480V672Z" />
              </mask>
              <path
                d="M576 768V769H577V768H576ZM575 672V768H577V672H575ZM576 767H480V769H576V767Z"
                fill="#D0D5DD"
                mask="url(#path-153-inside-76_4940_405685)"
              />
              <mask id="path-155-inside-77_4940_405685" fill="white">
                <path d="M576 672H672V768H576V672Z" />
              </mask>
              <path
                d="M672 768V769H673V768H672ZM671 672V768H673V672H671ZM672 767H576V769H672V767Z"
                fill="#D0D5DD"
                mask="url(#path-155-inside-77_4940_405685)"
              />
              <mask id="path-157-inside-78_4940_405685" fill="white">
                <path d="M672 672H768V768H672V672Z" />
              </mask>
              <path
                d="M768 768V769H769V768H768ZM767 672V768H769V672H767ZM768 767H672V769H768V767Z"
                fill="#D0D5DD"
                mask="url(#path-157-inside-78_4940_405685)"
              />
              <mask id="path-159-inside-79_4940_405685" fill="white">
                <path d="M768 672H864V768H768V672Z" />
              </mask>
              <path
                d="M864 768V769H865V768H864ZM863 672V768H865V672H863ZM864 767H768V769H864V767Z"
                fill="#D0D5DD"
                mask="url(#path-159-inside-79_4940_405685)"
              />
              <mask id="path-161-inside-80_4940_405685" fill="white">
                <path d="M864 672H960V768H864V672Z" />
              </mask>
              <path d="M864 672H960V768H864V672Z" fill="#F2F4F7" />
              <path
                d="M960 768V769H961V768H960ZM959 672V768H961V672H959ZM960 767H864V769H960V767Z"
                fill="#D0D5DD"
                mask="url(#path-161-inside-80_4940_405685)"
              />
              <mask id="path-163-inside-81_4940_405685" fill="white">
                <path d="M0 768H96V864H0V768Z" />
              </mask>
              <path d="M0 768H96V864H0V768Z" fill="#F2F4F7" />
              <path
                d="M96 864V865H97V864H96ZM95 768V864H97V768H95ZM96 863H0V865H96V863Z"
                fill="#D0D5DD"
                mask="url(#path-163-inside-81_4940_405685)"
              />
              <mask id="path-165-inside-82_4940_405685" fill="white">
                <path d="M96 768H192V864H96V768Z" />
              </mask>
              <path
                d="M192 864V865H193V864H192ZM191 768V864H193V768H191ZM192 863H96V865H192V863Z"
                fill="#D0D5DD"
                mask="url(#path-165-inside-82_4940_405685)"
              />
              <mask id="path-167-inside-83_4940_405685" fill="white">
                <path d="M192 768H288V864H192V768Z" />
              </mask>
              <path
                d="M288 864V865H289V864H288ZM287 768V864H289V768H287ZM288 863H192V865H288V863Z"
                fill="#D0D5DD"
                mask="url(#path-167-inside-83_4940_405685)"
              />
              <mask id="path-169-inside-84_4940_405685" fill="white">
                <path d="M288 768H384V864H288V768Z" />
              </mask>
              <path
                d="M384 864V865H385V864H384ZM383 768V864H385V768H383ZM384 863H288V865H384V863Z"
                fill="#D0D5DD"
                mask="url(#path-169-inside-84_4940_405685)"
              />
              <mask id="path-171-inside-85_4940_405685" fill="white">
                <path d="M384 768H480V864H384V768Z" />
              </mask>
              <path
                d="M480 864V865H481V864H480ZM479 768V864H481V768H479ZM480 863H384V865H480V863Z"
                fill="#D0D5DD"
                mask="url(#path-171-inside-85_4940_405685)"
              />
              <mask id="path-173-inside-86_4940_405685" fill="white">
                <path d="M480 768H576V864H480V768Z" />
              </mask>
              <path
                d="M576 864V865H577V864H576ZM575 768V864H577V768H575ZM576 863H480V865H576V863Z"
                fill="#D0D5DD"
                mask="url(#path-173-inside-86_4940_405685)"
              />
              <mask id="path-175-inside-87_4940_405685" fill="white">
                <path d="M576 768H672V864H576V768Z" />
              </mask>
              <path d="M576 768H672V864H576V768Z" fill="#F2F4F7" />
              <path
                d="M672 864V865H673V864H672ZM671 768V864H673V768H671ZM672 863H576V865H672V863Z"
                fill="#D0D5DD"
                mask="url(#path-175-inside-87_4940_405685)"
              />
              <mask id="path-177-inside-88_4940_405685" fill="white">
                <path d="M672 768H768V864H672V768Z" />
              </mask>
              <path
                d="M768 864V865H769V864H768ZM767 768V864H769V768H767ZM768 863H672V865H768V863Z"
                fill="#D0D5DD"
                mask="url(#path-177-inside-88_4940_405685)"
              />
              <mask id="path-179-inside-89_4940_405685" fill="white">
                <path d="M768 768H864V864H768V768Z" />
              </mask>
              <path
                d="M864 864V865H865V864H864ZM863 768V864H865V768H863ZM864 863H768V865H864V863Z"
                fill="#D0D5DD"
                mask="url(#path-179-inside-89_4940_405685)"
              />
              <mask id="path-181-inside-90_4940_405685" fill="white">
                <path d="M864 768H960V864H864V768Z" />
              </mask>
              <path
                d="M960 864V865H961V864H960ZM959 768V864H961V768H959ZM960 863H864V865H960V863Z"
                fill="#D0D5DD"
                mask="url(#path-181-inside-90_4940_405685)"
              />
              <mask id="path-183-inside-91_4940_405685" fill="white">
                <path d="M0 864H96V960H0V864Z" />
              </mask>
              <path
                d="M96 960V961H97V960H96ZM95 864V960H97V864H95ZM96 959H0V961H96V959Z"
                fill="#D0D5DD"
                mask="url(#path-183-inside-91_4940_405685)"
              />
              <mask id="path-185-inside-92_4940_405685" fill="white">
                <path d="M96 864H192V960H96V864Z" />
              </mask>
              <path
                d="M192 960V961H193V960H192ZM191 864V960H193V864H191ZM192 959H96V961H192V959Z"
                fill="#D0D5DD"
                mask="url(#path-185-inside-92_4940_405685)"
              />
              <mask id="path-187-inside-93_4940_405685" fill="white">
                <path d="M192 864H288V960H192V864Z" />
              </mask>
              <path
                d="M288 960V961H289V960H288ZM287 864V960H289V864H287ZM288 959H192V961H288V959Z"
                fill="#D0D5DD"
                mask="url(#path-187-inside-93_4940_405685)"
              />
              <mask id="path-189-inside-94_4940_405685" fill="white">
                <path d="M288 864H384V960H288V864Z" />
              </mask>
              <path
                d="M384 960V961H385V960H384ZM383 864V960H385V864H383ZM384 959H288V961H384V959Z"
                fill="#D0D5DD"
                mask="url(#path-189-inside-94_4940_405685)"
              />
              <mask id="path-191-inside-95_4940_405685" fill="white">
                <path d="M384 864H480V960H384V864Z" />
              </mask>
              <path
                d="M480 960V961H481V960H480ZM479 864V960H481V864H479ZM480 959H384V961H480V959Z"
                fill="#D0D5DD"
                mask="url(#path-191-inside-95_4940_405685)"
              />
              <mask id="path-193-inside-96_4940_405685" fill="white">
                <path d="M480 864H576V960H480V864Z" />
              </mask>
              <path
                d="M576 960V961H577V960H576ZM575 864V960H577V864H575ZM576 959H480V961H576V959Z"
                fill="#D0D5DD"
                mask="url(#path-193-inside-96_4940_405685)"
              />
              <mask id="path-195-inside-97_4940_405685" fill="white">
                <path d="M576 864H672V960H576V864Z" />
              </mask>
              <path
                d="M672 960V961H673V960H672ZM671 864V960H673V864H671ZM672 959H576V961H672V959Z"
                fill="#D0D5DD"
                mask="url(#path-195-inside-97_4940_405685)"
              />
              <mask id="path-197-inside-98_4940_405685" fill="white">
                <path d="M672 864H768V960H672V864Z" />
              </mask>
              <path
                d="M768 960V961H769V960H768ZM767 864V960H769V864H767ZM768 959H672V961H768V959Z"
                fill="#D0D5DD"
                mask="url(#path-197-inside-98_4940_405685)"
              />
              <mask id="path-199-inside-99_4940_405685" fill="white">
                <path d="M768 864H864V960H768V864Z" />
              </mask>
              <path
                d="M864 960V961H865V960H864ZM863 864V960H865V864H863ZM864 959H768V961H864V959Z"
                fill="#D0D5DD"
                mask="url(#path-199-inside-99_4940_405685)"
              />
              <mask id="path-201-inside-100_4940_405685" fill="white">
                <path d="M864 864H960V960H864V864Z" />
              </mask>
              <path
                d="M960 960V961H961V960H960ZM959 864V960H961V864H959ZM960 959H864V961H960V959Z"
                fill="#D0D5DD"
                mask="url(#path-201-inside-100_4940_405685)"
              />
            </g>
            <rect x="0.5" y="0.5" width={959} height={959} stroke="#D0D5DD" />
          </g>
          <defs>
            <radialGradient
              id="paint0_radial_4940_405685"
              cx={0}
              cy={0}
              r={1}
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(480 -0.000114441) rotate(90) scale(960 501.059)"
            >
              <stop />
              <stop offset="0.953125" stopOpacity={0} />
            </radialGradient>
            <clipPath id="clip0_4940_405685">
              <rect width={960} height={960} fill="white" />
            </clipPath>
          </defs>
        </svg>

        <IdeaSection />
      </div>

      <div className="relative z-10 mt-20 md:mt-20 lg:mt-40 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 mb-5">
        <div className="group isolate flex flex-col rounded-none border border-primary/10 bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] dark:bg-neutral-900 overflow-hidden transition-all duration-300 hover:shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04),0_0_0_1px_hsl(var(--primary)/10%)] hover:scale-[1.02] md:row-span-2 xl:row-span-2 relative">
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
            className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-0"
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
            className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-auto bottom-0"
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
            className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] left-0"
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
            className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] right-0 left-auto"
          ></div>
          <ReelsCarousel />
        </div>
        <div className="group isolate flex flex-col overflow-hidden rounded-none border border-primary/10 bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] dark:bg-neutral-900 md:row-span-2 xl:row-span-2 transition-all duration-300 hover:shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04),0_0_0_1px_hsl(var(--primary)/10%)] hover:scale-[1.02] relative">
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
            className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-0"
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
            className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-auto bottom-0"
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
            className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] left-0"
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
            className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] right-0 left-auto"
          ></div>
          <div className="p-6">
            <h3 className="font-sans text-sm font-medium tracking-tight text-neutral-700 dark:text-neutral-100">
              Generate product images with AI Chat
            </h3>
            <h3 className="mt-2 max-w-xs font-sans text-sm font-normal tracking-tight text-neutral-500 dark:text-neutral-400">
              Chat with AI to create stunning product images. Describe your
              product and get professional images instantly.
            </h3>
          </div>
          <div className="">
            <div className="p-6">
              <div className="grid grid-cols-2 justify-center gap-4">
                <div className="relative">
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: "none",
                      transformOrigin: "50% 50% 0px",
                    }}
                  >
                    <div className="absolute -top-[10px] -left-[10px] h-4 w-4 rounded-tl-lg border-t-2 border-l-2 border-blue-500 bg-transparent" />
                    <div className="absolute -top-[10px] -right-[10px] h-4 w-4 rounded-tr-lg border-t-2 border-r-2 border-blue-500 bg-transparent" />
                    <div className="absolute -bottom-[10px] -left-[10px] h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-blue-500 bg-transparent" />
                    <div className="absolute -right-[10px] -bottom-[10px] h-4 w-4 rounded-br-lg border-r-2 border-b-2 border-blue-500 bg-transparent" />
                  </div>
                  <span className="absolute inset-x-0 bottom-4 m-auto h-fit w-fit rounded-md border border-neutral-100 bg-white px-2 py-1 text-xs text-black">
                    generated <span className="font-bold">2.4k</span>
                  </span>
                  <img
                    alt="product image"
                    width={100}
                    height={140}
                    className="h-[200px] w-full rounded-lg object-cover object-center"
                    src="https://cdn.shopify.com/s/files/1/2303/2711/files/2_e822dae0-14df-4cb8-b145-ea4dc0966b34.jpg?v=1617059123"
                  />
                </div>
                <div className="relative">
                  <img
                    alt="product image"
                    width={100}
                    height={140}
                    className="h-[200px] w-full rounded-lg object-cover object-center"
                    src="https://d2v5dzhdg4zhx3.cloudfront.net/storyPage/webassets/3ce2396c-8566-4096-9818-0bcf234a41fa.webp"
                  />
                </div>
                <div className="relative">
                  <img
                    alt="product image"
                    width={100}
                    height={140}
                    className="h-[200px] w-full rounded-lg object-cover object-center"
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop"
                  />
                </div>
                <div
                  className="relative"
                  style={{
                    opacity: 1,
                    filter: "grayscale(0%)",
                    transform: "scale(0.984163)",
                  }}
                >
                  <img
                    alt="product image"
                    width={100}
                    height={140}
                    className="h-[200px] w-full rounded-lg object-cover object-center"
                    src="https://easy-peasy.ai/_next/image?url=https%3A%2F%2Fmedia.easy-peasy.ai%2F27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e%2Fd4999910-07fc-4893-bf0f-40ffdf3fc649.png&w=828&q=75"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="group isolate flex flex-col overflow-hidden rounded-none border border-primary/10 bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] dark:bg-neutral-900 md:row-span-2 xl:row-span-2 transition-all duration-300 hover:shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04),0_0_0_1px_hsl(var(--primary)/10%)] hover:scale-[1.02] relative">
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
            className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-0"
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
            className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-auto bottom-0"
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
            className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] left-0"
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
            className="absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] right-0 left-auto"
          ></div>
          <div className="p-6">
            <h3 className="font-sans text-sm font-medium tracking-tight text-neutral-700 dark:text-neutral-100">
              Instant product image generation
            </h3>
            <h3 className="mt-2 max-w-xs font-sans text-sm font-normal tracking-tight text-neutral-500 dark:text-neutral-400">
              Get professional product images in seconds. Simply describe your
              product in chat and watch it come to life.
            </h3>
          </div>
          <div className="h-full max-h-[500px] overflow-hidden flex flex-col">
            {/* Chat Messages Container */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-4 bg-neutral-50/50 dark:bg-neutral-950/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {messages.map((message, index) => {
                const isVisible = index < visibleMessages;
                const isUser = message.type === "user";
                const streamedText = streamingText[index];
                const isStreaming =
                  isVisible &&
                  message.type === "ai" &&
                  streamedText !== undefined &&
                  streamedText !== message.text;
                const displayText =
                  streamedText !== undefined
                    ? streamedText
                    : isVisible
                      ? message.text
                      : "";
                const showImage =
                  message.image &&
                  isVisible &&
                  !isStreaming &&
                  streamedText === message.text;

                if (!isVisible) return null;

                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
                  >
                    {isUser ? (
                      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 shadow-sm">
                        <p className="text-sm">{message.text}</p>
                      </div>
                    ) : (
                      <div className="max-w-[80%] space-y-2">
                        <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-neutral-800 px-4 py-2.5 shadow-sm border border-neutral-200 dark:border-neutral-700">
                          <p className="text-sm text-neutral-700 dark:text-neutral-200">
                            {displayText}
                            {isStreaming && (
                              <span className="inline-block w-0.5 h-4 bg-neutral-700 dark:bg-neutral-300 ml-1 animate-pulse" />
                            )}
                          </p>
                        </div>
                        {showImage && (
                          <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white animate-in fade-in zoom-in duration-500">
                            <img
                              src={message.image}
                              alt="Product image"
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white dark:bg-neutral-800 px-4 py-3 shadow-sm border border-neutral-200 dark:border-neutral-700">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Describe your product image..."
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    disabled
                  />
                </div>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  disabled
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="h-full w-full absolute z-20"></div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
