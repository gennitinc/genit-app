"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import withAuth from "@/helper/hoc/withAuth";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Download,
  History,
  Languages,
  Music,
  Pause,
  Play,
  Plus,
  Search,
  Settings2,
  Share2,
  Square,
  Trash2,
  Volume2,
  Zap,
} from "lucide-react";
import { useState } from "react";

// --- Types ---
interface TTSSection {
  id: string;
  label: string;
  speaker: string;
  gender: string;
  language: string;
  mood: string;
  content: string;
  isSelected?: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  sections: number;
  size: string;
  duration: string;
  isActive?: boolean;
}

// --- Mock Data ---
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "The Importance of Mental Health Awar...",
    description: "Explore the impact of mental health education...",
    sections: 4,
    size: "967KB",
    duration: "2hrs 10mins",
  },
  {
    id: "2",
    title: "The Future of AI in Everyday Life",
    description: "How artificial intelligence is changing daily routi...",
    sections: 6,
    size: "1.1MB",
    duration: "1hr 45mins",
    isActive: true,
  },
  {
    id: "3",
    title: "How to Grow Your Own Herb Garden",
    description: "A step-by-step guide to growing herbs in small...",
    sections: 5,
    size: "865KB",
    duration: "1hr 20mins",
  },
  {
    id: "4",
    title: "My Journey to Learning a New Instrum...",
    description: "Documenting the process of learning to play a...",
    sections: 4,
    size: "967KB",
    duration: "2hr 5mins",
  },
  {
    id: "5",
    title: "How to Stay Productive While Workin...",
    description: "Tips and strategies for maintaining productiv...",
    sections: 5,
    size: "1067KB",
    duration: "1hr 50mins",
  },
  {
    id: "6",
    title: "The Power of Positive Thinking",
    description: "The benefits of adopting a positive mindset...",
    sections: 7,
    size: "890KB",
    duration: "1hr 3ms",
  },
];

const MOCK_SECTIONS: TTSSection[] = [
  {
    id: "s1",
    label: "Section 1",
    speaker: "Jamie",
    gender: "Male",
    language: "English (British)",
    mood: "Casual",
    content:
      "Hey everyone! It's Jamie here. Today, I wanted to chat about how AI has unexpectedly changed my daily routine. It's not just about flashy high-tech gadgets; there's some kind of AI running things behind the scenes. Just last week, I realized my car was using AI to give me real-time traffic updates and adjust the route to avoid jams. It's so subtle that we hardly even notice it anymore.",
  },
  {
    id: "s2",
    label: "Section 2",
    speaker: "Jamie",
    gender: "Male",
    language: "English (British)",
    mood: "Casual",
    content:
      "Yeah, it's crazy how integrated AI has become, and it's happening so fast. I mean, a couple of years ago, AI was something you'd only hear about in tech talks or see in movies. Now, I can't imagine my day without it. My phone suggests apps I'm likely to open based on the time of day, and even my refrigerator keeps track of what I'm running low on and reminds me to buy groceries. It's like AI is literally managing parts of my life",
  },
  {
    id: "s3",
    label: "Section 3",
    speaker: "Chris",
    gender: "Male",
    language: "English (USA)",
    mood: "Thoughtful",
    content:
      "It's true, but do you ever wonder where it's all headed? I mean, we're relying on AI for everything: maps, music recommendations, online shopping, even setting reminders for things like taking medication. We've got AI controlling smart home devices, telling us when to wake up, what to eat, and how to exercise. But, isn't there a limit to how much AI we should let into our lives? It's starting to feel like we're handing over control",
    isSelected: true,
  },
  {
    id: "s4",
    label: "Section 4",
    speaker: "Chris",
    gender: "Male",
    language: "English (USA)",
    mood: "Thoughtful",
    content:
      "True, but with the right regulations and ethical standards, I think we can strike a balance. We just have to stay ahead of the curve. AI can definitely help us in ways we haven't even imagined yet—whether it's improving healthcare, making transportation safer, or even helping with climate change solutions. We just need to be responsible about how we use it, and make sure it's for the greater good.",
  },
];

