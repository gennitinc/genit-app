import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { getUseCase, useCases } from "@/lib/use-cases";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return useCases.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};
  return {
    title: `${useCase.name} | Genit Use Cases`,
    description: useCase.description,
    alternates: { canonical: `/use-cases/${slug}` },
    openGraph: {
      title: useCase.title,
      description: useCase.description,
      url: `/use-cases/${slug}`,
      type: "website",
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  const related = useCase.related
    .map((relatedSlug) => getUseCase(relatedSlug))
    .filter((item) => item !== undefined);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.trygenit.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Use cases",
            item: "https://www.trygenit.com/use-cases",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: useCase.name,
            item: `https://www.trygenit.com/use-cases/${slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: useCase.faq.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <div className='min-h-screen bg-white text-neutral-900 dark:bg-black dark:text-neutral-100'>
      <LandingNavbar />
      <main className='mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24'>
        <nav className='flex items-center gap-2 text-sm text-neutral-500'>
          <Link
            href='/use-cases'
            className='transition-colors hover:text-neutral-900 dark:hover:text-white'
          >
            Use cases
          </Link>
          <span className='text-neutral-300 dark:text-neutral-700'>/</span>
          <span className='text-neutral-900 dark:text-white'>
            {useCase.name}
          </span>
        </nav>

        <section className='mt-8 max-w-3xl'>
          <h1 className='text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white'>
            {useCase.title}
          </h1>
          <p className='mt-6 text-base leading-8 text-pretty text-neutral-600 sm:text-lg dark:text-neutral-400'>
            {useCase.intro}
          </p>
          <div className='mt-8 flex flex-wrap items-center gap-4'>
            <Link
              href={useCase.appHref}
              className='rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
            >
              {useCase.appLabel}
            </Link>
            <Link
              href='/pricing'
              className='text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
            >
              See pricing →
            </Link>
          </div>
        </section>

        <section className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'>
          <h2 className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'>
            How it works
          </h2>
          <ol className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {useCase.steps.map((step, index) => (
              <li key={step.title}>
                <span className='flex size-7 items-center justify-center rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'>
                  {index + 1}
                </span>
                <h3 className='mt-4 font-semibold text-neutral-950 dark:text-white'>
                  {step.title}
                </h3>
                <p className='mt-2 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'>
          <h2 className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'>
            What&apos;s included
          </h2>
          <div className='mt-8 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2'>
            {useCase.details.map((detail) => (
              <div key={detail.title}>
                <h3 className='font-semibold text-neutral-950 dark:text-white'>
                  {detail.title}
                </h3>
                <p className='mt-1 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  {detail.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'>
          <h2 className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'>
            Examples
          </h2>
          <ul className='mt-6 space-y-3'>
            {useCase.examples.map((example) => (
              <li
                key={example}
                className='border-l border-neutral-300 ps-4 text-sm leading-7 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'
              >
                {example}
              </li>
            ))}
          </ul>
        </section>

        <section className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'>
          <h2 className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'>
            Questions
          </h2>
          <div className='mt-6 divide-y divide-neutral-200 dark:divide-neutral-800'>
            {useCase.faq.map(({ question, answer }) => (
              <div key={question} className='py-6'>
                <h3 className='font-semibold text-neutral-950 dark:text-white'>
                  {question}
                </h3>
                <p className='mt-2 text-sm leading-7 text-pretty text-neutral-600 dark:text-neutral-400'>
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className='mt-20 border-t border-neutral-200 pt-14 dark:border-neutral-800'>
            <h2 className='text-2xl font-bold tracking-tight text-neutral-950 dark:text-white'>
              Works well with
            </h2>
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/use-cases/${item.slug}`}
                  className='rounded-xl border border-neutral-200 p-5 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900'
                >
                  <span className='font-semibold text-neutral-950 dark:text-white'>
                    {item.name}
                  </span>
                  <p className='mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400'>
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <LandingFooter />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
