"use client";

import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Float,
} from "@react-three/drei";
import {
  Search,
  Box,
  Layers,
  Camera,
  Sun,
  Lightbulb,
  User,
  Image as ImageIcon,
  Plus,
  Play,
  Share2,
  MousePointer2,
  Maximize2,
  Undo2,
  Redo2,
  Download,
  RotateCcw,
  Sparkles,
  Mic,
  ArrowUp,
  PanelLeftClose,
  PanelRightClose,
  ChevronDown,
  Minus,
  Cog,
  Square,
  Circle,
  Triangle,
  Type,
  PenTool,
  MessageSquare,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  BoxSelect,
  MousePointer,
  Sparkle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { NavUser } from "@/components/layout/nav-user";
import { useUserContext } from "@/context/AuthenticatedContext";

// --- 3D Scene Components ---

const EFFECTS_CONFIG: Record<string, any> = {
  default: {
    bg: "#f3f4f6",
    env: "city",
    ambient: 0.5,
    direct: { pos: [10, 10, 10], color: "#ffffff", intensity: 1 },
  },
  neon: {
    bg: "#020617",
    env: "night",
    ambient: 0.2,
    direct: { pos: [10, 5, 10], color: "#a855f7", intensity: 2 },
    secondary: { pos: [-10, 5, -10], color: "#3b82f6", intensity: 1.5 },
  },
  studio: {
    bg: "#ffffff",
    env: "studio",
    ambient: 0.8,
    direct: { pos: [5, 10, 5], color: "#ffffff", intensity: 1.5 },
  },
  warm: {
    bg: "#fff7ed",
    env: "sunset",
    ambient: 0.4,
    direct: { pos: [10, 2, 5], color: "#f97316", intensity: 2 },
  },
  cyber: {
    bg: "#0f172a",
    env: "apartment",
    ambient: 0.1,
    direct: { pos: [10, 10, 10], color: "#06b6d4", intensity: 2 },
    secondary: { pos: [-10, -5, -10], color: "#d946ef", intensity: 1.5 },
  },
  soft: {
    bg: "#fdf2f8",
    env: "forest",
    ambient: 0.6,
    direct: { pos: [0, 10, 10], color: "#fbcfe8", intensity: 1 },
  },
};

const PlaceholderModel = ({
  animation = "float",
  duration = 2.5,
  isPlaying = true,
  materialProps = { color: "#ea580c", roughness: 0.2, metalness: 0.8 },
}: {
  animation?: string;
  duration?: number;
  isPlaying?: boolean;
  materialProps?: { color: string; roughness: number; metalness: number };
}) => {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (!isPlaying || !groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (animation === "pulse") {
      const s = 1 + Math.sin((t * Math.PI * 2) / duration) * 0.05;
      groupRef.current.scale.set(s, s, s);
    } else {
      groupRef.current.scale.set(1, 1, 1);
    }

    if (animation === "spin") {
      groupRef.current.rotation.y = (t * Math.PI * 2) / duration;
    }
  });

  return (
    <Float
      speed={isPlaying ? 2 : 0}
      rotationIntensity={animation === "spin" && isPlaying ? 2 : 0.5}
      floatIntensity={animation === "float" && isPlaying ? 2 : 0.5}
    >
      <group ref={groupRef}>
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[1, 2, 4, 8]} />
          <meshStandardMaterial
            color={materialProps.color}
            roughness={materialProps.roughness}
            metalness={materialProps.metalness}
          />
        </mesh>
        {/* Heads */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color={materialProps.color} />
        </mesh>
      </group>
    </Float>
  );
};

const SceneBackground = ({
  effect = "default",
  ambientIntensity = 0.5,
  environmentIntensity = 1,
}: {
  effect?: string;
  ambientIntensity?: number;
  environmentIntensity?: number;
}) => {
  const config = EFFECTS_CONFIG[effect] || EFFECTS_CONFIG.default;

  return (
    <>
      <color attach="background" args={[config.bg]} />
      <Environment preset={config.env} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={config.direct.pos as any}
        intensity={config.direct.intensity}
        color={config.direct.color}
        castShadow
      />
      {config.secondary && (
        <directionalLight
          position={config.secondary.pos as any}
          intensity={config.secondary.intensity}
          color={config.secondary.color}
        />
      )}
      <ContactShadows
        opacity={effect === "studio" ? 0.2 : 0.4}
        scale={10}
        blur={2}
        far={10}
        resolution={256}
        color={effect === "warm" ? "#431407" : "#000000"}
      />
    </>
  );
};

