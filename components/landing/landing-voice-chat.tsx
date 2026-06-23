"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingVoiceClone() {
  return (
    <div className='mt-20'>
      <div className='mb-12 space-y-4 text-center md:mb-16'>
        <h2 className='text-foreground text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl'>
          Tired of typing? Voice it
        </h2>
        <p className='text-muted-foreground mx-auto max-w-2xl text-base md:text-base'>
          Skip the keyboard. Speak your ideas naturally and let Genit instantly
          turn your voice into perfectly formatted prompt.
        </p>
      </div>
      <div className="flex justify-center mt-6 mb-8">
        <Link
          href="/signup"
          className="relative z-20 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all duration-200 active:scale-95 shadow-md"
        >
          <span>Voice your prompt</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className='relative flex min-h-[300px] items-center justify-center'>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .orb-container {
                position: relative;
                width: 200px;
                height: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                border-radius: 50%;
                rotate: 90deg;
                cursor: pointer;
                filter: drop-shadow(0 0 6px #ff3e1c88) drop-shadow(0 0 6px #1c8cff88);
                transition: all 0.3s ease;
              }

              .orb {
                position: absolute;
                width: 200px;
                aspect-ratio: 1;
                border-radius: 50%;
                background: #060606;
                filter: blur(24px);
                transition: all 0.3s ease;
              }
              
              .orb-container:hover .orb {
                width: 220px;
                animation: rotateOrb 6s infinite;
              }

              @keyframes rotateOrb {
                50% {
                  transform: rotate(180deg);
                }
              }

              .orb-inner {
                position: absolute;
                left: -120%;
                top: -25%;
                width: 160%;
                aspect-ratio: 1;
                border-radius: 50%;
                background: #ff3e1c;
                clip-path: polygon(
                  50% 0%,
                  61% 35%,
                  98% 35%,
                  68% 57%,
                  79% 91%,
                  50% 70%,
                  21% 91%,
                  32% 57%,
                  2% 35%,
                  39% 35%
                );
                animation: rotateInner 6s linear infinite;
                transition: all 0.3s ease;
              }

              .orb-inner:nth-child(2) {
                left: auto;
                right: -120%;
                top: auto;
                bottom: -25%;
                background: #1c8cff;
                animation-duration: 8s;
                clip-path: polygon(
                  20% 0%,
                  0% 20%,
                  30% 50%,
                  0% 80%,
                  20% 100%,
                  50% 70%,
                  80% 100%,
                  100% 80%,
                  70% 50%,
                  100% 20%,
                  80% 0%,
                  50% 30%
                );
              }

              @keyframes rotateInner {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }

              .orb-container:hover .orb .orb-inner {
                width: 170%;
              }
            `,
          }}
        />
        <div className='orb-container'>
          <div className='orb'>
            <div className='orb-inner'></div>
            <div className='orb-inner'></div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      
    </div>
  );
}
