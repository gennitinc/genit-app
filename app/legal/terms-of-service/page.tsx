import Image from "next/image";
import {
  ArrowUpRight,
  Users,
  Briefcase,
  Zap,
  Trophy,
  Layers,
  Target,
  Clock,
  Globe,
  Award,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { HoverVideoPlayer } from "@/components/features/hover-video-player";

export default function About2() {
  return (
    <div className="dark:bg-black bg-white">
      <LandingNavbar />
      <div className="mx-auto w-full max-w-5xl px-6 md:max-w-7xl space-y-8 py-16">
        <div className="content mx-auto max-w-4xl">
          <div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl">
                Terms of{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Service
                </span>
              </h1>
              <p className=" text-neutral-600 dark:text-neutral-400 text-sm leading-[1.6] text-gray-9 font-normal mt-2 text-start">
                Last update: <time dateTime="2025-08-01">August 1st, 2025</time>
              </p>
            </div>
            <h2
              id="1-introduction"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#1-introduction" className="relative">
                1. Introduction
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              These Terms of Service (
              <strong className="font-semibold text-slate-12">
                "Terms", "Terms of Service"
              </strong>
              ) in conjunction with our{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="https://gennit.online/legal/privacy-policy"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="https://gennit.online/legal/dpa"
              >
                Data Processing Addendum
              </a>{" "}
              (<strong className="font-semibold text-slate-12">"DPA"</strong>),
              are the entire agreement (
              <strong className="font-semibold text-slate-12">
                "Agreement"
              </strong>
              ) between{" "}
              <strong className="font-semibold text-slate-12">
                Plus Five Five, Inc. ("Company", "We", "Our", "Us")
              </strong>{" "}
              , the operator of Gennit, an AI-powered media design platform, and
              you (
              <strong className="font-semibold text-slate-12">"You"</strong> or
              the{" "}
              <strong className="font-semibold text-slate-12">"User"</strong>).
              These Terms govern Your use of our web pages and services located
              at{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="https://gennit.online"
              >
                gennit.online
              </a>{" "}
              (collectively, the{" "}
              <strong className="font-semibold text-slate-12">"Service"</strong>
              ).
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              By (a) purchasing access to the service through an online ordering
              process that references this agreement, (b) signing up for a free
              plan for the service through a screen that references this
              agreement, or (c) clicking a box indicating acceptance, customer
              agrees to be bound by the Agreement.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              If you do not agree with or cannot comply with this Agreement,
              then you may not use the Service, so please read carefully.
            </p>
            <h2
              id="2-communications"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#2-communications" className="relative">
                2. Communications
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              By creating an Account on our Service, you agree to subscribe to
              newsletters, marketing or promotional materials and other
              information we may send. However, you may opt out of receiving
              any, or all, of these communications from us by following the
              unsubscribe link or by emailing at.
            </p>
            <h2
              id="3-purchases"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#3-purchases" className="relative">
                3. Purchases
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              If you wish to purchase any product or service made available
              through Service (
              <strong className="font-semibold text-slate-12">
                "Purchase"
              </strong>
              ), you may be asked to supply certain information relevant to your
              Purchase including, without limitation, your credit card number,
              the expiration date of your credit card, your billing address, and
              your shipping information.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You represent and warrant that: (i) you have the legal right to
              use any credit card(s) or other payment method(s) in connection
              with any Purchase; and that (ii) the information you supply to us
              is true, correct and complete.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We may employ the use of third party services for the purpose of
              facilitating payment and the completion of Purchases. By
              submitting your information, you grant us the right to provide the
              information to these third parties subject to our Privacy Policy.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We reserve the right to refuse or cancel your order at any time
              for reasons including but not limited to: product or service
              availability, errors in the description or price of the product or
              service, error in your order or other reasons.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We reserve the right to refuse or cancel your order if fraud or an
              unauthorized or illegal transaction is suspected.
            </p>
            <h2
              id="4-contests-sweepstakes-and-promotions"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a
                href="#4-contests-sweepstakes-and-promotions"
                className="relative"
              >
                4. Contests, Sweepstakes and Promotions
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Any contests, sweepstakes or other promotions (collectively,
              "Promotions") made available through Service may be governed by
              rules that are separate from these Terms of Service. If you
              participate in any Promotions, please review the applicable rules
              as well as our Privacy Policy. If the rules for a Promotion
              conflict with these Terms of Service, Promotion rules will apply.
            </p>
            <h2
              id="5-subscriptions"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#5-subscriptions" className="relative">
                5. Subscriptions
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Some parts of Service are billed on a subscription basis
              ("Subscription(s)"). You will be billed in advance on a recurring
              and periodic basis ("Billing Cycle"). Billing cycles are set
              either on a monthly or annual basis, depending on the type of
              subscription plan you select when purchasing a Subscription.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              At the end of each Billing Cycle, your Subscription will
              automatically renew under the exact same conditions unless you
              cancel it or Plus Five Five, Inc. cancels it. You may cancel your
              Subscription renewal either through your online account management
              page or by contacting Plus Five Five, Inc. customer support team.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              A valid payment method, including credit card, is required to
              process the payment for your subscription. You shall provide Plus
              Five Five, Inc. with accurate and complete billing information
              including full name, address, state, zip code, telephone number,
              and a valid payment method information. By submitting such payment
              information, you automatically authorize Plus Five Five, Inc. to
              charge all Subscription fees incurred through your account to any
              such payment instruments.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Should automatic billing fail to occur for any reason, Plus Five
              Five, Inc. will issue an electronic invoice indicating that you
              must proceed manually, within a certain deadline date, with the
              full payment corresponding to the billing period as indicated on
              the invoice.
            </p>
            <h2
              id="6-free-trial"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#6-free-trial" className="relative">
                6. Free Trial
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Plus Five Five, Inc. may, at its sole discretion, offer a
              Subscription with a free trial for a limited period of time (
              <strong className="font-semibold text-slate-12">
                "Free Trial"
              </strong>
              )
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You may be required to enter your billing information in order to
              sign up for Free Trial.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              If you do enter your billing information when signing up for Free
              Trial, you will not be charged by Plus Five Five, Inc. until Free
              Trial has expired. On the last day of Free Trial period, unless
              you cancelled your Subscription, you will be automatically charged
              the applicable Subscription fees for the type of Subscription you
              have selected.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              At any time and without notice, Plus Five Five, Inc. reserves the
              right to (i) modify Terms of Service of Free Trial offer, or (ii)
              cancel such Free Trial offer.
            </p>
            <h2
              id="7-fee-changes"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#7-fee-changes" className="relative">
                7. Fee Changes
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Plus Five Five, Inc., in its sole discretion and at any time, may
              modify Subscription fees for the Subscriptions. Any Subscription
              fee change will become effective at the end of the then-current
              Billing Cycle.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Plus Five Five, Inc. will provide you with a reasonable prior
              notice of any change in Subscription fees to give you an
              opportunity to terminate your Subscription before such change
              becomes effective.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Your continued use of Service after Subscription fee change comes
              into effect constitutes your agreement to pay the modified
              Subscription fee amount.
            </p>
            <h2
              id="8-refunds"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#8-refunds" className="relative">
                8. Refunds
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Except when required by law, paid Subscription fees are
              non-refundable.
            </p>
            <h2
              id="9-content"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#9-content" className="relative">
                9. Content
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Our AI-powered media design Service allows you to create, post,
              link, store, share and otherwise make available certain
              information, text, graphics, videos, animations, interactive
              designs, or other digital media content ("Content"). You are
              responsible for Content that you create, post, or upload on or
              through our Service, including its legality, reliability, and
              appropriateness.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              By creating, posting, or uploading Content on or through our
              AI-powered Service, You represent and warrant that: (i) Content is
              yours (you own it) and/or you have the right to use it and the
              right to grant us the rights and license as provided in these
              Terms, and (ii) that the creation, posting, or uploading of your
              Content on or through Service does not violate the privacy rights,
              publicity rights, copyrights, contract rights or any other rights
              of any person or entity. We reserve the right to terminate the
              account of anyone found to be infringing on a copyright.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You retain any and all of your rights to any Content you create,
              submit, post or display on or through our AI-powered Service and
              you are responsible for protecting those rights. We take no
              responsibility and assume no liability for Content you or any
              third party creates, posts, or uploads on or through Service.
              However, by creating or posting Content using our AI-powered
              Service you grant us the right and license to use such Content for
              purposes of making Service available for other users. This license
              does not include the right for us to make your Content available
              to other users of Service without your approval.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Plus Five Five, Inc. has the right but not the obligation to
              monitor and edit all Content provided by users.
            </p>
            <h2
              id="10-prohibited-uses"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#10-prohibited-uses" className="relative">
                10. Prohibited Uses
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You may use our AI-powered media design Service only for lawful
              purposes and in accordance with Terms. You agree not to use
              Service for:
            </p>
            <ol className="leading-7 flex my-5 list-decimal flex-col gap-3 pl-5 text-slate-11 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <strong className="font-semibold text-slate-12">
                  Misleading AI-Generated Content
                </strong>
                : You are prohibited from creating or distributing AI-generated
                content that is designed to mislead, deceive, or impersonate
                real people or entities.
              </li>
              <li>
                <strong className="font-semibold text-slate-12">
                  Copyright Infringement
                </strong>
                : You are prohibited from using our AI tools to create content
                that infringes on copyrighted material without proper
                authorization.
              </li>
              <li>
                <strong className="font-semibold text-slate-12">
                  Malicious Content
                </strong>
                : You are prohibited from creating or distributing any content
                that contains malware, viruses, or other harmful code, or using
                our AI tools to create content intended to harass, intimidate,
                or threaten any individual or group.
              </li>
              <li>
                <strong className="font-semibold text-slate-12">
                  Illegal Activities
                </strong>
                : You are prohibited from using our AI-powered media design
                Service to engage in any illegal activities or create content
                that violates applicable laws.
              </li>
            </ol>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Additionally, you agree not to:
            </p>
            <ol className="leading-7 flex my-5 list-decimal flex-col gap-3 pl-5 text-slate-11 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                Use our AI-powered Service in any manner that could disable,
                overburden, damage, or impair Service or interfere with any
                other party's use of Service, including their ability to create
                and manage media content.
              </li>
              <li>
                Introduce any viruses, trojan horses, worms, logic bombs, or
                other material which is malicious or technologically harmful
                through our platform.
              </li>
              <li>
                Attempt to gain unauthorized access to, interfere with, damage,
                or disrupt any parts of Service, the server on which Service is
                stored, or any server, computer, or database connected to
                Service.
              </li>
              <li>
                Attack Service via a denial-of-service attack or a distributed
                denial-of-service attack.
              </li>
            </ol>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              If you become aware of any violations, please report it to us
              immediately by contacting{" "}
              <a
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="mailto:support@gennit.online"
              >
                support@gennit.online
              </a>
              .
            </p>
            <h2
              id="11-analytics"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#11-analytics" className="relative">
                11. Analytics
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We may use third-party Service Providers to monitor and analyze
              the use of our Service.
            </p>
            <h3
              id="google-analytics"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-lg"
            >
              <a href="#google-analytics" className="relative">
                Google Analytics
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Google Analytics is a web analytics service offered by Google that
              tracks and reports website traffic. Google uses the data collected
              to track and monitor the use of our Service. This data is shared
              with other Google services. Google may use the collected data to
              contextualise and personalise the ads of its own advertising
              network.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              For more information on the privacy practices of Google, please
              visit the Google Privacy Terms web page:{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="https://policies.google.com/privacy?hl=en"
              >
                https://policies.google.com/privacy?hl=en
              </a>
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We also encourage you to review the Google's policy for
              safeguarding your data:{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="https://support.google.com/analytics/answer/6004245"
              >
                https://support.google.com/analytic
              </a>
              .
            </p>
            <h3
              id="mixpanel"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-lg"
            >
              <a href="#mixpanel" className="relative">
                Mixpanel
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Mixpanel is provided by Mixpanel Inc.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You can prevent Mixpanel from using your information for analytics
              purposes by opting-out. To opt-out of Mixpanel service, please
              visit this page:{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="https://mixpanel.com/optout/"
              >
                https://mixpanel.com/optout/
              </a>
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              For more information on what type of information Mixpanel
              collects, please visit the Terms of Use page of Mixpanel:{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="https://mixpanel.com/terms/"
              >
                https://mixpanel.com/terms/
              </a>
            </p>
            <h2
              id="12-no-use-by-minors"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#12-no-use-by-minors" className="relative">
                12. No Use By Minors
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Service is intended only for access and use by individuals at
              least eighteen (18) years old. By accessing or using any of
              Company, you warrant and represent that you are at least eighteen
              (18) years of age and with the full authority, right, and capacity
              to enter into this agreement and abide by all of the terms and
              conditions of Terms. If you are not at least eighteen (18) years
              old, you are prohibited from both the access and usage of Service.
            </p>
            <h2
              id="13-accounts"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#13-accounts" className="relative">
                13. Accounts
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              When you create an account with us, you guarantee that you are
              above the age of 18, and that the information you provide us is
              accurate, complete, and current at all times. Inaccurate,
              incomplete, or obsolete information may result in the immediate
              termination of your account on Service.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You are responsible for maintaining the confidentiality of your
              account and password, including but not limited to the restriction
              of access to your computer and/or account. You agree to accept
              responsibility for any and all activities or actions that occur
              under your account and/or password, whether your password is with
              our Service or a third-party service. You must notify us
              immediately upon becoming aware of any breach of security or
              unauthorized use of your account.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You may not use as a username the name of another person or entity
              or that is not lawfully available for use, a name or trademark
              that is subject to any rights of another person or entity other
              than you, without appropriate authorization. You may not use as a
              username any name that is offensive, vulgar or obscene.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We reserve the right to refuse service, terminate accounts, remove
              or edit content, or cancel orders in our sole discretion.
            </p>
            <h2
              id="14-intellectual-property"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#14-intellectual-property" className="relative">
                14. Intellectual Property
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Service and its original content (excluding Content provided by
              users), features and functionality are and will remain the
              exclusive property of Plus Five Five, Inc. and its licensors.
              Service is protected by copyright, trademark, and other laws of
              the United States and foreign countries. Our trademarks and trade
              dress may not be used in connection with any product or service
              without the prior written consent of Plus Five Five, Inc.
            </p>
            <h2
              id="15-copyright-policy"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#15-copyright-policy" className="relative">
                15. Copyright Policy
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We respect the intellectual property rights of others. It is our
              policy to respond to any claim that Content posted on Service
              infringes on the copyright or other intellectual property rights
              ("Infringement") of any person or entity.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              If you are a copyright owner, or authorized on behalf of one, and
              you believe that the copyrighted work has been copied in a way
              that constitutes copyright infringement, please submit your claim
              via email to{" "}
              <a
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="mailto:support@gennit.online"
              >
                support@gennit.online
              </a>
              , with the subject line: "Copyright Infringement" and include in
              your claim a detailed description of the alleged Infringement as
              detailed below, under "DMCA Notice and Procedure for Copyright
              Infringement Claims"
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You may be held accountable for damages (including costs and
              attorneys' fees) for misrepresentation or bad-faith claims on the
              infringement of any Content found on and/or through Service on
              your copyright.
            </p>
            <h2
              id="16-dmca-notice-and-procedure-for-copyright-infringement-claims"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a
                href="#16-dmca-notice-and-procedure-for-copyright-infringement-claims"
                className="relative"
              >
                16. DMCA Notice and Procedure for Copyright Infringement Claims
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You may submit a notification pursuant to the Digital Millennium
              Copyright Act (DMCA) by providing our Copyright Agent with the
              following information in writing (see 17 U.S.C 512(c)(3) for
              further detail):
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              an electronic or physical signature of the person authorized to
              act on behalf of the owner of the copyright's interest; a
              description of the copyrighted work that you claim has been
              infringed, including the URL (i.e., web page address) of the
              location where the copyrighted work exists or a copy of the
              copyrighted work; identification of the URL or other specific
              location on Service where the material that you claim is
              infringing is located; your address, telephone number, and email
              address; a statement by you that you have a good faith belief that
              the disputed use is not authorized by the copyright owner, its
              agent, or the law; a statement by you, made under penalty of
              perjury, that the above information in your notice is accurate and
              that you are the copyright owner or authorized to act on the
              copyright owner's behalf. You can contact our Copyright Agent via
              email at{" "}
              <a
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="mailto:support@gennit.online"
              >
                support@gennit.online
              </a>
            </p>
            <h2
              id="17-error-reporting-and-feedback"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#17-error-reporting-and-feedback" className="relative">
                17. Error Reporting and Feedback
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              You may provide us either directly at{" "}
              <a
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="mailto:support@gennit.online"
              >
                support@gennit.online
              </a>{" "}
              or via third party sites and tools with information and feedback
              concerning errors, suggestions for improvements, ideas, problems,
              complaints, and other matters related to our Service ("Feedback").
              You acknowledge and agree that: (i) you shall not retain, acquire
              or assert any intellectual property right or other right, title or
              interest in or to the Feedback; (ii) Company may have development
              ideas similar to the Feedback; (iii) Feedback does not contain
              confidential information or proprietary information from you or
              any third party; and (iv) Company is not under any obligation of
              confidentiality with respect to the Feedback. In the event the
              transfer of the ownership to the Feedback is not possible due to
              applicable mandatory laws, you grant Company and its affiliates an
              exclusive, transferable, irrevocable, free-of-charge,
              sub-licensable, unlimited and perpetual right to use (including
              copy, modify, create derivative works, publish, distribute and
              commercialize) Feedback in any manner and for any purpose.
            </p>
            <h2
              id="18-links-to-other-web-sites"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#18-links-to-other-web-sites" className="relative">
                18. Links To Other Web Sites
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Our Service may contain links to third party web sites or services
              that are not owned or controlled by Plus Five Five, Inc.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Plus Five Five, Inc. has no control over, and assumes no
              responsibility for the content, privacy policies, or practices of
              any third party web sites or services. We do not warrant the
              offerings of any of these entities/individuals or their websites.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              YOU ACKNOWLEDGE AND AGREE THAT PLUS FIVE FIVE, INC. SHALL NOT BE
              RESPONSIBLE OR LIABLE, DIRECTLY OR INDIRECTLY, FOR ANY DAMAGE OR
              LOSS CAUSED OR ALLEGED TO BE CAUSED BY OR IN CONNECTION WITH USE
              OF OR RELIANCE ON ANY SUCH CONTENT, GOODS OR SERVICES AVAILABLE ON
              OR THROUGH ANY SUCH THIRD PARTY WEB SITES OR SERVICES.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              WE STRONGLY ADVISE YOU TO READ THE TERMS OF SERVICE AND PRIVACY
              POLICIES OF ANY THIRD PARTY WEB SITES OR SERVICES THAT YOU VISIT.
            </p>
            <h2
              id="19-disclaimer-of-warranty"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#19-disclaimer-of-warranty" className="relative">
                19. Disclaimer Of Warranty
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              THESE SERVICES ARE PROVIDED BY COMPANY ON AN "AS IS" AND "AS
              AVAILABLE" BASIS. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES
              OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR
              SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED
              THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES,
              THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT
              YOUR SOLE RISK.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY
              WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS,
              SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE
              SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER COMPANY NOR
              ANYONE ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE
              SERVICES, THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH
              THE SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR
              UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES
              OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER
              HARMFUL COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS
              OBTAINED THROUGH THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR
              EXPECTATIONS.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER
              EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT
              LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT,
              AND FITNESS FOR PARTICULAR PURPOSE.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE
              EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
            </p>
            <h2
              id="20-limitation-of-liability"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#20-limitation-of-liability" className="relative">
                20. Limitation Of Liability
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS,
              DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT,
              PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT
              ARISES (INCLUDING ATTORNEYS' FEES AND ALL RELATED COSTS AND
              EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL,
              IF ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED),
              WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS
              ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT,
              INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR
              PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION BY
              YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR
              REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE
              IS LIABILITY FOUND ON THE PART OF COMPANY, IT WILL BE LIMITED TO
              THE AMOUNT PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO
              CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES.
              SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE,
              INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE PRIOR LIMITATION OR
              EXCLUSION MAY NOT APPLY TO YOU.
            </p>
            <h2
              id="21-termination"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#21-termination" className="relative">
                21. Termination
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We may terminate or suspend your account and bar access to Service
              immediately, without prior notice or liability, under our sole
              discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of Terms.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              If you wish to terminate your account, you may simply discontinue
              using Service.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              All provisions of Terms which by their nature should survive
              termination shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity
              and limitations of liability.
            </p>
            <h2
              id="22-governing-law"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#22-governing-law" className="relative">
                22. Governing Law
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              These Terms shall be governed and construed in accordance with the
              laws of State of California without regard to its conflict of law
              provisions.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect. These
              Terms constitute the entire agreement between us regarding our
              Service and supersede and replace any prior agreements we might
              have had between us regarding Service.
            </p>
            <h2
              id="23-changes-to-service"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#23-changes-to-service" className="relative">
                23. Changes To Service
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We reserve the right to withdraw or amend our Service, and any
              service or material we provide via Service, in our sole discretion
              without notice. We will not be liable if for any reason all or any
              part of Service is unavailable at any time or for any period. From
              time to time, we may restrict access to some parts of Service, or
              the entire Service, to users, including registered users.
            </p>
            <h2
              id="24-amendments-to-terms"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#24-amendments-to-terms" className="relative">
                24. Amendments To Terms
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              We may amend Terms at any time by posting the amended terms on
              this site. It is your responsibility to review these Terms
              periodically.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Your continued use of the Service following the posting of revised
              Terms means that you accept and agree to the changes. You are
              expected to check this page frequently so you are aware of any
              changes, as they are binding on you.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              By continuing to access or use our Service after any revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, you are no longer authorized to
              use Service.
            </p>
            <h2
              id="25-waiver-and-severability"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#25-waiver-and-severability" className="relative">
                25. Waiver And Severability
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              No waiver by Company of any term or condition set forth in Terms
              shall be deemed a further or continuing waiver of such term or
              condition or a waiver of any other term or condition, and any
              failure of Company to assert a right or provision under Terms
              shall not constitute a waiver of such right or provision.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              If any provision of Terms is held by a court or other tribunal of
              competent jurisdiction to be invalid, illegal or unenforceable for
              any reason, such provision shall be eliminated or limited to the
              minimum extent such that the remaining provisions of Terms will
              continue in full force and effect.
            </p>
            <h2
              id="26-logo-permission"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#26-logo-permission" className="relative">
                26. Logo Permission
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              By entering into this agreement, the Customer hereby grants the
              Company the non-exclusive, royalty-free right to use the
              Customer's logo for the sole purpose of promoting and referencing
              the Customer as a client of the Company.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Company may use the Customer's logo on its website, marketing
              materials, case studies, and other promotional content. Company
              agrees to use the Customer's logo in a professional manner and in
              accordance with any brand guidelines provided by the Customer.
              This logo usage right is non-transferable and shall remain in
              effect for the duration of the agreement and any subsequent
              renewal periods, unless terminated by either party in writing.
            </p>
            <h2
              id="27-acceptable-use"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#27-acceptable-use" className="relative">
                27. Acceptable Use
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              The Service may only be used in accordance with the Acceptable Use
              Policy found at{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="https://gennit.online/legal/acceptable-use"
              >
                gennit.online/legal/acceptable-use
              </a>
              .
            </p>
            <h2
              id="28-acknowledgement"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#28-acknowledgement" className="relative">
                28. Acknowledgement
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE
              THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY
              THEM
            </p>
            <h2
              id="29-contact-us"
              className="group relative mb-2 mt-12 scroll-mt-20 font-semibold text-white text-2xl"
            >
              <a href="#29-contact-us" className="relative">
                29. Contact Us
                <span
                  aria-hidden="true"
                  className="invisible ml-2 inline-block h-4 w-4 -translate-x-1/2 align-middle text-slate-11 opacity-0 [transition:opacity_300ms_cubic-bezier(.36,.66,.6,1),transform_240ms_cubic-bezier(.36,.66,.6,1),visibility_300ms] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <svg
                    width={15}
                    height={15}
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.51194 3.00541C9.18829 2.54594 10.0435 2.53694 10.6788 2.95419C10.8231 3.04893 10.9771 3.1993 11.389 3.61119C11.8009 4.02307 11.9513 4.17714 12.046 4.32141C12.4633 4.95675 12.4543 5.81192 11.9948 6.48827C11.8899 6.64264 11.7276 6.80811 11.3006 7.23511L10.6819 7.85383C10.4867 8.04909 10.4867 8.36567 10.6819 8.56093C10.8772 8.7562 11.1938 8.7562 11.389 8.56093L12.0077 7.94221L12.0507 7.89929C12.4203 7.52976 12.6568 7.2933 12.822 7.0502C13.4972 6.05623 13.5321 4.76252 12.8819 3.77248C12.7233 3.53102 12.4922 3.30001 12.1408 2.94871L12.0961 2.90408L12.0515 2.85942C11.7002 2.508 11.4692 2.27689 11.2277 2.11832C10.2377 1.46813 8.94398 1.50299 7.95001 2.17822C7.70691 2.34336 7.47044 2.57991 7.1009 2.94955L7.058 2.99247L6.43928 3.61119C6.24401 3.80645 6.24401 4.12303 6.43928 4.31829C6.63454 4.51355 6.95112 4.51355 7.14638 4.31829L7.7651 3.69957C8.1921 3.27257 8.35757 3.11027 8.51194 3.00541ZM4.31796 7.14672C4.51322 6.95146 4.51322 6.63487 4.31796 6.43961C4.12269 6.24435 3.80611 6.24435 3.61085 6.43961L2.99213 7.05833L2.94922 7.10124C2.57957 7.47077 2.34303 7.70724 2.17788 7.95035C1.50265 8.94432 1.4678 10.238 2.11799 11.2281C2.27656 11.4695 2.50766 11.7005 2.8591 12.0518L2.90374 12.0965L2.94837 12.1411C3.29967 12.4925 3.53068 12.7237 3.77214 12.8822C4.76219 13.5324 6.05589 13.4976 7.04986 12.8223C7.29296 12.6572 7.52943 12.4206 7.89896 12.051L7.89897 12.051L7.94188 12.0081L8.5606 11.3894C8.75586 11.1941 8.75586 10.8775 8.5606 10.6823C8.36533 10.487 8.04875 10.487 7.85349 10.6823L7.23477 11.301C6.80777 11.728 6.6423 11.8903 6.48794 11.9951C5.81158 12.4546 4.95642 12.4636 4.32107 12.0464C4.17681 11.9516 4.02274 11.8012 3.61085 11.3894C3.19896 10.9775 3.0486 10.8234 2.95385 10.6791C2.53661 10.0438 2.54561 9.18863 3.00507 8.51227C3.10993 8.35791 3.27224 8.19244 3.69924 7.76544L4.31796 7.14672ZM9.62172 6.08558C9.81698 5.89032 9.81698 5.57373 9.62172 5.37847C9.42646 5.18321 9.10988 5.18321 8.91461 5.37847L5.37908 8.91401C5.18382 9.10927 5.18382 9.42585 5.37908 9.62111C5.57434 9.81637 5.89092 9.81637 6.08619 9.62111L9.62172 6.08558Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 text-slate-11 my-5 text-pretty">
              Please send your feedback, comments, requests for technical
              support: By email:{" "}
              <a
                className="border-b-[.0375rem] border-solid border-slate-11 font-medium text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 hover:border-slate-12"
                href="mailto:support@gennit.online"
              >
                support@gennit.online
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