// --- UI Components ---

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  locked,
}: {
  icon: any;
  label: string;
  active?: boolean;
  locked?: boolean;
}) => (
  <div
    className={cn(
      "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all",
      active
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    )}
  >
    <div className="flex items-center gap-3">
      <Icon className="size-4" />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {locked && (
      <span className="text-[10px] text-muted-foreground opacity-50">🔒</span>
    )}
  </div>
);

const LayerItem = ({
  icon: Icon,
  name,
  depth = 0,
  selected = false,
  visible = true,
  locked = false,
  onClick,
}: {
  icon: any;
  name: string;
  depth?: number;
  selected?: boolean;
  visible?: boolean;
  locked?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "group flex items-center gap-2 px-3 py-1.5 cursor-pointer text-[11px] font-medium transition-colors border-l-2",
      selected
        ? "bg-primary text-primary-foreground border-primary"
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground border-transparent",
    )}
    style={{ paddingLeft: `${depth * 12 + 12}px` }}
  >
    <div className="flex items-center gap-2 flex-grow min-w-0">
      <Icon
        className={cn(
          "size-3.5 flex-shrink-0",
          selected ? "text-primary-foreground" : "text-primary",
        )}
      />
      <span className="truncate">{name}</span>
    </div>
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="size-5 rounded-md hover:bg-background/20"
      >
        {visible ? (
          <Eye className="size-2.5" />
        ) : (
          <EyeOff className="size-2.5" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-5 rounded-md hover:bg-background/20"
      >
        {locked ? (
          <Lock className="size-2.5" />
        ) : (
          <Unlock className="size-2.5" />
        )}
      </Button>
    </div>
  </div>
);

const PropertySection = ({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="border-b border-border/50">
    <div className="px-4 py-3 flex items-center justify-between group cursor-pointer hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-2">
        <ChevronDown className="size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
          {title}
        </span>
      </div>
      {action}
    </div>
    <div className="px-4 pb-5 space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
      {children}
    </div>
  </div>
);

const IconButton = ({
  icon: Icon,
  active,
  className,
  onClick,
  tooltip,
}: {
  icon: any;
  active?: boolean;
  className?: string;
  onClick?: () => void;
  tooltip?: string;
}) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={cn(
      "p-2 rounded-lg transition-all flex items-center justify-center group relative",
      active
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
      className,
    )}
  >
    <Icon className="size-4 transition-transform group-hover:scale-110" />
    {active && (
      <motion.div
        layoutId="active-indicator"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground"
      />
    )}
  </button>
);

const NumericStepper = ({
  value,
  onValueChange,
  min = 0,
  max = 1,
  step = 0.1,
  label,
  precision = 2,
  unit = "",
}: {
  value: number;
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  precision?: number;
  unit?: string;
}) => (
  <div className="space-y-2">
    {label && (
      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary">
          {value.toFixed(precision)}
          {unit}
        </span>
      </div>
    )}
    <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/50">
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-lg hover:bg-background shadow-sm"
        onClick={() => onValueChange(Math.max(min, value - step))}
      >
        <Minus className="size-3" />
      </Button>
      <div className="flex-grow text-center text-xs font-medium tabular-nums">
        {value.toFixed(precision)}
        {unit}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-lg hover:bg-background shadow-sm"
        onClick={() => onValueChange(Math.min(max, value + step))}
      >
        <Plus className="size-3" />
      </Button>
    </div>
  </div>
);

const ThreeDProjectCreatePage = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const user = useUserContext().user;
  const [activeTool, setActiveTool] = useState("select");

  // Transform State
  const [position, setPosition] = useState({ x: 319.95, y: 362.95, z: 0 });
  const [rotation, setRotation] = useState({ x: -0.03, y: 0, z: 0 });

  // Material State
  const [modelColor, setModelColor] = useState("#ea580c");
  const [roughness, setRoughness] = useState(0.2);
  const [metalness, setMetalness] = useState(0.8);

  // Lighting State
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);
  const [exposure, setExposure] = useState(1);

  // Lens States
  const [fov, setFov] = useState(50);
  const [cameraDistance, setCameraDistance] = useState(8);
  const [autoRotate, setAutoRotate] = useState(false);
  const [activeLens, setActiveLens] = useState<string | null>(null);

  // Effects State
  const [activeEffect, setActiveEffect] = useState("default");

  // Animation States
  const [activeTab, setActiveTab] = useState<
    "design" | "material" | "lighting" | "animation"
  >("design");
  const [animationPreset, setAnimationPreset] = useState("float");
  const [animationDuration, setAnimationDuration] = useState(2.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prompt, setPrompt] = useState("");

  const toggleLens = (type: string) => {
    setActiveLens(activeLens === type ? null : type);

    // Reset or set states based on type
    if (activeLens === type) {
      setFov(50);
      setCameraDistance(8);
      setAutoRotate(false);
    } else {
      switch (type) {
        case "wide":
          setFov(75);
          setCameraDistance(8);
          setAutoRotate(false);
          break;
        case "zoom":
          setFov(50);
          setCameraDistance(12);
          setAutoRotate(false);
          break;
        case "rotate":
          setFov(50);
          setCameraDistance(8);
          setAutoRotate(true);
          break;
        case "360":
          setFov(50);
          setCameraDistance(8);
          setAutoRotate(true); // Fast rotation or different behavior
          break;
      }
    }
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground">
      {/* Main Container */}
      <div className="flex-grow flex relative overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence initial={false}>
          {leftSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-border bg-card flex flex-col z-20 shadow-xl overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-border min-h-[64px]">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="size-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">
                    Layers
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg"
                  >
                    <Search className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg"
                    onClick={() => setLeftSidebarOpen(false)}
                  >
                    <PanelLeftClose className="size-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="py-2">
                  <LayerItem icon={Sparkle} name="Depth" depth={0} selected />
                  <div className="mt-1">
                    <LayerItem icon={BoxSelect} name="Frame" depth={1} />
                    <LayerItem icon={Type} name="Text 2" depth={2} />
                    <LayerItem icon={BoxSelect} name="Frame" depth={1} />
                    <LayerItem icon={Type} name="Text" depth={2} />
                    <LayerItem icon={Type} name="Text" depth={2} />
                    <LayerItem icon={Square} name="Rectangle 3" depth={1} />
                    <LayerItem icon={Square} name="Rectangle 2" depth={1} />
                    <LayerItem icon={Square} name="Rectangle 4" depth={1} />
                    <LayerItem icon={Square} name="Rectangle" depth={1} />
                  </div>
                </div>
              </ScrollArea>

              <div className="px-4 py-1 border-t border-border bg-muted/10">
                <NavUser user={user} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Center Content */}
        <main className="flex-grow relative flex flex-col">
          {!leftSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-40 bg-background/50 backdrop-blur-md"
              onClick={() => setLeftSidebarOpen(true)}
            >
              <PanelLeftClose className="size-4 rotate-180" />
            </Button>
          )}

          {/* Top Toolbar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 bg-background/70 backdrop-blur-2xl border border-white/10 p-1.5 rounded-[24px] shadow-[0_16px_32px_-8px_rgba(0,0,0,0.5)] transition-all">
            <IconButton
              icon={MousePointer}
              active={activeTool === "select"}
              onClick={() => setActiveTool("select")}
              tooltip="Select (V)"
            />
            <IconButton
              icon={BoxSelect}
              active={activeTool === "frame"}
              onClick={() => setActiveTool("frame")}
              tooltip="Frame (F)"
            />
            <Separator
              orientation="vertical"
              className="h-4 mx-1.5 opacity-20"
            />
            <IconButton
              icon={Square}
              active={activeTool === "rectangle"}
              onClick={() => setActiveTool("rectangle")}
              tooltip="Rectangle (R)"
            />
            <IconButton
              icon={Circle}
              active={activeTool === "circle"}
              onClick={() => setActiveTool("circle")}
              tooltip="Circle (O)"
            />
            <IconButton
              icon={Triangle}
              active={activeTool === "triangle"}
              onClick={() => setActiveTool("triangle")}
              tooltip="Triangle"
            />
            <IconButton
              icon={Type}
              active={activeTool === "text"}
              onClick={() => setActiveTool("text")}
              tooltip="Text (T)"
            />
            <IconButton
              icon={PenTool}
              active={activeTool === "pen"}
              onClick={() => setActiveTool("pen")}
              tooltip="Vector (P)"
            />
            <IconButton
              icon={ImageIcon}
              active={activeTool === "image"}
              onClick={() => setActiveTool("image")}
              tooltip="Image (I)"
            />
            <Separator
              orientation="vertical"
              className="h-4 mx-1.5 opacity-20"
            />
            <IconButton
              icon={MessageSquare}
              active={activeTool === "comment"}
              onClick={() => setActiveTool("comment")}
              tooltip="Comment (C)"
            />
            <IconButton
              icon={Cog}
              active={activeTool === "settings"}
              onClick={() => setActiveTool("settings")}
              tooltip="Scene Settings"
            />
            <Separator
              orientation="vertical"
              className="h-4 mx-1.5 opacity-20"
            />
            <IconButton
              icon={isPlaying ? Play : RotateCcw}
              active={isPlaying}
              onClick={() => setIsPlaying(!isPlaying)}
              tooltip={isPlaying ? "Stop" : "Play"}
              className={
                isPlaying
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                  : ""
              }
            />
          </div>

          {/* 3D Canvas */}
          <div className="absolute inset-0 z-0 transition-colors duration-1000">
            <Canvas shadows dpr={[1, 2]}>
              <Suspense fallback={null}>
                <SceneBackground
                  effect={activeEffect}
                  ambientIntensity={ambientIntensity}
                />
                <PlaceholderModel
                  animation={animationPreset}
                  duration={animationDuration}
                  isPlaying={isPlaying}
                  materialProps={{ color: modelColor, roughness, metalness }}
                />
                <PerspectiveCamera
                  makeDefault
                  position={[0, 2, cameraDistance]}
                  fov={fov}
                />
                <OrbitControls
                  makeDefault
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI / 1.75}
                  autoRotate={autoRotate}
                  autoRotateSpeed={activeLens === "360" ? 10 : 2}
                  enableDamping={true}
                />
              </Suspense>
            </Canvas>
          </div>

          {/* AI Prompt Input (Bottom) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4">
            <div className="bg-background/80 backdrop-blur-3xl border border-white/5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] rounded-[40px] p-2 flex items-end gap-2 transition-all focus-within:ring-2 ring-primary/20 group">
              <Button
                variant="ghost"
                className="rounded-full h-10 px-4 flex items-center gap-2 hover:bg-muted/50 transition-colors flex-shrink-0 border border-border/50"
              >
                <Sparkles className="size-4 text-primary" />
                <span className="text-[10px] font-black text-muted-foreground group-focus-within:text-foreground transition-colors uppercase tracking-widest">
                  Pexovia v5.2
                </span>
                <ChevronDown className="size-3 text-muted-foreground/50" />
              </Button>
              <div className="flex-grow flex items-center px-2 py-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="What are we creating today?..."
                  className="bg-transparent border-none outline-none flex-grow text-sm placeholder:text-muted-foreground/40 resize-none min-h-[24px] max-h-[160px] py-1 leading-relaxed"
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      setPrompt("");
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-1 pr-1 pb-1 flex-shrink-0">
                <Button
                  size="icon"
                  className={cn(
                    "size-10 rounded-full transition-all duration-300",
                    prompt.trim()
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                      : "bg-muted text-muted-foreground/30",
                  )}
                  onClick={() => setPrompt("")}
                >
                  <ArrowUp className="size-5" />
                </Button>
              </div>
            </div>
          </div>

          {!rightSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-40 bg-background/50 backdrop-blur-md"
              onClick={() => setRightSidebarOpen(true)}
            >
              <PanelRightClose className="size-4" />
            </Button>
          )}
        </main>

        {/* Right Sidebar */}
        <AnimatePresence initial={false}>
          {rightSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-border bg-card flex flex-col z-20 shadow-2xl overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-border min-h-[64px]">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cog className="size-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">
                    Properties
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground tracking-tighter">
                    115% <ChevronDown className="size-2 inline ml-0.5" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg"
                    onClick={() => setRightSidebarOpen(false)}
                  >
                    <PanelRightClose className="size-4 rotate-180" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="flex flex-col">
                  {/* Transform Section */}
                  <PropertySection
                    title="Transform"
                    action={
                      <IconButton
                        icon={Settings}
                        className="size-6 p-1 min-h-0"
                      />
                    }
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-muted-foreground/60 w-12 italic uppercase">
                          Position
                        </span>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/50">
                            <span className="text-[10px] font-black text-primary opacity-50 ml-1">
                              X
                            </span>
                            <input
                              value={position.x}
                              onChange={(e) =>
                                setPosition({
                                  ...position,
                                  x: parseFloat(e.target.value),
                                })
                              }
                              className="bg-transparent border-none outline-none w-full text-center tabular-nums p-0"
                            />
                          </div>
                          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/50">
                            <span className="text-[10px] font-black text-primary opacity-50 ml-1">
                              Y
                            </span>
                            <input
                              value={position.y}
                              onChange={(e) =>
                                setPosition({
                                  ...position,
                                  y: parseFloat(e.target.value),
                                })
                              }
                              className="bg-transparent border-none outline-none w-full text-center tabular-nums p-0"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-muted-foreground/60 w-12 italic uppercase">
                          Rotation
                        </span>
                        <div className="flex-1 grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/50">
                            <span className="text-[10px] font-black text-primary opacity-50 ml-1">
                              Z
                            </span>
                            <input
                              value={rotation.x}
                              onChange={(e) =>
                                setRotation({
                                  ...rotation,
                                  x: parseFloat(e.target.value),
                                })
                              }
                              className="bg-transparent border-none outline-none w-full text-center tabular-nums p-0"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-muted-foreground/60 w-12 italic uppercase">
                          3D
                        </span>
                        <div className="flex-1 h-7 bg-muted/30 p-0.5 rounded-lg border border-border/50 flex">
                          <button className="flex-1 rounded-md bg-white shadow-sm text-primary font-bold text-[9px] uppercase tracking-widest">
                            Yes
                          </button>
                          <button className="flex-1 rounded-md text-muted-foreground font-bold text-[9px] uppercase tracking-widest hover:bg-white/50">
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  </PropertySection>

                  {/* Constraints Section */}
                  <PropertySection title="Constraints">
                    <div className="flex items-center justify-between gap-4">
                      <div className="size-16 rounded-xl border-2 border-border/50 relative bg-muted/10 grid place-items-center">
                        <div className="size-8 border border-primary/30 rounded-sm relative">
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-primary" />
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-primary" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between p-1.5 px-3 bg-muted/30 rounded-lg border border-border/50 text-[10px] font-bold">
                          <span className="text-muted-foreground italic">
                            Left
                          </span>
                          <ChevronDown className="size-3 opacity-50" />
                        </div>
                        <div className="flex items-center justify-between p-1.5 px-3 bg-muted/30 rounded-lg border border-border/50 text-[10px] font-bold">
                          <span className="text-muted-foreground italic">
                            Top
                          </span>
                          <ChevronDown className="size-3 opacity-50" />
                        </div>
                      </div>
                    </div>
                  </PropertySection>

                  {/* Material Section */}
                  <PropertySection
                    title="Material"
                    action={
                      <IconButton icon={Plus} className="size-6 p-1 min-h-0" />
                    }
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <div className="size-10 rounded-xl ring-2 ring-primary bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg" />
                        <div className="size-10 rounded-xl border border-border/50 bg-[#1e1e1e] hover:border-primary/50 transition-colors" />
                        <div className="size-10 rounded-xl border border-border/50 bg-[#00ffcc] hover:border-primary/50 transition-colors" />
                        <div className="size-10 rounded-xl border border-border/50 bg-[#f7b733] hover:border-primary/50 transition-colors" />
                      </div>
                      <div className="space-y-3">
                        <NumericStepper
                          label="Roughness"
                          value={roughness}
                          onValueChange={setRoughness}
                          unit=""
                          precision={2}
                        />
                        <NumericStepper
                          label="Metalness"
                          value={metalness}
                          onValueChange={setMetalness}
                          unit=""
                          precision={2}
                        />
                        <NumericStepper
                          label="Reflectivity"
                          value={0.5}
                          onValueChange={() => {}}
                          unit=""
                          precision={2}
                        />
                        <NumericStepper
                          label="Glass"
                          value={1}
                          onValueChange={() => {}}
                          unit=""
                          precision={0}
                        />
                      </div>
                    </div>
                  </PropertySection>

                  {/* Effects Section */}
                  <PropertySection
                    title="Effects"
                    action={
                      <IconButton icon={Plus} className="size-6 p-1 min-h-0" />
                    }
                  >
                    <div className="flex items-center justify-between p-2.5 px-3 bg-muted/30 rounded-xl border border-border/50 text-[10px] font-bold group">
                      <div className="flex items-center gap-2">
                        <Circle className="size-3 text-primary" />
                        <span className="text-foreground">3D Shape</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="size-3 text-muted-foreground" />
                        <Settings className="size-3 text-muted-foreground" />
                        <Minus className="size-3 text-muted-foreground" />
                      </div>
                    </div>
                  </PropertySection>

                  <div className="p-4 pt-2">
                    <Button
                      className="w-full h-11 rounded-xl shadow-lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <div className="flex items-center gap-2">
                          <RotateCcw className="size-4" /> REWIND
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Play className="size-4" /> RESUME
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-3 bg-muted/10 border-t border-border flex items-center gap-2">
                <Button className="flex-1 bg-primary hover:bg-primary/90 rounded-xl text-[10px] font-black uppercase tracking-widest h-9 border border-primary/50 shadow-lg shadow-primary/20">
                  Export
                </Button>
                <Button
                  variant="outline"
                  className="size-9 rounded-xl border-border/50"
                >
                  <Share2 className="size-4" />
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ThreeDProjectCreatePage;
