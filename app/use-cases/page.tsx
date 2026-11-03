import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { useCases } from "@/lib/use-cases";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Use Cases | Genit",
  description:
    "What teams use Genit for: graphic design, AI video, a unified inbox, chat agents, automation, campaigns, scheduling, and asset management.",
  alternates: { canonical: "/use-cases" },
  openGraph: {
    title: "Genit Use Cases",
    description:
      "What teams use Genit for, from social graphics to campaign outreach.",
    url: "/use-cases",
    type: "website",
  },
};

export default function UseCasesPage() {
  return (
    <div className='min-h-screen bg-white text-neutral-900 dark:bg-black dark:text-neutral-100'>
      <LandingNavbar />
      <main className='mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24'>
        <section className='max-w-3xl'>
          <h1 className='text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white'>
            What you can do with Genit
          </h1>
          <p className='mt-5 text-base leading-8 text-pretty text-neutral-600 sm:text-lg dark:text-neutral-400'>
            Each of these is a part of the product you can use on its own. They
            share the same brand profile, media library, and connected
            accounts, so work made in one is ready to use in the others.
          </p>
        </section>

        <div className='mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-neutral-800 dark:bg-neutral-800'>
          {useCases.map((useCase) => (
            <Link
              key={useCase.slug}
              href={`/use-cases/${useCase.slug}`}
              className='group flex flex-col bg-white p-7 transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900'
            >
              <h2 className='flex items-center justify-between text-lg font-semibold text-neutral-950 dark:text-white'>
                <span>{useCase.name}</span>
                <span className='text-neutral-400 transition-transform group-hover:translate-x-1'>
                  →
                </span>
              </h2>
              <p className='mt-2 text-sm leading-6 text-pretty text-neutral-600 dark:text-neutral-400'>
                {useCase.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
