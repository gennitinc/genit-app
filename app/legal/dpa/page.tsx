import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Processing Addendum | Genit",
  description:
    "Request Genit's current Data Processing Addendum for your organization.",
  alternates: { canonical: "/legal/dpa" },
  robots: { index: false, follow: true },
};

export default function DpaPage() {
  return (
    <div className='min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-white'>
      <LandingNavbar />
      <main className='mx-auto max-w-4xl px-5 py-24 md:py-32'>
        <p className='text-sm font-semibold tracking-widest text-indigo-600 uppercase'>
          Legal
        </p>
        <h1 className='mt-4 text-4xl font-semibold tracking-tight md:text-6xl'>
          Data Processing Addendum
        </h1>
        <p className='text-muted-foreground mt-6 max-w-2xl text-lg leading-8'>
          If your organization requires a Data Processing Addendum to use Genit,
          contact our team to request the current agreement and discuss your
          data-processing requirements.
        </p>
        <a
          href='mailto:hello@trygenit.com?subject=Genit%20Data%20Processing%20Addendum'
          className='mt-8 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700'
        >
          Request the DPA
        </a>
        <p className='text-muted-foreground mt-8 text-sm'>
          You can also review our{" "}
          <Link href='/legal/privacy-policy' className='text-indigo-600'>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href='/legal/terms-of-service' className='text-indigo-600'>
            Terms of Service
          </Link>
          .
        </p>
      </main>
      <LandingFooter />
    </div>
  );
}
