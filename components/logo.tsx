import { cn } from "@/lib/utils";
import Image from "next/image";
import appLogo from "@/resources/images/gennit.svg";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-transparent",
        className
      )}
    >
      <Image
        src={appLogo}
        className="h-8 w-8"
        alt="gennit logo"
        height={200}
        width={200}
      />
    </div>
  );
}
