import Loading from "@/utils/Loading";
import type React from "react";

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Spinner({ className, ...props }: SpinnerProps) {
  const size = Number(props.width || props.height) || 24;
  return <Loading size={size} className={className} />;
}
