import { HoverVideoPlayer } from "@/components/features/hover-video-player";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  ChevronRight,
  CircleFadingArrowUp,
  Clock,
  Globe,
  Layers,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Teams at Genit",
  description:
    "Meet the team behind Genit. Dedicated to building the future of AI agents that simplify work and empower businesses.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function About2() {
  return (
    <div className='bg-white dark:bg-black'>
      <LandingNavbar />
      <>
        <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
            
                * {
                    font-family: "Poppins", sans-serif;
                }
            `}</style>
        <div className='px-4 py-20'>
          <div className='relative mx-auto flex w-full max-w-5xl flex-col items-center justify-between overflow-hidden rounded-3xl bg-linear-to-b from-violet-100 to-[#FFE8E9] px-6 pt-20 md:flex-row md:items-center md:p-18'>
            <div className='mb-8 flex-1 px-2 text-center md:mt-4 md:mb-0 md:pl-5 md:text-left'>
              <h1 className='text-3xl font-medium text-balance text-gray-900 md:text-4xl/12'>
                <LocalizedText text={"Meet the team Shaping the future."} />
              </h1>
              <p className='mx-auto mt-3 max-w-full text-sm/6 text-gray-700 md:mx-0 md:max-w-sm'>
                <LocalizedText
                  text={
                    "Our diverse team of engineers and designers are dedicated to building AI agents that simplify work and empower businesses."
                  }
                />
              </p>
              <button className='mt-6 cursor-pointer rounded-full bg-white px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 md:mt-8 md:px-8 md:py-3'>
                <LocalizedText text={"Join our team"} />
              </button>
            </div>

            <div className='-mb-6 w-full shrink-0 md:mt-4 md:-mr-18 md:-mb-23 md:w-auto'>
              <img
                className='h-auto w-full rounded-tr-3xl rounded-br-none rounded-bl-none md:w-[490px] md:rounded-tr-none md:rounded-br-3xl'
                src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/team/team-meeting-image.png'
                alt='meeting image'
              />
            </div>
          </div>
        </div>

        <>
          {/* Team */}
          <div className='mx-auto max-w-5xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14'>
            {/* Title */}
            <div className='mx-auto mb-10 max-w-2xl text-center lg:mb-14'>
              <h2 className='text-foreground text-2xl font-bold md:text-4xl md:leading-tight'>
                <LocalizedText text={"Our team"} />
              </h2>
              <p className='text-muted-foreground-2 mt-1'>
                <LocalizedText text={"Creative people"} />
              </p>
            </div>
            {/* End Title */}
            {/* Grid */}
            <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 md:gap-12 lg:grid-cols-5'>
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"David Forren"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Founder / CEO"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Amil Evara"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"UI/UX Designer"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Ebele Egbuna"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Support Consultant"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Maria Powers"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Director of sales"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Delia Pawelke"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Front-end Developer"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Tom Lowry"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"UI/UX Designer"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Louise Donadieu"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Support Consultant"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1514222709107-a180c68d72b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Jeff Fisher"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Project Manager"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1602452920335-6a132309c7c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Sophia Harrington"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Project Manager"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Christina Kray"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Support Consultant"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1514846226882-28b324ef7f28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Amy Forren"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Product Designer"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Philip Williams"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Support Consultant"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1520409364224-63400afe26e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Brian Lofoten"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"UI/UX Designer"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1558507652-2d9626c4e67a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Jessica Dorsey"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"Director of sales"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
              <div className='text-center'>
                <img
                  className='mx-auto size-24 rounded-full'
                  src='https://images.unsplash.com/photo-1521151716396-b2da27b1a19f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80'
                  alt='Avatar'
                />
                <div className='mt-2 sm:mt-4'>
                  <h3 className='text-foreground font-medium'>
                    <LocalizedText text={"Nick Jackson"} />
                  </h3>
                  <p className='text-muted-foreground-2 text-sm'>
                    <LocalizedText text={"UI/UX Designer"} />
                  </p>
                </div>
              </div>
              {/* End Col */}
            </div>
            {/* End Grid */}
            {/* Card */}
            <div className='mt-12 flex justify-center'>
              <div className='bg-layer border-layer-line rounded-full border px-3 py-2'>
                <div className='flex items-center gap-x-3'>
                  <span className='text-muted-foreground-1 text-sm'>
                    <LocalizedText text={"Want to work with us?"} />
                  </span>
                  <a
                    className='text-primary hover:text-primary-hover focus:text-primary-focus inline-flex items-center gap-x-2 text-sm font-medium focus:outline-hidden'
                    href='#'
                  >
                    <LocalizedText text={"We are hiring"} />
                    <svg
                      className='size-4 shrink-0'
                      xmlns='http://www.w3.org/2000/svg'
                      width={24}
                      height={24}
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='m9 18 6-6-6-6' />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            {/* End Card */}
          </div>
          {/* End Team */}
        </>
      </>

      <LandingFooter />
    </div>
  );
}