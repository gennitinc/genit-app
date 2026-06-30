"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import TopNavWithAurora from "@/components/layout/top-nav-with-aurora";
import { useUserContext } from "@/context/AuthenticatedContext";
import { APP_SECTIONS, type AppCardProps } from "@/lib/apps-config";
import { trackAppOpened, trackEvent } from "@/lib/mixpanelClient";
import { GradientFrame } from "@/utils/gradient-frame";
import {
  Activity,
  ArrowRight,
  Brush,
  Camera,
  Code,
  GitBranchPlus,
  Image as ImageIcon,
  type LucideIcon,
  MessageSquareCode,
  Plus,
  Search,
  Sparkles,
  Sun,
  User,
  Video,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import React, { useMemo, useState } from "react";

const FARMNET_EMAIL = "farmnetent@gmail.com";
const GOOGLE_FLOW_URL = "https://labs.google/fx/tools/flow";

const AppCard = ({
  app,
  onAction,
}: {
  app: AppCardProps;
  onAction: () => void;
}) => {
  const isSoon = app.badge?.text.toLowerCase().includes("soon");

  return (
    <div className='group flex items-center justify-between border-b border-zinc-100/40 py-4 last:border-b-0 dark:border-zinc-900/50'>
      <div className='flex min-w-0 flex-1 items-center'>
        {/* Brand Icon wrapper */}
        <div className='flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-50 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-950'>
          {app.imageSrc ? (
            <img
              src={app.imageSrc}
              alt={app.title}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='h-full w-full bg-zinc-100 dark:bg-zinc-900' />
          )}
        </div>

        {/* Text Area */}
        <div className='flex min-w-0 flex-1 flex-col justify-center pr-3 pl-4'>
          <div className='flex items-center gap-1.5'>
            <h3 className='truncate text-sm font-semibold tracking-tight text-zinc-900 sm:text-base dark:text-zinc-100'>
              {app.title}
            </h3>
            {app.badge && (
              <span
                className='relative inline-flex skew-x-[-10deg] items-center justify-center overflow-hidden rounded px-1.5 text-[10px] leading-[14px] font-bold uppercase sm:text-xs sm:leading-[16px]'
                style={{
                  fontFamily: '"Space Grotesk"',
                  backgroundColor: app.badge.bgColor,
                  color: app.badge.textColor,
                }}
              >
                <span>{app.badge.text}</span>
              </span>
            )}
          </div>
          <p className='mt-0.5 line-clamp-2 text-xs leading-snug text-zinc-500 sm:text-sm dark:text-zinc-400'>
            {app.description}
          </p>
        </div>
      </div>

      {/* Action Area */}
      <div className='ml-3 flex-shrink-0'>
        {isSoon ? (
          <button
            type='button'
            disabled
            className='cursor-not-allowed rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-400 select-none dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-500'
          >
            Soon
          </button>
        ) : (
          <button
            type='button'
            onClick={onAction}
            className='rounded-full border border-zinc-200/80 bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-900 transition-all hover:bg-zinc-200 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800'
          >
            Try
          </button>
        )}
      </div>
    </div>
  );
};

const Apps = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();
  const { user } = useUserContext();

  React.useEffect(() => {
    trackEvent("agents_directory_viewed", {
      total_sections: APP_SECTIONS.length,
      total_apps: APP_SECTIONS.reduce(
        (acc, section) => acc + section.apps.length,
        0
      ),
    });
  }, []);

  const handleAction = (app: AppCardProps) => {
    const shouldOpenGoogleFlow =
      user?.email?.toLowerCase() === FARMNET_EMAIL;
    const href = shouldOpenGoogleFlow ? GOOGLE_FLOW_URL : app.href;

    trackAppOpened(app.id, app.title, "agents_directory", {
      app_type: app.type,
      href,
    });

    if (shouldOpenGoogleFlow) {
      window.location.assign(GOOGLE_FLOW_URL);
      return;
    }

    router.push(app.href);
  };

  const categories = useMemo(() => {
    const titles = APP_SECTIONS.map((section) => section.title);
    return ["All", ...titles];
  }, []);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return APP_SECTIONS.map((section) => {
      const apps = q
        ? section.apps.filter(
            (app) =>
              app.title.toLowerCase().includes(q) ||
              (app.description ?? "").toLowerCase().includes(q) ||
              (app.type ?? "").toLowerCase().includes(q) ||
              section.title.toLowerCase().includes(q)
          )
        : section.apps;
      return { ...section, apps };
    })
      .filter((s) => s.apps.length > 0)
      .filter(
        (s) => selectedCategory === "All" || s.title === selectedCategory
      );
  }, [query, selectedCategory]);

  return (
    <div className='relative flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-black'>
      <Toaster />
      <AppSidebar />
      <div className='scroll-container flex flex-1 flex-col overflow-x-hidden overflow-y-auto will-change-scroll'>
        <TopNavWithAurora />
        <div
          id='main-content'
          className='mr-2 ml-0 flex-1 rounded-t-2xl md:mr-4 lg:border-2 lg:border-b-0'
        >
          <div className='mx-auto w-full max-w-4xl space-y-8 px-6 pb-16'>
            <section className='relative z-10'>
              <div className='mr-auto ml-auto max-w-4xl pt-12 pr-4 pb-20 pl-4 sm:px-6 lg:px-8'>
                <div className='mb-10 text-left'>
                  <h1 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
                    Apps
                  </h1>
                  <p className='mt-2 text-sm text-zinc-500 sm:text-base dark:text-zinc-400'>
                    Pick a starting point. your ai game just got smarter
                  </p>
                </div>

                {/* Search and filter slider bar */}
                <div className='mb-8 flex items-center gap-3'>
                  <div className='relative flex-1'>
                    <Search className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400' />
                    <input
                      type='search'
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder='Search apps...'
                      className='w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 pr-4 pl-10 text-sm text-zinc-900 shadow-xs transition-colors placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700/80'
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => {
                      setQuery("");
                      setSelectedCategory("All");
                    }}
                    className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50/50 text-zinc-500 shadow-xs transition-all hover:bg-zinc-100 hover:text-zinc-800 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                    title='Clear search and filters'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='h-4 w-4'
                    >
                      <line x1='4' y1='21' x2='4' y2='14' />
                      <line x1='4' y1='10' x2='4' y2='3' />
                      <line x1='12' y1='21' x2='12' y2='12' />
                      <line x1='12' y1='8' x2='12' y2='3' />
                      <line x1='20' y1='21' x2='20' y2='16' />
                      <line x1='20' y1='12' x2='20' y2='3' />
                      <line x1='1' y1='14' x2='7' y2='14' />
                      <line x1='9' y1='8' x2='15' y2='8' />
                      <line x1='17' y1='16' x2='23' y2='16' />
                    </svg>
                  </button>
                </div>

                {/* Categories Tabs Bar */}
                <div className='no-scrollbar mb-8 flex gap-2 overflow-x-auto scroll-smooth pb-2'>
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type='button'
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 select-none sm:text-sm ${
                          isActive
                            ? "bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100"
                            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {grouped.length === 0 ? (
                  <div className='py-16 text-center'>
                    <p className='text-sm text-zinc-500 dark:text-zinc-400'>
                      No apps match &ldquo;{query}&rdquo;.
                    </p>
                  </div>
                ) : (
                  <div className='space-y-12'>
                    {grouped.map((section) => (
                      <section key={section.title}>
                        <div className='mb-2 border-b border-zinc-100/80 pb-3 dark:border-zinc-900/80'>
                          <h3 className='text-sm font-semibold tracking-tight tracking-wider text-zinc-900 uppercase dark:text-zinc-100'>
                            {section.title}
                          </h3>
                        </div>
                        <div className='grid grid-cols-1 gap-x-12 gap-y-1 md:grid-cols-2'>
                          {section.apps.map((app) => (
                            <AppCard
                              key={app.id}
                              app={app}
                              onAction={() => handleAction(app)}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}

                {/* Developers Build Section */}
                <section className='mt-12'>
                  <div className='mb-4'>
                    <h3 className='text-foreground text-lg font-semibold tracking-tight'>
                      Developers
                    </h3>
                    <p className='text-muted-foreground mt-0.5 text-xs'>
                      Build custom agents
                    </p>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    <div className='group border-border bg-background rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm'>
                      {/* icon + title row */}
                      <div className='flex items-center gap-2'>
                        <div className='border-border bg-muted/40 flex h-8 w-8 items-center justify-center rounded-md border'>
                          <Code className='text-foreground h-4 w-4' />
                        </div>

                        <h3 className='text-foreground text-sm font-semibold'>
                          Custom Agent
                        </h3>
                      </div>

                      {/* description */}
                      <p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
                        Build and deploy AI agents with full SDK control and
                        integration hooks.
                      </p>

                      {/* CTA */}
                      <div className='mt-3 flex items-center justify-between'>
                        <a
                          href='#'
                          className='inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-400'
                        >
                          View SDK
                          <ArrowRight className='h-3 w-3' />
                        </a>

                        <span className='text-muted-foreground text-[10px]'>
                          SDK
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <div className='mt-12 text-center'>
                  <p className='text-muted-foreground mb-4 text-sm'>
                    Need a custom workflow or agent?
                  </p>
                  <button className='border-border bg-card/60 text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'>
                    <Plus className='h-4 w-4' />
                    Request agent
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <style
        type='text/css'
        dangerouslySetInnerHTML={{
          __html:
            "\n    @keyframes moveDot {\n      0%, 100% { top: 10%; right: 10%; }\n      25% { top: 10%; right: calc(100% - 35px); }\n      50% { top: calc(100% - 30px); right: calc(100% - 35px); }\n      75% { top: calc(100% - 30px); right: 10%; }\n    }\n    .integration-card:hover .animated-dot {\n      animation-play-state: running !important;\n    }\n      ",
        }}
      />
    </div>
  );
};

export default Apps;
