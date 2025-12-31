"use client";

import React, { useState } from "react";

export function LandingAvatar() {
  const [stopScroll, setStopScroll] = useState(false);
  const cardData = [
    {
      title: "Kimberly Hills",
      image:
        "https://i.pinimg.com/736x/a0/cb/f8/a0cbf895e3e033b27a823ef8bb5b6a31.jpg",
    },
    {
      title: "Li Wei",
      image:
        "https://i.pinimg.com/736x/74/3d/88/743d88dd2675cd87baa1b560f500c69c.jpg",
    },
    {
      title: "Marcus Johnson",
      image:
        "https://i.pinimg.com/736x/5f/5f/3c/5f5f3c82349c1dd8552ffa7e97423fb2.jpg",
    },
    {
      title: "Priya Sharma",
      image:
        "https://i.pinimg.com/736x/29/5f/f5/295ff586f4725e8b56b6ba08017e4a6d.jpg",
    },
    {
      title: "Carlos Rodriguez",
      image:
        "https://i.pinimg.com/1200x/3e/f3/50/3ef350dc86cc82a092463e5d795654b5.jpg",
    },
    {
      title: "Yuki Tanaka",
      image:
        "https://i.pinimg.com/736x/eb/76/a4/eb76a46ab920d056b02d203ca95e9a22.jpg",
    },
    {
      title: "Aisha Mohammed",
      image:
        "https://i.pinimg.com/736x/48/08/6e/48086ebb8989d9d6dde7d12d9f2939fd.jpg",
    },
    {
      title: "Kura Anderson",
      image:
        "https://i.pinimg.com/1200x/b2/db/80/b2db80290f2aba3567213d4eab1117a5.jpg",
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
