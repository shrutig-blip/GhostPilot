import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

export interface FeedEvent {
  id: number;
  timestamp: string;
  type: string;
  desc: string;
  isAnomaly: boolean;
  styleClass?: string;
}

export function TelemetryFeed({ externalEvents = [] }: { externalEvents?: FeedEvent[] }) {
  const [events, setEvents] = useState<FeedEvent[]>([
    { id: 1, timestamp: new Date().toISOString(), type: "TELEMETRY_RX", desc: "Initial chunk received", isAnomaly: false, styleClass: "cyan" }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalEvents.length > 0) {
      setEvents(prev => {
        const newEvents = [...prev, ...externalEvents];
        if (newEvents.length > 100) return newEvents.slice(newEvents.length - 100);
        return newEvents;
      });
    }
  }, [externalEvents]);

  useEffect(() => {
    const timer = setInterval(() => {
      const normalPool = [
        `Telemetry packet received — SEQ#${Math.floor(Math.random()*9999)}`,
        'Latency probe completed — 45ms',
        'Rule engine pass — no violations',
        'Health check passed — all nodes nominal',
        'AI model inference complete — 0.3s',
        `Report generated — ANL-${Math.floor(Math.random()*9999)}`,
        'Packet routing verified — path optimal',
        'Bandwidth utilization: 34%'
      ];
      const anomalyPool = [
        '⚡ Latency spike detected — 127ms peak',
        '⚠ Packet anomaly — seq gap detected',
        '⚡ CPU threshold breached — 87%',
        '⚠ Signal degradation on S-band link'
      ];
      const criticalPool = [
        '✖ Node timeout — N-09 unresponsive',
        '✖ Packet loss exceeds 10% threshold'
      ];

      const r = Math.random();
      let selectedDesc = "";
      let type = "";
      let isAnomaly = false;
      let styleClass = "";

      if (r < 0.1) {
        selectedDesc = criticalPool[Math.floor(Math.random() * criticalPool.length)];
        type = "CRIT";
        isAnomaly = true;
        styleClass = "red";
      } else if (r < 0.3) {
        selectedDesc = anomalyPool[Math.floor(Math.random() * anomalyPool.length)];
        type = "WARN";
        isAnomaly = true;
        styleClass = "amber";
      } else {
        selectedDesc = normalPool[Math.floor(Math.random() * normalPool.length)];
        const types = ["RECV", "RULE", "AI"];
        type = types[Math.floor(Math.random() * types.length)];
        isAnomaly = false;
        styleClass = type === "RECV" ? "green" : (type === "RULE" ? "blue" : "cyan");
      }
      
      setEvents(prev => {
        const newEvents = [...prev, {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          type,
          desc: selectedDesc,
          isAnomaly,
          styleClass
        }];
        if (newEvents.length > 100) return newEvents.slice(newEvents.length - 100);
        return newEvents;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  return (
    <div className="glass-panel rounded-lg flex flex-col h-full border border-border/30 font-mono text-xs overflow-hidden bg-black/40">
      <div className="bg-secondary/40 p-3 border-b border-border/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          <span className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground font-bold">LIVE TELEMETRY STREAM</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">EVENTS: {events.length}</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar scroll-smooth">
        {events.map((evt) => {
          let colorClass = "text-cyan-400";
          let tagClass = "text-cyan-400";

          if (evt.styleClass === "red") { colorClass = "text-red-400"; tagClass = "text-red-500"; }
          else if (evt.styleClass === "amber") { colorClass = "text-amber-400"; tagClass = "text-amber-500"; }
          else if (evt.styleClass === "green") { colorClass = "text-cyan-300"; tagClass = "text-green-500"; }
          else if (evt.styleClass === "blue") { colorClass = "text-cyan-300"; tagClass = "text-blue-400"; }
          else if (evt.styleClass === "cyan") { colorClass = "text-cyan-300"; tagClass = "text-cyan-400"; }

          return (
            <div key={evt.id} className="flex gap-3 leading-relaxed">
              <span className="text-muted-foreground/60 shrink-0 select-none">[{evt.timestamp.split('T')[1].substring(0, 8)}]</span>
              <span className={cn("font-bold shrink-0", tagClass)}>[{evt.type}]</span>
              <span className={cn("break-words", colorClass)}>
                {evt.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}