function TextToSpeechPage() {
  const [sections, setSections] = useState<TTSSection[]>(MOCK_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState<string>("s3");

  const addSection = () => {
    const newSection: TTSSection = {
      id: `s${sections.length + 1}`,
      label: `Section ${sections.length + 1}`,
      speaker: "Jamie",
      gender: "Male",
      language: "English (British)",
      mood: "Casual",
      content: "",
    };
    setSections([...sections, newSection]);
  };

  return (
    <div className='flex min-h-screen flex-col bg-[#F9FAFB] font-sans text-[#1F2937] transition-colors duration-200 dark:bg-[#0B0C10] dark:text-[#E5E7EB]'>
      <Toaster />
      <LandingNavbar />

      <main className='flex flex-1 overflow-hidden px-10'>
        {/* --- Left Sidebar: Project List --- */}
        <aside className='scrollbar-hide flex w-[300px] flex-col gap-4 overflow-y-auto border-r border-[#E5E7EB] bg-white p-4 dark:border-[#1F2937] dark:bg-[#111318]'>
          <div className='relative'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]' />
            <Input
              placeholder='Search all projects'
              className='h-10 border-none bg-[#F3F4F6] pl-10 text-sm placeholder:text-[#9CA3AF] dark:bg-[#1F2937]'
            />
          </div>

          <Button
            variant='outline'
            className='h-10 w-full justify-between border-[#E5E7EB] bg-white text-sm font-medium hover:bg-[#F9FAFB] dark:border-[#1F2937] dark:bg-[#111318] dark:hover:bg-[#1F2937]'
          >
            Create New Project
            <Plus className='h-4 w-4' />
          </Button>

          <div className='mt-4 flex flex-col gap-2'>
            {MOCK_PROJECTS.map((project) => (
              <div
                key={project.id}
                className={cn(
                  "cursor-pointer rounded-xl border border-transparent p-3 transition-all hover:border-[#E5E7EB] dark:hover:border-[#1F2937]",
                  project.isActive &&
                    "border-[#E5E7EB] bg-[#F3F4F6] dark:border-[#2D3139] dark:bg-[#1C1F26]"
                )}
              >
                <h3 className='mb-1 truncate text-[13px] font-semibold'>
                  {project.title}
                </h3>
                <p className='mb-2 line-clamp-2 text-[11px] leading-relaxed text-[#6B7280] dark:text-[#9CA3AF]'>
                  {project.description}
                </p>
                <div className='flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#9CA3AF]'>
                  <span>{project.sections} Sections</span>
                  <span>{project.size}</span>
                  <span>{project.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Card */}
          <div className='mt-auto pt-6'>
            <div className='rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-4 shadow-sm dark:border-[#2D3139] dark:bg-[#1C1F26]'>
              <div className='mb-3 flex items-center justify-between'>
                <h4 className='flex items-center gap-1 text-sm font-bold text-[#1F2937] dark:text-white'>
                  Running on Fumes! ⚡
                </h4>
                <div className='flex items-center gap-1 rounded border border-[#9D4EDD]/20 bg-[#9D4EDD]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#9D4EDD]'>
                  <Zap className='h-3 w-3 fill-current' />
                  Starter Plan
                </div>
              </div>
              <p className='mb-4 text-[11px] text-[#6B7280] dark:text-[#9CA3AF]'>
                Just{" "}
                <span className='font-bold text-[#1F2937] dark:text-white'>
                  3000 points
                </span>{" "}
                left from your <span className='font-bold'>5000 limit</span>.
                Boost with Pro to keep things rolling!
              </p>

              <div className='mb-4 flex h-3 gap-1'>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-full",
                      i < 12
                        ? "bg-gradient-to-t from-[#F97316] to-[#FBBF24]"
                        : "bg-[#F3F4F6] dark:bg-[#2D3139]"
                    )}
                  />
                ))}
              </div>

              <Button className='h-10 w-full rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#1F2937] shadow-none hover:bg-[#F9FAFB] dark:border-[#2D3139] dark:bg-[#111318] dark:text-white dark:hover:bg-[#1F2937]'>
                See Pricing Plans
              </Button>
            </div>
          </div>
        </aside>

        {/* --- Main Content: TTS Sessions --- */}
        <section className='scrollbar-hide flex flex-1 flex-col items-center overflow-y-auto bg-[#FDFDFD] p-8 dark:bg-[#0B0C10]'>
          <div className='flex w-full max-w-[800px] flex-col gap-8'>
            {sections.map((section) => (
              <div key={section.id} className='group flex flex-col gap-3'>
                <div className='flex items-center justify-between px-2'>
                  <span className='text-[12px] font-medium tracking-wider text-[#9CA3AF] uppercase'>
                    {section.label}
                  </span>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-1.5 dark:bg-[#1C1F26]'>
                      <div className='h-5 w-5 rounded-full bg-gradient-to-tr from-[#0EA5E9] to-[#38BDF8]' />
                      <span className='text-[11px] font-semibold'>
                        {section.speaker}{" "}
                        <span className='border-none font-normal opacity-70'>
                          ({section.gender})
                        </span>
                      </span>
                    </div>
                    <div className='flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-1.5 dark:bg-[#1C1F26]'>
                      <Languages className='h-3.5 w-3.5 text-[#6B7280]' />
                      <span className='text-[11px] font-semibold'>
                        {section.language}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-1.5 dark:bg-[#1C1F26]'>
                      <span className='text-[11px] font-semibold'>
                        🧐 {section.mood}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    "relative cursor-text rounded-[24px] border-2 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all dark:bg-[#111318] dark:shadow-none",
                    activeSectionId === section.id
                      ? "border-[#9D4EDD] ring-4 ring-[#9D4EDD]/5"
                      : "border-transparent hover:border-[#E5E7EB] dark:hover:border-[#1F2937]"
                  )}
                >
                  <textarea
                    className='min-h-[140px] w-full resize-none overflow-hidden border-none bg-transparent text-[15px] leading-relaxed font-medium text-[#1F2937] placeholder:text-[#9CA3AF] focus:ring-0 dark:text-white'
                    value={section.content}
                    onChange={(e) => {
                      const newContent = e.target.value;
                      setSections(
                        sections.map((s) =>
                          s.id === section.id
                            ? { ...s, content: newContent }
                            : s
                        )
                      );
                    }}
                    placeholder='Type or paste your text here...'
                  />

                  {activeSectionId === section.id && (
                    <div className='absolute right-0 -bottom-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-8 w-8 rounded-full border border-[#E5E7EB] bg-white shadow-sm dark:border-[#1F2937] dark:bg-[#111318]'
                      >
                        <Trash2 className='h-4 w-4 text-red-500' />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className='flex justify-center pt-4 pb-12'>
              <Button
                onClick={addSection}
                variant='outline'
                className='flex h-11 gap-2 rounded-full border-[#E5E7EB] bg-white px-6 font-semibold shadow-sm transition-all hover:scale-105 hover:bg-[#F9FAFB] active:scale-95 dark:border-[#1F2937] dark:bg-[#111318] dark:hover:bg-[#1F2937]'
              >
                <Plus className='h-4 w-4' />
                Add New Section
              </Button>
            </div>
          </div>
        </section>

        {/* --- Right Sidebar: Audio Controls --- */}
        <aside className='scrollbar-hide flex w-[340px] flex-col gap-8 overflow-y-auto border-l border-[#E5E7EB] bg-white p-6 font-sans dark:border-[#1F2937] dark:bg-[#111318]'>
          {/* Waveform Visualization Mock */}
          <div className='flex flex-col gap-4'>
            <div className='mb-2 flex h-16 items-center justify-center gap-1 px-4'>
              {[...Array(40)].map((_, i) => {
                const height =
                  10 + Math.abs(Math.sin(i * 0.3) * 40) + Math.random() * 10;
                return (
                  <div
                    key={i}
                    className='w-[3px] rounded-full bg-[#9D4EDD] opacity-40'
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>

            <div className='flex items-center justify-between gap-3 font-sans'>
              <Button
                variant='outline'
                className='flex h-10 flex-1 gap-2 rounded-lg border-[#E5E7EB] bg-white text-xs font-semibold dark:border-[#1F2937] dark:bg-[#111318]'
              >
                <Play className='h-4 w-4 fill-current text-[#1F2937] dark:text-white' />{" "}
                Play
              </Button>
              <Button
                variant='outline'
                className='flex h-10 flex-1 gap-2 rounded-lg border-[#E5E7EB] bg-white text-xs font-semibold text-[#6B7280] dark:border-[#1F2937] dark:bg-[#111318]'
              >
                <Pause className='h-4 w-4' /> Pause
              </Button>
              <Button
                variant='outline'
                className='flex h-10 flex-1 gap-2 rounded-lg border-[#E5E7EB] bg-white text-xs font-semibold text-[#6B7280] dark:border-[#1F2937] dark:bg-[#111318]'
              >
                <Square className='h-4 w-4 fill-current' /> Stop
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-6 border-t border-[#F3F4F6] pt-6 font-sans dark:border-[#1F2937]'>
            <div className='space-y-4'>
              <label className='text-[12px] font-bold tracking-wider text-[#6B7280] uppercase'>
                Voice Settings
              </label>

              <div className='grid grid-cols-2 gap-3'>
                <Select defaultValue='chris'>
                  <SelectTrigger className='h-11 rounded-xl border-none bg-[#F9FAFB] px-4 text-[13px] font-medium text-[#1F2937] dark:bg-[#1C1F26] dark:text-white'>
                    <div className='flex items-center gap-2'>
                      <div className='h-5 w-5 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400' />
                      <SelectValue placeholder='Voice' />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='chris'>Chris (Male)</SelectItem>
                    <SelectItem value='jamie'>Jamie (Male)</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue='thoughtful'>
                  <SelectTrigger className='h-11 rounded-xl border-none bg-[#F9FAFB] px-4 text-center text-[13px] font-medium text-[#1F2937] dark:bg-[#1C1F26] dark:text-white'>
                    <div className='flex items-center gap-2'>
                      <span className='text-base'>🧐</span>
                      <SelectValue placeholder='Style' />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='thoughtful'>Thoughtful</SelectItem>
                    <SelectItem value='casual'>Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-4 pt-2'>
                <div className='flex items-center justify-between text-[12px] font-medium'>
                  <span>Voice Pitch</span>
                  <span className='rounded bg-[#F3F4F6] px-1.5 py-0.5 text-[#6B7280] dark:bg-[#1C1F26]'>
                    75%
                  </span>
                </div>
                <Slider
                  defaultValue={[75]}
                  max={100}
                  step={1}
                  className='[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:bg-[#9D4EDD] [&_[role=slider]]:shadow-sm dark:[&_[role=slider]]:border-[#111318]'
                />

                <div className='flex items-center justify-between pt-2 text-[12px] font-medium'>
                  <span>Voice Speed</span>
                  <Select defaultValue='0.75'>
                    <SelectTrigger className='h-8 w-20 rounded-lg border-none bg-[#F9FAFB] px-2 py-0 text-[12px] font-bold text-[#1F2937] dark:bg-[#1C1F26] dark:text-white'>
                      <SelectValue placeholder='1.0X' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='0.75'>0.75X</SelectItem>
                      <SelectItem value='1.0'>1.0X</SelectItem>
                      <SelectItem value='1.5'>1.5X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className='space-y-4 pt-2'>
              <label className='text-[12px] font-bold tracking-wider text-[#6B7280] uppercase'>
                Language and Translations
              </label>
              <div className='grid grid-cols-2 gap-3'>
                <Select defaultValue='en'>
                  <SelectTrigger className='h-11 rounded-xl border-none bg-[#F9FAFB] text-[13px] font-medium text-[#1F2937] dark:bg-[#1C1F26] dark:text-white'>
                    <SelectValue placeholder='Language' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='en'>English</SelectItem>
                    <SelectItem value='fr'>French</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue='us'>
                  <SelectTrigger className='h-11 rounded-xl border-none bg-[#F9FAFB] text-[13px] font-medium text-[#1F2937] dark:bg-[#1C1F26] dark:text-white'>
                    <SelectValue placeholder='Accent' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='us'>American</SelectItem>
                    <SelectItem value='uk'>British</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex items-center gap-2 pt-2'>
                <Checkbox
                  id='translate'
                  className='rounded-md border-[#E5E7EB] dark:border-[#2D3139]'
                />
                <label
                  htmlFor='translate'
                  className='cursor-pointer text-[12px] font-medium text-[#6B7280]'
                >
                  Translate section
                </label>
              </div>
            </div>

            <div className='space-y-4 pt-2'>
              <div className='flex items-center justify-between text-[12px] font-bold tracking-wider text-[#6B7280] uppercase'>
                <span>Audio Volume</span>
                <span className='text-[11px] font-medium normal-case opacity-70'>
                  47%
                </span>
              </div>
              <div className='flex h-3 items-end gap-0.5'>
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-sm transition-all",
                      i < 15
                        ? "h-full bg-gradient-to-t from-green-400 to-yellow-300 shadow-[0_0_8px_rgba(74,222,128,0.3)]"
                        : "h-1/2 bg-[#F3F4F6] dark:bg-[#1C1F26]"
                    )}
                  />
                ))}
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <Select defaultValue='none'>
                  <SelectTrigger className='h-11 rounded-xl border-none bg-[#F9FAFB] text-[13px] font-medium text-[#1F2937] dark:bg-[#1C1F26] dark:text-white'>
                    <SelectValue placeholder='Music Backdrop' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>Music Backdrop</SelectItem>
                    <SelectItem value='lofi'>Lofi Chill</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue='mp3'>
                  <SelectTrigger className='h-11 rounded-xl border-none bg-[#F9FAFB] text-[13px] font-medium text-[#1F2937] dark:bg-[#1C1F26] dark:text-white'>
                    <SelectValue placeholder='Format' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='mp3'>Audio Format</SelectItem>
                    <SelectItem value='wav'>WAV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='mt-2 space-y-4 pt-6'>
              <label className='text-[12px] font-bold tracking-wider text-[#6B7280] uppercase'>
                Export Audio
              </label>
              <div className='grid grid-cols-2 gap-3'>
                <Select defaultValue='medium'>
                  <SelectTrigger className='h-11 rounded-xl border-none bg-[#F9FAFB] text-[13px] font-medium text-[#1F2937] dark:bg-[#1C1F26] dark:text-white'>
                    <SelectValue placeholder='Quality' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='medium'>Medium (360Kps)</SelectItem>
                    <SelectItem value='high'>High (480Kps)</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue='mp3'>
                  <SelectTrigger className='h-11 rounded-xl border-none bg-[#F9FAFB] text-[13px] font-medium text-[#1F2937] dark:bg-[#1C1F26] dark:text-white'>
                    <SelectValue placeholder='MP3' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='mp3'>MP3</SelectItem>
                    <SelectItem value='wav'>WAV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className='flex h-12 w-full gap-2 rounded-xl border border-[#E5E7EB] bg-white font-semibold text-[#1F2937] shadow-sm hover:bg-[#F9FAFB] dark:border-[#2D3139] dark:bg-[#1C1F26] dark:text-white dark:hover:bg-[#32363F]'>
                Export The Future of AI in Everyday Life
              </Button>
              <div className='flex items-center justify-center'>
                <Button
                  variant='link'
                  className='flex gap-1.5 text-[12px] text-[#9CA3AF] no-underline transition-colors hover:text-[#1F2937] dark:hover:text-white'
                >
                  <Play className='h-3 w-3 fill-current' /> Preview Audio
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <LandingFooter />
    </div>
  );
}

export default withAuth(TextToSpeechPage);
