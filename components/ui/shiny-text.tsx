import "./shiny-text.css";
import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText = ({
  text,
  disabled = false,
  speed = 3,
  className = "",
}: ShinyTextProps) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${disabled ? "disabled" : ""} ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
