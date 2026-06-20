import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconBook,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconShoppingBagCheck,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Built for everyone",
      description:
        "Built for engineers, developers, dreamers, thinkers and doers.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Ease of use",
      description:
        "It's as easy as using an Apple, and as expensive as buying one.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Code with English",
      description:
        "Write and generate code using plain English instructions. Just describe what you want.",
      icon: <IconBook />,
    },
    {
      title: "Earn",
      description: "Sell your codebase to other creators.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Multiple Integration",
      description: "Integrates with GitHub, Supabase, Vercel, and more.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "24/7 Customer Support",
      description:
        "We are available a 100% of the time. Atleast our AI Agents are.",
      icon: <IconHelp />,
    },
    {
      title: "Market Place",
      description: "Inspirations to discover design ideas.",
      icon: <IconShoppingBagCheck />,
    },
    {
      title: "And everything else",
      description: "I just ran out of copy ideas. Accept my sincere apologies",
      icon: <IconHeart />,
    },
  ];
  return (
    <div className='relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4'>
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "group/feature relative flex flex-col py-10 lg:border-r dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className='pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800' />
      )}
      {index >= 4 && (
        <div className='pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800' />
      )}
      <div className='relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400'>
        {icon}
      </div>
      <div className='relative z-10 mb-2 px-10 text-lg font-bold'>
        <div className='absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700' />
        <span className='inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100'>
          {title}
        </span>
      </div>
      <p className='relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300'>
        {description}
      </p>
    </div>
  );
};
