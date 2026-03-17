"use client";
import { Handle, Position } from "reactflow";
import { X } from "lucide-react";
// import { GlowingEffect } from "../ui/glowing-effect";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BorderBeam } from "@/components/ui/border-beam";

export const BrandNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const [lightColor, setLightColor] = useState("#1064eb");
  useEffect(() => {
    setLightColor(theme === "dark" ? "#2c48e3" : "#2c48e3");
  }, [theme]);

  return (
    <div className="relative max-w-sm bg-muted border border-muted rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* <BorderBeam
        lightColor={lightColor}
        lightWidth={400}
        duration={8}
        className="absolute inset-0 rounded-xl"
      /> */}
      {/* Connection Handles */}
      {/* <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      /> */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />

      {/* Remove Button */}
      {data.onRemoveNode && data.nodeId && (
        <button
          onClick={() => data.onRemoveNode?.(data.nodeId as string)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg z-10"
          title="Remove node"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      {/* <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      /> */}

      {/* Remove Button */}
      {/* {data.onRemoveNode && (
        <button
          onClick={() => data.onRemoveNode(data.nodeId)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200 shadow-lg"
          title="Remove node"
        >
          <X className="w-3 h-3" />
        </button>
      )} */}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <img
              src="https://png.pngtree.com/template/20200427/ourmid/pngtree-black-horse---the-luxurious-brand-logo-design-image_367194.jpg"
              alt=""
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          </a>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1">
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:underline truncate"
              >
                Alex Johnson
              </a>
            </div>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-sm hover:underline"
            >
              @userhandle
            </a>
          </div>
        </div>
        {/* <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
        >
         
        </a> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={256}
          height={260}
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 256 260"
          className="w-5 h-5"
        >
          <path
            fill="#fff"
            d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
          Just finished reading an amazing book on web development! The future
          of frontend is looking bright.
        </p>
      </div>

      {/* Timestamp */}
      <div className="text-muted-foreground text-xs">
        Last updated · Dec 20, 2024
      </div>
    </div>
  );
};
