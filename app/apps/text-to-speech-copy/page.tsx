"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Play,
  Pause,
  Square,
  ChevronDown,
  Volume2,
  Trash2,
  Languages,
  Music,
  Share2,
  Download,
  Settings2,
  History,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import withAuth from "@/helper/hoc/withAuth";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Toaster } from "@/components/ui/sonner";

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
    content: "Hey everyone! It's Jamie here. Today, I wanted to chat about how AI has unexpectedly changed my daily routine. It's not just about flashy high-tech gadgets; there's some kind of AI running things behind the scenes. Just last week, I realized my car was using AI to give me real-time traffic updates and adjust the route to avoid jams. It's so subtle that we hardly even notice it anymore.",
  },
  {
    id: "s2",
    label: "Section 2",
    speaker: "Jamie",
    gender: "Male",
    language: "English (British)",
    mood: "Casual",
    content: "Yeah, it's crazy how integrated AI has become, and it's happening so fast. I mean, a couple of years ago, AI was something you'd only hear about in tech talks or see in movies. Now, I can't imagine my day without it. My phone suggests apps I'm likely to open based on the time of day, and even my refrigerator keeps track of what I'm running low on and reminds me to buy groceries. It's like AI is literally managing parts of my life",
  },
  {
    id: "s3",
    label: "Section 3",
    speaker: "Chris",
    gender: "Male",
    language: "English (USA)",
    mood: "Thoughtful",
    content: "It's true, but do you ever wonder where it's all headed? I mean, we're relying on AI for everything: maps, music recommendations, online shopping, even setting reminders for things like taking medication. We've got AI controlling smart home devices, telling us when to wake up, what to eat, and how to exercise. But, isn't there a limit to how much AI we should let into our lives? It's starting to feel like we're handing over control",
    isSelected: true,
  },
  {
    id: "s4",
    label: "Section 4",
    speaker: "Chris",
    gender: "Male",
    language: "English (USA)",
    mood: "Thoughtful",
    content: "True, but with the right regulations and ethical standards, I think we can strike a balance. We just have to stay ahead of the curve. AI can definitely help us in ways we haven't even imagined yet—whether it's improving healthcare, making transportation safer, or even helping with climate change solutions. We just need to be responsible about how we use it, and make sure it's for the greater good.",
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
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#0B0C10] font-sans text-[#1F2937] dark:text-[#E5E7EB] transition-colors duration-200">
      <Toaster />
      <LandingNavbar />

      <main className="flex flex-1 overflow-hidden px-10">
        {/* --- Left Sidebar: Project List --- */}
        <aside className="w-[300px] flex flex-col border-r border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111318] p-4 gap-4 overflow-y-auto scrollbar-hide">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search all projects"
              className="pl-10 bg-[#F3F4F6] dark:bg-[#1F2937] border-none text-sm h-10 placeholder:text-[#9CA3AF]"
            />
          </div>

          <Button
            variant="outline"
            className="w-full justify-between h-10 text-sm font-medium border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111318] hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937]"
          >
            Create New Project
            <Plus className="w-4 h-4" />
          </Button>

          <div className="flex flex-col gap-2 mt-4">
            {MOCK_PROJECTS.map((project) => (
              <div
                key={project.id}
                className={cn(
                  "p-3 rounded-xl cursor-pointer transition-all border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#1F2937]",
                  project.isActive && "bg-[#F3F4F6] dark:bg-[#1C1F26] border-[#E5E7EB] dark:border-[#2D3139]"
                )}
              >
                <h3 className="text-[13px] font-semibold truncate mb-1">
                  {project.title}
                </h3>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] line-clamp-2 leading-relaxed mb-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#9CA3AF]">
                  <span>{project.sections} Sections</span>
                  <span>{project.size}</span>
                  <span>{project.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Card */}
          <div className="mt-auto pt-6">
            <div className="bg-[#FFFFFF] dark:bg-[#1C1F26] border border-[#E5E7EB] dark:border-[#2D3139] p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold flex items-center gap-1 text-[#1F2937] dark:text-white">
                  Running on Fumes! ⚡
                </h4>
                <div className="flex items-center gap-1 bg-[#9D4EDD]/10 px-1.5 py-0.5 rounded text-[#9D4EDD] text-[10px] font-medium border border-[#9D4EDD]/20">
                   <Zap className="w-3 h-3 fill-current" />
                   Starter Plan
                </div>
              </div>
              <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mb-4">
                Just <span className="font-bold text-[#1F2937] dark:text-white">3000 points</span> left from your <span className="font-bold">5000 limit</span>. Boost with Pro to keep things rolling!
              </p>
              
              <div className="flex gap-1 h-3 mb-4">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-full",
                      i < 12 ? "bg-gradient-to-t from-[#F97316] to-[#FBBF24]" : "bg-[#F3F4F6] dark:bg-[#2D3139]"
                    )}
                  />
                ))}
              </div>
              
              <Button className="w-full h-10 rounded-lg text-sm bg-white dark:bg-[#111318] text-[#1F2937] dark:text-white border border-[#E5E7EB] dark:border-[#2D3139] hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] shadow-none">
                See Pricing Plans
              </Button>
            </div>
          </div>
        </aside>

        {/* --- Main Content: TTS Sessions --- */}
        <section className="flex-1 flex flex-col items-center bg-[#FDFDFD] dark:bg-[#0B0C10] overflow-y-auto p-8 scrollbar-hide">
          <div className="w-full max-w-[800px] flex flex-col gap-8">
            {sections.map((section) => (
              <div key={section.id} className="flex flex-col gap-3 group">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wider">
                    {section.label}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#F3F4F6] dark:bg-[#1C1F26] px-3 py-1.5 rounded-full">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0EA5E9] to-[#38BDF8]" />
                      <span className="text-[11px] font-semibold">{section.speaker} <span className="font-normal opacity-70 border-none">({section.gender})</span></span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F3F4F6] dark:bg-[#1C1F26] px-3 py-1.5 rounded-full">
                       <Languages className="w-3.5 h-3.5 text-[#6B7280]" />
                       <span className="text-[11px] font-semibold">{section.language}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F3F4F6] dark:bg-[#1C1F26] px-3 py-1.5 rounded-full">
                       <span className="text-[11px] font-semibold">🧐 {section.mood}</span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    "relative bg-white dark:bg-[#111318] rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none border-2 transition-all cursor-text",
                    activeSectionId === section.id 
                      ? "border-[#9D4EDD] ring-4 ring-[#9D4EDD]/5" 
                      : "border-transparent hover:border-[#E5E7EB] dark:hover:border-[#1F2937]"
                  )}
                >
                  <textarea
                    className="w-full min-h-[140px] bg-transparent border-none focus:ring-0 text-[15px] font-medium leading-relaxed resize-none overflow-hidden placeholder:text-[#9CA3AF] text-[#1F2937] dark:text-white"
                    value={section.content}
                    onChange={(e) => {
                       const newContent = e.target.value;
                       setSections(sections.map(s => s.id === section.id ? {...s, content: newContent} : s));
                    }}
                    placeholder="Type or paste your text here..."
                  />
                  
                  {activeSectionId === section.id && (
                     <div className="absolute -bottom-10 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white dark:bg-[#111318] shadow-sm border border-[#E5E7EB] dark:border-[#1F2937]">
                           <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                     </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-4 pb-12">
              <Button
                onClick={addSection}
                variant="outline"
                className="h-11 px-6 rounded-full border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111318] hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] font-semibold flex gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add New Section
              </Button>
            </div>
          </div>
        </section>

        {/* --- Right Sidebar: Audio Controls --- */}
        <aside className="w-[340px] flex flex-col border-l border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111318] p-6 gap-8 overflow-y-auto scrollbar-hide font-sans">
          {/* Waveform Visualization Mock */}
          <div className="flex flex-col gap-4">
            <div className="h-16 flex items-center justify-center gap-1 px-4 mb-2">
              {[...Array(40)].map((_, i) => {
                const height = 10 + Math.abs(Math.sin(i * 0.3) * 40) + Math.random() * 10;
                return (
                  <div
                    key={i}
                    className="w-[3px] bg-[#9D4EDD] rounded-full opacity-40"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            
            <div className="flex items-center justify-between gap-3 font-sans">
              <Button variant="outline" className="flex-1 h-10 rounded-lg flex gap-2 text-xs font-semibold bg-white dark:bg-[#111318] border-[#E5E7EB] dark:border-[#1F2937]">
                <Play className="w-4 h-4 fill-current text-[#1F2937] dark:text-white" /> Play
              </Button>
              <Button variant="outline" className="flex-1 h-10 rounded-lg flex gap-2 text-xs font-semibold text-[#6B7280] bg-white dark:bg-[#111318] border-[#E5E7EB] dark:border-[#1F2937]">
                <Pause className="w-4 h-4" /> Pause
              </Button>
              <Button variant="outline" className="flex-1 h-10 rounded-lg flex gap-2 text-xs font-semibold text-[#6B7280] bg-white dark:bg-[#111318] border-[#E5E7EB] dark:border-[#1F2937]">
                <Square className="w-4 h-4 fill-current" /> Stop
              </Button>
            </div>
          </div>

          <div className="border-t border-[#F3F4F6] dark:border-[#1F2937] pt-6 flex flex-col gap-6 font-sans">
            <div className="space-y-4">
              <label className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Voice Settings</label>
              
              <div className="grid grid-cols-2 gap-3">
                 <Select defaultValue="chris">
                    <SelectTrigger className="h-11 rounded-xl bg-[#F9FAFB] dark:bg-[#1C1F26] border-none text-[13px] font-medium px-4 text-[#1F2937] dark:text-white">
                       <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400" />
                          <SelectValue placeholder="Voice" />
                       </div>
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="chris">Chris (Male)</SelectItem>
                       <SelectItem value="jamie">Jamie (Male)</SelectItem>
                    </SelectContent>
                 </Select>

                 <Select defaultValue="thoughtful">
                    <SelectTrigger className="h-11 rounded-xl bg-[#F9FAFB] dark:bg-[#1C1F26] border-none text-[13px] font-medium px-4 text-center text-[#1F2937] dark:text-white">
                       <div className="flex items-center gap-2">
                          <span className="text-base">🧐</span>
                          <SelectValue placeholder="Style" />
                       </div>
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="thoughtful">Thoughtful</SelectItem>
                       <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-[12px] font-medium">
                  <span>Voice Pitch</span>
                  <span className="bg-[#F3F4F6] dark:bg-[#1C1F26] px-1.5 py-0.5 rounded text-[#6B7280]">75%</span>
                </div>
                <Slider defaultValue={[75]} max={100} step={1} className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white dark:[&_[role=slider]]:border-[#111318] [&_[role=slider]]:bg-[#9D4EDD] [&_[role=slider]]:shadow-sm" />
                
                <div className="flex justify-between items-center text-[12px] font-medium pt-2">
                  <span>Voice Speed</span>
                  <Select defaultValue="0.75">
                    <SelectTrigger className="w-20 h-8 rounded-lg bg-[#F9FAFB] dark:bg-[#1C1F26] border-none text-[12px] font-bold px-2 py-0 text-[#1F2937] dark:text-white">
                      <SelectValue placeholder="1.0X" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.75">0.75X</SelectItem>
                      <SelectItem value="1.0">1.0X</SelectItem>
                      <SelectItem value="1.5">1.5X</SelectItem>
                    </SelectContent>
                 </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Language and Translations</label>
              <div className="grid grid-cols-2 gap-3">
                 <Select defaultValue="en">
                    <SelectTrigger className="h-11 rounded-xl bg-[#F9FAFB] dark:bg-[#1C1F26] border-none text-[13px] font-medium text-[#1F2937] dark:text-white">
                       <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="en">English</SelectItem>
                       <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                 </Select>
                 <Select defaultValue="us">
                    <SelectTrigger className="h-11 rounded-xl bg-[#F9FAFB] dark:bg-[#1C1F26] border-none text-[13px] font-medium text-[#1F2937] dark:text-white">
                       <SelectValue placeholder="Accent" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="us">American</SelectItem>
                       <SelectItem value="uk">British</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                 <Checkbox id="translate" className="rounded-md border-[#E5E7EB] dark:border-[#2D3139]" />
                 <label htmlFor="translate" className="text-[12px] text-[#6B7280] font-medium cursor-pointer">Translate section</label>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">
                <span>Audio Volume</span>
                <span className="normal-case font-medium text-[11px] opacity-70">47%</span>
              </div>
              <div className="flex gap-0.5 items-end h-3">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-sm transition-all",
                      i < 15 ? "bg-gradient-to-t from-green-400 to-yellow-300 h-full shadow-[0_0_8px_rgba(74,222,128,0.3)]" : "bg-[#F3F4F6] dark:bg-[#1C1F26] h-1/2"
                    )}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                 <Select defaultValue="none">
                    <SelectTrigger className="h-11 rounded-xl bg-[#F9FAFB] dark:bg-[#1C1F26] border-none text-[13px] font-medium text-[#1F2937] dark:text-white">
                       <SelectValue placeholder="Music Backdrop" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="none">Music Backdrop</SelectItem>
                       <SelectItem value="lofi">Lofi Chill</SelectItem>
                    </SelectContent>
                 </Select>
                 <Select defaultValue="mp3">
                    <SelectTrigger className="h-11 rounded-xl bg-[#F9FAFB] dark:bg-[#1C1F26] border-none text-[13px] font-medium text-[#1F2937] dark:text-white">
                       <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="mp3">Audio Format</SelectItem>
                       <SelectItem value="wav">WAV</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            </div>

            <div className="space-y-4 pt-6 mt-2">
               <label className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Export Audio</label>
               <div className="grid grid-cols-2 gap-3">
                 <Select defaultValue="medium">
                    <SelectTrigger className="h-11 rounded-xl bg-[#F9FAFB] dark:bg-[#1C1F26] border-none text-[13px] font-medium text-[#1F2937] dark:text-white">
                       <SelectValue placeholder="Quality" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="medium">Medium (360Kps)</SelectItem>
                       <SelectItem value="high">High (480Kps)</SelectItem>
                    </SelectContent>
                 </Select>
                 <Select defaultValue="mp3">
                    <SelectTrigger className="h-11 rounded-xl bg-[#F9FAFB] dark:bg-[#1C1F26] border-none text-[13px] font-medium text-[#1F2937] dark:text-white">
                       <SelectValue placeholder="MP3" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="mp3">MP3</SelectItem>
                       <SelectItem value="wav">WAV</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <Button className="w-full h-12 rounded-xl bg-white dark:bg-[#1C1F26] text-[#1F2937] dark:text-white border border-[#E5E7EB] dark:border-[#2D3139] hover:bg-[#F9FAFB] dark:hover:bg-[#32363F] shadow-sm font-semibold flex gap-2">
                 Export The Future of AI in Everyday Life
              </Button>
              <div className="flex items-center justify-center">
                 <Button variant="link" className="text-[12px] text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white flex gap-1.5 no-underline transition-colors">
                    <Play className="w-3 h-3 fill-current" /> Preview Audio
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
