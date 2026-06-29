import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { riskTrendData } from "@/data/mockData";

export function TrendChart() {
  return (
    <div className="glass-panel p-6 rounded-lg h-[300px] flex flex-col">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Risk Trend Analysis</h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={riskTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                color: 'hsl(var(--foreground))'
              }} 
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <ReferenceLine y={75} stroke="hsl(var(--destructive))" strokeDasharray="3 3" opacity={0.5} />
            <ReferenceLine y={40} stroke="hsl(var(--accent))" strokeDasharray="3 3" opacity={0.5} />
            <Area 
              type="monotone" 
              dataKey="risk" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorRisk)" 
              strokeWidth={3}
              activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
