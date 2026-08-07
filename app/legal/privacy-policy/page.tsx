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
  title: "Privacy Policy – Genit AI",
  description:
    "Read Genit AI's privacy policy to understand how we collect, use, and protect your personal data.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function About2() {
  return (
    <div className='bg-white dark:bg-black'>
      <LandingNavbar />

      <div className='mx-auto w-full max-w-5xl space-y-8 px-6 py-16 md:max-w-7xl'>
        <div className='content mx-auto max-w-4xl'>
          <div>
            <div>
              <h1 className='text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl'>
                <LocalizedText text={"Privacy"} />{" "}
                <span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
                  <LocalizedText text={"Policy"} />
                </span>
              </h1>
              <p className='text-gray-9 mt-2 text-start text-sm leading-[1.6] font-normal text-neutral-600 dark:text-neutral-400'>
                <LocalizedText text={"Last update:"} />
                <time dateTime='2026-07-15'>
                  <LocalizedText text={"July 15th, 2026"} />
                </time>
              </p>
            </div>
            <h2
              id='1-introduction'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#1-introduction' className='relative'>
                <LocalizedText text={"1. Introduction"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Welcome to genit - Your AI Agent Brand Management Platform."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText
                  text={'Klip Technologies, Inc. ("us", "we", or "our")'}
                />
              </strong>{" "}
              <LocalizedText text={"operates"} />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://trygenit.com'
              >
                <LocalizedText text={"https://trygenit.com"} />
              </a>{" "}
              <LocalizedText text={"(hereinafter referred to as"} />{" "}
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={'"Service"'} />
              </strong>
              <LocalizedText
                text={
                  "), an AI agent platform that helps businesses manage and grow their brand from a single workspace by executing end-to-end marketing activities."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={"Our Privacy Policy governs your visit to"}
              />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://trygenit.com'
              >
                <LocalizedText text={"https://trygenit.com"} />
              </a>
              <LocalizedText
                text={
                  ", and explains how we collect, safeguard and disclose information that results from your use of our AI agent platform Service."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We use your data to provide and improve Service. By using Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our Terms and Conditions."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText text={"Our Terms and Conditions ("} />
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"“Terms”"} />
              </strong>
              <LocalizedText
                text={
                  ") govern all use of our Service and together with the Privacy Policy constitutes your agreement with us ("
                }
              />
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"“agreement”"} />
              </strong>
              ).
            </p>
            <h2
              id='2-definitions'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#2-definitions' className='relative'>
                <LocalizedText text={"2. Definitions"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"SERVICE"} />
              </strong>{" "}
              <LocalizedText text={"means the"} />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://trygenit.com'
              >
                <LocalizedText text={"https://trygenit.com"} />
              </a>{" "}
              <LocalizedText
                text={"website operated by Klip Technologies, Inc."}
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"PERSONAL DATA"} />
              </strong>{" "}
              <LocalizedText
                text={
                  "means data about a living individual who can be identified from those data (or from those and other information either in our possession or likely to come into our possession)."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"USAGE DATA"} />
              </strong>{" "}
              <LocalizedText
                text={
                  "is data collected automatically either generated by the use of Service or from Service infrastructure itself (for example, the duration of a page visit)."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"COOKIES"} />
              </strong>{" "}
              <LocalizedText
                text={
                  "are small files stored on your device (computer or mobile device)."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"DATA CONTROLLER"} />
              </strong>{" "}
              <LocalizedText
                text={
                  "means a natural or legal person who (either alone or jointly or in common with other persons) determines the purposes for which and the manner in which any personal data are, or are to be, processed. For the purpose of this Privacy Policy, we are a Data Controller of your data."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText
                  text={"DATA PROCESSORS (OR SERVICE PROVIDERS)"}
                />
              </strong>{" "}
              <LocalizedText
                text={
                  "means any natural or legal person who processes the data on behalf of the Data Controller. We may use the services of various Service Providers in order to process your data more effectively."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"DATA SUBJECT"} />
              </strong>{" "}
              <LocalizedText
                text={
                  "is any living individual who is the subject of Personal Data."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"THE USER"} />
              </strong>{" "}
              <LocalizedText
                text={
                  "is the individual using our Service. The User corresponds to the Data Subject, who is the subject of Personal Data."
                }
              />
            </p>
            <h2
              id='3-information-collection-and-use'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#3-information-collection-and-use' className='relative'>
                <LocalizedText text={"3. Information Collection and Use"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We collect several different types of information for various purposes to provide and improve our Service to you."
                }
              />
            </p>
            <h2
              id='4-types-of-data-collected'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#4-types-of-data-collected' className='relative'>
                <LocalizedText text={"4. Types of Data Collected"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <h3
              id='personal-data'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a href='#personal-data' className='relative'>
                <LocalizedText text={"Personal Data"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (“Personal Data”). Personally identifiable information may include, but is not limited to:"
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Email address First name and last name Address, State, Province, ZIP/Postal code, City Cookies and Usage Data We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link."
                }
              />
            </p>
            <h3
              id='usage-data'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a href='#usage-data' className='relative'>
                <LocalizedText text={"Usage Data"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We may also collect information that your browser sends whenever you visit our Service or when you access Service by or through a mobile device (“Usage Data”)."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "When you access Service with a mobile device, this Usage Data may include information such as the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device identifiers and other diagnostic data."
                }
              />
            </p>
            <h2
              id='5-use-of-data'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#5-use-of-data' className='relative'>
                <LocalizedText text={"5. Use of Data"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Klip Technologies, Inc. uses the collected data for various purposes:"
                }
              />
            </p>
            <ol className='my-5 flex list-decimal flex-col gap-3 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
              <li>
                <LocalizedText
                  text={"to notify you about changes to our Service;"}
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "to allow you to participate in interactive features of our Service when you choose to do so;"
                  }
                />
              </li>
              <li>
                <LocalizedText text={"to provide customer support;"} />
              </li>
              <li>
                <LocalizedText
                  text={
                    "to gather analysis or valuable information so that we can improve our Service;"
                  }
                />
              </li>
              <li>
                <LocalizedText text={"to monitor the usage of our Service;"} />
              </li>
              <li>
                <LocalizedText
                  text={"to detect, prevent and address technical issues;"}
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "to fulfill any other purpose for which you provide it;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "to carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "to provide you with notices about your account and/or subscription, including expiration and renewal notices, email-instructions, etc.;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "to provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "in any other way we may describe when you provide the information;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={"for any other purpose with your consent."}
                />
              </li>
            </ol>
            <h2
              id='google-api-services-user-data'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-neutral-950 dark:text-white'
            >
              <a href='#google-api-services-user-data' className='relative'>
                <LocalizedText text={"Google API Services User Data"} />
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Genit accesses Google user data only after you choose to connect a Google service and grant permission through Google's OAuth consent flow. The data accessed depends on the integrations and features you enable and may include:"
                }
              />
            </p>
            <ul className='my-5 flex list-disc flex-col gap-3 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
              <li>
                <LocalizedText
                  text={
                    "your Google Account email address, name, profile image, and account identifiers so we can identify and display the connected account;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "Gmail messages, threads, headers, attachments, labels, and sending information used to display the unified inbox, provide conversation context, send messages you approve or configure, and organize messages;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "Google Calendar lists and event information, including titles, descriptions, dates, times, attendees, and availability, used to display schedules and create, update, or delete marketing events at your direction;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "Google Drive and Workspace files, folders, content, and metadata that you open with Genit or ask Genit to create, used to import marketing assets and save or manage generated content;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "YouTube channel information, videos, playlists, comments, and analytics used to publish and manage channel content, respond to comments, and report performance; and"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "Google Ads account, campaign, advertisement, and performance information used to create, manage, and report on advertising activity you request."
                  }
                />
              </li>
            </ul>
            <h3 className='mt-8 mb-2 text-lg font-semibold text-neutral-950 dark:text-white'>
              <LocalizedText text={"How we use and share Google user data"} />
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We use Google user data only to provide or improve the user-facing integration you request. We do not sell Google user data, use it for advertising or retargeting, or use it to train generalized or foundation AI models. When an AI-assisted feature requires processing Google user data, we and our contracted service providers process only the data needed to produce the output you requested. Service providers may process Google user data solely on our behalf under confidentiality and data protection obligations. We may also disclose data when you direct us to do so or when required by law."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Genit's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements."
                }
              />
            </p>
            <h3 className='mt-8 mb-2 text-lg font-semibold text-neutral-950 dark:text-white'>
              <LocalizedText
                text={"Storage, protection, retention, and deletion"}
              />
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We may store connected-account identifiers, encrypted OAuth credentials, integration settings and synchronization state, and Google content needed to provide an enabled feature. We protect Google user data using access controls, encryption in transit, encryption of stored OAuth credentials, and monitoring designed to prevent unauthorized access, disclosure, alteration, or loss."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We retain Google user data only while your integration is active and for as long as needed to provide the requested feature, comply with law, resolve disputes, or maintain security. You can disconnect a Google integration from your Genit settings or revoke Genit's access through your Google Account. Disconnecting stops future access and removes the authorization credentials from the active integration. You may also request deletion of Google user data associated with your account by emailing"
                }
              />{" "}
              <a
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='mailto:team@trygenit.com'
              >
                <LocalizedText text={"team@trygenit.com"} />
              </a>
              <LocalizedText
                text={
                  ". We delete or de-identify retained copies when they are no longer required, subject to limited backup, security, fraud-prevention, and legal-retention obligations."
                }
              />
            </p>
            <h2
              id='6-retention-of-data'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#6-retention-of-data' className='relative'>
                <LocalizedText text={"6. Retention of Data"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods."
                }
              />
            </p>
            <h2
              id='7-transfer-of-data'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#7-transfer-of-data' className='relative'>
                <LocalizedText text={"7. Transfer of Data"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Your information, including Personal Data, may be transferred to – and maintained on – computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Klip Technologies, Inc. will take all the steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organisation or a country unless there are adequate controls in place including the security of your data and other personal information."
                }
              />
            </p>
            <h2
              id='8-disclosure-of-data'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#8-disclosure-of-data' className='relative'>
                <LocalizedText text={"8. Disclosure of Data"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We may disclose personal information that we collect, or you provide:"
                }
              />
            </p>
            <h3
              id='disclosure-for-law-enforcement'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a href='#disclosure-for-law-enforcement' className='relative'>
                <LocalizedText text={"Disclosure for Law Enforcement."} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Under certain circumstances, we may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities."
                }
              />
            </p>
            <h3
              id='other-cases-we-may-disclose-your-information-also'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a
                href='#other-cases-we-may-disclose-your-information-also'
                className='relative'
              >
                <LocalizedText
                  text={"Other cases. We may disclose your information also:"}
                />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <ol className='my-5 flex list-decimal flex-col gap-3 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
              <li>
                <LocalizedText
                  text={
                    "to contractors, service providers, and other third parties we use to support our business;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={"to fulfill the purpose for which you provide it;"}
                />
              </li>
              <li>
                <LocalizedText text={"with your consent in any other cases;"} />
              </li>
            </ol>
            <h2
              id='9-security-of-data'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#9-security-of-data' className='relative'>
                <LocalizedText text={"9. Security of Data"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security."
                }
              />
            </p>
            <h2
              id='10-your-data-protection-rights-under-general-data-protection-regulation-gdpr'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a
                href='#10-your-data-protection-rights-under-general-data-protection-regulation-gdpr'
                className='relative'
              >
                <LocalizedText
                  text={
                    "10. Your Data Protection Rights Under General Data Protection Regulation (GDPR)"
                  }
                />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "If you are a resident of the European Union (EU) and European Economic Area (EEA), you have certain data protection rights, covered by GDPR. – See more at:"
                }
              />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://eur-lex.europa.eu/eli/reg/2016/679/oj'
              >
                <LocalizedText
                  text={"https://eur-lex.europa.eu/eli/reg/2016/679/oj"}
                />
              </a>
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please email us at"
                }
              />{" "}
              <a
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='mailto:team@trygenit.com'
              >
                <LocalizedText text={"team@trygenit.com"} />
              </a>
              .
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "In certain circumstances, you have the following data protection rights:"
                }
              />
            </p>
            <ol className='my-5 flex list-decimal flex-col gap-3 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
              <li>
                <LocalizedText
                  text={
                    "the right to access, update or to delete the information we have on you;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "the right of rectification. You have the right to have your information rectified if that information is inaccurate or incomplete;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "the right to object. You have the right to object to our processing of your Personal Data;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "the right of restriction. You have the right to request that we restrict the processing of your personal information;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "the right to data portability. You have the right to be provided with a copy of your Personal Data in a structured, machine-readable and commonly used format;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "the right to withdraw consent. You also have the right to withdraw your consent at any time where we rely on your consent to process your personal information;"
                  }
                />
              </li>
            </ol>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Please note that we may ask you to verify your identity before responding to such requests. Please note, we may not able to provide Service without some necessary data."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "You have the right to complain to a Data Protection Authority about our collection and use of your Personal Data. For more information, please contact your local data protection authority in the European Economic Area (EEA)."
                }
              />
            </p>
            <h2
              id='11-your-data-protection-rights-under-the-california-privacy-protection-act-caloppa'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a
                href='#11-your-data-protection-rights-under-the-california-privacy-protection-act-caloppa'
                className='relative'
              >
                <LocalizedText
                  text={
                    "11. Your Data Protection Rights under the California Privacy Protection Act (CalOPPA)"
                  }
                />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law’s reach stretches well beyond California to require a person or company in the United States (and conceivable the world) that operates websites collecting personally identifiable information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals with whom it is being shared, and to comply with this policy. – See more at:"
                }
              />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://consumercal.org/about-cfc/cfc-education-foundation/california-online-privacy-protection-act-caloppa-3/'
              >
                <LocalizedText
                  text={
                    "https://consumercal.org/about-cfc/cfc-education-foundation/california-online-privacy-protection-act-caloppa-3/"
                  }
                />
              </a>
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={"According to CalOPPA we agree to the following:"}
              />
            </p>
            <ol className='my-5 flex list-decimal flex-col gap-3 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
              <li>
                <LocalizedText text={"users can visit our site anonymously;"} />
              </li>
              <li>
                <LocalizedText
                  text={
                    "our Privacy Policy link includes the word “Privacy”, and can easily be found on the page specified above on the home page of our website;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "users will be notified of any privacy policy changes on our Privacy Policy Page;"
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "users are able to change their personal information by emailing us at"
                  }
                />{" "}
                <a
                  className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                  href='mailto:team@trygenit.com'
                >
                  <LocalizedText text={"team@trygenit.com"} />
                </a>
                .
              </li>
            </ol>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText text={"Our Policy on “Do Not Track” Signals:"} />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We honor Do Not Track signals and do not track, plant cookies, or use advertising when a Do Not Track browser mechanism is in place. Do Not Track is a preference you can set in your web browser to inform websites that you do not want to be tracked."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser."
                }
              />
            </p>
            <h2
              id='12-your-data-protection-rights-under-the-california-consumer-privacy-act-ccpa'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a
                href='#12-your-data-protection-rights-under-the-california-consumer-privacy-act-ccpa'
                className='relative'
              >
                <LocalizedText
                  text={
                    "12. Your Data Protection Rights under the California Consumer Privacy Act (CCPA)"
                  }
                />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "If you are a California resident, you are entitled to learn what data we collect about you, ask to delete your data and not to sell (share) it. To exercise your data protection rights, you can make certain requests and ask us:"
                }
              />
            </p>
            <h3
              id='a-what-personal-information-we-have-about-you'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a
                href='#a-what-personal-information-we-have-about-you'
                className='relative'
              >
                <LocalizedText
                  text={"a) What personal information we have about you."}
                />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={"If you make this request, we will return to you"}
              />
            </p>
            <ol className='my-5 flex list-decimal flex-col gap-3 pl-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
              <li>
                <LocalizedText
                  text={
                    "The categories of personal information we have collected about you."
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "The categories of sources from which we collect your personal information."
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "The business or commercial purpose for collecting or selling your personal information."
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "The categories of third parties with whom we share personal information."
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "The specific pieces of personal information we have collected about you."
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "A list of categories of personal information that we have sold, along with the category of any other company we sold it to. If we have not sold your personal information, we will inform you of that fact."
                  }
                />
              </li>
              <li>
                <LocalizedText
                  text={
                    "A list of categories of personal information that we have disclosed for a business purpose, along with the category of any other company we shared it with."
                  }
                />
              </li>
            </ol>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Please note, you are entitled to ask us to provide you with this information up to two times in a rolling twelve-month period. When you make this request, the information provided may be limited to the personal information we collected about you in the previous 12 months."
                }
              />
            </p>
            <h3
              id='b-to-delete-your-personal-information'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a
                href='#b-to-delete-your-personal-information'
                className='relative'
              >
                <LocalizedText
                  text={"b) To delete your personal information."}
                />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "If you make this request, we will delete the personal information we hold about you as of the date of your request from our records and direct any service providers to do the same. In some cases, deletion may be accomplished through de-identification of the information. If you choose to delete your personal information, you may not be able to use certain functions that require your personal information to operate."
                }
              />
            </p>
            <h3
              id='c-to-stop-selling-your-personal-information'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a
                href='#c-to-stop-selling-your-personal-information'
                className='relative'
              >
                <LocalizedText
                  text={"c) To stop selling your personal information"}
                />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We don't sell or rent your personal information to any third parties for any purpose. You are the only owner of your Personal Data and can request disclosure or deletion at any time."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Please note, if you ask us to delete or stop selling your data, it may impact your experience with us, and you may not be able to participate in certain programs or membership services which require the usage of your personal information to function. But in no circumstances, we will discriminate against you for exercising your rights."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "To exercise your California data protection rights described above, please send your request(s) by one of the following means:"
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText text={"By email:"} />{" "}
              <a
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='mailto:team@trygenit.com'
              >
                <LocalizedText text={"team@trygenit.com"} />
              </a>
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Your data protection rights, described above, are covered by the CCPA, short for the California Consumer Privacy Act. To find out more, visit the official California Legislative Information website. The CCPA took effect on 01/01/2020."
                }
              />
            </p>
            <h2
              id='13-service-providers'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#13-service-providers' className='relative'>
                <LocalizedText text={"13. Service Providers"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We may employ third party companies and individuals to facilitate our Service (“Service Providers”), provide Service on our behalf, perform Service-related services or assist us in analysing how our Service is used."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose."
                }
              />
            </p>
            <h2
              id='14-analytics'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#14-analytics' className='relative'>
                <LocalizedText text={"14. Analytics"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We may use third-party Service Providers to monitor and analyze the use of our Service."
                }
              />
            </p>
            <h3
              id='google-analytics'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a href='#google-analytics' className='relative'>
                <LocalizedText text={"Google Analytics"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service. This data is shared with other Google services. Google may use the collected data to contextualise and personalise the ads of its own advertising network."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "For more information on the privacy practices of Google, please visit the Google Privacy Terms web page:"
                }
              />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://policies.google.com/privacy?hl=en'
              >
                <LocalizedText
                  text={"https://policies.google.com/privacy?hl=en"}
                />
              </a>
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We also encourage you to review the Google's policy for safeguarding your data:"
                }
              />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://support.google.com/analytics/answer/6004245'
              >
                <LocalizedText text={"https://support.google.com/analytics"} />
              </a>
              .
            </p>
            <h3
              id='mixpanel'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a href='#mixpanel' className='relative'>
                <LocalizedText text={"Mixpanel"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText text={"Mixpanel is provided by Mixpanel Inc."} />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "You can prevent Mixpanel from using your information for analytics purposes by opting-out. To opt-out of Mixpanel service, please visit this page:"
                }
              />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://mixpanel.com/optout/'
              >
                <LocalizedText text={"https://mixpanel.com/optout/"} />
              </a>
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "For more information on what type of information Mixpanel collects, please visit the Terms of Use page of Mixpanel: https://mixpanel.com/terms/"
                }
              />
            </p>
            <h3
              id='segmentio'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a href='#segmentio' className='relative'>
                <LocalizedText text={"Segment.io"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Segment.io is a web traffic analysis tool. You can read the Privacy Policy for Segment.io here:"
                }
              />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://segment.com/legal/privacy/'
              >
                <LocalizedText text={"https://segment.com/legal/privacy/"} />
              </a>
              .
            </p>
            <h2
              id='15-cicd-tools'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#15-cicd-tools' className='relative'>
                <LocalizedText text={"15. CI/CD tools"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We may use third-party Service Providers to automate the development process of our Service."
                }
              />
            </p>
            <h3
              id='circleci'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a href='#circleci' className='relative'>
                <LocalizedText text={"CircleCI"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={"CircleCI is provided by Circle Internet Services, Inc."}
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "CircleCI is Continuous Integration, a development practice which is being used by software teams allowing them to build, test and deploy applications easier and quicker on multiple platforms."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "For more information on what data Circle CI collects for what purpose and how the protection of the data is ensured, please visit Circle CI Privacy Policy page:"
                }
              />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://circleci.com/privacy/'
              >
                <LocalizedText text={"https://circleci.com/privacy/"} />
              </a>
              .
            </p>
            <h2
              id='16-payments'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#16-payments' className='relative'>
                <LocalizedText text={"16. Payments"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We may provide paid products and/or services within Service. In that case, we use third-party services for payment processing (e.g. payment processors)."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, Mastercard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of payment information."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={"The payment processors we work with are:"}
              />
            </p>
            <h3
              id='stripe'
              className='group relative mt-12 mb-2 scroll-mt-20 text-lg font-semibold text-white'
            >
              <a href='#stripe' className='relative'>
                <LocalizedText text={"Stripe"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText text={"Their Privacy Policy can be viewed at:"} />{" "}
              <a
                target='_blank'
                rel='noopener noreferrer'
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='https://stripe.com/us/privacy'
              >
                <LocalizedText text={"https://stripe.com/us/privacy"} />
              </a>
            </p>
            <h2
              id='17-links-to-other-sites'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#17-links-to-other-sites' className='relative'>
                <LocalizedText text={"17. Links to Other Sites"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services."
                }
              />
            </p>
            <h2
              id='18-childrens-privacy'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#18-childrens-privacy' className='relative'>
                <LocalizedText text={"18. Children's Privacy"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "Our Services are not intended for use by children under the age of 18 ("
                }
              />
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"“Child”"} />
              </strong>{" "}
              <LocalizedText text={"or"} />{" "}
              <strong className='text-slate-12 font-semibold'>
                <LocalizedText text={"“Children”"} />
              </strong>
              ).
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We do not knowingly collect personally identifiable information from Children under 18. If you become aware that a Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from Children without verification of parental consent, we take steps to remove that information from our servers."
                }
              />
            </p>
            <h2
              id='19-changes-to-this-privacy-policy'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#19-changes-to-this-privacy-policy' className='relative'>
                <LocalizedText text={"19. Changes to This Privacy Policy"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update “effective date” at the top of this Privacy Policy."
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
                }
              />
            </p>
            <h2
              id='20-contact-us'
              className='group relative mt-12 mb-2 scroll-mt-20 text-2xl font-semibold text-white'
            >
              <a href='#20-contact-us' className='relative'>
                <LocalizedText text={"20. Contact Us"} />
                <span
                  aria-hidden='true'
                  className='invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox='0 0 15 15'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z'
                      fill='currentColor'
                      fillRule='evenodd'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText
                text={
                  "If you have any questions about this Privacy Policy, please contact us:"
                }
              />
            </p>
            <p className='my-5 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
              <LocalizedText text={"By email:"} />{" "}
              <a
                className='border-slate-11 hover:text-slate-12 hover:border-slate-12 border-b-[.0375rem] border-solid font-medium transition-colors duration-200 ease-in-out'
                href='mailto:team@trygenit.com'
              >
                <LocalizedText text={"team@trygenit.com"} />
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
