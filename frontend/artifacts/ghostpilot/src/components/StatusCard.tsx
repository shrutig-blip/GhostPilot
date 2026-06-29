import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";

interface StatusCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  statusColor?: "green" | "yellow" | "red" | "cyan" | "amber";
  className?: string;
  isPercentage?: boolean;
}

export function StatusCard({ label, value, icon, statusColor, className, isPercentage }: StatusCardProps) {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = typeof displayValue === 'number' ? displayValue : 0;
      const duration = 600;
      const fps = 60;
      const frames = duration / (1000 / fps);
      const increment = (value - start) / frames;
      
      let currentFrame = 0;
      const timer = setInterval(() => {
        currentFrame++;
        start += increment;
        setDisplayValue(Math.round(start));
        if (currentFrame >= frames) {
          clearInterval(timer);
          setDisplayValue(value);
        }
      }, 1000 / fps);
      
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  let borderClass = "border-t-transparent border-t-2 border-border/50";
  let textClass = "text-foreground";
  
  if (statusColor === "green") {
    borderClass = "border-t-green-500 shadow-[inset_0_2px_0_0_rgba(34,197,94,1)]";
    textClass = "text-green-500";
  } else if (statusColor === "yellow") {
    borderClass = "border-t-yellow-500 shadow-[inset_0_2px_0_0_rgba(234,179,8,1)]";
    textClass = "text-yellow-500";
  } else if (statusColor === "red") {
    borderClass = "border-t-red-500 shadow-[inset_0_2px_0_0_rgba(239,68,68,1)]";
    textClass = "text-red-500";
  } else if (statusColor === "cyan") {
    borderClass = "border-t-cyan-400 shadow-[inset_0_2px_0_0_rgba(34,211,238,1)]";
    textClass = "text-cyan-400";
  } else if (statusColor === "amber") {
    borderClass = "border-t-amber-500 shadow-[inset_0_2px_0_0_rgba(245,158,11,1)]";
    textClass = "text-amber-500";
  }

  return (
    <div 
      tabIndex={0}
      className={cn(
        "glass-panel p-4 rounded-sm flex flex-col justify-between relative overflow-hidden group min-h-[100px] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/[0.02] focus-visible:ring-1 focus-visible:ring-primary/50", 
        borderClass,
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground truncate mr-2">{label}</h3>
        {icon && <div className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0">{icon}</div>}
      </div>
      
      <div className={cn("text-2xl font-bold font-mono text-foreground truncate", textClass)}>
        {displayValue}{isPercentage && typeof displayValue === 'number' ? "%" : ""}
      </div>
    </div>
  );
}
