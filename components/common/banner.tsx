import { PointerHighlight } from "../ui/pointer-highlight";
import CategoryAndSearch from "./category-and-search";
import { cn } from "@/lib/utils";

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
        <span className='from-foreground to-foreground/70 bg-gradient-to-br bg-clip-text text-transparent'>
          {title}
        </span>
      );
    }

    const parts = title.split(highlight);
    if (parts.length === 1) {
      // Highlight not found in title, just return the title with gradient
      return (
        <span className='from-foreground to-foreground/70 bg-gradient-to-br bg-clip-text text-transparent'>
          {title}
        </span>
      );
    }

    return parts.map((part, index) => (
      <span key={index}>
        <span className='from-foreground to-foreground/70 bg-gradient-to-br bg-clip-text text-transparent'>
          {part}
        </span>
        {index < parts.length - 1 && (
          <span className='inline-block'>
            <PointerHighlight>{highlight}</PointerHighlight>
          </span>
        )}
      </span>
    ));
  };

  return (
    <div className='relative mt-6 mb-5'>
      <div className='relative flex flex-col items-center justify-center space-y-4'>
        {children}

        <div className='flex max-w-2xl flex-col justify-center space-y-2'>
          {/* Title with better typography */}
          <div className='flex flex-col space-y-4'>
            <h1 className='max-w-xl text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl'>
              {renderTitle()}
            </h1>
            <p className='text-muted-foreground max-w-xl text-center text-base leading-relaxed md:text-lg'>
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
