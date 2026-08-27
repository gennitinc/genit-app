"use client";

import { ConnectDialog } from "@/app/integrations/_components/connect-dialog";
import { Button } from "@/components/ui/button";
import {
  type ComposioToolDefinition,
  type ComposioToolkit,
  type ComposioTriggerType,
  fetchComposioToolkits,
  fetchComposioTools,
  fetchComposioTriggers,
  fetchIntegrations,
} from "@/lib/integrations-api";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Plug, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  mode: "trigger" | "action";
  data: Record<string, any>;
  onChange: (fields: Record<string, any>) => void;
};

const inputCls =
  "w-full rounded border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-800 outline-none transition-[border-color] duration-150 focus:border-violet-500/60 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200";
const labelCls =
  "mb-1 block text-[9px] font-medium uppercase tracking-wider text-zinc-500 dark:text-neutral-400";

function valueForInput(value: unknown, schema: any) {
  if (schema?.type === "object" || schema?.type === "array")
    return value === undefined
      ? ""
      : typeof value === "string"
        ? value
        : JSON.stringify(value, null, 2);
  return value === undefined || value === null ? "" : String(value);
}

function parseInput(value: string, schema: any) {
  if (schema?.type === "number" || schema?.type === "integer")
    return value === "" ? undefined : Number(value);
  if (schema?.type === "object" || schema?.type === "array") {
    try {
      return value ? JSON.parse(value) : undefined;
    } catch {
      return value;
    }
  }
  return value;
}

