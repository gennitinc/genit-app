import { StandardPromo, StandardPromoProps } from "../../remotion/Template";
import { Player } from "@remotion/player";
import React from "react";

interface VideoPlayerMessageProps {
  videoConfig: StandardPromoProps & { durationInFrames: number };
}

export function VideoPlayerMessage({ videoConfig }: VideoPlayerMessageProps) {
  // Ensure we have valid props before rendering
  if (!videoConfig) return <div>Invalid Video Config</div>;

  return (
    <div className='border-border group relative aspect-video w-full overflow-hidden rounded-md border bg-black/5'>
      <Player
        component={StandardPromo}
        inputProps={videoConfig}
        durationInFrames={videoConfig.durationInFrames || 150}
        fps={30}
        compositionWidth={1920}
        compositionHeight={1080}
        style={{
          width: "100%",
          height: "100%",
        }}
        controls
        autoPlay={false}
      />
    </div>
  );
}
