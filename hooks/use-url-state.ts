"use client";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useUrlState() {
  const searchParams = useSearchParams();

  const params = Object.fromEntries(searchParams.entries());
  if (params.type === "error") {
    toast.error(params.message);
  }

  if (
    Object.keys(params).some((key) => key.toLowerCase().includes("pricing"))
  ) {
    console.log("pricing");
  }

  const setUrlState = (type: string, message: string) => {
    const url = new URL(window.location.href);
    const currentParams = new URLSearchParams(url.search);
    currentParams.set(type, message);
    window.history.pushState(
      {},
      "",
      `${url.pathname}?${currentParams.toString()}`
    );
  };

  const removeUrlState = (param: string) => {
    const url = new URL(window.location.href);
    const currentParams = new URLSearchParams(url.search);
    currentParams.delete(param);
    window.history.pushState(
      {},
      "",
      `${url.pathname}?${currentParams.toString()}`
    );
  };

  const getUrlState = () => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      ...Object.fromEntries(Object.keys(params).map((key) => [key, true])),
      getValue: (key: string) => params[key] || null,
    } as { [key: string]: boolean } & {
      getValue: (key: string) => string | null;
    };
  };

  return { params, setUrlState, removeUrlState, getUrlState };
}
