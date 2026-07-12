"use client";

import { IdeaSection } from "../layout/idea-section";
import { MainContent } from "../layout/main-content";
import { BorderBeam } from "../ui/border-beam";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import {
  BrevoBrand,
  FacebookBrand,
  InstagramBrand,
  LinkedinBrand,
  TikTokBrand,
  XBrand,
  YoutubeBrand,
} from "@/app/(auth)/onboarding/_components/social-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/utils/Loading";
import { SendIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

// Video data for Reels carousel
const reelsVideos = [
  {
    id: "1",
    videoUrl:
      "https://cdn.leonardo.ai/users/26ac8e01-36b5-47e7-b454-73e1f56828de/generations/f5c5461c-6f42-4518-aa35-1a4512dc1790/segments/1:1:1/motion2Fast_Korean_drama_emotional_scene_30yearold_Korean_woma_0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/26ac8e01-36b5-47e7-b454-73e1f56828de/generations/f5c5461c-6f42-4518-aa35-1a4512dc1790/segments/1:1:1/motion2Fast_Korean_drama_emotional_scene_30yearold_Korean_woma_0.jpg?w=512",
    username: "Kavero",
    profilePic: "/brandlogo1.png",
    location: "Instagram Ad",
    likes: 92372,
    verified: true,
    platform: "instagram",
  },
  {
    id: "2",
    videoUrl:
      "https://cdn.leonardo.ai/users/578e674e-459e-4190-a8d2-1aed4b909bc8/generations/d3ff7032-d672-4ffc-82ac-3760ceb07a7a/segments/1:1:1/motion2Fast_A_lone_human_figure_in_a_space_suit_standing_still_0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/578e674e-459e-4190-a8d2-1aed4b909bc8/generations/d3ff7032-d672-4ffc-82ac-3760ceb07a7a/segments/1:1:1/motion2Fast_A_lone_human_figure_in_a_space_suit_standing_still_0.jpg?w=512",
    username: "Kavero",
    profilePic: "/brandlogo1.png",
    location: "Tiktok Ad",
    likes: 45621,
    verified: true,
    platform: "tiktok",
  },
  {
    id: "3",
    videoUrl:
      "https://cdn.leonardo.ai/users/8ff3af02-0eb3-442b-af5f-6266be661fef/generations/1f0e41aa-b754-6f80-9119-11f0c6259841/veo-3.1-fast-generate-preview_A_confident_Black_woman_with_sleek_bob-length_hair_flawless_glowing_skin_soft_gl-0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/8ff3af02-0eb3-442b-af5f-6266be661fef/generations/1f0e41aa-b754-6f80-9119-11f0c6259841/veo-3.1-fast-generate-preview_A_confident_Black_woman_with_sleek_bob-length_hair_flawless_glowing_skin_soft_gl-0.jpg?w=512",
    username: "Kavero",
    profilePic: "/brandlogo1.png",
    location: "Facebook Ad",
    likes: 78234,
    verified: true,
    platform: "facebook",
  },
];

const messages = [
  {
    type: "user",
    text: "Generate a brand-tailored promotional visual for our upcoming product launch.",
  },
  {
    type: "ai",
    text: "Here's your promotional visual, perfectly aligned with your brand identity and color palette!",
    image: "./branding1.png",
  },
  {
    type: "user",
    text: "Looks amazing! Resize it for an Instagram story and schedule it to publish tomorrow.",
  },
  {
    type: "ai",
    text: "Done! The visual is resized for Instagram Stories and scheduled to post tomorrow at 10:00 AM via your connected account.",
    icons: ["instagram"],
  },
  {
    type: "user",
    text: "Awesome. Let's also set up a Facebook ad campaign using this visual with a $50 daily budget.",
  },
  {
    type: "ai",
    text: "Campaign created! Your Facebook ad is now configured with the visual, optimized for maximum conversions, and running at $50/day.",
    icons: ["facebook"],
  },
  {
    type: "user",
    text: "Perfect. Now generate engaging captions for X and LinkedIn.",
  },
  {
    type: "ai",
    text: 'Here you go!\n\nX: "We\'re thrilled to announce our latest launch! 🚀 Discover innovation like never before."\n\nLinkedIn: "We are excited to unveil our newest product line, designed to bring unparalleled value to our customers."',
  },
  {
    type: "user",
    text: "Publish both of those posts right now.",
  },
  {
    type: "ai",
    text: "Published! The posts are now live on your connected X and LinkedIn integrations.",
    icons: ["x", "linkedin"],
  },
  {
    type: "user",
    text: "Great! Let's wrap up by sending an announcement email to our subscribers via Brevo.",
  },
  {
    type: "ai",
    text: "I've drafted a stunning newsletter template in Brevo featuring the new visual. The campaign is queued and ready to send to your mailing list!",
    icons: ["brevo"],
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div className='flex h-fit flex-col items-center justify-center px-4'>
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
    <div className='flex h-full flex-col items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-900'>
      <h3 className='mb-6 font-sans text-sm font-medium tracking-tight text-neutral-700 dark:text-neutral-100'>
        Run targeted ads to Meta, Google, and TikTok via chat
      </h3>
      <div className='w-full max-w-md overflow-hidden rounded-sm border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'>
        {/* Header */}

        <div className='flex items-center border-b border-neutral-200 px-4 py-3 dark:border-neutral-700'>
          <Image
            className='h-8 w-8 rounded-full bg-black object-cover dark:bg-white'
            src={reelsVideos[currentIndex].profilePic}
            alt={reelsVideos[currentIndex].username}
            width={32}
            height={32}
          />
          <div className='ml-3 flex-1'>
            <div className='flex items-center gap-1.5'>
              <span className='text-foreground block text-sm leading-tight font-semibold antialiased'>
                {reelsVideos[currentIndex].username}
              </span>
              {reelsVideos[currentIndex].verified && (
                <Image
                  src='https://ext.same-assets.com/3322540528/871220803.png'
                  alt='Verified'
                  width={14}
                  height={14}
                  className='flex-shrink-0'
                />
              )}
            </div>
            <span className='text-muted-foreground block text-xs'>
              {reelsVideos[currentIndex].location}
            </span>
          </div>
          <div className='ml-auto flex items-center justify-center'>
            {reelsVideos[currentIndex].platform === "instagram" && (
              <InstagramBrand className='h-6 w-6' />
            )}
            {reelsVideos[currentIndex].platform === "tiktok" && (
              <TikTokBrand className='h-6 w-6' />
            )}
            {reelsVideos[currentIndex].platform === "facebook" && (
              <FacebookBrand className='h-6 w-6' />
            )}
          </div>
        </div>

        {/* Video Carousel */}
        <div ref={containerRef} className='relative overflow-hidden'>
          <div
            ref={carouselRef}
            className='flex snap-x snap-mandatory overflow-x-auto scroll-smooth'
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
                className='reels-carousel relative min-w-full snap-center'
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={video.videoUrl}
                  className='aspect-[9/10] w-full object-cover'
                  muted
                  playsInline
                  loop
                  preload='auto'
                  autoPlay
                />
                {/* Dot indicators */}
                <div className='absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-1.5'>
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
        <div className='mx-4 mt-3 mb-2 flex items-center justify-between'>
          <div className='flex gap-5'>
            <svg
              fill='currentColor'
              height={24}
              viewBox='0 0 48 48'
              width={24}
              className='text-foreground'
            >
              <path d='M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z' />
            </svg>
            <svg
              fill='currentColor'
              height={24}
              viewBox='0 0 48 48'
              width={24}
              className='text-foreground'
            >
              <path
                clipRule='evenodd'
                d='M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z'
                fillRule='evenodd'
              />
            </svg>
            <svg
              fill='currentColor'
              height={24}
              viewBox='0 0 48 48'
              width={24}
              className='text-foreground'
            >
              <path d='M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z' />
            </svg>
          </div>
          <div className='flex'>
            <svg
              fill='currentColor'
              height={24}
              viewBox='0 0 48 48'
              width={24}
              className='text-foreground'
            >
              <path d='M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z' />
            </svg>
          </div>
        </div>
        <div className='text-foreground mx-4 mt-2 mb-4 text-sm font-semibold'>
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
    <section className='relative w-full overflow-x-hidden px-2 py-10 md:px-12 lg:px-20 lg:py-0 lg:pb-16 xl:px-24'>
      <div className='relative flex w-full flex-col items-center justify-center'>
        {/* <IdeaSection /> */}
        <div className='mt-14 mb-40 grid grid-cols-1 items-center gap-16 lg:grid-cols-2 w-full'>
          {/* Left: Content */}
          <div className='max-w-2xl w-full'>
            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-300'>
              <span className='inline-flex h-1.5 w-1.5 rounded-full bg-lime-300' />
              Marketing that never sleeps.
            </div>
            <h1 className='font-bricolage text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl'>
              Marketing Team <br />
              <span className='font-bricolage font-medium tracking-tight text-neutral-300'>
                Than Never Sleeps
              </span>
            </h1>
            <p className='mt-5 max-w-xl text-neutral-400'>
              Autonomous AI Agents that works 24/7, so you don't have to.
            </p>
            {/* Tags / mini metrics */}
            {/* <div className='mt-7 flex flex-wrap gap-3'>
              <div className='rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-neutral-200'>
                <span className='text-neutral-400'>Level:</span>
                Moderate
              </div>
              <div className='rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-neutral-200'>
                <span className='text-neutral-400'>Duration:</span>
                6.5 h
              </div>
              <div className='rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-neutral-200'>
                <span className='text-neutral-400'>Distance:</span>
                14.2 km
              </div>
              <div className='rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-neutral-200'>
                <span className='text-neutral-400'>Group:</span>8 people
              </div>
            </div> */}
            {/* CTAs */}
            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <a
                href='#'
                className='group inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3 font-medium text-neutral-950 transition hover:brightness-95 active:translate-y-[1px]'
              >
                Get started
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width={24}
                  height={24}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='h-4 w-4 -translate-x-0.5 transition group-hover:translate-x-0.5'
                >
                  <path d='M5 12h14' className='' />
                  <path d='m12 5 7 7-7 7' className='' />
                </svg>
              </a>
              <a
                href='#'
                className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white/90 transition hover:bg-white/[0.08] active:translate-y-[1px]'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width={24}
                  height={24}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='h-4 w-4 text-white/80'
                >
                  <path
                    d='M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z'
                    className=''
                  />
                  <path d='M15 5.764v15' className='' />
                  <path d='M9 3.236v15' className='' />
                </svg>
                Watch Demo
              </a>
            </div>
            {/* Avatars / social proof */}
            <div className='mt-7 flex items-center gap-4'>
              <div className='flex -space-x-2'>
                <img
                  src='https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/cb364025-2387-4977-a5e2-b5466b778b1d_320w.webp'
                  alt=''
                  className='h-8 w-8 rounded-full object-cover ring-2 ring-neutral-950'
                />
                <img
                  src='https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/71ad0e95-131b-49d0-b467-355dc7813bbb_320w.webp'
                  alt=''
                  className='h-8 w-8 rounded-full object-cover ring-2 ring-neutral-950'
                />
                <img
                  src='https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/60f2ed7a-4b74-4fdb-8c2c-66ab7dca6cde_320w.webp'
                  alt=''
                  className='h-8 w-8 rounded-full object-cover ring-2 ring-neutral-950'
                />
                <div className='flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[11px] text-neutral-300 ring-2 ring-neutral-950'>
                  +12
                </div>
              </div>
              <p className='text-sm text-neutral-400'>
                Trusted by 2,400+ hikers worldwide
              </p>
            </div>
          </div>
          {/* Right: Showcase phones */}
          <div className='relative mx-auto w-full max-w-xl lg:ml-auto'>
            {/* Floating group container for subtle parallax */}
            <div id='phones' className='relative h-[560px] sm:h-[600px]'>
              {/* Phone 1: Upcoming trail card */}
              <div className='absolute top-10 left-2 rotate-[-8deg] sm:top-6 sm:left-0'>
                <div
                  className='relative h-[620px] w-64 overflow-hidden rounded-[2.2rem] bg-neutral-900 shadow-2xl ring-1 shadow-black/40 ring-white/10 sm:w-72'
                  style={{ transform: "translate3d(0px, 0px, 0px)" }}
                >
                  {/* notch */}
                  <div className='absolute top-3 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full bg-black/70' />
                  <div className='flex items-center justify-between p-5'>
                    <button className='inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width={24}
                        height={24}
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path d='m15 18-6-6 6-6' className='' />
                      </svg>
                    </button>
                    <button className='inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width={24}
                        height={24}
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path
                          d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'
                          className=''
                        />
                      </svg>
                    </button>
                  </div>
                  <div className='px-5'>
                    <h3 className='font-bricolage text-2xl font-medium tracking-tight'>
                      Yosemite Trails
                    </h3>
                    <p className='mt-1 text-sm text-white/60'>
                      Discover 24 trails
                    </p>
                  </div>
                  <div className='mt-4 pr-5 pl-5'>
                    <div className='relative overflow-hidden rounded-3xl'>
                      <img
                        src='https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/c934d23e-214b-4c92-9df8-881eb8f280c2_800w.webp'
                        alt=''
                        className='h-72 w-full object-cover'
                      />
                      <div className='absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 via-black/10 to-black/0 pt-4 pb-4'></div>
                      <div className='absolute top-3 right-3'>
                        <div className='rounded-full border border-lime-300/30 bg-lime-300/20 px-2.5 py-1 text-xs font-medium text-lime-300 backdrop-blur'>
                          Moderate
                        </div>
                      </div>
                      <div className='absolute right-3 bottom-3 left-3'>
                        <div className='flex items-end justify-between'>
                          <div className=''>
                            <p className='font-medium text-white/90'>
                              Vernal Fall
                            </p>
                            <p className='text-xs text-white/70'>
                              Yosemite Valley • CA
                            </p>
                          </div>
                          <button className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-neutral-950 shadow'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={24}
                              height={24}
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              className='h-4 w-4'
                            >
                              <path d='M5 12h14' className='' />
                              <path d='m12 5 7 7-7 7' className='' />
                            </svg>
                          </button>
                        </div>
                        <div className='mt-3 grid grid-cols-2 gap-2'>
                          <div className='rounded-2xl bg-white/15 px-3 py-2 text-white/90 backdrop-blur'>
                            <p className='text-[11px] text-white/70'>
                              Elevation
                            </p>
                            <p className='text-sm'>+400m</p>
                          </div>
                          <div className='rounded-2xl bg-white/15 px-3 py-2 text-white/90 backdrop-blur'>
                            <p className='text-[11px] text-white/70'>
                              Duration
                            </p>
                            <p className='text-sm'>6.5 h</p>
                          </div>
                          <div className='rounded-2xl bg-white/15 px-3 py-2 text-white/90 backdrop-blur'>
                            <p className='text-[11px] text-white/70'>
                              Distance
                            </p>
                            <p className='text-sm'>14.2 km</p>
                          </div>
                          <div className='rounded-2xl bg-white/15 px-3 py-2 text-white/90 backdrop-blur'>
                            <p className='text-[11px] text-white/70'>Hikers</p>
                            <p className='text-sm'>8</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-4 px-5'>
                    <div className='flex items-center gap-2 text-xs text-white/60'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width={24}
                        height={24}
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-3.5 w-3.5'
                      >
                        <path d='M8 2v4' className='' />
                        <path d='M16 2v4' className='' />
                        <rect
                          width={18}
                          height={18}
                          x={3}
                          y={4}
                          rx={2}
                          className=''
                        />
                        <path d='M3 10h18' className='' />
                      </svg>
                      <span>Next hike: Tomorrow 8:00 AM</span>
                    </div>
                  </div>
                  <div className='absolute right-0 bottom-4 left-0 flex justify-center'>
                    <div className='h-1 w-16 rounded-full bg-white/10' />
                  </div>
                </div>
              </div>
              {/* Phone 2: Map route */}
              <div className='absolute top-0 left-1/2 -translate-x-1/2 sm:left-1/2 sm:-translate-x-1/2'>
                <div
                  className='relative h-[620px] w-64 overflow-hidden rounded-[2.2rem] bg-neutral-900 shadow-2xl ring-1 shadow-black/50 ring-white/10 sm:w-72'
                  style={{ transform: "translate3d(0px, 0px, 0px)" }}
                >
                  <div className='absolute top-3 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full bg-black/70' />
                  <div className='flex items-center justify-between px-5 pt-4'>
                    <button className='inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width={24}
                        height={24}
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4 text-white/80'
                      >
                        <path d='m15 18-6-6 6-6' className='' />
                      </svg>
                    </button>
                    <div className='flex -space-x-2'>
                      <img
                        src='https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/2a8d2822-6b15-416c-b2a1-331d656c363c_320w.webp'
                        alt=''
                        className='h-7 w-7 rounded-full object-cover ring-2 ring-neutral-900'
                      />
                      <img
                        src='https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/204d39d4-2b62-4998-80bc-4e908c217f17_320w.jpg'
                        alt=''
                        className='h-7 w-7 rounded-full object-cover ring-2 ring-neutral-900'
                      />
                      <img
                        src='https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/7895a3d2-423d-4e12-8ee1-63b70b944bfc_320w.webp'
                        alt=''
                        className='h-7 w-7 rounded-full object-cover ring-2 ring-neutral-900'
                      />
                      <div className='flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[10px] text-neutral-300 ring-2 ring-neutral-900'>
                        +5
                      </div>
                    </div>
                  </div>
                  <div className='mt-3 px-5'>
                    <h3 className='font-bricolage text-2xl font-medium tracking-tight'>
                      Vernal Fall
                    </h3>
                    <p className='mt-0.5 text-sm text-white/60'>
                      Starting in 2h 15m
                    </p>
                  </div>
                  <div className='relative mx-4 mt-3 h-[240px] overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 to-black ring-1 ring-white/10'>
                    {/* Stylized topo lines */}
                    <svg
                      viewBox='0 0 400 300'
                      className='absolute inset-0 h-full w-full text-neutral-700/40'
                    >
                      <defs className=''>
                        <pattern
                          id='grid'
                          width={40}
                          height={40}
                          patternUnits='userSpaceOnUse'
                          className=''
                        >
                          <path
                            d='M 40 0 L 0 0 0 40'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='0.6'
                            className=''
                          />
                        </pattern>
                      </defs>
                      <rect
                        width='100%'
                        height='100%'
                        fill='url(#grid)'
                        className=''
                      />
                      {/* route */}
                      <path
                        d='M30,250 C80,180 120,220 160,180 C200,140 260,160 300,120 C330,95 360,110 370,90'
                        fill='none'
                        stroke='#d9ff3f'
                        strokeWidth={4}
                        strokeLinecap='round'
                        className=''
                      />
                      {/* start marker */}
                      <circle
                        cx={30}
                        cy={250}
                        r={8}
                        fill='#d9ff3f'
                        className=''
                      />
                      {/* end marker */}
                      <circle
                        cx={370}
                        cy={90}
                        r={8}
                        fill='#fef08a'
                        className=''
                      />
                    </svg>
                    <div className='absolute top-3 right-3 left-3 flex items-center justify-between'>
                      <div className='rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-white/80 backdrop-blur'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width={24}
                          height={24}
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='mr-1 inline h-3 w-3'
                        >
                          <path
                            d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0'
                            className=''
                          />
                          <circle cx={12} cy={10} r={3} className='' />
                        </svg>
                        Start: El Capitan
                      </div>
                      <div className='rounded-full border border-lime-300/30 bg-lime-300/20 px-2.5 py-1 text-xs font-medium text-lime-300 backdrop-blur'>
                        14.2 km
                      </div>
                    </div>
                    <div className='absolute right-3 bottom-3 left-3 flex items-center justify-between'>
                      <div className='rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur'>
                        Offline maps ready
                      </div>
                      <div className='flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width={24}
                          height={24}
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='h-3 w-3 text-lime-300'
                        >
                          <path
                            d='M22 11.08V12a10 10 0 1 1-5.93-9.14'
                            className=''
                          />
                          <path d='m9 11 3 3L22 4' className='' />
                        </svg>
                        <span className='text-xs text-white/70'>GPS</span>
                      </div>
                    </div>
                  </div>
                  <div className='mt-4 px-4'>
                    <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-4'>
                      <div className='mb-3 flex items-center justify-between'>
                        <div className='text-xs text-white/60'>Trail stats</div>
                        <div className='text-xs text-lime-300'>Moderate</div>
                      </div>
                      <div className='grid grid-cols-3 gap-3'>
                        <div className=''>
                          <div className='font-bricolage text-xl font-medium tracking-tight'>
                            +400m
                          </div>
                          <div className='text-[11px] text-white/60'>
                            Elevation
                          </div>
                        </div>
                        <div>
                          <div className='font-bricolage text-xl font-medium tracking-tight'>
                            6.5h
                          </div>
                          <div className='text-[11px] text-white/60'>
                            Duration
                          </div>
                        </div>
                        <div>
                          <div className='font-bricolage text-xl font-medium tracking-tight'>
                            3.2
                          </div>
                          <div className='text-[11px] text-white/60'>
                            Difficulty
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-3 px-4'>
                    <button className='flex w-full items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-sm font-medium text-neutral-950'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width={24}
                        height={24}
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path
                          d='M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z'
                          className=''
                        />
                      </svg>
                      Start hike
                    </button>
                  </div>
                </div>
              </div>
              {/* Phone 3: Live hike */}
              <div className='absolute top-14 right-1 rotate-[8deg] sm:top-10 sm:right-0'>
                <div
                  className='relative h-[620px] w-64 overflow-hidden rounded-[2.2rem] bg-neutral-900 shadow-2xl ring-1 shadow-black/40 ring-white/10 sm:w-72'
                  style={{ transform: "translate3d(0px, 0px, 0px)" }}
                >
                  <div className='absolute top-3 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full bg-black/70' />
                  <div className='relative h-56'>
                    <img
                      src='https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/cc58d81e-28c7-4497-8773-59291a867e64_800w.webp'
                      alt=''
                      className='absolute top-0 right-0 bottom-0 left-0 h-full w-full object-cover'
                    />
                    <div className='absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-b from-black/30 via-transparent to-black/40'></div>
                    {/* Status indicators */}
                    <div className='absolute top-3 left-3 flex gap-2'>
                      <div className='flex items-center gap-1.5 rounded-full border border-red-400/50 bg-red-500/90 px-2.5 py-1 backdrop-blur'>
                        <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-white' />
                        <span className='text-xs font-medium text-white'>
                          Live
                        </span>
                      </div>
                    </div>
                    <div className='absolute top-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-white/15 px-2.5 py-1 backdrop-blur'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width={24}
                        height={24}
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-3.5 w-3.5 text-lime-300'
                      >
                        <path
                          d='M22 11.08V12a10 10 0 1 1-5.93-9.14'
                          className=''
                        />
                        <path d='m9 11 3 3L22 4' className='' />
                      </svg>
                      <span className='text-xs'>87%</span>
                    </div>
                    <div className='absolute right-3 bottom-3 left-3'>
                      <div className='flex items-center gap-2 text-white/90'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width={24}
                          height={24}
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='h-4 w-4'
                        >
                          <path
                            d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0'
                            className=''
                          />
                          <circle cx={12} cy={10} r={3} className='' />
                        </svg>
                        <span className='text-sm'>Vernal Fall Trail</span>
                      </div>
                    </div>
                  </div>
                  {/* speed card */}
                  <div className='relative px-4'>
                    <div className='relative -mt-8 rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur'>
                      <div className='mx-auto h-1.5 w-14 rounded-full bg-gradient-to-r from-lime-300 to-yellow-200' />
                      <div className='mt-2 flex items-end justify-between'>
                        <div className='font-bricolage text-5xl font-medium tracking-tight'>
                          4.2
                        </div>
                        <div className='text-sm text-white/70'>km/h</div>
                      </div>
                      <div className='mt-1 text-xs text-white/50'>
                        Current pace
                      </div>
                      <div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                        <div className='rounded-xl border border-white/10 bg-white/5 px-3 py-2'>
                          <p className='text-[11px] text-white/60'>Time</p>
                          <p className='text-white/90'>2:47</p>
                        </div>
                        <div className='rounded-xl border border-white/10 bg-white/5 px-3 py-2'>
                          <p className='text-[11px] text-white/60'>Distance</p>
                          <p className='text-white/90'>8.3 km</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-4 px-4'>
                    <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-3'>
                      <div className='flex items-center gap-3'>
                        <div className='flex-1'>
                          <div className='mb-1 flex items-center justify-between'>
                            <span className='text-xs text-white/60'>
                              Progress
                            </span>
                            <span className='text-xs text-lime-300'>58%</span>
                          </div>
                          <div className='h-1.5 rounded-full bg-white/10'>
                            <div className='h-1.5 w-[58%] rounded-full bg-gradient-to-r from-lime-300 to-yellow-200' />
                          </div>
                        </div>
                      </div>
                      <div className='mt-3 flex items-center justify-between text-xs'>
                        <div className='flex items-center gap-1.5 text-white/70'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={24}
                            height={24}
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='h-3.5 w-3.5'
                          >
                            <path d='m3 16 4 4 4-4' className='' />
                            <path d='M7 20V4' className='' />
                            <path d='m21 8-4-4-4 4' className='' />
                            <path d='M17 4v16' className='' />
                          </svg>
                          <span className=''>Elevation: +232m</span>
                        </div>
                        <div className='text-white/90'>5.9 km left</div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-3 px-4'>
                    <div className='flex gap-2'>
                      <button className='flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/10'>
                        Pause
                      </button>
                      <button className='flex-1 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/20'>
                        End hike
                      </button>
                    </div>
                  </div>
                  <div className='absolute right-0 bottom-4 left-0 flex justify-center'>
                    <div className='h-1 w-16 rounded-full bg-white/10' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end phones */}
        </div>
      </div>

      <div className='relative z-10 mt-10 mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8'>
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
          <ReelsCarousel />
        </div>
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
          <div className='p-6'>
            <h3 className='font-sans text-sm font-medium tracking-tight text-neutral-700 dark:text-neutral-100'>
              Generate brand tailored visuals
            </h3>
            <h3 className='mt-2 max-w-xs font-sans text-sm font-normal tracking-tight text-neutral-500 dark:text-neutral-400'>
              Chat with AI to create stunning visuals that match your brand.
              Describe your vision and get professional images instantly.
            </h3>
          </div>
          <div className=''>
            <div className='p-6'>
              <div className='grid grid-cols-2 justify-center gap-4'>
                <div className='relative'>
                  <div
                    className='absolute inset-0'
                    style={{
                      transform: "none",
                      transformOrigin: "50% 50% 0px",
                    }}
                  >
                    <div className='absolute -top-[10px] -left-[10px] h-4 w-4 rounded-tl-lg border-t-2 border-l-2 border-blue-500 bg-transparent' />
                    <div className='absolute -top-[10px] -right-[10px] h-4 w-4 rounded-tr-lg border-t-2 border-r-2 border-blue-500 bg-transparent' />
                    <div className='absolute -bottom-[10px] -left-[10px] h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-blue-500 bg-transparent' />
                    <div className='absolute -right-[10px] -bottom-[10px] h-4 w-4 rounded-br-lg border-r-2 border-b-2 border-blue-500 bg-transparent' />
                  </div>
                  {/* <span className='absolute inset-x-0 bottom-4 m-auto h-fit w-fit rounded-md border border-neutral-100 bg-white px-2 py-1 text-xs text-black'>
                    generated <span className='font-bold'>2.4k</span>
                  </span> */}
                  <img
                    alt='product image'
                    width={100}
                    height={140}
                    className='h-[200px] w-full rounded-lg object-cover object-center'
                    src='./brandinglogo.png'
                  />
                </div>
                <div className='relative'>
                  <img
                    alt='product image'
                    width={100}
                    height={140}
                    className='h-[200px] w-full rounded-lg object-cover object-center'
                    src='./branding1.png'
                  />
                </div>
                <div className='relative'>
                  <img
                    alt='product image'
                    width={100}
                    height={140}
                    className='h-[200px] w-full rounded-lg object-cover object-center'
                    src='./branding2.png'
                  />
                </div>
                <div
                  className='relative'
                  style={{
                    opacity: 1,
                    filter: "grayscale(0%)",
                    transform: "scale(0.984163)",
                  }}
                >
                  <img
                    alt='product image'
                    width={100}
                    height={140}
                    className='h-[200px] w-full rounded-lg object-cover object-center'
                    src='./branding3.png'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <div className='p-6'>
            <h3 className='font-sans text-sm font-medium tracking-tight text-neutral-700 dark:text-neutral-100'>
              Autonomous marketing agents in your chat
            </h3>
            <h3 className='mt-2 max-w-xs font-sans text-sm font-normal tracking-tight text-neutral-500 dark:text-neutral-400'>
              Unleash your brand&apos;s full potential with AI agents without
              lifting a finger.
            </h3>
          </div>
          <div className='flex h-full max-h-[500px] flex-col overflow-hidden'>
            {/* Chat Messages Container */}
            <div
              ref={chatContainerRef}
              className='flex-1 [scrollbar-width:none] space-y-4 overflow-y-auto bg-neutral-50/50 p-4 [-ms-overflow-style:none] lg:p-10 dark:bg-neutral-950/50 [&::-webkit-scrollbar]:hidden'
            >
              {visibleMessages === 0 && (
                <div className='flex h-full items-center justify-center text-neutral-400'>
                  <Loading size={32} />
                </div>
              )}
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
                      <div className='bg-foreground/80 text-primary-foreground max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm'>
                        <p className='text-sm'>{message.text}</p>
                      </div>
                    ) : (
                      <div className='max-w-[80%] space-y-2'>
                        <div className='rounded-2xl rounded-tl-sm border border-neutral-200 bg-white px-4 py-2.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
                          <p className='text-sm text-neutral-700 dark:text-neutral-200'>
                            {displayText}
                            {isStreaming && (
                              <span className='ml-1 inline-block h-4 w-0.5 animate-pulse bg-neutral-700 dark:bg-neutral-300' />
                            )}
                          </p>
                          {!isStreaming && message.icons && (
                            <div className='animate-in fade-in zoom-in mt-3 flex gap-2 duration-500'>
                              {message.icons.map((icon) => (
                                <div
                                  key={icon}
                                  className='flex h-7 w-7 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900'
                                >
                                  {icon === "instagram" && (
                                    <InstagramBrand className='h-4 w-4' />
                                  )}
                                  {icon === "facebook" && (
                                    <FacebookBrand className='h-4 w-4' />
                                  )}
                                  {icon === "x" && (
                                    <XBrand className='h-4 w-4' />
                                  )}
                                  {icon === "linkedin" && (
                                    <LinkedinBrand className='h-4 w-4' />
                                  )}
                                  {icon === "brevo" && (
                                    <BrevoBrand className='h-4 w-4' />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {showImage && (
                          <div className='animate-in fade-in zoom-in overflow-hidden rounded-lg border border-neutral-200 bg-white duration-500 dark:border-neutral-700'>
                            <img
                              src={message.image}
                              alt='Product image'
                              className='h-auto w-full object-cover'
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
                <div className='animate-in fade-in flex justify-start duration-300'>
                  <div className='max-w-[80%] rounded-2xl rounded-tl-sm border border-neutral-200 bg-white px-4 py-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
                    <div className='flex gap-1'>
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500'
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500'
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500'
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className='border-t border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900'>
              <div className='flex items-center gap-2'>
                <div className='relative flex-1'>
                  <input
                    type='text'
                    placeholder='Describe your product image...'
                    className='focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:ring-2 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800'
                    disabled
                  />
                </div>
                <button className='relative cursor-pointer rounded-[10px] bg-[linear-gradient(to_top,#292929,#555555,#292929)] p-[2px] shadow-[inset_0_6px_2px_-4px_rgba(255,255,255,.5)] transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'>
                  {/* Border effects behind content */}
                  <div className='absolute inset-0 overflow-hidden rounded-[10px]'>
                    <BorderBeam
                      duration={6}
                      size={40}
                      className='from-transparent via-red-500 to-transparent'
                    />
                    <BorderBeam
                      duration={6}
                      delay={10}
                      size={40}
                      borderWidth={2}
                      className='from-transparent via-blue-500 to-transparent'
                    />
                  </div>

                  {/* Button content */}
                  <div className='relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-black/10 backdrop-blur-[3px] transition-all duration-300 hover:drop-shadow-[0_0_5px_white]'>
                    <svg
                      className='h-4 w-4 text-white'
                      viewBox='0 0 512 512'
                      fill='currentColor'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05' />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className='absolute z-20 h-full w-full bg-transparent'></div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
