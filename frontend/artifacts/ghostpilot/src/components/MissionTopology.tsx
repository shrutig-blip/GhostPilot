import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Satellite, RadioReceiver, Network, Laptop, BrainCircuit, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MissionTopologyProps {
  status: string;
}

const mockNodeData: Record<string, { ip: string, freq: string, ping: string, rate: string }> = {
  "Orbital Asset": { ip: "GS-7 Transponder", freq: "S-Band 2.25GHz", ping: "12ms", rate: "4830 pkt/s" },
  "Ground Station": { ip: "192.168.1.10", freq: "UHF 437MHz", ping: "8ms", rate: "2100 pkt/s" },
  "Core Router": { ip: "10.0.0.1", freq: "N/A", ping: "1ms", rate: "9200 pkt/s" },
  "Mission Control": { ip: "10.0.1.50", freq: "N/A", ping: "2ms", rate: "1800 pkt/s" },
  "GhostPilot AI": { ip: "10.0.2.100", freq: "N/A", ping: "<1ms", rate: "N/A — Inference Engine" }
};

export function MissionTopology({ status }: MissionTopologyProps) {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const getNodeHealth = (nodeName: string) => {
    if (status === "Healthy") return "green";
    if (status === "Warning") {
      if (nodeName === "Ground Station" || nodeName === "Core Router") return "amber";
      return "green";
    }
    // Critical
    if (nodeName === "Ground Station" || nodeName === "Core Router") return "red";
    if (nodeName === "Mission Control") return "amber";
    return "green";
  };

  const getColorClasses = (health: string) => {
    if (health === "green") return "border-green-500/50 text-green-400 bg-green-500/10 shadow-[0_0_12px_rgba(34,197,94,0.25)]";
    if (health === "amber") return "border-amber-500/50 text-amber-500 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.25)]";
    return "border-red-500/50 text-red-500 bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.25)]";
  };
  
  const getBadgeClasses = (health: string) => {
    if (health === "green") return "bg-green-500/20 text-green-400";
    if (health === "amber") return "bg-amber-500/20 text-amber-500";
    return "bg-red-500/20 text-red-500";
  };

  const getStatusLabel = (health: string) => {
    if (health === "green") return "NOMINAL";
    if (health === "amber") return "DEGRADED";
    return "OFFLINE";
  };

  const getDotColor = (health: string) => {
    if (health === "green") return "bg-green-400";
    if (health === "amber") return "bg-amber-500";
    return "bg-red-500";
  };

  const getStrokeColor = (health: string) => {
    if (health === "green") return "#4ade80";
    if (health === "amber") return "#f59e0b";
    return "#ef4444";
  };

  useEffect(() => {
    const closePopup = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.node-container')) {
        setExpandedNode(null);
      }
    };
    document.addEventListener('click', closePopup);
    return () => document.removeEventListener('click', closePopup);
  }, []);

  const Node = ({ icon, label, isFirst = false, isLast = false, delay = 0 }: { icon: React.ReactNode, label: string, isFirst?: boolean, isLast?: boolean, delay?: number }) => {
    const health = getNodeHealth(label);
    const isExpanded = expandedNode === label;

    return (
      <div className="flex flex-col items-center relative node-container">
        {!isFirst && (
          <div className="h-10 w-full flex justify-center relative">
            <svg width="40" height="40" className="absolute top-0 overflow-visible">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                </filter>
              </defs>
              <line x1="20" y1="0" x2="20" y2="40" stroke={getStrokeColor(health)} strokeWidth="6" opacity="0.08" filter="url(#glow)" />
              <line x1="20" y1="0" x2="20" y2="40" stroke={getStrokeColor(health)} strokeWidth="3" opacity="0.2" />
              <line x1="20" y1="0" x2="20" y2="40" stroke={getStrokeColor(health)} strokeWidth="1.5" strokeDasharray="6 3" opacity="0.7" />
            </svg>
            <motion.div
              className="absolute top-0 flex items-center justify-center"
              animate={{ y: [0, 40] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: delay }}
            >
              <div className="w-[6px] h-[6px] rounded-full absolute opacity-30" style={{ backgroundColor: getStrokeColor(health) }} />
              <div className="w-[3px] h-[3px] rounded-full absolute" style={{ backgroundColor: getStrokeColor(health) }} />
            </motion.div>
          </div>
        )}
        <div 
          onClick={() => setExpandedNode(isExpanded ? null : label)}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setExpandedNode(isExpanded ? null : label)}
          className={cn(
            "flex items-center justify-between p-3 border rounded-md transition-all duration-300 min-w-[260px] cursor-pointer z-10 bg-background/80 backdrop-blur-md hover:shadow-[inset_0_0_15px_rgba(255,255,255,0.05)] hover:bg-white/[0.02] focus-visible:ring-1 focus-visible:ring-primary/50",
            getColorClasses(health)
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-1.5 rounded", getBadgeClasses(health))}>
              {icon}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground">{label}</span>
              <span className={cn("font-mono text-[9px] uppercase tracking-wider", health === 'green' ? 'text-green-400/80' : health === 'amber' ? 'text-amber-500/80' : 'text-red-500/80')}>
                {getStatusLabel(health)}
              </span>
            </div>
          </div>
          <div className="relative flex items-center justify-center w-4 h-4">
            <div className={cn("absolute w-4 h-4 rounded-full opacity-30 animate-pulse", getDotColor(health))} />
            <div className={cn("absolute w-2.5 h-2.5 rounded-full animate-pulse", getDotColor(health))} />
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute top-full mt-2 z-50 min-w-[200px] glass-panel p-4 rounded-lg border shadow-xl",
                health === 'green' ? 'border-green-500/30' : health === 'amber' ? 'border-amber-500/30' : 'border-red-500/30'
              )}
            >
              <div className={cn("absolute -top-2 left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent", health === 'green' ? 'border-b-green-500/30' : health === 'amber' ? 'border-b-amber-500/30' : 'border-b-red-500/30')} />
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-xs font-bold uppercase text-foreground">{label} details</span>
                <button 
                  aria-label="Close" 
                  className="h-4 w-4 flex items-center justify-center text-muted-foreground hover:text-white transition-colors" 
                  onClick={(e) => { e.stopPropagation(); setExpandedNode(null); }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2 font-mono text-[10px] text-muted-foreground">
                <div className="flex justify-between"><span className="opacity-70">STATUS:</span> <span className={cn("font-bold", health === 'green' ? 'text-green-400' : health === 'amber' ? 'text-amber-500' : 'text-red-500')}>{getStatusLabel(health)}</span></div>
                <div className="flex justify-between"><span className="opacity-70">IP/ROUTE:</span> <span className="text-foreground">{mockNodeData[label].ip}</span></div>
                <div className="flex justify-between"><span className="opacity-70">FREQ/BAND:</span> <span className="text-foreground">{mockNodeData[label].freq}</span></div>
                <div className="flex justify-between"><span className="opacity-70">LAST PING:</span> <span className="text-foreground">{mockNodeData[label].ping}</span></div>
                <div className="flex justify-between"><span className="opacity-70">PKT RATE:</span> <span className="text-foreground">{mockNodeData[label].rate}</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="glass-panel rounded-lg p-5 h-full flex flex-col items-center justify-center relative bg-black/20 overflow-visible">
      <div className="flex justify-between items-center w-full absolute top-4 left-0 px-5 z-20">
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground flex items-center gap-2">
          <Network className="h-3.5 w-3.5" />
          Network Topology
        </h2>
        <span className={cn("text-[9px] font-mono font-bold px-2 py-0.5 rounded", status === "Healthy" ? "bg-green-500/20 text-green-400" : status === "Warning" ? "bg-amber-500/20 text-amber-500" : "bg-red-500/20 text-red-500")}>
          SIGNAL: {status === "Healthy" ? "OPTIMAL" : status === "Warning" ? "DEGRADED" : "CRITICAL"}
        </span>
      </div>
      
      <div className="flex flex-col items-center w-full mt-8 py-4">
        <Node icon={<Satellite className="h-4 w-4" />} label="Orbital Asset" isFirst delay={0} />
        <Node icon={<RadioReceiver className="h-4 w-4" />} label="Ground Station" delay={0.4} />
        <Node icon={<Network className="h-4 w-4" />} label="Core Router" delay={0.8} />
        <Node icon={<Laptop className="h-4 w-4" />} label="Mission Control" delay={1.2} />
        <Node icon={<BrainCircuit className="h-4 w-4" />} label="GhostPilot AI" isLast delay={1.6} />
      </div>
    </div>
  );
}
