"use client";

import { useQuery } from "@tanstack/react-query";
import { useUrlState } from "../use-url-state";
import { type Project } from "@/app/community/data";
import { useEffect } from "react";

const fetchProjects = async (
  filter: string,
  category: string,
  sort: string = "createdAt:desc"
): Promise<Project[]> => {
  // Build query params
  const params = new URLSearchParams();
  if (filter && filter !== "all") params.append("filter", filter);
  if (category && category !== "all") params.append("category", category);
  if (sort) params.append("sort", sort);

  const res = await fetch(`http://localhost:8000/api/v1/templates?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();

  const templates = data.templates || [];

  return templates.map((item: any) => ({
    id: item.id?.toString() ?? "",
    title: item.title ?? "",
    url: item.url ?? "",
    imageUrl: item.imageUrl ?? "",
    forks: item.forks ?? 0,
    views: item.views ?? 0,
    bookmarks: item.bookmarks ?? 0,
    isPro: item.isPro ?? 0,
    creator: item.creator ?? {},
    description: item.description ?? "",
    createdAt: item.createdAt ?? "",
  }));
};

export function useProjects() {
  const { getUrlState, setUrlState } = useUrlState();
  const currentFilter = getUrlState().getValue("filter") || "all";
  const currentCategory = getUrlState().getValue("category") || "all";
  const currentSort = getUrlState().getValue("sort") || "createdAt:desc";

  useEffect(() => {
    if (!currentCategory || !currentFilter) {
      setUrlState("category", "all");
      setUrlState("filter", "all");
    }
  }, [currentCategory, currentFilter, setUrlState]);

  return useQuery({
    queryKey: ["projects", currentFilter, currentCategory, currentSort],
    queryFn: () => fetchProjects(currentFilter, currentCategory, currentSort),
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
  });
}
