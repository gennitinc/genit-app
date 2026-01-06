"use client";
import React from "react";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const LandingCreator = () => {
  return (
    <div>
      <div className="text-center mb-12 md:mb-16 space-y-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Earn as a creator
        </h2>
        <p className="text-base md:text-base text-muted-foreground max-w-2xl mx-auto">
          Join the creators program and start earning money by referring others.
        </p>
        <Link href="/creators-program" className="text-base md:text-base text-muted-foreground max-w-2xl mx-auto flex flex-row items-center justify-center gap-2">
          <span>Get Started</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
      <div className="relative flex justify-center items-center w-full px-2 md:px-12 lg:px-20 xl:px-24">
        <div className="lg:w-10/12 w-full space-y-5">
          <div className="flex lg:flex-row flex-col gap-5">
            <div className="relative h-full lg:w-3/5 w-full flex flex-col items-center overflow-hidden p-5 pt-20 border border-border dark:border-neutral-800 bg-background">
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
              <div>
                <div className="absolute -right-24 top-5 z-20 w-[350px] gap-4 bg-white dark:bg-neutral-900 rounded-2xl h-16 flex items-center px-5 border border-border dark:border-neutral-800 shadow-[0px_4px_8px_0px_#0000001a,0px_15px_15px_0px_#00000017,0px_34px_20px_0px_#0000000d,0px_60px_24px_0px_#00000003,0px_93px_26px_0px_#00000000]">
                  <span>✅</span>
                  <span className="text-foreground">Creators Vibe</span>
                </div>
                <div className="absolute -right-[115px] top-10 z-10 w-[350px] gap-4 bg-white dark:bg-neutral-900 rounded-2xl h-16 flex items-center px-5 border border-border dark:border-neutral-800 shadow-[0px_4px_8px_0px_#0000001a,0px_15px_15px_0px_#00000017,0px_34px_20px_0px_#0000000d,0px_60px_24px_0px_#00000003,0px_93px_26px_0px_#00000000]" />
              </div>
              <div>
                <div className="relative lg:w-[532px] h-[275px] lg:[&>*]:scale-[0.8] [&>*]:scale-[0.6] bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-solid border-border dark:border-neutral-800">
                  <header className="flex w-[488px] items-center justify-between bg-transparent m-5">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-6 h-6">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.4996 3H6.49958C6.49958 3 6.26981 4.85118 6.49958 6C6.96587 8.33148 9.5946 10.4062 11.0425 11.3923C11.624 11.7883 12.3751 11.7883 12.9566 11.3923C14.4046 10.4062 17.0333 8.33148 17.4996 6C17.7293 4.85118 17.4996 3 17.4996 3Z"
                            stroke="#1DBF73"
                            strokeWidth={2}
                            strokeLinejoin="round"
                          />
                          <path
                            d="M17.5006 21H6.50055C6.50055 21 6.27079 19.1488 6.50055 18C6.96685 15.6685 9.59558 13.5938 11.0435 12.6077C11.625 12.2117 12.3761 12.2117 12.9576 12.6077C14.4055 13.5938 17.0343 15.6685 17.5006 18C17.7303 19.1488 17.5006 21 17.5006 21Z"
                            stroke="#1DBF73"
                            strokeWidth={2}
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14.9632 18.5C14.9632 18.7761 14.7394 19 14.4632 19H9.53613C9.25999 19 9.03613 18.7761 9.03613 18.5V18.2118C9.03613 18.071 9.04338 17.9263 9.10917 17.8018C9.52919 17.0069 11.3199 16.6234 11.8508 16.5257C11.9502 16.5074 12.0491 16.5074 12.1486 16.5257C12.6795 16.6234 14.4702 17.0069 14.8902 17.8018C14.956 17.9263 14.9632 18.071 14.9632 18.2118V18.5Z"
                            fill="#1DBF73"
                          />
                          <path
                            d="M10.6546 7C10.3363 7 10.11 7.29655 10.2864 7.56151C10.6124 8.05119 11.1595 8.4687 11.5476 8.7258C11.8238 8.9087 12.1756 8.9087 12.4517 8.7258C12.8399 8.4687 13.3869 8.05119 13.7129 7.56151C13.8893 7.29655 13.6631 7 13.3448 7H10.6546Z"
                            fill="#1DBF73"
                          />
                          <path
                            d="M19.5 3H4.5"
                            stroke="#1DBF73"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.5 21H4.5"
                            stroke="#1DBF73"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="gap-1 flex items-center justify-center">
                        <div className="w-fit mt-[-1.00px] font-heading-h5-semibold font-normal text-foreground text-xl leading-[var(--heading-h5-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-h5-semibold-font-style)]">
                          Referral Tracker
                        </div>
                        <div className="w-10 ml-1">
                          <svg
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx={8}
                              cy={8}
                              r={8}
                              className="fill-muted-foreground"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.30469 5.24219C9.42969 5.02344 9.5 4.76953 9.5 4.5C9.5 3.67188 8.82812 3 8 3C7.17188 3 6.5 3.67188 6.5 4.5C6.5 5.32812 7.17188 6 8 6C8.55859 6 9.04688 5.69531 9.30469 5.24219ZM7 7H7.5H8.5C9.05273 7 9.5 7.44727 9.5 8V9V13C9.5 13.5527 9.05273 14 8.5 14C7.94727 14 7.5 13.5527 7.5 13V9.75C7.5 9.33594 7.16406 9 6.75 9C6.33594 9 6 8.66406 6 8.25V8C6 7.64844 6.18164 7.33789 6.45508 7.16016C6.61133 7.05859 6.79883 7 7 7Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </header>
                  <div className="flex w-[416px] items-center gap-0.5 absolute top-[237px] left-[42px]">
                    <div className="flex items-center justify-center gap-1 px-1 py-2 relative flex-1 grow">
                      <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-center tracking-normal leading-4 whitespace-nowrap">
                        Mon
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 px-1 py-2 relative flex-1 grow">
                      <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-center tracking-normal leading-4 whitespace-nowrap">
                        Tue
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 px-1 py-2 relative flex-1 grow">
                      <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-center tracking-normal leading-4 whitespace-nowrap">
                        Wed
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 px-1 py-2 relative flex-1 grow">
                      <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-center tracking-normal leading-4 whitespace-nowrap">
                        Thu
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 px-1 py-2 relative flex-1 grow">
                      <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-center tracking-normal leading-4 whitespace-nowrap">
                        Fri
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 px-1 py-2 relative flex-1 grow">
                      <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-center tracking-normal leading-4 whitespace-nowrap">
                        Sat
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 px-1 py-2 relative flex-1 grow">
                      <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-center tracking-normal leading-4 whitespace-nowrap">
                        Sun
                      </div>
                    </div>
                  </div>
                  <div className="absolute w-[475px] h-[145px] top-20 left-[27px]">
                    <div className="absolute w-[456px] h-[145px] top-0 left-[19px]">
                      <div className="flex w-[416px] items-end gap-4 absolute top-[23px] left-0 border-b border-border dark:border-neutral-800 pb-2">
                        <div
                          className="flex flex-col items-start relative flex-1 grow"
                          style={{ height: 50 }}
                        >
                          <div className="bg-[#D2F2E3] rounded-[8px_8px_0px_0px] relative flex-1 self-stretch w-full grow" />
                          <div
                            style={{ height: 38 }}
                            className="bg-[#1DBF73] rounded-[0px_0px_8px_8px] relative self-stretch w-full"
                          />
                        </div>
                        <div
                          className="flex flex-col items-start relative flex-1 grow"
                          style={{ height: 101 }}
                        >
                          <div className="bg-[#D2F2E3] rounded-[8px_8px_0px_0px] relative flex-1 self-stretch w-full grow" />
                          <div
                            style={{ height: 67 }}
                            className="bg-[#1DBF73] rounded-[0px_0px_8px_8px] relative self-stretch w-full"
                          />
                        </div>
                        <div
                          className="flex flex-col items-start relative flex-1 grow"
                          style={{ height: 122 }}
                        >
                          <div className="bg-[#D2F2E3] rounded-[8px_8px_0px_0px] relative flex-1 self-stretch w-full grow" />
                          <div
                            style={{ height: 92 }}
                            className="bg-[#1DBF73] rounded-[0px_0px_8px_8px] relative self-stretch w-full"
                          />
                        </div>
                        <div
                          className="flex flex-col items-start relative flex-1 grow"
                          style={{ height: 85 }}
                        >
                          <div className="bg-[#D2F2E3] rounded-[8px_8px_0px_0px] relative flex-1 self-stretch w-full grow" />
                          <div
                            style={{ height: 44 }}
                            className="bg-[#1DBF73] rounded-[0px_0px_8px_8px] relative self-stretch w-full"
                          />
                        </div>
                        <div
                          className="flex flex-col items-start relative flex-1 grow"
                          style={{ height: 50 }}
                        >
                          <div className="bg-[#D2F2E3] rounded-[8px_8px_0px_0px] relative flex-1 self-stretch w-full grow" />
                          <div
                            style={{ height: 31 }}
                            className="bg-[#1DBF73] rounded-[0px_0px_8px_8px] relative self-stretch w-full"
                          />
                        </div>
                        <div
                          className="flex flex-col items-start relative flex-1 grow"
                          style={{ height: 106 }}
                        >
                          <div className="bg-[#D2F2E3] rounded-[8px_8px_0px_0px] relative flex-1 self-stretch w-full grow" />
                          <div
                            style={{ height: 80 }}
                            className="bg-[#1DBF73] rounded-[0px_0px_8px_8px] relative self-stretch w-full"
                          />
                        </div>
                        <div className="flex flex-col h-[13px] items-start relative flex-1 grow">
                          <div className="bg-muted rounded-xl relative flex-1 self-stretch w-full grow" />
                        </div>
                      </div>
                      <div className="inline-flex flex-col items-start gap-[27px] absolute top-0 left-[435px]">
                        <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-right tracking-normal leading-4 whitespace-nowrap">
                          8h
                        </div>
                        <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-right tracking-normal leading-4 whitespace-nowrap">
                          4h
                        </div>
                        <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-right tracking-normal leading-4 whitespace-nowrap">
                          2h
                        </div>
                        <div className="relative w-fit mt-[-1.00px] font-label-l2-medium font-medium text-muted-foreground text-right tracking-normal leading-4 whitespace-nowrap">
                          0
                        </div>
                      </div>
                    </div>
                    <img
                      alt="Vector"
                      loading="lazy"
                      width={447}
                      height={1}
                      decoding="async"
                      data-nimg={1}
                      className="absolute w-[447px] h-0.5 top-[67px] left-0"
                      style={{ color: "transparent" }}
                      src="/assets/VerticalDots.svg"
                    />
                    <div className="inline-flex items-start absolute top-[57px] left-[407px] rotate-180 h-[22px] overflow-hidden ml-1">
                      <div className="inline-flex items-start gap-2.5 pl-1 pr-0.5 py-px relative flex-[0_0_auto] bg-foreground dark:bg-neutral-800 rounded-[4px_0px_0px_4px] overflow-hidden">
                        <div className="relative w-fit mt-[-1.00px] h-[21px] rotate-180 [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-background dark:text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                          Avg
                        </div>
                      </div>
                      <div className="relative w-[9.65px] h-[22px] -rotate-180">
                        <svg
                          width={10}
                          height={22}
                          viewBox="0 0 10 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.611521 10.3273C0.264775 10.7087 0.264775 11.2913 0.611521 11.6727L10 22L10 -4.37114e-07L0.611521 10.3273Z"
                            className="fill-foreground dark:fill-neutral-800"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start mt-4">
                <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-start text-foreground">
                  <span className="inline-block">Track</span>{" "}
                  <span className="inline-block">referrals,</span>{" "}
                  <span className="inline-block">effortlessly</span>
                </h1>
                <p className="text-start text-sm md:w-[70%] w-full mt-2 md:mt-4 text-muted-foreground">
                  Visualize your referral performance with detailed analytics
                  and insights
                </p>
              </div>
            </div>
            <div className="max-w-2xl mx-auto relative">
              <div className="rounded-3xl overflow-hidden relative">
                <Image
                  src="https://ext.same-assets.com/3322540528/2275812143.jpeg"
                  alt="_jason"
                  width={800}
                  height={500}
                  className="w-full object-cover"
                />
                {/* Username */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Image
                    src="https://ext.same-assets.com/3322540528/2275812143.jpeg"
                    alt="_jason"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span className="text-white text-sm font-medium">_jason</span>
                  <Image
                    src="https://ext.same-assets.com/3322540528/871220803.png"
                    alt="Verified"
                    width={14}
                    height={14}
                  />
                </div>
              </div>

              {/* Floating Badge - 200k */}
              <div className="absolute top-8 left-4 bg-white dark:bg-neutral-900 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 border border-border dark:border-neutral-800">
                <svg
                  className="w-4 h-4 text-red-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="text-sm font-medium text-foreground">
                  200k
                </span>
              </div>

              {/* Floating Badge - 1.9k profile clicks */}
              <div className="absolute bottom-16 right-4 bg-white dark:bg-neutral-900 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 border border-border dark:border-neutral-800">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                </svg>
                <span className="text-sm font-medium text-foreground">
                  1.9k video views
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCreator;
