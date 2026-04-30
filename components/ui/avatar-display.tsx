"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import appLogo from "@/resources/images/gennit-logo-genneric.svg";
import Image from "next/image";

interface AvatarDisplayProps {
  src?: string;
  alt: string;
  fallback: string;
  variant?: "ai" | "user";
  className?: string;
}

export function AvatarDisplay({
  src,
  alt,
  fallback,
  variant = "user",
  className = "",
}: AvatarDisplayProps) {
  if (variant === "ai") {
    return (
      <Image
        src={appLogo}
        alt={alt}
        className={`mt-1 h-8 w-8 flex-shrink-0 ${className} dark:invert`}
      />
    );
  }

  return (
    <Avatar className={`mt-1 h-8 w-8 flex-shrink-0 ${className}`}>
      {src && <AvatarImage src={src || "/placeholder.svg"} alt={alt} />}
      <AvatarFallback className='bg-muted-foreground/30 text-muted-foreground rounded-lg text-sm font-medium'>
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
