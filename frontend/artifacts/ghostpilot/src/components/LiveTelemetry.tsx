import { AnalysisResult } from "@/data/mockData";
import { Activity, Wifi, Cpu, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveTelemetryProps {
  data: AnalysisResult | null;
}

export function LiveTelemetry({ data }: LiveTelemetryProps) {
  const telemetry = data?.telemetry || { latency: 45, packet_loss: 2, cpu: 60 };
  const risk = data?.predicted_risk || 0;

  const MetricCard = ({ label, value, unit, normalRange, icon, isAlert }: any) => (
    <div className={cn(
      "p-4 rounded border flex flex-col justify-between relative overflow-hidden",
      isAlert ? "bg-red-500/10 border-red-500/30" : "bg-background/40 border-border/50"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {icon}
          {label}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-2xl font-mono font-bold tracking-tight",
          isAlert ? "text-red-400" : "text-cyan-400"
        )}>{value}</span>
        <span className="text-sm font-mono text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-2 flex justify-between items-center text-[10px] font-mono">
        <span className="text-muted-foreground">Normal: {normalRange}</span>
        <span className={cn(
          "px-1.5 py-0.5 rounded",
          isAlert ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
        )}>
          {isAlert ? "ELEVATED" : "NOMINAL"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="glass-panel rounded-lg p-5 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground mb-1">Live Telemetry</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-grow">
        <MetricCard 
          label="Latency" 
          value={telemetry.latency} 
          unit="ms" 
          normalRange="< 50ms" 
          icon={<Activity className="h-3 w-3" />}
          isAlert={telemetry.latency > 100}
        />
        <MetricCard 
          label="Packet Loss" 
          value={telemetry.packet_loss} 
          unit="%" 
          normalRange="< 2%" 
          icon={<Wifi className="h-3 w-3" />}
          isAlert={telemetry.packet_loss > 5}
        />
        <MetricCard 
          label="CPU Usage" 
          value={telemetry.cpu} 
          unit="%" 
          normalRange="< 80%" 
          icon={<Cpu className="h-3 w-3" />}
          isAlert={telemetry.cpu > 80}
        />
        <MetricCard 
          label="Risk Score" 
          value={risk} 
          unit="%" 
          normalRange="< 40%" 
          icon={<AlertTriangle className="h-3 w-3" />}
          isAlert={risk > 70}
        />
      </div>
    </div>
  );
}
