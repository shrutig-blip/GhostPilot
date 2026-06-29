import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

interface RiskGaugeProps {
  value: number;
  className?: string;
}

export function RiskGauge({ value, className }: RiskGaugeProps) {
  const getColor = (risk: number) => {
    if (risk <= 30) return "#22c55e"; // Green
    if (risk <= 70) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  const getStatusLabel = (risk: number) => {
    if (risk <= 30) return "NOMINAL";
    if (risk <= 70) return "ELEVATED";
    return "CRITICAL";
  };

  const radius = 80;
  const circumference = radius * Math.PI; // Half circle
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = getColor(value);

  return (
    <div className={cn("glass-panel p-5 rounded-lg flex flex-col items-center justify-center relative min-h-[250px]", className)}>
      <h3 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground absolute top-5 left-5 flex items-center gap-2">
        <ShieldAlert className="h-3.5 w-3.5" />
        System Risk
      </h3>
      
      <div className="relative mt-8 w-[200px] h-[100px] flex items-end justify-center overflow-visible">
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          {/* Faint full circle outline for track */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            strokeLinecap="round"
            className="opacity-10"
          />
          {/* Background track */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="16"
            strokeLinecap="round"
            className="opacity-20"
          />
          {/* Foreground colored arc */}
          <motion.path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            initial={{ strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset, stroke: color }}
            transition={{ duration: 1, ease: "easeOut", stroke: { duration: 0.5 } }}
            style={{ pathLength: 1 }}
          />
        </svg>
        
        <div className="absolute bottom-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-display font-bold text-foreground tracking-tighter mb-[-8px]">
            {value}%
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center gap-2">
        <span className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">SYSTEM RISK</span>
        <div 
          className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border"
          style={{ 
            color: color, 
            borderColor: `${color}40`, 
            backgroundColor: `${color}10` 
          }}
        >
          {getStatusLabel(value)}
        </div>
      </div>
    </div>
  );
}
