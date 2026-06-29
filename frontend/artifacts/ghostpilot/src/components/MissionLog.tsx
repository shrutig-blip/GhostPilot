import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface LogEntry {
  id: number;
  timestamp: string;
  level: "INFO" | "WARNING" | "CRITICAL";
  message: string;
}

export function MissionLog({ externalLogs = [] }: { externalLogs?: LogEntry[] }) {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, timestamp: new Date(Date.now() - 20000).toISOString(), level: "INFO", message: "System initialized" },
    { id: 2, timestamp: new Date(Date.now() - 15000).toISOString(), level: "INFO", message: "Connected to ground station relays" },
    { id: 3, timestamp: new Date(Date.now() - 10000).toISOString(), level: "INFO", message: "Telemetry stream established" },
    { id: 4, timestamp: new Date(Date.now() - 5000).toISOString(), level: "WARNING", message: "Slight jitter detected on secondary link" },
    { id: 5, timestamp: new Date().toISOString(), level: "INFO", message: "Awaiting new telemetry" }
  ]);

  useEffect(() => {
    if (externalLogs.length > 0) {
      setLogs(prev => {
        const newLogs = [...externalLogs, ...prev];
        return newLogs.slice(0, 50);
      });
    }
  }, [externalLogs]);

  useEffect(() => {
    const timer = setInterval(() => {
      const messages = ["Background diagnostic complete", "Syncing routing tables", "Cache cleared", "Heartbeat ACK received"];
      const newEntry: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        level: "INFO",
        message: messages[Math.floor(Math.random() * messages.length)]
      };
      setLogs(prev => [newEntry, ...prev].slice(0, 50));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const getLevelColor = (level: string) => {
    if (level === "INFO") return "text-cyan-400";
    if (level === "WARNING") return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="glass-panel rounded-lg flex flex-col h-full border border-border/30 font-mono text-xs overflow-hidden">
      <div className="bg-secondary/40 p-4 border-b border-border/30 flex justify-between items-center">
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5" />
          Mission Log
        </h2>
        <span className="text-[10px] text-green-500 animate-pulse font-bold flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> LIVE
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-start group hover:bg-white/[0.02] p-1 rounded transition-colors"
              >
                <span className="text-muted-foreground shrink-0 mt-[1px]">[{log.timestamp.split('T')[1].substring(0, 8)}]</span>
                <span className={`shrink-0 w-16 mt-[1px] ${getLevelColor(log.level)}`}>[{log.level}]</span>
                <span className="text-foreground/80 break-words flex-1 leading-relaxed">{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50">
              <Terminal className="h-8 w-8 mb-2" />
              <span className="text-sm">No mission log entries yet.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
