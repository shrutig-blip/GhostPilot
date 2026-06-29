import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { riskTrendData, cpuTrendData, latencyTrendData, packetLossTrendData } from "@/data/mockData";
import { TrendingUp } from "lucide-react";

export function MultiTrendChart() {
  const MiniChart = ({ title, data, dataKey, color, domain = [0, 'auto'] }: any) => (
    <div className="flex flex-col h-[140px] bg-background/30 border border-border/40 p-3 rounded transition-all duration-200 hover:border-white/10 hover:bg-white/[0.02]">
      <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">{title}</h4>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 2, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis domain={domain} hide />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fill={`url(#color-${dataKey})`} 
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="glass-panel p-5 rounded-lg flex flex-col h-full border-t-[3px] border-t-cyan-500/50 min-h-[250px]">
      <div className="mb-4">
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5" />
          Trend Analysis
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 flex-grow">
        <MiniChart title="Risk Score Trend" data={riskTrendData} dataKey="risk" color="hsl(var(--destructive))" domain={[0, 100]} />
        <MiniChart title="CPU Trend (%)" data={cpuTrendData} dataKey="value" color="hsl(var(--primary))" domain={[0, 100]} />
        <MiniChart title="Latency Trend (ms)" data={latencyTrendData} dataKey="value" color="hsl(var(--accent))" domain={[0, 200]} />
        <MiniChart title="Packet Loss (%)" data={packetLossTrendData} dataKey="value" color="hsl(142, 71%, 40%)" domain={[0, 20]} />
      </div>
    </div>
  );
}
