"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Presenter } from "@/app/video/create/page";

interface PresenterSelectorProps {
  selectedPresenter: Presenter | null;
  onSelectPresenter: (presenter: Presenter) => void;
}

// Mock presenters data - replace with actual API data
const POPULAR_PRESENTERS: Presenter[] = [
  {
    id: "presenter-1",
    name: "Sarah",
    image: "/api/placeholder/200/300",
    category: "popular",
    gender: "female",
  },
  {
    id: "presenter-2",
    name: "Michael",
    image: "/api/placeholder/200/300",
    category: "popular",
    gender: "male",
  },
  {
    id: "presenter-3",
    name: "Emma",
    image: "/api/placeholder/200/300",
    category: "popular",
    gender: "female",
  },
  {
    id: "presenter-4",
    name: "James",
    image: "/api/placeholder/200/300",
    category: "popular",
    gender: "male",
  },
  {
    id: "presenter-5",
    name: "David",
    image: "/api/placeholder/200/300",
    category: "popular",
    gender: "male",
  },
  {
    id: "presenter-6",
    name: "Sophia",
    image: "/api/placeholder/200/300",
    category: "popular",
    gender: "female",
  },
];

const NEW_PRESENTERS: Presenter[] = [
  {
    id: "presenter-7",
    name: "Olivia",
    image: "/api/placeholder/200/300",
    category: "new",
    gender: "female",
  },
  {
    id: "presenter-8",
    name: "Noah",
    image: "/api/placeholder/200/300",
    category: "new",
    gender: "male",
  },
  {
    id: "presenter-9",
    name: "Ava",
    image: "/api/placeholder/200/300",
    category: "new",
    gender: "female",
  },
  {
    id: "presenter-10",
    name: "Liam",
    image: "/api/placeholder/200/300",
    category: "new",
    gender: "male",
  },
];

export function PresenterSelector({
  selectedPresenter,
  onSelectPresenter,
}: PresenterSelectorProps) {
  const [activeTab, setActiveTab] = useState<"popular" | "my-presenter">("popular");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("popular")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "popular"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Reals Presenters
        </button>
        <button
          onClick={() => setActiveTab("my-presenter")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "my-presenter"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          My Presenter
        </button>
      </div>

      {/* Presenter Grid */}
      {activeTab === "popular" && (
        <div className="space-y-6">
          {/* Popular Presenters */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              POPULAR
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {POPULAR_PRESENTERS.map((presenter) => (
                <button
                  key={presenter.id}
                  onClick={() => onSelectPresenter(presenter)}
                  className={cn(
                    "relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                    selectedPresenter?.id === presenter.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-primary/30 flex items-center justify-center mb-2">
                        <span className="text-xs font-medium">
                          {presenter.name[0]}
                        </span>
                      </div>
                      <p className="text-xs font-medium">{presenter.name}</p>
                    </div>
                  </div>
                  {selectedPresenter?.id === presenter.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* New Presenters */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              NEW
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {NEW_PRESENTERS.map((presenter) => (
                <button
                  key={presenter.id}
                  onClick={() => onSelectPresenter(presenter)}
                  className={cn(
                    "relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                    selectedPresenter?.id === presenter.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-primary/30 flex items-center justify-center mb-2">
                        <span className="text-xs font-medium">
                          {presenter.name[0]}
                        </span>
                      </div>
                      <p className="text-xs font-medium">{presenter.name}</p>
                    </div>
                  </div>
                  {selectedPresenter?.id === presenter.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "my-presenter" && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Upload your own presenter avatar
          </p>
          <button className="px-4 py-2 text-sm border rounded-md hover:bg-accent transition-colors">
            Upload Presenter
          </button>
        </div>
      )}
    </div>
  );
}

