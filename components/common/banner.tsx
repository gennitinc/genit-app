import { cn } from "@/lib/utils";
import { PointerHighlight } from "../ui/pointer-highlight";
import CategoryAndSearch from "./category-and-search";

export default function Banner({
  title,
  description,
  highlight,
  children,
}: {
  title: string;
  description?: string;
  highlight?: string;
  children?: React.ReactNode;
}) {
  // Function to render title with highlight
  const renderTitle = () => {
    if (!highlight) {
      return (
        <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </span>
      );
    }

    const parts = title.split(highlight);
    if (parts.length === 1) {
      // Highlight not found in title, just return the title with gradient
      return (
        <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </span>
      );
    }

    return parts.map((part, index) => (
      <span key={index}>
        <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {part}
        </span>
        {index < parts.length - 1 && (
          <span className="inline-block">
            <PointerHighlight>{highlight}</PointerHighlight>
          </span>
        )}
      </span>
    ));
  };

  return (
    <div className="relative mt-6 mb-5">
      <div className="relative space-y-4 flex flex-col items-center justify-center">
        {children}

        <div className="max-w-2xl flex flex-col justify-center space-y-2">
          {/* Title with better typography */}
          <div className="space-y-4 flex flex-col">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center max-w-xl font-bold tracking-tight">
              {renderTitle()}
            </h1>
            <p className="text-base md:text-lg text-center max-w-xl text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Search and categories */}
          <CategoryAndSearch />
        </div>
      </div>
    </div>
  );
}
