import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Sparkles,
  TrendingUp,
  Zap,
  Image,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomeGrid() {
  return (
    <motion.div
      className="mt-8 mb-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <BentoGrid className="max-w-4xl mx-auto">
        {agents.map((agent, i) => (
          <BentoGridItem
            key={i}
            title={agent.title}
            description={agent.description}
            header={agent.header}
            icon={agent.icon}
            className={cn(
              "h-[300px] w-full",
              i === 6 ? "md:col-span-2" : "",
              agent.disabled && "opacity-60 cursor-not-allowed"
            )}
          />
        ))}
      </BentoGrid>
    </motion.div>
  );
}

const AgentHeader = ({
  image,
  disabled = false,
}: {
  image: string;
  disabled?: boolean;
}) => (
  <div
    className={cn(
      "flex flex-1 w-full h-[200px] rounded-xl bg-cover bg-center",
      disabled && "opacity-60"
    )}
    style={{ backgroundImage: `url(${image})` }}
  ></div>
);

const agents = [
  {
    title: "Social Media Manager",
    description:
      "Manage your social presence and engagement across all platforms with AI-powered content creation and scheduling.",
    header: (
      <AgentHeader image="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop&crop=center" />
    ),
    icon: <MessageSquare className="h-4 w-4 text-neutral-500" />,
    badge: "Pro",
  },
  {
    title: "Customer Support",
    description:
      "Handle customer inquiries and support tickets efficiently with intelligent response generation and ticket management.",
    header: (
      <AgentHeader image="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop&crop=center" />
    ),
    icon: <Users className="h-4 w-4 text-neutral-500" />,
    badge: "Pro",
  },
  {
    title: "Content Writer",
    description:
      "Create compelling content for your brand and marketing needs with AI-assisted writing and content optimization.",
    header: (
      <AgentHeader image="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop&crop=center" />
    ),
    icon: <Sparkles className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Ads Manager",
    description:
      "Optimize and manage your advertising campaigns for better ROI with data-driven insights and automated optimization.",
    header: (
      <AgentHeader image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center" />
    ),
    icon: <TrendingUp className="h-4 w-4 text-neutral-500" />,
    badge: "Pro",
  },
  {
    title: "Growth Specialist",
    description:
      "Drive user acquisition and retention with data-driven strategies and automated growth hacking techniques.",
    header: (
      <AgentHeader image="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop&crop=center" />
    ),
    icon: <Zap className="h-4 w-4 text-neutral-500" />,
    badge: "Pro",
  },
  {
    title: "AI Graphic Designer",
    description:
      "Create stunning visuals and graphics for your brand with AI-powered design tools and automated asset generation.",
    header: (
      <AgentHeader
        image="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop&crop=center"
        disabled
      />
    ),
    icon: <Image className="h-4 w-4 text-neutral-500" />,
    badge: "Coming Soon",
    disabled: true,
  },
];