export function ComposioCatalogFields({ mode, data, onChange }: Props) {
  const [toolkits, setToolkits] = useState<ComposioToolkit[]>([]);
  const [items, setItems] = useState<
    Array<ComposioTriggerType | ComposioToolDefinition>
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [connectedToolkits, setConnectedToolkits] = useState<Set<string>>(
    new Set()
  );
  const [connectOpen, setConnectOpen] = useState(false);
  const toolkit = String(data.composioToolkit || "");
  const selectedSlug = String(
    mode === "trigger"
      ? data.composioTriggerSlug || ""
      : data.composioToolSlug || ""
  );
  const values =
    (mode === "trigger"
      ? data.composioTriggerConfig
      : data.composioToolArguments) || {};

  useEffect(() => {
    Promise.all([fetchComposioToolkits(), fetchIntegrations()])
      .then(([catalog, connections]) => {
        setToolkits(catalog);
        setConnectedToolkits(
          new Set(
            connections.integrations
              .filter(
                (item) =>
                  item.platform === "composio" && item.status === "active"
              )
              .map((item) =>
                String(item.metadata?.toolkitSlug || "").toLowerCase()
              )
          )
        );
      })
      .catch(() => setToolkits([]));
  }, []);

  useEffect(() => {
    setItemSearch("");
  }, [toolkit]);

  useEffect(() => {
    if (!toolkit) {
      setItems([]);
      return;
    }
    let active = true;
    setLoading(true);
    setLoadError("");
    const timer = setTimeout(
      () => {
        const request =
          mode === "trigger"
            ? fetchComposioTriggers(toolkit)
            : fetchComposioTools(toolkit, itemSearch);
        request
          .then((result) => active && setItems(result))
          .catch(() => {
            if (active) {
              setItems([]);
              setLoadError("Could not load the app catalog");
            }
          })
          .finally(() => active && setLoading(false));
      },
      mode === "action" && itemSearch ? 250 : 0
    );
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [itemSearch, mode, toolkit]);

  const selectedToolkit = toolkits.find((item) => item.slug === toolkit);
  useEffect(() => {
    if (!selectedToolkit) return;
    if (
      data.composioToolkitName !== selectedToolkit.name ||
      data.composioLogo !== selectedToolkit.logo
    )
      onChange({
        composioToolkitName: selectedToolkit.name,
        composioLogo: selectedToolkit.logo,
      });
  }, [data.composioLogo, data.composioToolkitName, onChange, selectedToolkit]);

  const selected = items.find((item) => item.slug === selectedSlug);
  const schema =
    mode === "trigger"
      ? (selected as ComposioTriggerType | undefined)?.config
      : (selected as ComposioToolDefinition | undefined)?.inputParameters;
  const properties = useMemo(
    () => Object.entries((schema as any)?.properties || {}),
    [schema]
  );
  const required = new Set((schema as any)?.required || []);

  const updateValue = (key: string, value: unknown) => {
    const field =
      mode === "trigger" ? "composioTriggerConfig" : "composioToolArguments";
    onChange({ [field]: { ...values, [key]: value } });
  };

  return (
    <div className='space-y-3 rounded-md border border-violet-500/15 bg-violet-500/[0.03] p-2.5'>
      <div>
        <label className={labelCls}>Connected app</label>
        <input
          list={`composio-toolkits-${mode}`}
          value={toolkit}
          onChange={(event) =>
            onChange({
              composioToolkit: event.target.value.trim().toLowerCase(),
              composioToolkitName: undefined,
              composioLogo: undefined,
              integrationId: undefined,
              composioStatus: undefined,
              composioError: undefined,
              composioTriggerId: undefined,
              ...(mode === "trigger"
                ? { composioTriggerSlug: "", composioTriggerConfig: {} }
                : { composioToolSlug: "", composioToolArguments: {} }),
            })
          }
          className={inputCls}
          placeholder='Search 1,000+ apps'
        />
        <datalist id={`composio-toolkits-${mode}`}>
          {toolkits.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </datalist>
      </div>

      <div>
        <label className={labelCls}>
          {mode === "trigger" ? "Event" : "Action"}
        </label>
        {mode === "action" && toolkit && (
          <div className='relative mb-1.5'>
            <Search className='pointer-events-none absolute top-2 left-2 h-3 w-3 text-zinc-400' />
            <input
              value={itemSearch}
              onChange={(event) => setItemSearch(event.target.value)}
              className={cn(inputCls, "pl-7")}
              placeholder='Search every available action'
            />
          </div>
        )}
        <div className='relative'>
          <select
            value={selectedSlug}
            disabled={!toolkit || loading}
            onChange={(event) =>
              onChange(
                mode === "trigger"
                  ? {
                      composioTriggerSlug: event.target.value,
                      composioTriggerConfig: {},
                    }
                  : {
                      composioToolSlug: event.target.value,
                      composioToolArguments: {},
                    }
              )
            }
            className={cn(
              inputCls,
              "cursor-pointer appearance-none pr-7 disabled:opacity-50"
            )}
          >
            <option value=''>
              Select {mode === "trigger" ? "an event" : "an action"}
            </option>
            {items.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          {loading && (
            <Loader2 className='absolute top-2 right-2 h-3 w-3 animate-spin text-violet-500' />
          )}
        </div>
        {selected?.description && (
          <p className='mt-1.5 line-clamp-3 text-[10px] leading-4 text-zinc-500'>
            {selected.description}
          </p>
        )}
        {!loading && toolkit && !items.length && (
          <p className='mt-1.5 text-[10px] text-zinc-500'>
            {loadError ||
              (mode === "trigger"
                ? "This app does not expose an event trigger. Use Schedule or Webhook with its actions."
                : "No actions match this search.")}
          </p>
        )}
      </div>

      {properties.map(([key, rawSchema]) => {
        const fieldSchema = rawSchema as any;
        const label = `${key}${required.has(key) ? " *" : ""}`;
        if (fieldSchema.type === "boolean")
          return (
            <label
              key={key}
              className='flex items-center gap-2 text-[10px] text-zinc-600 dark:text-neutral-300'
            >
              <input
                type='checkbox'
                checked={Boolean(values[key])}
                onChange={(event) => updateValue(key, event.target.checked)}
              />
              {label}
            </label>
          );
        if (Array.isArray(fieldSchema.enum))
          return (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <select
                className={inputCls}
                value={valueForInput(values[key], fieldSchema)}
                onChange={(event) => updateValue(key, event.target.value)}
              >
                <option value=''>Select</option>
                {fieldSchema.enum.map((option: unknown) => (
                  <option key={String(option)} value={String(option)}>
                    {String(option)}
                  </option>
                ))}
              </select>
            </div>
          );
        const multiline = ["object", "array"].includes(fieldSchema.type);
        return (
          <div key={key}>
            <label className={labelCls}>{label}</label>
            {multiline ? (
              <textarea
                className={cn(inputCls, "min-h-16 resize-y font-mono")}
                value={valueForInput(values[key], fieldSchema)}
                onChange={(event) =>
                  updateValue(key, parseInput(event.target.value, fieldSchema))
                }
                placeholder={fieldSchema.description || `{{ event.${key} }}`}
              />
            ) : (
              <input
                className={inputCls}
                type={fieldSchema.type === "number" ? "number" : "text"}
                value={valueForInput(values[key], fieldSchema)}
                onChange={(event) =>
                  updateValue(key, parseInput(event.target.value, fieldSchema))
                }
                placeholder={fieldSchema.description || `{{ event.${key} }}`}
              />
            )}
          </div>
        );
      })}

      {mode === "trigger" && data.composioStatus && (
        <div
          className={cn(
            "rounded px-2 py-1.5 text-[10px]",
            data.composioStatus === "active"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : data.composioStatus === "paused"
                ? "bg-amber-500/10 text-amber-600"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
          )}
        >
          {data.composioStatus === "active"
            ? "Listening for events"
            : data.composioError || data.composioStatus}
        </div>
      )}
      {toolkit &&
        (connectedToolkits.has(toolkit) ? (
          <Button
            type='button'
            size='sm'
            variant='secondary'
            disabled
            className='h-7 text-[10px] disabled:opacity-100'
          >
            <CheckCircle2 /> Connected
          </Button>
        ) : (
          <Button
            type='button'
            size='sm'
            className='h-7 text-[10px] active:scale-[0.97]'
            onClick={(event) => {
              event.stopPropagation();
              setConnectOpen(true);
            }}
          >
            <Plug /> Connect app
          </Button>
        ))}

      <ConnectDialog
        open={connectOpen}
        onOpenChange={setConnectOpen}
        platform='composio'
        platformName={selectedToolkit?.name || toolkit}
        platformDescription={`Connect ${selectedToolkit?.name || toolkit} to use it in this automation.`}
        Icon={Plug}
        iconUrl={selectedToolkit?.logo}
        glow='rgba(79, 70, 229, 0.7)'
        appSlug={toolkit}
        onConnected={() => {
          setConnectedToolkits((current) => new Set(current).add(toolkit));
          setConnectOpen(false);
        }}
      />
    </div>
  );
}
