"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ContactShadows,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  Copy,
  EyeOff,
  Grid3X3,
  Layers,
  Magnet,
  MousePointer2,
  PenTool,
  Play,
  Plus,
  PlusSquare,
  RotateCcw,
  RotateCw,
  Save,
  Scissors,
  Share,
  Trash2,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { Suspense, useState } from "react";

// --- 3D Components ---

const ModelV2 = ({ color = "#f97316" }: { color?: string }) => {
  return (
    <group>
      {/* Character Mockup (Lucky Turtle style) */}
      <group position={[0, 0, 0]}>
        {/* Body */}
        <mesh castShadow position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.5, 0.8, 4, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color='#ffedd5' />
        </mesh>
        {/* Hat / Cap */}
        <mesh castShadow position={[0, 1.7, 0.1]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.2, 32]} />
          <meshStandardMaterial color='#3b82f6' />
        </mesh>
        {/* Skateboard Mockup */}
        <mesh castShadow position={[0, 0.1, 0.2]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.8, 0.05, 1.8]} />
          <meshStandardMaterial color='#1e1e1e' />
        </mesh>
      </group>

      {/* Bounding Box & Dimensions */}
      <group position={[0, 0.9, 0]}>
        {/* The Box */}
        <lineSegments>
          <edgesGeometry
            args={[new (require("three").BoxGeometry)(1.4, 2.2, 1.2)]}
          />
          <lineBasicMaterial color='white' transparent opacity={0.5} />
        </lineSegments>

        {/* Circular Handles */}
        {[-0.7, 0.7].map((x) =>
          [-1.1, 1.1].map((y) => (
            <mesh key={`${x}-${y}`} position={[x, y, 0.6]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color='white' />
            </mesh>
          ))
        )}
        {[0].map((x) =>
          [-1.1, 1.1].map((y) => (
            <mesh key={`center-${y}`} position={[x, y, 0.6]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshBasicMaterial color='white' />
              <mesh position={[0, 0, 0.01]}>
                <ringGeometry args={[0.08, 0.1, 32]} />
                <meshBasicMaterial color='white' />
              </mesh>
            </mesh>
          ))
        )}

        {/* Dimension Labels */}
        <group position={[-0.8, 1.1, 0.6]}>
          <mesh>
            <planeGeometry args={[0.4, 0.15]} />
            <meshBasicMaterial color='black' transparent opacity={0.8} />
          </mesh>
          {/* We can't easily do text without another lib, so we'll skip the actual "120MM" text for now or use a placeholder */}
        </group>
      </group>
    </group>
  );
};

// --- UI Components ---

const FloatingSegment = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-1 rounded-2xl border border-white/10 bg-[#1a1a1a]/80 p-1 shadow-2xl backdrop-blur-xl",
      className
    )}
  >
    {children}
  </div>
);

const NavButton = ({
  icon: Icon,
  label,
  active,
  onClick,
  variant = "default",
}: {
  icon?: any;
  label?: string;
  active?: boolean;
  onClick?: () => void;
  variant?: "default" | "minimal";
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-all",
      active
        ? "bg-white/10 text-white"
        : "text-white/40 hover:bg-white/5 hover:text-white"
    )}
  >
    {Icon && (
      <Icon className={cn("size-5", active ? "text-white" : "text-white/60")} />
    )}
    {label && (
      <span className='text-[10px] font-medium tracking-wider uppercase'>
        {label}
      </span>
    )}
  </button>
);

