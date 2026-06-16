"use client";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LandingCreator = () => {
  return (
    <div>
      <div className='mt-24 mb-12 space-y-4 text-center md:mb-16'>
        <h2 className='text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl'>
         Refer and earn
        </h2>
        <p className='text-muted-foreground mx-auto max-w-2xl text-base md:text-base'>
          Join the creators program and start earning money by referring others.
        </p>

        <Link
          href='/creators-program'
          className='text-muted-foreground mx-auto flex w-fit max-w-2xl items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-base shadow-lg shadow-black/5 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 hover:bg-white/20 md:text-base dark:bg-white/5 dark:hover:bg-white/10'
        >
          <span>Get Started</span>
          <ArrowRightIcon className='h-4 w-4' />
        </Link>
      </div>
      <div className='relative flex w-full items-center justify-center px-2 md:px-12 lg:px-20 xl:px-24'>
        <div className='w-full space-y-5 lg:w-10/12'>
          <div className='flex flex-col gap-5 lg:flex-row'>
            <div className='border-border bg-background relative flex h-full w-full flex-col items-center overflow-hidden border p-5 pt-20 lg:w-3/5 dark:border-neutral-800'>
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
              <div>
                <div className='border-border absolute top-5 -right-24 z-20 flex h-16 w-[350px] items-center gap-4 rounded-2xl border bg-white px-5 shadow-[0px_4px_8px_0px_#0000001a,0px_15px_15px_0px_#00000017,0px_34px_20px_0px_#0000000d,0px_60px_24px_0px_#00000003,0px_93px_26px_0px_#00000000] dark:border-neutral-800 dark:bg-neutral-900'>
                  <span>✅</span>
                  <span className='text-foreground'>Creators Vibe</span>
                </div>
                <div className='border-border absolute top-10 -right-[115px] z-10 flex h-16 w-[350px] items-center gap-4 rounded-2xl border bg-white px-5 shadow-[0px_4px_8px_0px_#0000001a,0px_15px_15px_0px_#00000017,0px_34px_20px_0px_#0000000d,0px_60px_24px_0px_#00000003,0px_93px_26px_0px_#00000000] dark:border-neutral-800 dark:bg-neutral-900' />
              </div>
              <div>
                <div className='border-border relative h-[275px] overflow-hidden rounded-3xl border border-solid bg-white lg:w-[532px] dark:border-neutral-800 dark:bg-neutral-900 [&>*]:scale-[0.6] lg:[&>*]:scale-[0.8]'>
                  <header className='m-5 flex w-[488px] items-center justify-between bg-transparent'>
                    <div className='inline-flex items-center gap-2'>
                      <div className='h-6 w-6'>
                        <svg
                          width={24}
                          height={24}
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M17.4996 3H6.49958C6.49958 3 6.26981 4.85118 6.49958 6C6.96587 8.33148 9.5946 10.4062 11.0425 11.3923C11.624 11.7883 12.3751 11.7883 12.9566 11.3923C14.4046 10.4062 17.0333 8.33148 17.4996 6C17.7293 4.85118 17.4996 3 17.4996 3Z'
                            stroke='#1DBF73'
                            strokeWidth={2}
                            strokeLinejoin='round'
                          />
                          <path
                            d='M17.5006 21H6.50055C6.50055 21 6.27079 19.1488 6.50055 18C6.96685 15.6685 9.59558 13.5938 11.0435 12.6077C11.625 12.2117 12.3761 12.2117 12.9576 12.6077C14.4055 13.5938 17.0343 15.6685 17.5006 18C17.7303 19.1488 17.5006 21 17.5006 21Z'
                            stroke='#1DBF73'
                            strokeWidth={2}
                            strokeLinejoin='round'
                          />
                          <path
                            d='M14.9632 18.5C14.9632 18.7761 14.7394 19 14.4632 19H9.53613C9.25999 19 9.03613 18.7761 9.03613 18.5V18.2118C9.03613 18.071 9.04338 17.9263 9.10917 17.8018C9.52919 17.0069 11.3199 16.6234 11.8508 16.5257C11.9502 16.5074 12.0491 16.5074 12.1486 16.5257C12.6795 16.6234 14.4702 17.0069 14.8902 17.8018C14.956 17.9263 14.9632 18.071 14.9632 18.2118V18.5Z'
                            fill='#1DBF73'
                          />
                          <path
                            d='M10.6546 7C10.3363 7 10.11 7.29655 10.2864 7.56151C10.6124 8.05119 11.1595 8.4687 11.5476 8.7258C11.8238 8.9087 12.1756 8.9087 12.4517 8.7258C12.8399 8.4687 13.3869 8.05119 13.7129 7.56151C13.8893 7.29655 13.6631 7 13.3448 7H10.6546Z'
                            fill='#1DBF73'
                          />
                          <path
                            d='M19.5 3H4.5'
                            stroke='#1DBF73'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M19.5 21H4.5'
                            stroke='#1DBF73'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                      <div className='flex items-center justify-center gap-1'>
                        <div className='font-heading-h5-semibold text-foreground mt-[-1.00px] w-fit text-xl leading-[var(--heading-h5-semibold-line-height)] font-normal whitespace-nowrap [font-style:var(--heading-h5-semibold-font-style)]'>
                          Referral Tracker
                        </div>
                        <div className='ml-1 w-10'>
                          <svg
                            width={16}
                            height={16}
                            viewBox='0 0 16 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <circle
                              cx={8}
                              cy={8}
                              r={8}
                              className='fill-muted-foreground'
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M9.30469 5.24219C9.42969 5.02344 9.5 4.76953 9.5 4.5C9.5 3.67188 8.82812 3 8 3C7.17188 3 6.5 3.67188 6.5 4.5C6.5 5.32812 7.17188 6 8 6C8.55859 6 9.04688 5.69531 9.30469 5.24219ZM7 7H7.5H8.5C9.05273 7 9.5 7.44727 9.5 8V9V13C9.5 13.5527 9.05273 14 8.5 14C7.94727 14 7.5 13.5527 7.5 13V9.75C7.5 9.33594 7.16406 9 6.75 9C6.33594 9 6 8.66406 6 8.25V8C6 7.64844 6.18164 7.33789 6.45508 7.16016C6.61133 7.05859 6.79883 7 7 7Z'
                              fill='white'
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </header>
                  <div className='absolute top-[237px] left-[42px] flex w-[416px] items-center gap-0.5'>
                    <div className='relative flex flex-1 grow items-center justify-center gap-1 px-1 py-2'>
                      <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-center leading-4 font-medium tracking-normal whitespace-nowrap'>
                        Mon
                      </div>
                    </div>
                    <div className='relative flex flex-1 grow items-center justify-center gap-1 px-1 py-2'>
                      <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-center leading-4 font-medium tracking-normal whitespace-nowrap'>
                        Tue
                      </div>
                    </div>
                    <div className='relative flex flex-1 grow items-center justify-center gap-1 px-1 py-2'>
                      <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-center leading-4 font-medium tracking-normal whitespace-nowrap'>
                        Wed
                      </div>
                    </div>
                    <div className='relative flex flex-1 grow items-center justify-center gap-1 px-1 py-2'>
                      <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-center leading-4 font-medium tracking-normal whitespace-nowrap'>
                        Thu
                      </div>
                    </div>
                    <div className='relative flex flex-1 grow items-center justify-center gap-1 px-1 py-2'>
                      <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-center leading-4 font-medium tracking-normal whitespace-nowrap'>
                        Fri
                      </div>
                    </div>
                    <div className='relative flex flex-1 grow items-center justify-center gap-1 px-1 py-2'>
                      <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-center leading-4 font-medium tracking-normal whitespace-nowrap'>
                        Sat
                      </div>
                    </div>
                    <div className='relative flex flex-1 grow items-center justify-center gap-1 px-1 py-2'>
                      <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-center leading-4 font-medium tracking-normal whitespace-nowrap'>
                        Sun
                      </div>
                    </div>
                  </div>
                  <div className='absolute top-20 left-[27px] h-[145px] w-[475px]'>
                    <div className='absolute top-0 left-[19px] h-[145px] w-[456px]'>
                      <div className='border-border absolute top-[23px] left-0 flex w-[416px] items-end gap-4 border-b pb-2 dark:border-neutral-800'>
                        <div
                          className='relative flex flex-1 grow flex-col items-start'
                          style={{ height: 50 }}
                        >
                          <div className='relative w-full flex-1 grow self-stretch rounded-[8px_8px_0px_0px] bg-[#D2F2E3]' />
                          <div
                            style={{ height: 38 }}
                            className='relative w-full self-stretch rounded-[0px_0px_8px_8px] bg-[#1DBF73]'
                          />
                        </div>
                        <div
                          className='relative flex flex-1 grow flex-col items-start'
                          style={{ height: 101 }}
                        >
                          <div className='relative w-full flex-1 grow self-stretch rounded-[8px_8px_0px_0px] bg-[#D2F2E3]' />
                          <div
                            style={{ height: 67 }}
                            className='relative w-full self-stretch rounded-[0px_0px_8px_8px] bg-[#1DBF73]'
                          />
                        </div>
                        <div
                          className='relative flex flex-1 grow flex-col items-start'
                          style={{ height: 122 }}
                        >
                          <div className='relative w-full flex-1 grow self-stretch rounded-[8px_8px_0px_0px] bg-[#D2F2E3]' />
                          <div
                            style={{ height: 92 }}
                            className='relative w-full self-stretch rounded-[0px_0px_8px_8px] bg-[#1DBF73]'
                          />
                        </div>
                        <div
                          className='relative flex flex-1 grow flex-col items-start'
                          style={{ height: 85 }}
                        >
                          <div className='relative w-full flex-1 grow self-stretch rounded-[8px_8px_0px_0px] bg-[#D2F2E3]' />
                          <div
                            style={{ height: 44 }}
                            className='relative w-full self-stretch rounded-[0px_0px_8px_8px] bg-[#1DBF73]'
                          />
                        </div>
                        <div
                          className='relative flex flex-1 grow flex-col items-start'
                          style={{ height: 50 }}
                        >
                          <div className='relative w-full flex-1 grow self-stretch rounded-[8px_8px_0px_0px] bg-[#D2F2E3]' />
                          <div
                            style={{ height: 31 }}
                            className='relative w-full self-stretch rounded-[0px_0px_8px_8px] bg-[#1DBF73]'
                          />
                        </div>
                        <div
                          className='relative flex flex-1 grow flex-col items-start'
                          style={{ height: 106 }}
                        >
                          <div className='relative w-full flex-1 grow self-stretch rounded-[8px_8px_0px_0px] bg-[#D2F2E3]' />
                          <div
                            style={{ height: 80 }}
                            className='relative w-full self-stretch rounded-[0px_0px_8px_8px] bg-[#1DBF73]'
                          />
                        </div>
                        <div className='relative flex h-[13px] flex-1 grow flex-col items-start'>
                          <div className='bg-muted relative w-full flex-1 grow self-stretch rounded-xl' />
                        </div>
                      </div>
                      <div className='absolute top-0 left-[435px] inline-flex flex-col items-start gap-[27px]'>
                        <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-right leading-4 font-medium tracking-normal whitespace-nowrap'>
                          8h
                        </div>
                        <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-right leading-4 font-medium tracking-normal whitespace-nowrap'>
                          4h
                        </div>
                        <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-right leading-4 font-medium tracking-normal whitespace-nowrap'>
                          2h
                        </div>
                        <div className='font-label-l2-medium text-muted-foreground relative mt-[-1.00px] w-fit text-right leading-4 font-medium tracking-normal whitespace-nowrap'>
                          0
                        </div>
                      </div>
                    </div>
                    <img
                      alt='Vector'
                      loading='lazy'
                      width={447}
                      height={1}
                      decoding='async'
                      data-nimg={1}
                      className='absolute top-[67px] left-0 h-0.5 w-[447px]'
                      style={{ color: "transparent" }}
                      src='/assets/VerticalDots.svg'
                    />
                    <div className='absolute top-[57px] left-[407px] ml-1 inline-flex h-[22px] rotate-180 items-start overflow-hidden'>
                      <div className='bg-foreground relative inline-flex flex-[0_0_auto] items-start gap-2.5 overflow-hidden rounded-[4px_0px_0px_4px] py-px pr-0.5 pl-1 dark:bg-neutral-800'>
                        <div className="text-background relative mt-[-1.00px] h-[21px] w-fit rotate-180 [font-family:'SF_Pro_Text-Regular',Helvetica] text-sm leading-5 font-normal tracking-[0] whitespace-nowrap dark:text-white">
                          Avg
                        </div>
                      </div>
                      <div className='relative h-[22px] w-[9.65px] -rotate-180'>
                        <svg
                          width={10}
                          height={22}
                          viewBox='0 0 10 22'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M0.611521 10.3273C0.264775 10.7087 0.264775 11.2913 0.611521 11.6727L10 22L10 -4.37114e-07L0.611521 10.3273Z'
                            className='fill-foreground dark:fill-neutral-800'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-4 flex flex-col items-start'>
                <h1 className='text-foreground text-start text-xl font-semibold tracking-tight md:text-4xl'>
                  <span className='inline-block'>Track</span>{" "}
                  <span className='inline-block'>referrals,</span>{" "}
                  <span className='inline-block'>effortlessly</span>
                </h1>
                <p className='text-muted-foreground mt-2 w-full text-start text-sm md:mt-4 md:w-[70%]'>
                  Visualize your referral performance with detailed analytics
                  and insights
                </p>
              </div>
            </div>
            <div className='relative mx-auto max-w-2xl'>
              <div className='relative overflow-hidden rounded-3xl'>
                <Image
                  src='https://ext.same-assets.com/3322540528/2275812143.jpeg'
                  alt='_jason'
                  width={800}
                  height={500}
                  className='w-full object-cover'
                />
                {/* Username */}
                <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                  <Image
                    src='https://ext.same-assets.com/3322540528/2275812143.jpeg'
                    alt='_jason'
                    width={32}
                    height={32}
                    className='h-8 w-8 rounded-full border-2 border-white'
                  />
                  <span className='text-sm font-medium text-white'>_jason</span>
                  <Image
                    src='https://ext.same-assets.com/3322540528/871220803.png'
                    alt='Verified'
                    width={14}
                    height={14}
                  />
                </div>
              </div>

              {/* Floating Badge - 200k */}
              <div className='border-border absolute top-8 left-4 flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-lg dark:border-neutral-800 dark:bg-neutral-900'>
                <svg
                  className='h-4 w-4 text-red-500'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                </svg>
                <span className='text-foreground text-sm font-medium'>
                  200k
                </span>
              </div>

              {/* Floating Badge - 1.9k profile clicks */}
              <div className='border-border absolute right-4 bottom-16 flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-lg dark:border-neutral-800 dark:bg-neutral-900'>
                <svg
                  className='text-muted-foreground h-4 w-4'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <circle cx='12' cy='12' r='10' />
                  <circle cx='12' cy='10' r='3' />
                  <path d='M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662' />
                </svg>
                <span className='text-foreground text-sm font-medium'>
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
