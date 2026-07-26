"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  const projects = [
    {
      id: 1,
      username: "kia_dances",
      image: "https://ext.same-assets.com/3322540528/2818850031.png",
    },
    {
      id: 2,
      username: "sarah_rides",
      image: "https://ext.same-assets.com/3322540528/3536909961.png",
    },
    {
      id: 3,
      username: "tennis_tips",
      image: "https://ext.same-assets.com/3322540528/108827404.jpeg",
    },
    {
      id: 4,
      username: "business_chats",
      image: "https://ext.same-assets.com/3322540528/88222209.png",
    },
    {
      id: 5,
      username: "golf_with_jess",
      image: "https://ext.same-assets.com/3322540528/1607598511.png",
    },
    {
      id: 6,
      username: "zoe_gardens",
      image: "https://ext.same-assets.com/3322540528/591418869.png",
    },
  ];
  const quotes = [
    {
      quote:
        "Influence helped me turn raw clips into content that actually converts.",
      name: "MayaLennox",
      avatar: "https://ext.same-assets.com/3322540528/489297333.jpeg",
    },
    {
      quote:
        "Our Reels finally have structure, pace, and purpose — thanks to Influence.",
      name: "_traveldiaries",
      avatar: "https://ext.same-assets.com/3322540528/490832111.png",
    },
    {
      quote: "Influence made it effortless to stay consistent and grow fast.",
      name: "sarah_fx",
      avatar: "https://ext.same-assets.com/3322540528/3139708538.png",
    },
    {
      quote: "From 2K to 10K followers in weeks — Influence knows what works.",
      name: "Maya Lennox",
      avatar: "https://ext.same-assets.com/3322540528/489297333.jpeg",
    },
    {
      quote: "Influence gave my videos the polish they were missing.",
      name: "jo",
      avatar: "https://ext.same-assets.com/3322540528/2300361184.png",
    },
    {
      quote: "They handled everything — editing, pacing, captions — perfectly.",
      name: "Lara_Cunningham",
      avatar: "https://ext.same-assets.com/3322540528/591418869.png",
    },
    {
      quote: "Engagement doubled. Saves tripled. All from Influence's edits.",
      name: "Rahul_rules",
      avatar: "https://ext.same-assets.com/3322540528/88222209.png",
    },
    {
      quote: "Influence helped me turn niche content into mainstream reach.",
      name: "Matt",
      avatar: "https://ext.same-assets.com/3322540528/108827404.jpeg",
    },
  ];

  const plans = [
    {
      name: "Starter plan",
      price: "$750",
      description: "Perfect for creators looking to grow an audience.",
      features: [
        "8 short-form videos (15–60s each)",
        "5-day turnaround",
        "1 revision per video",
        "Monthly performance report",
      ],
      cta: "Get started",
      popular: false,
    },
    {
      name: "Growth plan",
      price: "$1,500",
      description: "Ideal for brands ready to post frequently and grow fast.",
      features: [
        "20 short-form videos (15–60s each)",
        "3-day turnaround",
        "Unlimited revisions",
        "Monthly performance report",
      ],
      cta: "Book an intro call",
      popular: true,
    },
    {
      name: "Scale plan",
      price: "$2,800",
      description:
        "For founders, agencies, or creators building a dominant presence.",
      features: [
        "32 short-form videos (15–60s each)",
        "48-hr turnaround",
        "Unlimited revisions",
        "Monthly performance report",
      ],
      cta: "Get started",
      popular: false,
    },
  ];

  return (
    <div>
      <section className='bg-[#f8f8f8] pt-32 pb-16'>
        <div className='mx-auto max-w-[1200px] px-6'>
          {/* Spots Left Badge */}
          <div className='mb-8 flex justify-center'>
            <div className='inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm'>
              <span className='text-orange-500'>●</span>
              <span className='text-xs font-medium tracking-wide text-orange-600 uppercase'>
                3 spots left for august
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className='mb-8 text-center'>
            <h1 className='mb-6 text-5xl leading-tight font-bold md:text-6xl'>
              <span className='flex flex-wrap items-center justify-center gap-3'>
                Make changes
                <span className='inline-flex items-center gap-1'>
                  <Image
                    src='https://ext.same-assets.com/3322540528/3449985188.png'
                    alt='TikTok'
                    width={40}
                    height={40}
                    className='rounded-lg'
                  />
                  <Image
                    src='https://ext.same-assets.com/3322540528/587108078.png'
                    alt='Social Icons'
                    width={80}
                    height={40}
                    className='h-10 w-auto'
                  />
                </span>
              </span>
              <span className='block'>
                that builds{" "}
                <span className='font-serif italic'>real influence.</span>
              </span>
            </h1>

            <p className='mx-auto mb-8 max-w-md text-lg text-gray-500'>
              We turn your expertise into viral short-form content that builds
              trust and drives attention.
            </p>

            {/* CTA Buttons */}
            <div className='mb-10 flex items-center justify-center gap-4'>
              <Link
                href='https://cal.com'
                className='inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800'
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                Let&apos;s grow your brand
              </Link>
              <Link
                href='#pricing'
                className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50'
              >
                See pricing
              </Link>
            </div>

            {/* Social Proof */}
            <div className='flex items-center justify-center gap-8'>
              <div className='flex items-center gap-4'>
                <span className='text-xs tracking-wide text-gray-400 uppercase'>
                  100+ personal brands
                </span>
                <div className='flex -space-x-2'>
                  <Image
                    src='https://ext.same-assets.com/3322540528/3374079693.png'
                    alt='User 1'
                    width={32}
                    height={32}
                    className='h-8 w-8 rounded-full border-2 border-white'
                  />
                  <Image
                    src='https://ext.same-assets.com/3322540528/3013210382.png'
                    alt='User 2'
                    width={32}
                    height={32}
                    className='h-8 w-8 rounded-full border-2 border-white'
                  />
                </div>
              </div>
              <div className='h-8 w-px bg-gray-200' />
              <div className='flex items-center gap-2'>
                <span className='text-xs tracking-wide text-gray-400 uppercase'>
                  rated excellent: 5/5
                </span>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className='h-5 w-5 text-orange-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phone Mockup with Floating Badges */}
          <div className='relative mx-auto mt-12 max-w-[500px]'>
            {/* Main Phone */}
            <div className='relative'>
              <div className='overflow-hidden rounded-[32px] bg-black shadow-2xl'>
                <Image
                  src='https://ext.same-assets.com/3322540528/2275812143.jpeg'
                  alt='Creator Content'
                  width={400}
                  height={800}
                  className='w-full'
                />
                {/* Username overlay */}
                <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                  <Image
                    src='https://ext.same-assets.com/3322540528/2275812143.jpeg'
                    alt='dan_cooks'
                    width={32}
                    height={32}
                    className='h-8 w-8 rounded-full border-2 border-white'
                  />
                  <span className='text-sm font-medium text-white'>
                    dan_cooks
                  </span>
                  <Image
                    src='https://ext.same-assets.com/3322540528/871220803.png'
                    alt='Verified'
                    width={16}
                    height={16}
                  />
                </div>
              </div>

              {/* Floating Badge - 100+ */}
              <div className='animate-float absolute -top-4 -left-12 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg'>
                <svg
                  className='h-4 w-4 text-gray-600'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
                </svg>
                <span className='text-sm font-medium'>100+</span>
              </div>

              {/* Floating Badge - 40k+ */}
              <div
                className='animate-float absolute top-1/3 -right-16 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg'
                style={{ animationDelay: "0.5s" }}
              >
                <svg
                  className='h-4 w-4 text-gray-600'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                  <circle cx='12' cy='12' r='3' />
                </svg>
                <span className='text-sm font-medium'>40k+</span>
              </div>

              {/* Floating Badge - 30k Likes */}
              <div
                className='animate-float absolute bottom-1/3 -left-16 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg'
                style={{ animationDelay: "1s" }}
              >
                <svg
                  className='h-4 w-4 text-red-500'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                </svg>
                <span className='text-sm font-medium'>30k</span>
              </div>

              {/* Floating Badge - 2k+ followers */}
              <div
                className='animate-float absolute -right-20 bottom-16 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg'
                style={{ animationDelay: "1.5s" }}
              >
                <Image
                  src='https://ext.same-assets.com/3322540528/2275812143.jpeg'
                  alt='User'
                  width={24}
                  height={24}
                  className='h-6 w-6 rounded-full'
                />
                <span className='text-sm font-medium'>2k+ followers</span>
              </div>
            </div>

            {/* Side Buttons */}
            <div className='absolute top-1/3 -right-32 flex flex-col gap-3'>
              <button className='rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800'>
                Buy template
              </button>
              <div className='flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm'>
                <svg
                  className='h-4 w-4'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                </svg>
                <span>Made in Framer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-[#f8f8f8] py-24'>
        <div className='mx-auto max-w-[1200px] px-6'>
          {/* Spots Left Badge */}
          <div className='mb-8 flex justify-center'>
            <div className='inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm'>
              <span className='text-orange-500'>●</span>
              <span className='text-xs font-medium tracking-wide text-orange-600 uppercase'>
                3 spots left for august
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className='mb-8 text-center'>
            <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
              Your profile growth is
              <br />
              only a few edits away.
            </h2>

            {/* CTA Button */}
            <Link
              href='https://cal.com'
              className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50'
            >
              Get started today
            </Link>
          </div>

          {/* Creator Images */}
          <div className='mt-12 flex items-end justify-center gap-4'>
            {/* Left Creator */}
            <div className='relative h-72 w-48 overflow-hidden rounded-3xl'>
              <Image
                src='https://ext.same-assets.com/3322540528/2824705707.png'
                alt='skin_glow'
                fill
                className='object-cover'
              />
              <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                <Image
                  src='https://ext.same-assets.com/3322540528/2824705707.png'
                  alt='skin_glow'
                  width={24}
                  height={24}
                  className='h-6 w-6 rounded-full border-2 border-white object-cover'
                />
                <span className='text-xs font-medium text-white'>
                  skin_glow
                </span>
                <Image
                  src='https://ext.same-assets.com/3322540528/871220803.png'
                  alt='Verified'
                  width={12}
                  height={12}
                />
              </div>
            </div>

            {/* Middle Creator (taller) */}
            <div className='relative h-96 w-48 overflow-hidden rounded-3xl'>
              <Image
                src='https://ext.same-assets.com/3322540528/1667287416.png'
                alt='sasha_dances'
                fill
                className='object-cover'
              />
              <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                <Image
                  src='https://ext.same-assets.com/3322540528/1667287416.png'
                  alt='sasha_dances'
                  width={24}
                  height={24}
                  className='h-6 w-6 rounded-full border-2 border-white object-cover'
                />
                <span className='text-xs font-medium text-white'>
                  sasha_dances
                </span>
                <Image
                  src='https://ext.same-assets.com/3322540528/871220803.png'
                  alt='Verified'
                  width={12}
                  height={12}
                />
              </div>
            </div>

            {/* Right Creator */}
            <div className='relative h-72 w-48 overflow-hidden rounded-3xl'>
              <Image
                src='https://ext.same-assets.com/3322540528/2225745264.png'
                alt='MikeCooks'
                fill
                className='object-cover'
              />
              <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                <Image
                  src='https://ext.same-assets.com/3322540528/2225745264.png'
                  alt='MikeCooks'
                  width={24}
                  height={24}
                  className='h-6 w-6 rounded-full border-2 border-white object-cover'
                />
                <span className='text-xs font-medium text-white'>
                  MikeCooks
                </span>
                <Image
                  src='https://ext.same-assets.com/3322540528/871220803.png'
                  alt='Verified'
                  width={12}
                  height={12}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-[#f8f8f8] py-24'>
        <div className='mx-auto max-w-[1200px] px-6'>
          {/* Spots Left Badge */}
          <div className='mb-8 flex justify-center'>
            <div className='inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm'>
              <span className='text-orange-500'>●</span>
              <span className='text-xs font-medium tracking-wide text-orange-600 uppercase'>
                3 spots left for august
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className='mb-8 text-center'>
            <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
              Your profile growth is
              <br />
              only a few edits away.
            </h2>

            {/* CTA Button */}
            <Link
              href='https://cal.com'
              className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50'
            >
              Get started today
            </Link>
          </div>

          {/* Creator Images */}
          <div className='mt-12 flex items-end justify-center gap-4'>
            {/* Left Creator */}
            <div className='relative h-72 w-48 overflow-hidden rounded-3xl'>
              <Image
                src='https://ext.same-assets.com/3322540528/2824705707.png'
                alt='skin_glow'
                fill
                className='object-cover'
              />
              <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                <Image
                  src='https://ext.same-assets.com/3322540528/2824705707.png'
                  alt='skin_glow'
                  width={24}
                  height={24}
                  className='h-6 w-6 rounded-full border-2 border-white object-cover'
                />
                <span className='text-xs font-medium text-white'>
                  skin_glow
                </span>
                <Image
                  src='https://ext.same-assets.com/3322540528/871220803.png'
                  alt='Verified'
                  width={12}
                  height={12}
                />
              </div>
            </div>

            {/* Middle Creator (taller) */}
            <div className='relative h-96 w-48 overflow-hidden rounded-3xl'>
              <Image
                src='https://ext.same-assets.com/3322540528/1667287416.png'
                alt='sasha_dances'
                fill
                className='object-cover'
              />
              <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                <Image
                  src='https://ext.same-assets.com/3322540528/1667287416.png'
                  alt='sasha_dances'
                  width={24}
                  height={24}
                  className='h-6 w-6 rounded-full border-2 border-white object-cover'
                />
                <span className='text-xs font-medium text-white'>
                  sasha_dances
                </span>
                <Image
                  src='https://ext.same-assets.com/3322540528/871220803.png'
                  alt='Verified'
                  width={12}
                  height={12}
                />
              </div>
            </div>

            {/* Right Creator */}
            <div className='relative h-72 w-48 overflow-hidden rounded-3xl'>
              <Image
                src='https://ext.same-assets.com/3322540528/2225745264.png'
                alt='MikeCooks'
                fill
                className='object-cover'
              />
              <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                <Image
                  src='https://ext.same-assets.com/3322540528/2225745264.png'
                  alt='MikeCooks'
                  width={24}
                  height={24}
                  className='h-6 w-6 rounded-full border-2 border-white object-cover'
                />
                <span className='text-xs font-medium text-white'>
                  MikeCooks
                </span>
                <Image
                  src='https://ext.same-assets.com/3322540528/871220803.png'
                  alt='Verified'
                  width={12}
                  height={12}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-[#0a0a0a] py-24'>
        <div className='mx-auto max-w-[1200px] px-6'>
          {/* Process Badge */}
          <div className='mb-6 flex justify-center'>
            <div className='inline-flex items-center gap-2 rounded-full border border-pink-700/30 bg-pink-900/30 px-4 py-1.5 text-xs'>
              <span className='font-medium tracking-wide text-pink-400 uppercase'>
                Process
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-white md:text-5xl'>
              Here's how we turn your
              <br />
              raw clips into viral content.
            </h2>
            <p className='mx-auto max-w-lg text-lg text-gray-400'>
              From idea to execution, we handle everything — so you can focus on
              creating while we make sure your videos get seen, shared, and
              saved.
            </p>
          </div>

          {/* Process Steps Grid */}
          <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Step 1 */}
            <div className='rounded-3xl bg-[#141414] p-6'>
              <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-pink-900/40 px-3 py-1 text-xs text-pink-400'>
                Step 1
              </div>
              <div className='mb-6 flex gap-3'>
                <div className='h-24 w-24 overflow-hidden rounded-lg'>
                  <Image
                    src='https://ext.same-assets.com/3322540528/3139708538.png'
                    alt='Person 1'
                    width={96}
                    height={96}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='h-24 w-24 overflow-hidden rounded-lg'>
                  <Image
                    src='https://ext.same-assets.com/3322540528/490832111.png'
                    alt='Person 2'
                    width={96}
                    height={96}
                    className='h-full w-full object-cover'
                  />
                </div>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-white'>
                Kickoff call.
              </h3>
              <p className='text-sm text-gray-400'>
                Quick kickoff call to learn your brand, tone, and goals. So
                every video feels authentically you.
              </p>
            </div>

            {/* Step 2 */}
            <div className='rounded-3xl bg-[#141414] p-6'>
              <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-pink-900/40 px-3 py-1 text-xs text-pink-400'>
                Step 2
              </div>
              <div className='mb-6 flex h-32 items-center justify-center'>
                <div className='relative'>
                  <div className='flex h-28 w-20 items-center justify-center rounded-xl bg-gray-800'>
                    <Image
                      src='https://ext.same-assets.com/3322540528/993412145.png'
                      alt='Upload'
                      width={60}
                      height={80}
                      className='rounded-lg'
                    />
                  </div>
                  <div className='absolute -top-2 -right-8 flex items-center gap-1 rounded-full bg-gray-700 px-2 py-1'>
                    <div className='h-3 w-3 rounded-full bg-green-500' />
                    <span className='text-xs text-white'>3</span>
                  </div>
                </div>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-white'>
                Send us your footage.
              </h3>
              <p className='text-sm text-gray-400'>
                Record on your phone, Zoom, podcast, or wherever you like. Just
                upload it — we'll take it from there.
              </p>
            </div>

            {/* Step 3 */}
            <div className='rounded-3xl bg-[#141414] p-6'>
              <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-pink-900/40 px-3 py-1 text-xs text-pink-400'>
                Step 3
              </div>
              <div className='mb-6 rounded-lg bg-gray-800/50 p-4'>
                <div className='mb-2 flex items-center gap-3'>
                  <div className='h-8 w-8 rounded-full bg-gray-600' />
                  <div className='flex-1'>
                    <div className='inline-block rounded-lg bg-gray-700 px-3 py-2 text-xs text-white'>
                      Hey, we uploaded the edited reels
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-end gap-3'>
                  <div className='inline-block rounded-lg bg-white px-3 py-2 text-xs text-black'>
                    These look awesome!
                  </div>
                </div>
                <div className='mt-2 flex items-center gap-3'>
                  <div className='h-8 w-8 rounded-full bg-gray-600' />
                  <div className='inline-block rounded-lg bg-gray-700 px-3 py-2 text-xs text-white'>
                    Glad you liked them! Just finishing your next week's content
                  </div>
                </div>
              </div>
              <h3 className='mb-2 text-lg font-semibold text-white'>
                We edit. You approve.
              </h3>
              <p className='text-sm text-gray-400'>
                Our team crafts edits with hooks, subtitles, music, and visual
                flair. You review, request changes, or hit post.
              </p>
            </div>

            {/* Step 4 */}
            <div className='rounded-3xl bg-[#141414] p-6'>
              <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-pink-900/40 px-3 py-1 text-xs text-pink-400'>
                Step 4
              </div>
              <div className='mb-6 flex h-32 items-end justify-center gap-1'>
                {[40, 55, 70, 60, 80, 65, 90, 75].map((height, i) => (
                  <div
                    key={i}
                    className='w-6 rounded-t-md bg-white'
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <h3 className='mb-2 text-lg font-semibold text-white'>
                Track what works.
              </h3>
              <p className='text-sm text-gray-400'>
                Each month, we show you what's performing best — so you can
                double down on content that converts.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-[#f8f8f8] py-24'>
        <div className='mx-auto max-w-[1200px] px-6'>
          {/* Projects Badge */}
          <div className='mb-6 flex justify-center'>
            <div className='inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 text-xs'>
              <span className='font-medium tracking-wide text-pink-600 uppercase'>
                Projects
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold md:text-5xl'>
              Where strategy meets
              <br />
              scroll-stopping content.
            </h2>
            <p className='mx-auto max-w-md text-lg text-gray-500'>
              A curated look at how we turned raw footage into viral-worthy
              moments — and real audience growth.
            </p>
          </div>

          {/* Projects Grid */}
          <div className='mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2'>
            {projects.map((project) => (
              <div key={project.id} className='group relative cursor-pointer'>
                <div className='relative aspect-[3/4] overflow-hidden rounded-3xl'>
                  <Image
                    src={project.image}
                    alt={project.username}
                    fill
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  {/* Username */}
                  <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                    <Image
                      src={project.image}
                      alt={project.username}
                      width={28}
                      height={28}
                      className='h-7 w-7 rounded-full border-2 border-white object-cover'
                    />
                    <span className='text-sm font-medium text-white'>
                      {project.username}
                    </span>
                    <Image
                      src='https://ext.same-assets.com/3322540528/871220803.png'
                      alt='Verified'
                      width={14}
                      height={14}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='bg-[#f8f8f8] py-24'>
        <div className='mx-auto max-w-[1200px] px-6'>
          {/* Purpose Badge */}
          <div className='mb-6 flex justify-center'>
            <div className='inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 text-xs'>
              <span className='font-medium tracking-wide text-pink-600 uppercase'>
                Purpose
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold md:text-5xl'>
              Performance-led creatives
              <br />
              that helps brands scale faster.
            </h2>
            <p className='mx-auto max-w-md text-lg text-gray-500'>
              We blend aesthetics with performance to help you turn views into
              real business outcomes.
            </p>
          </div>

          {/* Creator Cards */}
          <div className='flex justify-center gap-6'>
            {/* Card 1 - zaratalks */}
            <div className='relative'>
              <div className='relative h-80 w-64 overflow-hidden rounded-3xl'>
                <Image
                  src='https://ext.same-assets.com/3322540528/3139708538.png'
                  alt='zaratalks'
                  fill
                  className='object-cover'
                />
                {/* Username */}
                <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                  <Image
                    src='https://ext.same-assets.com/3322540528/3139708538.png'
                    alt='zaratalks'
                    width={28}
                    height={28}
                    className='h-7 w-7 rounded-full border-2 border-white'
                  />
                  <span className='text-sm font-medium text-white'>
                    zaratalks
                  </span>
                  <Image
                    src='https://ext.same-assets.com/3322540528/871220803.png'
                    alt='Verified'
                    width={14}
                    height={14}
                  />
                </div>
              </div>
              {/* Floating Badge */}
              <div className='absolute top-4 right-4 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-lg'>
                6.1% conversion
              </div>
              {/* Bottom Badge */}
              <div className='absolute -bottom-2 -left-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-lg'>
                5k follower growth
              </div>
            </div>

            {/* Card 2 - travelwithmia */}
            <div className='relative mt-8'>
              <div className='relative h-80 w-64 overflow-hidden rounded-3xl'>
                <Image
                  src='https://ext.same-assets.com/3322540528/490832111.png'
                  alt='travelwithmia'
                  fill
                  className='object-cover'
                />
                {/* Username */}
                <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                  <Image
                    src='https://ext.same-assets.com/3322540528/490832111.png'
                    alt='travelwithmia'
                    width={28}
                    height={28}
                    className='h-7 w-7 rounded-full border-2 border-white'
                  />
                  <span className='text-sm font-medium text-white'>
                    travelwithmia
                  </span>
                  <Image
                    src='https://ext.same-assets.com/3322540528/871220803.png'
                    alt='Verified'
                    width={14}
                    height={14}
                  />
                </div>
              </div>
              {/* Floating Badge */}
              <div className='absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-lg'>
                <svg
                  className='h-3 w-3'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
                  <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
                </svg>
                Link clicks
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-[#0a0a0a] py-24'>
        <div className='mx-auto max-w-[1200px] px-6'>
          {/* Quotes Grid */}
          <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2'>
            {quotes.map((quote, index) => (
              <div key={index} className='rounded-lg bg-[#141414] p-6'>
                <div className='mb-4 text-2xl text-gray-500'>"</div>
                <p className='mb-6 text-sm leading-relaxed text-white'>
                  {quote.quote}
                </p>
                <div className='flex items-center gap-3'>
                  <Image
                    src={quote.avatar}
                    alt={quote.name}
                    width={40}
                    height={40}
                    className='h-10 w-10 rounded-full object-cover'
                  />
                  <span className='text-sm font-medium text-white'>
                    {quote.name}
                  </span>
                  <Image
                    src='https://ext.same-assets.com/3322540528/871220803.png'
                    alt='Verified'
                    width={14}
                    height={14}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id='pricing' className='bg-[#0a0a0a] py-24'>
        <div className='mx-auto max-w-[1200px] px-6'>
          {/* Pricing Badge */}
          <div className='mb-6 flex justify-center'>
            <div className='inline-flex items-center gap-2 rounded-full border border-pink-700/30 bg-pink-900/30 px-4 py-1.5 text-xs'>
              <span className='font-medium tracking-wide text-pink-400 uppercase'>
                Pricing
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-white md:text-5xl'>
              Flexible plans built for growth.
            </h2>
            <p className='mx-auto max-w-lg text-lg text-gray-400'>
              Pick a plan that fits your content needs and lets us do the heavy
              lifting.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className='mx-auto flex max-w-xl flex-col gap-6'>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-3xl p-6 ${
                  plan.popular
                    ? "border border-gray-700 bg-[#1a1a1a]"
                    : "bg-[#141414]"
                }`}
              >
                <div className='mb-4 flex items-start justify-between'>
                  <div>
                    <h3 className='text-lg font-semibold text-white'>
                      {plan.name}
                    </h3>
                    <p className='mt-1 text-sm text-gray-400'>
                      {plan.description}
                    </p>
                  </div>
                  <div className='text-xl font-bold text-white'>
                    {plan.price}/m
                  </div>
                </div>

                <ul className='mb-6 space-y-3'>
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className='flex items-center gap-3 text-sm text-gray-300'
                    >
                      <span className='text-gray-500'>•</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href='https://cal.com'
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {plan.popular && (
                    <Image
                      src='https://ext.same-assets.com/3322540528/3374079693.png'
                      alt='Avatar'
                      width={20}
                      height={20}
                      className='h-5 w-5 rounded-full'
                    />
                  )}
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='bg-[#f8f8f8] py-24'>
        <div className='mx-auto max-w-[1200px] px-6'>
          {/* Mission Badge */}
          <div className='mb-6 flex justify-center'>
            <div className='inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-1.5 text-xs'>
              <span className='font-medium tracking-wide text-pink-600 uppercase'>
                Mission
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-4xl font-bold md:text-5xl'>
              Built for creators who
              <br />
              are ready to grow today.
            </h2>
            <p className='mx-auto max-w-md text-lg text-gray-500'>
              If you're showing up, we'll make sure it converts — with
              short-form content built to scale.
            </p>
          </div>

          {/* Large Creator Card */}
          <div className='relative mx-auto max-w-2xl'>
            <div className='relative overflow-hidden rounded-3xl'>
              <Image
                src='https://ext.same-assets.com/3322540528/2300361184.png'
                alt='_jason'
                width={800}
                height={500}
                className='w-full object-cover'
              />
              {/* Username */}
              <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                <Image
                  src='https://ext.same-assets.com/3322540528/2300361184.png'
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
            <div className='absolute top-8 left-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg'>
              <svg
                className='h-4 w-4 text-red-500'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
              </svg>
              <span className='text-sm font-medium'>200k</span>
            </div>

            {/* Floating Badge - 1.9k profile clicks */}
            <div className='absolute right-4 bottom-16 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg'>
              <svg
                className='h-4 w-4 text-gray-600'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <circle cx='12' cy='12' r='10' />
                <circle cx='12' cy='10' r='3' />
                <path d='M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662' />
              </svg>
              <span className='text-sm font-medium'>1.9k profile clicks</span>
            </div>
          </div>
        </div>
      </section>
      <footer className='bg-[#0a0a0a] py-16'>
        <div className='mx-auto max-w-[1200px] px-6'>
          <div className='flex flex-col justify-between gap-12 md:flex-row'>
            {/* Left Column - Logo and Description */}
            <div className='max-w-xs'>
              <Link href='/' className='mb-4 flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white'>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12 2L2 7L12 12L22 7L12 2Z'
                      stroke='black'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M2 17L12 22L22 17'
                      stroke='black'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M2 12L12 17L22 12'
                      stroke='black'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <span className='text-lg font-semibold text-white'>
                  Influence
                </span>
              </Link>
              <p className='text-sm leading-relaxed text-gray-400'>
                We turn your expertise into viral short-form content that builds
                trust and drives attention.
              </p>
            </div>

            {/* Navigation Columns */}
            <div className='flex gap-16'>
              {/* Column 1 */}
              <div className='flex flex-col gap-3'>
                <Link
                  href='/about'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  About
                </Link>
                <Link
                  href='#pricing'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Pricing
                </Link>
                <Link
                  href='/blog'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Blog
                </Link>
                <Link
                  href='/careers'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Careers
                </Link>
              </div>

              {/* Column 2 */}
              <div className='flex flex-col gap-3'>
                <Link
                  href='https://instagram.com'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Instagram
                </Link>
                <Link
                  href='https://youtube.com'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  YouTube
                </Link>
                <Link
                  href='https://tiktok.com'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  TikTok
                </Link>
              </div>

              {/* Column 3 */}
              <div className='flex flex-col gap-3'>
                <Link
                  href='/contact'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Contact
                </Link>
                <Link
                  href='/terms'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  Terms
                </Link>
                <Link
                  href='/404'
                  className='text-sm text-gray-300 transition-colors hover:text-white'
                >
                  404
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row'>
            <p className='text-sm text-gray-500'>
              © 2026{" "}
              <Link
                href='https://browser.supply'
                className='underline transition-colors hover:text-gray-300'
              >
                browser.supply
              </Link>
              .{" "}
              <Link
                href='https://framer.com'
                className='underline transition-colors hover:text-gray-300'
              >
                Framer
              </Link>{" "}
              website templates
            </p>
            <div className='mt-4 flex items-center gap-2 md:mt-0'>
              <span className='text-sm text-gray-500'>Created by</span>
              <Image
                src='https://ext.same-assets.com/3322540528/3374079693.png'
                alt='Ramish Aziz'
                width={24}
                height={24}
                className='h-6 w-6 rounded-full'
              />
              <Link
                href='https://x.com/ramishdotdesign'
                className='text-sm text-gray-300 underline transition-colors hover:text-white'
              >
                Ramish Aziz
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
