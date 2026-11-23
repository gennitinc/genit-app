import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

export type StandardPromoProps = {
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  animationType: "spring" | "fade" | "slide";
};

export const StandardPromo: React.FC<StandardPromoProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor,
  animationType,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const slideUp = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    from: 100,
    to: 0,
  });

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    from: 0.5,
    to: 1,
  });

  const contentStyle: React.CSSProperties = {
    textAlign: "center",
    color: textColor,
    fontFamily: "sans-serif",
    zIndex: 1,
  };

  if (animationType === "slide") {
    contentStyle.transform = `translateY(${slideUp}px)`;
  } else if (animationType === "spring") {
    contentStyle.transform = `scale(${scale})`;
  } else {
    // fade
    contentStyle.opacity = opacity;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={contentStyle}>
        <h1 style={{ fontSize: 80, fontWeight: "bold", marginBottom: 20 }}>
          {title}
        </h1>
        <h2 style={{ fontSize: 40, fontWeight: "normal" }}>{subtitle}</h2>
      </div>
    </AbsoluteFill>
  );
};
