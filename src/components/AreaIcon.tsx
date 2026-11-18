"use client";

import {
  BarChart3,
  Coins,
  Globe2,
  Landmark,
  Lightbulb,
  Ruler,
  Target,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  target: Target,
  globe: Globe2,
  "trending-up": TrendingUp,
  landmark: Landmark,
  wallet: Wallet,
  ruler: Ruler,
  lightbulb: Lightbulb,
  coins: Coins,
  chart: BarChart3,
};

export function AreaIcon({
  name,
  className = "h-5 w-5",
}: {
  name?: string;
  className?: string;
}) {
  const Icon = (name && map[name]) || Target;
  return <Icon className={className} aria-hidden />;
}
