"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUrlState } from "@/hooks/use-url-state";
import { Loader, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

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
    <div className='flex w-full max-w-2xl flex-col justify-start space-y-6'>
      {/* Heading */}
      {/* Enhanced search input */}
      <div className='group relative'>
        <form onSubmit={handleSearch} className='w-full'>
          <div className='relative'>
            <Search className='text-muted-foreground group-focus-within:text-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transition-colors' />
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder='Search Inspirations, tools, and components...'
              className='bg-background/80 w-full rounded-full border-2 py-6 pr-16 text-base shadow-sm backdrop-blur-sm transition-all duration-200 group-focus-within:shadow-md focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
            {/* Clear icon */}
            {searchQuery && (
              <button
                type='button'
                className='text-muted-foreground hover:text-foreground absolute top-1/2 right-14 flex h-8 w-8 -translate-y-1/2 items-center justify-center transition-colors'
                onClick={() => {
                  setSearchQuery("");
                  router.push("/templates");
                }}
                tabIndex={-1}
                aria-label='Clear search'
              >
                <X className='h-5 w-5' />
              </button>
            )}
            <Button
              disabled={!searchQuery.trim() || searchLoading}
              type='submit'
              className='btn-gradient text-primary-foreground absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full p-0 shadow-sm transition-all duration-200 disabled:opacity-50'
              onClick={handleSearch}
            >
              {searchLoading ? (
                <Loader className='h-4 w-4 animate-spin' />
              ) : (
                <Search className='h-4 w-4' />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
