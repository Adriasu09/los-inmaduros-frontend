import { ROUTE_LEVELS } from "@/constants";
import type { RouteLevel } from "@/types";

interface RouteLevelBadgeProps {
  level: RouteLevel;
}

export default function RouteLevelBadge({ level }: RouteLevelBadgeProps) {
  const { label, color } = ROUTE_LEVELS[level];

  return <span className={`text-xs font-semibold ${color}`}>{label}</span>;
}
