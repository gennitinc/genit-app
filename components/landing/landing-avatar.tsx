"use client";

import React, { useState } from "react";

export function LandingAvatar() {
  const [stopScroll, setStopScroll] = useState(false);
  const cardData = [
    {
      title: "Kimberly Hills",
      image: "https://i.pravatar.cc/400?img=1",
    },
    {
      title: "Li Wei",
      image: "https://i.pravatar.cc/400?img=12",
    },
    {
      title: "Marcus Johnson",
      image: "https://i.pravatar.cc/400?img=33",
    },
    {
      title: "Priya Sharma",
      image: "https://i.pravatar.cc/400?img=47",
    },
    {
      title: "Carlos Rodriguez",
      image: "https://i.pravatar.cc/400?img=52",
    },
    {
      title: "Yuki Tanaka",
      image: "https://i.pravatar.cc/400?img=68",
    },
    {
      title: "Aisha Mohammed",
      image: "https://i.pravatar.cc/400?img=70",
    },
    {
      title: "James Anderson",
      image: "https://i.pravatar.cc/400?img=5",
    },
  ];

  return (
    <div className="mt-20">
      <div className="text-center mb-12 md:mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Generate AI-Human Avatars
        </h2>
        <p className="text-base md:text-base text-muted-foreground max-w-2xl mx-auto">
          Generate stunning AI-Human avatars with AI.
        </p>
      </div>
      <>
        <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

        <div
          className="overflow-hidden w-full relative max-w-6xl mx-auto"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
        >
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent dark:from-background" />
          <div
            className="marquee-inner flex w-fit"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: cardData.length * 2500 + "ms",
            }}
          >
            <div className="flex">
              {[...cardData, ...cardData].map((card, index) => (
                <div
                  key={index}
                  className="w-56 mx-4 h-[20rem] relative group hover:scale-90 transition-all duration-300 rounded-none border border-primary/10 overflow-hidden"
                >
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

                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/40 dark:bg-black/60">
                    <p className="text-white text-lg font-semibold text-center">
                      {card.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent dark:from-background" />
        </div>
      </>
    </div>
  );
}
