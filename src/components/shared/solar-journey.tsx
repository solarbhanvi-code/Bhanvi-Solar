import { BatteryCharging, Grid2x2, Home, Sun, TrendingDown, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Stop {
  icon: LucideIcon;
  label: string;
  description: string;
}

const STOPS: Stop[] = [
  { icon: Sun, label: "Sun", description: "Sunlight reaches your roof" },
  { icon: Grid2x2, label: "Solar Panels", description: "Panels capture sunlight" },
  { icon: Zap, label: "Energy Generated", description: "Converted to DC electricity" },
  { icon: BatteryCharging, label: "Inverter / Battery", description: "Converted to usable AC power" },
  { icon: Home, label: "Home / Business", description: "Powers your appliances" },
  { icon: TrendingDown, label: "Lower Electricity Cost", description: "Reduced grid dependence" },
];

export function SolarJourney() {
  return (
    <div className="relative">
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-3">
        {STOPS.map((stop, idx) => {
          const Icon = stop.icon;
          return (
            <li key={stop.label} className="relative flex flex-col items-center gap-3 text-center">
              <div className="relative flex size-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-solar-300 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                <Icon className="size-7" />
                {idx < STOPS.length - 1 && (
                  <svg
                    className="absolute left-full top-1/2 hidden h-2 w-6 -translate-y-1/2 text-energy-400 lg:block"
                    viewBox="0 0 24 8"
                    fill="none"
                  >
                    <line
                      x1="0"
                      y1="4"
                      x2="24"
                      y2="4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-flow"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-white">{stop.label}</p>
                <p className="mt-1 text-xs text-white/50">{stop.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
