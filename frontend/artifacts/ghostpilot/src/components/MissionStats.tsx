import { Activity, Database, Radio, Satellite, Cpu, Wifi, AlertTriangle } from "lucide-react";

interface MissionStatsProps {
  telemetryProcessed: number;
  alertsCount: number;
  avgLatency?: number;
  avgCpu?: number;
  avgLoss?: number;
}

export function MissionStats({ telemetryProcessed, alertsCount, avgLatency = 45, avgCpu = 60, avgLoss = 2 }: MissionStatsProps) {
  const StatTile = ({ icon, label, value, className = "" }: any) => (
    <div className={`p-4 glass-panel rounded flex flex-col justify-between h-full gap-3 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-white/[0.02] hover:border-white/[0.1] ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="text-muted-foreground/60 flex items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5">
          {icon}
        </div>
        <span className="text-[10px] uppercase tracking-[0.15em] font-mono">{label}</span>
      </div>
      <div className="text-2xl font-mono font-bold text-foreground">{value}</div>
    </div>
  );

  return (
    <div className="glass-panel rounded-lg p-5 w-full">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-3.5 w-3.5 text-muted-foreground/60" />
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground">Mission Statistics</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
        <StatTile icon={<Database />} label="Telemetry Processed" value={telemetryProcessed.toLocaleString()} />
        <StatTile icon={<Radio />} label="Packets/sec" value="4,830" />
        <StatTile icon={<Satellite />} label="Satellites Online" value="4 / 6" className="border-t border-t-green-500/50" />
        <StatTile icon={<Radio />} label="Ground Stations" value="3 Active" className="border-t border-t-amber-500/50" />
        <StatTile icon={<Activity />} label="Avg Latency" value={`${avgLatency}ms`} />
        <StatTile icon={<Cpu />} label="Avg CPU Load" value={`${avgCpu}%`} />
        <StatTile icon={<Wifi />} label="Avg Pkt Loss" value={`${avgLoss}%`} />
        <StatTile icon={<AlertTriangle />} label="Recent Alerts" value={alertsCount} className={alertsCount > 0 ? "border-t border-t-amber-500/50 text-amber-500" : ""} />
      </div>
    </div>
  );
}