const DesignerV2 = () => {
  const [activeTool, setActiveTool] = useState("select");
  const [showColorPanel, setShowColorPanel] = useState(true);
  const [activeColor, setActiveColor] = useState("#f97316");

  const colorPresets = [
    { color: "#ff4444", name: "Red" },
    { color: "#f97316", name: "Orange" },
    { color: "#ffcc00", name: "Yellow" },
    { color: "#00ff00", name: "Green" },
    { color: "#0088ff", name: "Blue" },
  ];

  return (
    <div className='flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0a] font-sans text-white hover:bg-indigo-700/30'>
      {/* 3D Workspace */}
      <div className='absolute inset-0 z-0'>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[5, 2, 8]} fov={35} />
          <Suspense fallback={null}>
            <Environment preset='city' />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
            <Grid
              infiniteGrid
              fadeDistance={50}
              fadeStrength={5}
              cellSize={1}
              sectionSize={5}
              sectionThickness={1.5}
              sectionColor='#222'
              cellColor='#111'
            />
            <ModelV2 color={activeColor} />
            <OrbitControls
              makeDefault
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.75}
            />
            <GizmoHelper alignment='top-left' margin={[100, 100]}>
              <GizmoViewport
                axisColors={["#ff3653", "#0ad46b", "#2266ff"]}
                labelColor='white'
              />
            </GizmoHelper>
          </Suspense>
        </Canvas>
      </div>

      {/* Top Overlay */}
      <div className='pointer-events-none relative z-10 flex items-start justify-between p-6'>
        {/* Project Info */}
        <div className='pointer-events-auto flex flex-col gap-2'>
          <div className='flex items-center gap-4'>
            <button className='group flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10'>
              <ArrowLeft className='size-5 text-white/60 group-hover:text-white' />
            </button>
            <div className='flex items-center gap-2'>
              <span className='text-xl font-medium tracking-tight'>
                Lucky Turtle
              </span>
              <ChevronDown className='size-4 text-white/40' />
            </div>
          </div>
          <div className='flex w-10 flex-col items-center'>
            <span className='mt-1 text-[10px] font-bold tracking-widest text-white/40 uppercase'>
              Back
            </span>
          </div>
        </div>

        {/* Center Tools */}
        <div className='pointer-events-auto'>
          <FloatingSegment>
            <NavButton
              icon={MousePointer2}
              label='Select'
              active={activeTool === "select"}
              onClick={() => setActiveTool("select")}
            />
            <NavButton
              icon={PenTool}
              label='Draw'
              active={activeTool === "draw"}
              onClick={() => setActiveTool("draw")}
            />
            <NavButton
              icon={Plus}
              label='Add'
              active={activeTool === "add"}
              onClick={() => setActiveTool("add")}
            />
          </FloatingSegment>
        </div>

        {/* Right Actions */}
        <div className='pointer-events-auto'>
          <FloatingSegment>
            <NavButton icon={PlusSquare} label='New' />
            <NavButton icon={Share} label='Share' />
            <NavButton icon={Save} label='Save' />
          </FloatingSegment>
        </div>
      </div>

      {/* Center Splitter / Indicators (Optional) */}
      <div className='pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-20'>
        <div className='flex size-10 items-center justify-center rounded-full border border-white/20'>
          <div className='h-4 w-0.5 bg-white/40' />
        </div>
      </div>

      {/* Color Panel (Floating) */}
      <AnimatePresence>
        {showColorPanel && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className='pointer-events-auto absolute top-1/2 right-10 z-20 w-80 -translate-y-[60%] overflow-hidden rounded-[32px] border border-white/10 bg-[#121212] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]'
          >
            <div className='flex items-center justify-between border-b border-white/5 p-4'>
              <div className='flex-grow text-center text-sm font-semibold tracking-tight'>
                Colors
              </div>
              <button
                onClick={() => setShowColorPanel(false)}
                className='flex size-6 items-center justify-center rounded-full transition-all hover:bg-white/10'
              >
                <X className='size-3.5 text-white/40' />
              </button>
            </div>

            <div className='p-2'>
              <Tabs defaultValue='grid' className='w-full'>
                <TabsList className='h-10 w-full rounded-xl bg-white/5 p-1'>
                  <TabsTrigger
                    value='grid'
                    className='flex-1 rounded-lg text-xs data-[state=active]:bg-white/15'
                  >
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value='spectrum'
                    className='flex-1 rounded-lg text-xs data-[state=active]:bg-white/15'
                  >
                    Spectrum
                  </TabsTrigger>
                  <TabsTrigger
                    value='sliders'
                    className='flex-1 rounded-lg text-xs data-[state=active]:bg-white/15'
                  >
                    Sliders
                  </TabsTrigger>
                </TabsList>

                <div className='mt-4 space-y-4 px-2'>
                  {/* Grid of colors */}
                  <div className='grid grid-cols-10 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10'>
                    {Array.from({ length: 120 }).map((_, i) => (
                      <div
                        key={i}
                        className='aspect-square w-full'
                        style={{
                          backgroundColor: `hsl(${i * 3}, 70%, ${50 + (i % 5) * 5}%)`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Opacity slider */}
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between text-[10px] font-bold tracking-widest text-white/40 uppercase'>
                      <span>Opacity</span>
                      <span className='text-white'>100%</span>
                    </div>
                    <div className='relative flex h-6 w-full items-center rounded-full border border-white/5 bg-gradient-to-r from-transparent to-purple-500 px-1'>
                      <div className='border-primary absolute right-1 size-4 rounded-full border-2 bg-white shadow-lg' />
                    </div>
                  </div>

                  {/* Recent Colors */}
                  <div className='flex flex-wrap gap-2 pb-2'>
                    <div className='size-16 rounded-2xl bg-purple-500 shadow-xl shadow-purple-500/20' />
                    <div className='flex flex-grow flex-wrap content-start gap-2'>
                      {[
                        "#ffffff",
                        "#ffecd2",
                        "#fcb69f",
                        "#ff9a9e",
                        "#a1c4fd",
                        "#c2e9fb",
                      ].map((c, i) => (
                        <div
                          key={i}
                          className='size-7 rounded-full border border-white/10'
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <div className='flex size-7 items-center justify-center rounded-full border border-dashed border-white/10 text-white/20'>
                        <Plus className='size-4' />
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Toolbars Overlay */}
      <div className='pointer-events-none relative z-10 mt-auto flex items-end justify-between p-6'>
        {/* Undo / Redo */}
        <div className='pointer-events-auto flex flex-col items-center gap-2'>
          <FloatingSegment className='p-1 px-2'>
            <button className='p-2 text-white/40 transition-all hover:text-white'>
              <RotateCcw className='size-5' />
            </button>
            <button className='p-2 text-white/40 transition-all hover:text-white'>
              <RotateCw className='size-5' />
            </button>
          </FloatingSegment>
          <div className='flex gap-6 text-[10px] font-bold tracking-widest text-white/40 uppercase'>
            <span>Undo</span>
            <span>Redo</span>
          </div>
        </div>

        {/* Snap Control */}
        <div className='pointer-events-auto flex flex-col items-center gap-2'>
          <button className='group hover:border-primary/50 flex size-14 items-center justify-center rounded-full border border-white/10 bg-[#1a1a1a] shadow-xl transition-all'>
            <Magnet className='group-hover:text-primary size-6 text-white/40' />
          </button>
          <span className='text-primary text-[10px] font-bold tracking-widest uppercase'>
            Snap
          </span>
        </div>

        {/* Main Actions Bar */}
        <div className='pointer-events-auto flex flex-col items-center gap-2'>
          <FloatingSegment className='px-2'>
            <NavButton icon={Copy} label='Duplicate' />
            <NavButton icon={Layers} label='Boolean' />
            <NavButton icon={Grid3X3} label='Loose' />
            <NavButton icon={PlusSquare} label='Group' />
            <NavButton icon={PlusSquare} label='Studs' />
            <NavButton icon={EyeOff} label='Hide' />
            <NavButton icon={Trash2} label='Delete' />
          </FloatingSegment>
          <div className='flex gap-8 text-[10px] font-bold tracking-widest text-white/40 uppercase' />
        </div>

        {/* Colors Quick Access */}
        <div className='pointer-events-auto flex flex-col items-center gap-2'>
          <FloatingSegment className='gap-2 px-3'>
            {colorPresets.map((preset, i) => (
              <div
                key={i}
                onClick={() => setActiveColor(preset.color)}
                className={cn(
                  "size-6 cursor-pointer rounded-full ring-white/20 ring-offset-2 ring-offset-[#1a1a1a] transition-all hover:ring-2",
                  activeColor === preset.color && "ring-2 ring-white"
                )}
                style={{ backgroundColor: preset.color }}
              />
            ))}
            <button
              onClick={() => setShowColorPanel(!showColorPanel)}
              className={cn(
                "ml-1 pb-1 text-white/40 transition-colors hover:text-white",
                showColorPanel && "text-white"
              )}
            >
              ...
            </button>
          </FloatingSegment>
          <span className='text-[10px] font-bold tracking-widest text-white/40 uppercase'>
            Color
          </span>
        </div>

        {/* Play & Action */}
        <div className='pointer-events-auto flex flex-col items-center gap-2'>
          <div className='flex gap-2'>
            <button className='group flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-[#1a1a1a] transition-all hover:border-white/30'>
              <Play className='size-5 fill-white/10 text-white/40 group-hover:text-white' />
            </button>
            <button className='group flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-[#1a1a1a] transition-all hover:border-white/30'>
              <Video className='size-5 text-white/40 group-hover:text-white' />
            </button>
          </div>
          <div className='flex gap-6 text-[10px] font-bold tracking-widest text-white/40 uppercase'>
            <span>Play</span>
            <span>Action</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerV2;
