"use client";

import {
  INTEGRATIONS,
  type IntegrationIcon,
} from "@/app/integrations/integrations-explorer";
import { useLanguage } from "@/context/LanguageContext";
import { useComposioToolkits } from "@/hooks/use-integrations";
import { isNativeOnlyComposioToolkit } from "@/lib/integrations-api";
import { Blocks } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type FlowPlugin = {
  slug: string;
  name: string;
  Icon?: IntegrationIcon;
  logo?: string;
};

const NATIVE_PLUGINS: FlowPlugin[] = INTEGRATIONS.filter(
  (plugin) => plugin.baseStatus === "available"
).map((plugin) => ({
  slug: plugin.appSlug || plugin.platform,
  name: plugin.name,
  Icon: plugin.icon,
}));

export function useAvailablePlugins() {
  const { data: composioPlugins = [], isSuccess } = useComposioToolkits();

  const plugins = useMemo(() => {
    const known = new Set(NATIVE_PLUGINS.map((plugin) => plugin.slug));
    return [
      ...NATIVE_PLUGINS,
      ...composioPlugins
        .filter(
          (plugin) =>
            !known.has(plugin.slug) && !isNativeOnlyComposioToolkit(plugin.slug)
        )
        .map((plugin) => ({
          slug: plugin.slug,
          name: plugin.name,
          Icon: undefined,
          logo: plugin.logo,
        })),
    ];
  }, [composioPlugins]);

  return { plugins, total: isSuccess ? plugins.length : 1387 };
}

export function PluginsFlow({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  const { plugins, total } = useAvailablePlugins();
  const featuredPlugins = plugins.slice(0, 18);
  const loop = [...featuredPlugins, ...featuredPlugins];

  return (
    <section className={`relative space-y-4 pt-6 pb-10 ${className}`}>
      <h2 className='text-muted-foreground text-center text-sm tracking-tight md:text-base'>
        {t("with over")} {total} {t("marketing")}{" "}
        <Link
          href='/plugins'
          className='text-foreground font-medium underline underline-offset-4'
        >
          {t("Plugins")}
        </Link>
      </h2>

      <div className='relative z-10 mx-auto max-w-5xl'>
        <div className='overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4 motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]'>
          <div
            className='animate-marquee flex w-max gap-10 hover:[animation-play-state:paused] motion-reduce:animate-none'
            style={{
              animationDuration: `${Math.max(40, featuredPlugins.length * 2)}s`,
            }}
          >
            {loop.map((plugin, index) => {
              const Icon = plugin.Icon;
              return (
                <Link
                  key={`${plugin.slug}-${index}`}
                  href={`/plugins#${plugin.slug}`}
                  className='group text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-2 transition-colors'
                >
                  <span className='flex size-7 items-center justify-center'>
                    {plugin.logo ? (
                      <img
                        src={plugin.logo}
                        alt=''
                        className='size-6 rounded-sm object-contain'
                      />
                    ) : Icon ? (
                      <Icon className='h-6 w-auto' />
                    ) : (
                      <Blocks className='size-6' />
                    )}
                  </span>
                  <span className='text-sm font-medium whitespace-nowrap md:text-base'>
                    {plugin.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
