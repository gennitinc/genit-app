"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface TestimonialContent {
  title: string;
  description: string;
  rating?: number;
  reviewCount?: string;
  avatars?: string[];
}

interface MediaItem {
  type: "image" | "video";
  showControls: boolean;
  src: string;
  alt?: string;
  poster?: string; // For video thumbnails
  testimonial: TestimonialContent; // Each media item has its own testimonial
}

interface AuthMediaCarouselProps {
  media: MediaItem[];
  autoPlayInterval?: number; // in milliseconds
  showControls?: boolean;
}

export const AuthMediaCarousel: React.FC<AuthMediaCarouselProps> = ({
  media,
  autoPlayInterval = 5000,
  showControls = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentMedia = media[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [media.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && media.length > 1) {
      // Don't auto-advance if current media is a video that's playing
      if (currentMedia.type === "video" && isVideoPlaying) {
        return;
      }

      intervalRef.current = setInterval(goToNext, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isPlaying,
    goToNext,
    autoPlayInterval,
    media.length,
    currentMedia.type,
    isVideoPlaying,
  ]);

  // Handle video playback
  useEffect(() => {
    if (currentMedia.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked
        setIsVideoPlaying(false);
      });
      setIsVideoPlaying(true);
    }
  }, [currentIndex, currentMedia.type]);

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    if (isPlaying && media.length > 1) {
      goToNext();
    }
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        width={20}
        height={20}
        viewBox='0 0 20 20'
        fill='none'
        className={`size-5 ${i < rating ? "text-orange-400" : "text-gray-400"}`}
      >
        <path
          d='M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z'
          className='fill-bg-tertiary'
        />
        <g clipPath={`url(#clip-star-${i})`}>
          <path
            d='M9.53834 1.60996C9.70914 1.19932 10.2909 1.19932 10.4617 1.60996L12.5278 6.57744C12.5998 6.75056 12.7626 6.86885 12.9495 6.88383L18.3123 7.31376C18.7556 7.3493 18.9354 7.90256 18.5976 8.19189L14.5117 11.6919C14.3693 11.8139 14.3071 12.0053 14.3506 12.1876L15.5989 17.4208C15.7021 17.8534 15.2315 18.1954 14.8519 17.9635L10.2606 15.1592C10.1006 15.0615 9.89938 15.0615 9.73937 15.1592L5.14806 17.9635C4.76851 18.1954 4.29788 17.8534 4.40108 17.4208L5.64939 12.1876C5.69289 12.0053 5.6307 11.8139 5.48831 11.6919L1.40241 8.19189C1.06464 7.90256 1.24441 7.3493 1.68773 7.31376L7.05054 6.88383C7.23744 6.86885 7.40024 6.75056 7.47225 6.57744L9.53834 1.60996Z'
            fill='currentColor'
          />
        </g>
        <defs>
          <clipPath id={`clip-star-${i}`}>
            <rect width={i < rating ? "100%" : "0%"} height={20} fill='white' />
          </clipPath>
        </defs>
      </svg>
    ));
  };

  return (
    <div className='relative hidden h-screen w-full items-end justify-center overflow-hidden lg:flex'>
      {/* Media Content */}
      <div className='absolute inset-0'>
        {currentMedia.type === "image" ? (
          <img
            src={currentMedia.src}
            className='absolute inset-0 size-full object-cover transition-opacity duration-500'
            alt={currentMedia.alt || "Carousel image"}
          />
        ) : (
          <video
            ref={videoRef}
            src={currentMedia.src}
            poster={currentMedia.poster}
            className='absolute inset-0 size-full object-cover'
            muted={isMuted}
            playsInline
            onEnded={handleVideoEnded}
            loop={media.length === 1}
          />
        )}
      </div>

      {/* Grid Overlay SVG */}
      <svg
        width={960}
        height={960}
        viewBox='0 0 960 960'
        fill='none'
        className='pointer-events-none absolute top-0 opacity-40'
      >
        <mask
          id='mask0_carousel'
          style={{ maskType: "alpha" }}
          maskUnits='userSpaceOnUse'
          x={0}
          y={0}
          width={960}
          height={960}
        >
          <rect width={960} height={960} fill='url(#paint0_radial_carousel)' />
        </mask>
        <g mask='url(#mask0_carousel)'>
          <rect x='0.5' y='0.5' width={959} height={959} stroke='#D0D5DD' />
        </g>
        <defs>
          <radialGradient
            id='paint0_radial_carousel'
            cx={0}
            cy={0}
            r={1}
            gradientUnits='userSpaceOnUse'
            gradientTransform='translate(480 -0.000114441) rotate(90) scale(960 501.059)'
          >
            <stop />
            <stop offset='0.953125' stopOpacity={0} />
          </radialGradient>
        </defs>
      </svg>

      {/* Video Controls */}
      {currentMedia.type === "video" && currentMedia.showControls === true && (
        <div className='absolute top-4 right-4 z-20 flex gap-2'>
          <button
            onClick={toggleVideoPlayback}
            className='rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70'
            aria-label={isVideoPlaying ? "Pause video" : "Play video"}
          >
            {isVideoPlaying ? (
              <Pause className='h-5 w-5' />
            ) : (
              <Play className='h-5 w-5' />
            )}
          </button>
          <button
            onClick={toggleMute}
            className='rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70'
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className='h-5 w-5' />
            ) : (
              <Volume2 className='h-5 w-5' />
            )}
          </button>
        </div>
      )}

      {/* Navigation Arrows */}
      {/* {media.length > 1 && showControls && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )} */}

      {/* Testimonial Content */}
      <div className='z-10 flex w-full flex-col items-start justify-start gap-8 bg-gradient-to-t from-black/60 to-black/0 px-16 py-24'>
        {/* Logo/Icon */}
        <svg width={80} height={80} viewBox='0 0 80 80' fill='none'>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0 40C25.4247 40 40 25.4247 40 0C40 25.4247 54.5753 40 80 40C54.5753 40 40 54.5753 40 80C40 54.5753 25.4247 40 0 40Z'
            className='fill-white'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0 12C7.62742 12 12 7.62742 12 0C12 7.62742 16.3726 12 24 12C16.3726 12 12 16.3726 12 24C12 16.3726 7.62742 12 0 12Z'
            className='fill-orange-300'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M64 24C69.0849 24 72 21.0849 72 16C72 21.0849 74.9151 24 80 24C74.9151 24 72 26.9151 72 32C72 26.9151 69.0849 24 64 24Z'
            className='fill-orange-300'
          />
        </svg>

        {/* Title and Description */}
        <div className='flex flex-col gap-5 transition-opacity duration-300'>
          <h2 className='text-4xl font-semibold -tracking-[1.2px] text-white'>
            {currentMedia.testimonial.title}
          </h2>
          <p className='text-base text-white'>
            {currentMedia.testimonial.description}
          </p>
        </div>

        {/* Avatars and Rating */}
        <div className='flex items-center gap-4'>
          {currentMedia.testimonial.avatars &&
            currentMedia.testimonial.avatars.length > 0 && (
              <div className='flex -space-x-3'>
                {currentMedia.testimonial.avatars.map((avatar, index) => (
                  <img
                    key={index}
                    className='size-10 rounded-full object-cover ring-2 ring-white/20'
                    src={avatar}
                    alt={`User ${index + 1}`}
                  />
                ))}
              </div>
            )}
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-2'>
              <div className='flex gap-1'>
                {renderStars(currentMedia.testimonial.rating)}
              </div>
              <p className='text-md font-semibold text-white'>
                {currentMedia.testimonial.rating?.toFixed(1) || "5.0"}
              </p>
            </div>
            {currentMedia.testimonial.reviewCount && (
              <span className='text-md font-medium text-white'>
                {currentMedia.testimonial.reviewCount}
              </span>
            )}
          </div>
        </div>

        {/* Pagination Dots */}
        {media.length > 1 && (
          <div className='mt-4 flex gap-2'>
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Default avatars used across testimonials
const defaultAvatars = [
  "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
  "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
  "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
  "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
  "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80",
];

// Default media and testimonial data for Login
export const loginCarouselData: { media: MediaItem[] } = {
  media: [
    {
      type: "image",
      src: "https://i.pinimg.com/1200x/40/d9/b7/40d9b7c963e383dc23a50bbc7c5b6158.jpg",
      alt: "AI Design Tools",
      showControls: false,
      testimonial: {
        title: "Design Ads with AI",
        description:
          "Access powerful AI tools to create stunning graphics anytime.",
        rating: 5,
        reviewCount: "Daily active creators",
        avatars: defaultAvatars,
      },
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dkym1gbk1/video/upload/v1768770565/new_blxhcs.mp4?_s=public-apps",
      alt: "Video Creation",
      showControls: false,
      testimonial: {
        title: "Create Videos That Convert",
        description:
          "Produce professional promo videos without editing skills.",
        rating: 5,
        reviewCount: "High engagement",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://i.pinimg.com/736x/5f/5f/3c/5f5f3c82349c1dd8552ffa7e97423fb2.jpg",
      alt: "Avatar Studio",
      showControls: false,
      testimonial: {
        title: "Your AI Avatar Studio",
        description: "Create and manage AI avatars for content and marketing.",
        rating: 5,
        reviewCount: "Loved by brands",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://i.pinimg.com/1200x/c8/62/04/c862048c66b954303866047010109f36.jpg",
      alt: "Voice AI",
      showControls: false,
      testimonial: {
        title: "Voice Cloning Made Simple",
        description:
          "Generate realistic voiceovers using advanced AI voice tech.",
        rating: 5,
        reviewCount: "Natural-sounding voices",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://genit-storage.s3.eu-north-1.amazonaws.com/templeajuzie%40gmail.com/generated/image/1766919857775-genit-image-1766919857769-0.jpg",
      alt: "HD Image Generator",
      showControls: false,
      testimonial: {
        title: "Ultra-Sharp AI Images",
        description:
          "Create high-resolution images ready for ads and campaigns.",
        rating: 5,
        reviewCount: "Crystal-clear quality",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://i.pinimg.com/videos/thumbnails/originals/aa/6b/de/aa6bde250e02a08fbfebf25688f85d91.0000000.jpg",
      alt: "Creator Earnings",
      showControls: false,
      testimonial: {
        title: "Turn Creativity into Income",
        description: "Sell services, content, and AI creations on genit.",
        rating: 5,
        reviewCount: "Creators getting paid",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://i.pinimg.com/videos/thumbnails/originals/49/b1/ec/49b1ecdd8b27f40ddd70f2c60f353246.0000000.jpg",
      alt: "Creator Community",
      showControls: false,
      testimonial: {
        title: "Build with the Community",
        description: "Connect with creators, share ideas, and grow together.",
        rating: 5,
        reviewCount: "Strong community vibes",
        avatars: defaultAvatars,
      },
    },
  ],
};

// Default media and testimonial data for Signup
export const signupCarouselData: { media: MediaItem[] } = {
  media: [
    {
      type: "image",
      src: "https://i.pinimg.com/1200x/cf/1f/eb/cf1febfbad3b22202fb83bccd08b6328.jpg",
      alt: "AI Graphics",
      showControls: false,
      testimonial: {
        title: "Create Graphics with AI",
        description:
          "Design logos, flyers, thumbnails, and social posts in seconds with AI.",
        rating: 5,
        reviewCount: "Creators love this",
        avatars: defaultAvatars,
      },
    },
    {
      type: "video",
      src: "https://res.cloudinary.com/dkym1gbk1/video/upload/v1768770565/new_blxhcs.mp4?_s=public-apps",
      alt: "Promotional Videos",
      showControls: false,
      testimonial: {
        title: "Generate Promotional Videos",
        description:
          "Turn scripts and ideas into high-converting promo videos instantly.",
        rating: 5,
        reviewCount: "Top-rated feature",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://i.pinimg.com/1200x/b2/db/80/b2db80290f2aba3567213d4eab1117a5.jpg",
      alt: "AI Avatar",
      showControls: false,
      testimonial: {
        title: "Create AI-Human Avatars",
        description:
          "Build lifelike avatars to represent your brand or business 24/7.",
        rating: 5,
        reviewCount: "Highly recommended",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://i.pinimg.com/1200x/99/f1/69/99f169a3b1c58c7f6b46314c30458a9e.jpg",
      alt: "Voice Cloning",
      showControls: false,
      testimonial: {
        title: "Clone Voices with AI",
        description:
          "Create natural-sounding voiceovers using AI voice cloning.",
        rating: 5,
        reviewCount: "Used worldwide",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://genit-storage.s3.eu-north-1.amazonaws.com/templeajuzie%40gmail.com/generated/image/1768029882257-genit-image-1768029882254-0.jpg",
      alt: "HD Images",
      showControls: false,
      testimonial: {
        title: "Generate HD Images",
        description:
          "Produce ultra-high-quality images for ads, brands, and products.",
        rating: 5,
        reviewCount: "HD quality guaranteed",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://i.pinimg.com/videos/thumbnails/originals/aa/6b/de/aa6bde250e02a08fbfebf25688f85d91.0000000.jpg",
      alt: "Earn as Creator",
      showControls: false,
      testimonial: {
        title: "Earn as a Creator",
        description:
          "Monetize your skills, content, and AI creations on genit.",
        rating: 5,
        reviewCount: "Creators earning daily",
        avatars: defaultAvatars,
      },
    },
    {
      type: "image",
      src: "https://i.pinimg.com/videos/thumbnails/originals/49/b1/ec/49b1ecdd8b27f40ddd70f2c60f353246.0000000.jpg",
      alt: "Community",
      showControls: false,
      testimonial: {
        title: "Join the Creator Community",
        description:
          "Collaborate, learn, and grow with creators building with AI.",
        rating: 5,
        reviewCount: "Fast-growing community",
        avatars: defaultAvatars,
      },
    },
  ],
};
