import { marketingCapabilities } from "@/lib/marketing-capabilities";
import Link from "next/link";

const featured = marketingCapabilities.slice(0, 6);
const faq = [
  {
    question: "What is Genit?",
    answer:
      "Genit is an end-to-end AI marketing platform. Brand-aware agents can help plan campaigns, create content, build automations, publish across connected channels, manage conversations, and analyze results from one workspace.",
  },
  {
    question: "Is Genit only an AI media designer?",
    answer:
      "No. Genit creates images, video, copy, and business documents, but creation is one part of the platform. Genit also includes autonomous agents, marketing workflows, campaign tools, social publishing, a unified inbox, brand intelligence, and business app integrations.",
  },
  {
    question: "How is Genit different from Zapier, n8n, or HubSpot?",
    answer:
      "Genit combines marketing-specialized AI agents, brand and creative context, content production, campaign execution, conversations, and workflow automation in one product. General automation and CRM platforms can connect broad business processes; Genit is designed around the complete marketing lifecycle.",
  },
  {
    question: "Can Genit take action in other apps?",
    answer:
      "Yes. With permission, Genit agents and workflows can use connected social, email, advertising, calendar, storage, productivity, and other business tools. Available actions depend on each provider and connection.",
  },
];

export function LandingPlatformOverview() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <section
      className='mx-auto max-w-6xl px-4 py-24 md:px-6'
      aria-labelledby='complete-marketing-platform'
    >
      <div className='max-w-3xl'>
        <p className='text-sm font-semibold tracking-widest text-indigo-600 uppercase'>
          One connected marketing system
        </p>
        <h2
          id='complete-marketing-platform'
          className='mt-4 text-4xl font-semibold tracking-tight md:text-6xl'
        >
          Genit does more than generate. It executes.
        </h2>
        <p className='text-muted-foreground mt-6 text-lg leading-8'>
          Start with a goal, not a blank canvas. Genit’s autonomous marketing
          agents can understand your brand, research and plan the work, create
          every required format, and take approved action through connected
          channels and workflows.
        </p>
      </div>

      <div className='mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {featured.map((capability) => (
          <Link
            key={capability.slug}
            href={`/platform/${capability.slug}`}
            className='group rounded-2xl border border-zinc-200 p-6 transition hover:border-indigo-500 dark:border-zinc-800'
          >
            <p className='text-xs font-semibold tracking-widest text-indigo-600 uppercase'>
              {capability.eyebrow}
            </p>
            <h3 className='mt-3 text-xl font-semibold group-hover:text-indigo-600'>
              {capability.name}
            </h3>
            <p className='text-muted-foreground mt-3 text-sm leading-6'>
              {capability.description}
            </p>
          </Link>
        ))}
      </div>
      <Link
        href='/platform'
        className='mt-8 inline-flex rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white dark:bg-white dark:text-zinc-950'
      >
        Explore the full Genit platform →
      </Link>

      <div
        className='mt-24 grid gap-10 md:grid-cols-[1fr_1.5fr]'
        aria-labelledby='genit-faq'
      >
        <div>
          <h2
            id='genit-faq'
            className='text-3xl font-semibold tracking-tight md:text-4xl'
          >
            Genit, clearly explained
          </h2>
          <p className='text-muted-foreground mt-3'>
            Straight answers for people—and search engines—evaluating the
            platform.
          </p>
        </div>
        <div className='divide-y divide-zinc-200 dark:divide-zinc-800'>
          {faq.map(({ question, answer }) => (
            <details key={question} className='py-5'>
              <summary className='cursor-pointer list-none text-lg font-semibold'>
                {question}
              </summary>
              <p className='text-muted-foreground mt-3 leading-7'>{answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </section>
  );
}
