"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Layers,
  Users,
} from "lucide-react";

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
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className='bg-card border-border/50 hover:border-primary/20 group relative overflow-hidden rounded-lg border p-6 transition-all'
        >
          <div className='mb-4 flex items-start justify-between'>
            <div className={`rounded-xl p-3 ${card.bgColor} ${card.color}`}>
              <card.icon className='h-6 w-6' />
            </div>
            <div className='flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500'>
              <ArrowUpRight className='mr-1 h-3 w-3' />
              Active
            </div>
          </div>
          <div>
            <h3 className='text-muted-foreground mb-1 text-sm font-medium'>
              {card.title}
            </h3>
            <p className='text-foreground text-3xl font-bold tracking-tight'>
              {card.value}
            </p>
            <p className='text-muted-foreground mt-2 text-xs font-medium'>
              {card.change}
            </p>
          </div>

          {/* Decorative Gradient Overlay */}
          <div className='from-primary/5 absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br to-transparent blur-2xl transition-transform duration-500 group-hover:scale-150' />
        </motion.div>
      ))}
    </div>
  );
};
