"use client";
import { useEffect } from "react";
import { useUrlState } from "../use-url-state";
import { useQuery } from "@tanstack/react-query";
import { creators } from "@/app/creators/data";

const fetchCreators = async (filter: string, category: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (filter === "all" || !filter || category === "all" || !category) {
    return creators;
  }

  return creators;
};

export function useCreators() {
  const { getUrlState, setUrlState } = useUrlState();
  const currentFilter = getUrlState().getValue("filter") || "all";
  const currentCategory = getUrlState().getValue("category") || "all";

  useEffect(() => {
    if (!currentCategory || !currentFilter) {
      setUrlState("category", "all");
      setUrlState("filter", "all");
    }
  }, [currentCategory, currentFilter, setUrlState]);

  return useQuery({
    queryKey: ["creators", currentFilter, currentCategory],
    queryFn: () => fetchCreators(currentFilter, currentCategory),
  });
}
