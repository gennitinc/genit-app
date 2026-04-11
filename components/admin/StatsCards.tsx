"use client";

import { Users, CreditCard, Layers, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  stats: {
    users: { total: number; newToday: number };
    revenue: { total: number; orders: number };
    content: { total: number };
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Users",
      value: stats.users.total.toLocaleString(),
      change: `+${stats.users.newToday} today`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue.total.toLocaleString()}`,
      change: `${stats.revenue.orders} orders`,
      icon: CreditCard,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Content Created",
      value: stats.content.total.toLocaleString(),
      change: "All generations",
      icon: Layers,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all group overflow-hidden relative"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${card.bgColor} ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Active
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {card.title}
            </h3>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {card.change}
            </p>
          </div>
          
          {/* Decorative Gradient Overlay */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        </motion.div>
      ))}
    </div>
  );
};
