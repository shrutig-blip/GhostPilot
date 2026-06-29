import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { healthPieData } from "@/data/mockData";
import { Activity } from "lucide-react";

export function HealthChart() {
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 text-[10px] font-mono uppercase tracking-widest mt-2">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.color }} />
            {entry.value} ({healthPieData.find(d => d.name === entry.value)?.value}%)
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="glass-panel p-5 rounded-lg h-full flex flex-col relative border-t-[3px] border-t-cyan-500/50 min-h-[250px]">
      <div className="mb-4">
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground flex items-center gap-2">
          <Activity className="h-3.5 w-3.5" />
          Health Distribution
        </h2>
      </div>
      <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center flex-col -mt-4 pointer-events-none">
          <span className="text-3xl font-bold font-mono text-cyan-400">45%</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Healthy</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={healthPieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
            >
              {healthPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(5,8,22,0.95)', 
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend content={renderCustomLegend} verticalAlign="bottom" height={40} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
