import { cn } from "@/lib/utils";
import Image from "next/image";
import appLogo from "@/resources/images/gennit.svg";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-transparent p-1.5",
        className
      )}
    >
      <Image
        src={appLogo}
        // className="h-12 w-12"
        alt="enterbox logo"
        height={200}
        width={200}
      />
      
    </div>
  );
}
