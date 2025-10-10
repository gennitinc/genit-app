"use client";

import type React from "react";

import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUrlState } from "@/hooks/use-url-state";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function CategoryAndSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const { getUrlState, setUrlState } = useUrlState();
  const categoryValueFromUrl = getUrlState().getValue("category");
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setSearchLoading(true);
      router.push(
        `/templates?q=${encodeURIComponent(searchQuery.trim() || "")}`
      );
      setSearchLoading(false);
    }
  };

  // No auto-navigation on mount

  return (
    <div className="max-w-2xl flex flex-col justify-start w-full space-y-6">
      {/* Heading */}
      {/* Enhanced search input */}
      <div className="relative group">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search Inspirations, tools, and components..."
              className="w-full pr-16 py-6 text-base rounded-full bg-background/80 backdrop-blur-sm border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-sm transition-all duration-200 group-focus-within:shadow-md"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            {/* Clear icon */}
            {searchQuery && (
              <button
                type="button"
                className="absolute right-14 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  setSearchQuery("");
                  router.push("/templates");
                }}
                tabIndex={-1}
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <Button
              disabled={!searchQuery.trim() || searchLoading}
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 btn-gradient rounded-full text-primary-foreground p-0 flex items-center justify-center shadow-sm transition-all duration-200 disabled:opacity-50"
              onClick={handleSearch}
            >
              {searchLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
