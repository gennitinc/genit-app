"use client";

import { IdeaSection } from "../layout/idea-section";
import { MainContent } from "../layout/main-content";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { InstagramBrand, FacebookBrand, XBrand, LinkedinBrand, BrevoBrand, TikTokBrand, YoutubeBrand } from "@/app/(auth)/onboarding/_components/social-icons";

// Video data for Reels carousel
const reelsVideos = [
  {
    id: "1",
    videoUrl:
      "https://cdn.leonardo.ai/users/26ac8e01-36b5-47e7-b454-73e1f56828de/generations/f5c5461c-6f42-4518-aa35-1a4512dc1790/segments/1:1:1/motion2Fast_Korean_drama_emotional_scene_30yearold_Korean_woma_0.mp4",
    thumbnailUrl:
      "https://cdn.leonardo.ai/users/26ac8e01-36b5-47e7-b454-73e1f56828de/generations/f5c5461c-6f42-4518-aa35-1a4512dc1790/segments/1:1:1/motion2Fast_Korean_drama_emotional_scene_30yearold_Korean_woma_0.jpg?w=512",
    username: "genit_ai",
    profilePic: "https://picsum.photos/id/1027/150/150",
    location: "Product Commercial",
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
    username: "brand_marketing",
    profilePic: "https://picsum.photos/id/64/150/150",
    location: "Brand Promo",
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
    username: "product_showcase",
    profilePic: "https://picsum.photos/id/177/150/150",
    location: "Product Ad",
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
    text: "Here you go!\n\nX: \"We're thrilled to announce our latest launch! 🚀 Discover innovation like never before.\"\n\nLinkedIn: \"We are excited to unveil our newest product line, designed to bring unparalleled value to our customers.\"",
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
  }
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
  };
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
            className='h-8 w-8 rounded-full object-cover'
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
            {reelsVideos[currentIndex].platform === "instagram" && <InstagramBrand className="h-6 w-6" />}
            {reelsVideos[currentIndex].platform === "tiktok" && <TikTokBrand className="h-6 w-6" />}
            {reelsVideos[currentIndex].platform === "facebook" && <FacebookBrand className="h-6 w-6" />}
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
    <section className='relative w-screen overflow-x-hidden px-2 py-10 md:px-12 lg:px-20 lg:py-0 lg:pb-16 xl:px-24'>
      <div className='relative flex w-full flex-col items-center justify-center'>
     
        <IdeaSection />
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
              Instant product image generation
            </h3>
            <h3 className='mt-2 max-w-xs font-sans text-sm font-normal tracking-tight text-neutral-500 dark:text-neutral-400'>
              Get professional product images in seconds. Simply describe your
              product in chat and watch it come to life.
            </h3>
          </div>
          <div className='flex h-full max-h-[500px] flex-col overflow-hidden'>
            {/* Chat Messages Container */}
            <div
              ref={chatContainerRef}
              className='flex-1 space-y-4 overflow-y-auto bg-neutral-50/50 p-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:p-10 dark:bg-neutral-950/50 [&::-webkit-scrollbar]:hidden'
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
                      <div className='bg-primary text-primary-foreground max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm'>
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
                            <div className='mt-3 flex gap-2 animate-in fade-in zoom-in duration-500'>
                              {message.icons.map((icon) => (
                                <div key={icon} className='flex h-7 w-7 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-900'>
                                  {icon === "instagram" && <InstagramBrand className="h-4 w-4" />}
                                  {icon === "facebook" && <FacebookBrand className="h-4 w-4" />}
                                  {icon === "x" && <XBrand className="h-4 w-4" />}
                                  {icon === "linkedin" && <LinkedinBrand className="h-4 w-4" />}
                                  {icon === "brevo" && <BrevoBrand className="h-4 w-4" />}
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
                <button
                  className='bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg transition-opacity hover:opacity-90'
                  disabled
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={20}
                    height={20}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='m22 2-7 20-4-9-9-4Z' />
                    <path d='M22 2 11 13' />
                  </svg>
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
