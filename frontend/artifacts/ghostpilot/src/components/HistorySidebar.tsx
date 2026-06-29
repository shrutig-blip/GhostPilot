import { AnalysisResult } from "@/data/mockData";
import { formatTimestamp } from "@/utils/formatters";
import { Clock, ChevronRight, Search, ArrowDownUp, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HistorySidebarProps {
  history: AnalysisResult[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function HistorySidebar({ history, activeId, onSelect }: HistorySidebarProps) {
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);

  const filteredHistory = history
    .filter(item => item.network_status.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortNewest) return new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime();
      return new Date(a.generated_at).getTime() - new Date(b.generated_at).getTime();
    });

  const getStatusColorCls = (status: string) => {
    switch (status) {
      case "Healthy": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "Warning": return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case "Critical": return "bg-red-500/20 text-red-500 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="glass-panel rounded-lg flex flex-col overflow-hidden w-full">
      <div className="p-4 border-b border-border/40 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          Analysis History
        </h2>
        <div className="flex gap-2">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Filter ID/Status..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-black/40 border-border/50 font-mono text-foreground focus-visible:ring-primary/50"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            aria-label={sortNewest ? "Sort Oldest First" : "Sort Newest First"}
            className="h-8 w-8 bg-black/40 border-border/50 text-muted-foreground hover:text-foreground hover:scale-[1.02] active:scale-[0.98] transition-transform" 
            onClick={() => setSortNewest(!sortNewest)}
            title={sortNewest ? "Sort Oldest First" : "Sort Newest First"}
          >
            <ArrowDownUp className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar p-4">
        <div className="flex gap-4 pb-2 min-w-max">
          <AnimatePresence initial={false}>
            {filteredHistory.map((item) => {
              const isActive = activeId === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  layoutId={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onSelect(item.id)}
                  tabIndex={0}
                  className={cn(
                    "flex flex-col w-64 text-left p-4 rounded transition-all duration-200 border shrink-0 focus-visible:ring-1 focus-visible:ring-primary/50 hover:shadow-lg",
                    isActive 
                      ? "bg-primary/10 border-primary/50 shadow-[inset_0_2px_10px_rgba(6,182,212,0.15)]" 
                      : "bg-background/50 border-border/40 hover:bg-secondary/30 hover:border-border/60"
                  )}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono text-foreground font-bold">{item.id}</span>
                    <span className={cn("text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border", getStatusColorCls(item.network_status))}>
                      {item.network_status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-auto pt-3 border-t border-border/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-muted-foreground">Generated</span>
                      <span className="text-xs font-mono text-foreground/80">{formatTimestamp(item.generated_at).split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-muted-foreground">Risk</span>
                      <span className="text-xs font-mono font-bold text-foreground">{item.predicted_risk}%</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
          {filteredHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground/60 w-full min-w-[300px] border border-dashed border-border/30 rounded">
              <FileSearch className="h-8 w-8 mb-2" />
              <span className="text-sm font-mono">No analyses match your filter.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
