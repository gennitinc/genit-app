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
      <section className="pt-32 pb-16 bg-[#f8f8f8]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Spots Left Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 text-sm">
              <span className="text-orange-500">●</span>
              <span className="text-orange-600 font-medium uppercase text-xs tracking-wide">
                3 spots left for august
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="flex items-center justify-center gap-3 flex-wrap">
                Make changes
                <span className="inline-flex items-center gap-1">
                  <Image
                    src="https://ext.same-assets.com/3322540528/3449985188.png"
                    alt="TikTok"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <Image
                    src="https://ext.same-assets.com/3322540528/587108078.png"
                    alt="Social Icons"
                    width={80}
                    height={40}
                    className="h-10 w-auto"
                  />
                </span>
              </span>
              <span className="block">
                that builds{" "}
                <span className="italic font-serif">real influence.</span>
              </span>
            </h1>

            <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
              We turn your expertise into viral short-form content that builds
              trust and drives attention.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <Link
                href="https://cal.com"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Let&apos;s grow your brand
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                See pricing
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  100+ personal brands
                </span>
                <div className="flex -space-x-2">
                  <Image
                    src="https://ext.same-assets.com/3322540528/3374079693.png"
                    alt="User 1"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <Image
                    src="https://ext.same-assets.com/3322540528/3013210382.png"
                    alt="User 2"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  rated excellent: 5/5
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phone Mockup with Floating Badges */}
          <div className="relative max-w-[500px] mx-auto mt-12">
            {/* Main Phone */}
            <div className="relative">
              <div className="rounded-[32px] overflow-hidden shadow-2xl bg-black">
                <Image
                  src="https://ext.same-assets.com/3322540528/2275812143.jpeg"
                  alt="Creator Content"
                  width={400}
                  height={800}
                  className="w-full"
                />
                {/* Username overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Image
                    src="https://ext.same-assets.com/3322540528/2275812143.jpeg"
                    alt="dan_cooks"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span className="text-white text-sm font-medium">
                    dan_cooks
                  </span>
                  <Image
                    src="https://ext.same-assets.com/3322540528/871220803.png"
                    alt="Verified"
                    width={16}
                    height={16}
                  />
                </div>
              </div>

              {/* Floating Badge - 100+ */}
              <div className="absolute -top-4 -left-12 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-float">
                <svg
                  className="w-4 h-4 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-sm font-medium">100+</span>
              </div>

              {/* Floating Badge - 40k+ */}
              <div
                className="absolute top-1/3 -right-16 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-sm font-medium">40k+</span>
              </div>

              {/* Floating Badge - 30k Likes */}
              <div
                className="absolute bottom-1/3 -left-16 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <svg
                  className="w-4 h-4 text-red-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="text-sm font-medium">30k</span>
              </div>

              {/* Floating Badge - 2k+ followers */}
              <div
                className="absolute bottom-16 -right-20 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <Image
                  src="https://ext.same-assets.com/3322540528/2275812143.jpeg"
                  alt="User"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">2k+ followers</span>
              </div>
            </div>

            {/* Side Buttons */}
            <div className="absolute top-1/3 -right-32 flex flex-col gap-3">
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Buy template
              </button>
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>Made in Framer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-[#f8f8f8]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Spots Left Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 text-sm">
              <span className="text-orange-500">●</span>
              <span className="text-orange-600 font-medium uppercase text-xs tracking-wide">
                3 spots left for august
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your profile growth is
              <br />
              only a few edits away.
            </h2>

            {/* CTA Button */}
            <Link
              href="https://cal.com"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Get started today
            </Link>
          </div>

          {/* Creator Images */}
          <div className="flex justify-center items-end gap-4 mt-12">
            {/* Left Creator */}
            <div className="relative w-48 h-72 rounded-3xl overflow-hidden">
              <Image
                src="https://ext.same-assets.com/3322540528/2824705707.png"
                alt="skin_glow"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Image
                  src="https://ext.same-assets.com/3322540528/2824705707.png"
                  alt="skin_glow"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white text-xs font-medium">
                  skin_glow
                </span>
                <Image
                  src="https://ext.same-assets.com/3322540528/871220803.png"
                  alt="Verified"
                  width={12}
                  height={12}
                />
              </div>
            </div>

            {/* Middle Creator (taller) */}
            <div className="relative w-48 h-96 rounded-3xl overflow-hidden">
              <Image
                src="https://ext.same-assets.com/3322540528/1667287416.png"
                alt="sasha_dances"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Image
                  src="https://ext.same-assets.com/3322540528/1667287416.png"
                  alt="sasha_dances"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white text-xs font-medium">
                  sasha_dances
                </span>
                <Image
                  src="https://ext.same-assets.com/3322540528/871220803.png"
                  alt="Verified"
                  width={12}
                  height={12}
                />
              </div>
            </div>

            {/* Right Creator */}
            <div className="relative w-48 h-72 rounded-3xl overflow-hidden">
              <Image
                src="https://ext.same-assets.com/3322540528/2225745264.png"
                alt="MikeCooks"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Image
                  src="https://ext.same-assets.com/3322540528/2225745264.png"
                  alt="MikeCooks"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white text-xs font-medium">
                  MikeCooks
                </span>
                <Image
                  src="https://ext.same-assets.com/3322540528/871220803.png"
                  alt="Verified"
                  width={12}
                  height={12}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-[#f8f8f8]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Spots Left Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 text-sm">
              <span className="text-orange-500">●</span>
              <span className="text-orange-600 font-medium uppercase text-xs tracking-wide">
                3 spots left for august
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your profile growth is
              <br />
              only a few edits away.
            </h2>

            {/* CTA Button */}
            <Link
              href="https://cal.com"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Get started today
            </Link>
          </div>

          {/* Creator Images */}
          <div className="flex justify-center items-end gap-4 mt-12">
            {/* Left Creator */}
            <div className="relative w-48 h-72 rounded-3xl overflow-hidden">
              <Image
                src="https://ext.same-assets.com/3322540528/2824705707.png"
                alt="skin_glow"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Image
                  src="https://ext.same-assets.com/3322540528/2824705707.png"
                  alt="skin_glow"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white text-xs font-medium">
                  skin_glow
                </span>
                <Image
                  src="https://ext.same-assets.com/3322540528/871220803.png"
                  alt="Verified"
                  width={12}
                  height={12}
                />
              </div>
            </div>

            {/* Middle Creator (taller) */}
            <div className="relative w-48 h-96 rounded-3xl overflow-hidden">
              <Image
                src="https://ext.same-assets.com/3322540528/1667287416.png"
                alt="sasha_dances"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Image
                  src="https://ext.same-assets.com/3322540528/1667287416.png"
                  alt="sasha_dances"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white text-xs font-medium">
                  sasha_dances
                </span>
                <Image
                  src="https://ext.same-assets.com/3322540528/871220803.png"
                  alt="Verified"
                  width={12}
                  height={12}
                />
              </div>
            </div>

            {/* Right Creator */}
            <div className="relative w-48 h-72 rounded-3xl overflow-hidden">
              <Image
                src="https://ext.same-assets.com/3322540528/2225745264.png"
                alt="MikeCooks"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Image
                  src="https://ext.same-assets.com/3322540528/2225745264.png"
                  alt="MikeCooks"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
                <span className="text-white text-xs font-medium">
                  MikeCooks
                </span>
                <Image
                  src="https://ext.same-assets.com/3322540528/871220803.png"
                  alt="Verified"
                  width={12}
                  height={12}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Process Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-pink-900/30 border border-pink-700/30 rounded-full px-4 py-1.5 text-xs">
              <span className="text-pink-400 font-medium uppercase tracking-wide">
                Process
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Here's how we turn your
              <br />
              raw clips into viral content.
            </h2>
            <p className="text-gray-400 text-lg max-w-lg mx-auto">
              From idea to execution, we handle everything — so you can focus on
              creating while we make sure your videos get seen, shared, and
              saved.
            </p>
          </div>

          {/* Process Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="bg-[#141414] rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 bg-pink-900/40 rounded-full px-3 py-1 text-xs text-pink-400 mb-6">
                Step 1
              </div>
              <div className="flex gap-3 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden">
                  <Image
                    src="https://ext.same-assets.com/3322540528/3139708538.png"
                    alt="Person 1"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-24 h-24 rounded-2xl overflow-hidden">
                  <Image
                    src="https://ext.same-assets.com/3322540528/490832111.png"
                    alt="Person 2"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Kickoff call.
              </h3>
              <p className="text-gray-400 text-sm">
                Quick kickoff call to learn your brand, tone, and goals. So
                every video feels authentically you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#141414] rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 bg-pink-900/40 rounded-full px-3 py-1 text-xs text-pink-400 mb-6">
                Step 2
              </div>
              <div className="flex justify-center items-center h-32 mb-6">
                <div className="relative">
                  <div className="w-20 h-28 bg-gray-800 rounded-xl flex items-center justify-center">
                    <Image
                      src="https://ext.same-assets.com/3322540528/993412145.png"
                      alt="Upload"
                      width={60}
                      height={80}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="absolute -top-2 -right-8 flex items-center gap-1 bg-gray-700 rounded-full px-2 py-1">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-white text-xs">3</span>
                  </div>
                </div>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Send us your footage.
              </h3>
              <p className="text-gray-400 text-sm">
                Record on your phone, Zoom, podcast, or wherever you like. Just
                upload it — we'll take it from there.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#141414] rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 bg-pink-900/40 rounded-full px-3 py-1 text-xs text-pink-400 mb-6">
                Step 3
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600" />
                  <div className="flex-1">
                    <div className="bg-gray-700 rounded-lg px-3 py-2 text-white text-xs inline-block">
                      Hey, we uploaded the edited reels
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <div className="bg-white rounded-lg px-3 py-2 text-black text-xs inline-block">
                    These look awesome!
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600" />
                  <div className="bg-gray-700 rounded-lg px-3 py-2 text-white text-xs inline-block">
                    Glad you liked them! Just finishing your next week's content
                  </div>
                </div>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                We edit. You approve.
              </h3>
              <p className="text-gray-400 text-sm">
                Our team crafts edits with hooks, subtitles, music, and visual
                flair. You review, request changes, or hit post.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#141414] rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 bg-pink-900/40 rounded-full px-3 py-1 text-xs text-pink-400 mb-6">
                Step 4
              </div>
              <div className="flex items-end justify-center gap-1 h-32 mb-6">
                {[40, 55, 70, 60, 80, 65, 90, 75].map((height, i) => (
                  <div
                    key={i}
                    className="w-6 bg-white rounded-t-md"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Track what works.
              </h3>
              <p className="text-gray-400 text-sm">
                Each month, we show you what's performing best — so you can
                double down on content that converts.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-[#f8f8f8]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Projects Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-4 py-1.5 text-xs">
              <span className="text-pink-600 font-medium uppercase tracking-wide">
                Projects
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Where strategy meets
              <br />
              scroll-stopping content.
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              A curated look at how we turned raw footage into viral-worthy
              moments — and real audience growth.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {projects.map((project) => (
              <div key={project.id} className="relative group cursor-pointer">
                <div className="rounded-3xl overflow-hidden relative aspect-[3/4]">
                  <Image
                    src={project.image}
                    alt={project.username}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Username */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <Image
                      src={project.image}
                      alt={project.username}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    />
                    <span className="text-white text-sm font-medium">
                      {project.username}
                    </span>
                    <Image
                      src="https://ext.same-assets.com/3322540528/871220803.png"
                      alt="Verified"
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
      <section className="py-24 bg-[#f8f8f8]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Purpose Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-4 py-1.5 text-xs">
              <span className="text-pink-600 font-medium uppercase tracking-wide">
                Purpose
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Performance-led creatives
              <br />
              that helps brands scale faster.
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              We blend aesthetics with performance to help you turn views into
              real business outcomes.
            </p>
          </div>

          {/* Creator Cards */}
          <div className="flex justify-center gap-6">
            {/* Card 1 - zaratalks */}
            <div className="relative">
              <div className="w-64 h-80 rounded-3xl overflow-hidden relative">
                <Image
                  src="https://ext.same-assets.com/3322540528/3139708538.png"
                  alt="zaratalks"
                  fill
                  className="object-cover"
                />
                {/* Username */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Image
                    src="https://ext.same-assets.com/3322540528/3139708538.png"
                    alt="zaratalks"
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full border-2 border-white"
                  />
                  <span className="text-white text-sm font-medium">
                    zaratalks
                  </span>
                  <Image
                    src="https://ext.same-assets.com/3322540528/871220803.png"
                    alt="Verified"
                    width={14}
                    height={14}
                  />
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1.5 shadow-lg text-xs font-medium">
                6.1% conversion
              </div>
              {/* Bottom Badge */}
              <div className="absolute -bottom-2 -left-2 bg-white rounded-full px-3 py-1.5 shadow-lg text-xs font-medium">
                5k follower growth
              </div>
            </div>

            {/* Card 2 - travelwithmia */}
            <div className="relative mt-8">
              <div className="w-64 h-80 rounded-3xl overflow-hidden relative">
                <Image
                  src="https://ext.same-assets.com/3322540528/490832111.png"
                  alt="travelwithmia"
                  fill
                  className="object-cover"
                />
                {/* Username */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Image
                    src="https://ext.same-assets.com/3322540528/490832111.png"
                    alt="travelwithmia"
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full border-2 border-white"
                  />
                  <span className="text-white text-sm font-medium">
                    travelwithmia
                  </span>
                  <Image
                    src="https://ext.same-assets.com/3322540528/871220803.png"
                    alt="Verified"
                    width={14}
                    height={14}
                  />
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1.5 shadow-lg text-xs font-medium flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Link clicks
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Quotes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {quotes.map((quote, index) => (
              <div key={index} className="bg-[#141414] rounded-2xl p-6">
                <div className="text-2xl text-gray-500 mb-4">"</div>
                <p className="text-white text-sm mb-6 leading-relaxed">
                  {quote.quote}
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={quote.avatar}
                    alt={quote.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-white text-sm font-medium">
                    {quote.name}
                  </span>
                  <Image
                    src="https://ext.same-assets.com/3322540528/871220803.png"
                    alt="Verified"
                    width={14}
                    height={14}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="pricing" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Pricing Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-pink-900/30 border border-pink-700/30 rounded-full px-4 py-1.5 text-xs">
              <span className="text-pink-400 font-medium uppercase tracking-wide">
                Pricing
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Flexible plans built for growth.
            </h2>
            <p className="text-gray-400 text-lg max-w-lg mx-auto">
              Pick a plan that fits your content needs and lets us do the heavy
              lifting.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="flex flex-col gap-6 max-w-xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-3xl p-6 ${
                  plan.popular
                    ? "bg-[#1a1a1a] border border-gray-700"
                    : "bg-[#141414]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <div className="text-white text-xl font-bold">
                    {plan.price}/m
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-300 text-sm"
                    >
                      <span className="text-gray-500">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="https://cal.com"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {plan.popular && (
                    <Image
                      src="https://ext.same-assets.com/3322540528/3374079693.png"
                      alt="Avatar"
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-[#f8f8f8]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Mission Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-4 py-1.5 text-xs">
              <span className="text-pink-600 font-medium uppercase tracking-wide">
                Mission
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for creators who
              <br />
              are ready to grow today.
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              If you're showing up, we'll make sure it converts — with
              short-form content built to scale.
            </p>
          </div>

          {/* Large Creator Card */}
          <div className="max-w-2xl mx-auto relative">
            <div className="rounded-3xl overflow-hidden relative">
              <Image
                src="https://ext.same-assets.com/3322540528/2300361184.png"
                alt="_jason"
                width={800}
                height={500}
                className="w-full object-cover"
              />
              {/* Username */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Image
                  src="https://ext.same-assets.com/3322540528/2300361184.png"
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
            <div className="absolute top-8 left-4 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
              <svg
                className="w-4 h-4 text-red-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-sm font-medium">200k</span>
            </div>

            {/* Floating Badge - 1.9k profile clicks */}
            <div className="absolute bottom-16 right-4 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
              </svg>
              <span className="text-sm font-medium">1.9k profile clicks</span>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-[#0a0a0a] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            {/* Left Column - Logo and Description */}
            <div className="max-w-xs">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-lg text-white">
                  Influence
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                We turn your expertise into viral short-form content that builds
                trust and drives attention.
              </p>
            </div>

            {/* Navigation Columns */}
            <div className="flex gap-16">
              {/* Column 1 */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/about"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  href="#pricing"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/careers"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-3">
                <Link
                  href="https://instagram.com"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Instagram
                </Link>
                <Link
                  href="https://youtube.com"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  YouTube
                </Link>
                <Link
                  href="https://tiktok.com"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  TikTok
                </Link>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/404"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  404
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              © 2025{" "}
              <Link
                href="https://browser.supply"
                className="underline hover:text-gray-300 transition-colors"
              >
                browser.supply
              </Link>
              .{" "}
              <Link
                href="https://framer.com"
                className="underline hover:text-gray-300 transition-colors"
              >
                Framer
              </Link>{" "}
              website templates
            </p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">Created by</span>
              <Image
                src="https://ext.same-assets.com/3322540528/3374079693.png"
                alt="Ramish Aziz"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
              <Link
                href="https://x.com/ramishdotdesign"
                className="text-gray-300 text-sm underline hover:text-white transition-colors"
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
