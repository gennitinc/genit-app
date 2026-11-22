import type { ComponentType, CSSProperties } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

/**
 * An icon slot that accepts either a Hugeicons icon (the default) or a custom
 * component such as a brand logo SVG.
 */
export type IconSource =
  | IconSvgElement
  | ComponentType<{ className?: string; style?: CSSProperties }>;

export function isHugeicon(icon: IconSource): icon is IconSvgElement {
  return Array.isArray(icon);
}

export function IconSourceView({
  icon,
  className,
  style,
  size,
  strokeWidth,
}: {
  icon: IconSource;
  className?: string;
  style?: CSSProperties;
  size?: number;
  strokeWidth?: number;
}) {
  if (isHugeicon(icon)) {
    return (
      <HugeiconsIcon
        icon={icon}
        className={className}
        style={style}
        size={size}
        strokeWidth={strokeWidth}
      />
    );
  }
  const Icon = icon;
  return (
    <Icon
      className={className}
      style={size ? { width: size, height: size, ...style } : style}
    />
  );
}
