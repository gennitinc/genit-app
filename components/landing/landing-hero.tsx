"use client";

import { SendIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Video data for Reels carousel
const reelsVideos = [
  {
    id: "1",
    videoUrl:
      "https://framerusercontent.com/assets/EsKprNy4lLQLqGnbpg4HT6afA.mp4",
    thumbnailUrl: "https://ext.same-assets.com/3322540528/489297333.jpeg",
    username: "gennit_ai",
    profilePic: "https://picsum.photos/id/1027/150/150",
    location: "Product Commercial",
    likes: 92372,
    verified: true,
  },
  {
    id: "2",
    videoUrl:
      "https://pikaso.cdnpk.net/private/production/2117418280/8cdd6e72-262b-43b0-8a12-11f61216be4c-0.mp4",
    thumbnailUrl: "https://ext.same-assets.com/3322540528/490832111.png",
    username: "brand_marketing",
    profilePic: "https://picsum.photos/id/64/150/150",
    location: "Brand Promo",
    likes: 45621,
    verified: true,
  },
  {
    id: "3",
    videoUrl:
      "https://framerusercontent.com/assets/DXWg7xZQ9FVGADXcu1YyaoKGc.mp4",
    thumbnailUrl: "https://ext.same-assets.com/3322540528/3139708538.png",
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
    text: "Create a product image for a wireless headphone",
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
    text: "Give me a phot of Meta glasses!",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop",
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
    <section className="relative py-12 md:py-16 px-2 md:px-12 lg:px-20 xl:px-24">
      <div className="mx-auto mb-8 max-w-3xl text-center px-4">
        <h2 className="font-heading mb-6 text-4xl text-balance lg:text-5xl lg:leading-14">
          Think it? <span className="font-serif italic">Generate it</span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl text-balance">
          just describe what you want and watch it come to life.
        </p>
      </div>

      <InputLandingMediaChat />
      <div className="relative z-10 mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 mb-5">
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
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
