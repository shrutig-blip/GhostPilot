import { AnalysisResult } from "@/data/mockData";
import { AlertCircle, BrainCircuit, Activity, Zap, FileText, ShieldCheck, Copy, ChevronDown, Check, Square } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnalysisPanelProps {
  data: AnalysisResult | null;
}

export function AnalysisPanel({ data }: AnalysisPanelProps) {
  if (!data) {
    return (
      <div className="glass-panel rounded-lg p-8 h-full flex flex-col items-center justify-center text-center bg-background/40">
        <BrainCircuit className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-mono text-foreground mb-2">No Analysis Selected</h3>
        <p className="text-sm text-muted-foreground max-w-md font-mono">
          Select a history item or run a new telemetry scan to view AI-generated insights.
        </p>
      </div>
    );
  }

  const parseConfidence = (summary: string) => {
    const match = summary.match(/confidence:?\s*(\d+)%/i);
    return match ? parseInt(match[1]) : (100 - data.predicted_risk);
  };
  const confidence = parseConfidence(data.summary);

  return (
    <div className="glass-panel rounded-lg p-6 h-full flex flex-col">
      <div className="flex flex-col gap-4 mb-5 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h2 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground">AI Analysis Report</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-secondary/50 border border-border/50 text-[10px] font-mono uppercase text-muted-foreground">
            <span>Model:</span>
            <span className="text-foreground font-bold">{data.model || "Phi-3 Local"}</span>
          </div>
        </div>
        
        <div className="w-full">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="text-cyan-400 font-bold">{confidence}%</span>
          </div>
          <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]">
            <div 
              className="h-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-1000"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow text-sm font-mono">
        <MissionCard 
          icon={<FileText className="h-4 w-4 text-cyan-500" />}
          title="SUMMARY"
          badge="OPERATIONAL SUMMARY"
          content={data.summary}
          accentColor="cyan"
          hexColor="#06b6d4"
          bgTint="rgba(6,182,212,0.03)"
          defaultOpen={true}
        />
        
        <MissionCard 
          icon={<AlertCircle className="h-4 w-4 text-blue-500" />}
          title="REASON"
          badge="ANOMALY REASON"
          content={data.reason}
          accentColor="blue"
          hexColor="#3b82f6"
          bgTint="rgba(59,130,246,0.03)"
          defaultOpen={true}
        />
        
        <MissionCard 
          icon={<Zap className="h-4 w-4 text-amber-500" />}
          title="ROOT CAUSE"
          badge="ROOT CAUSE ANALYSIS"
          content={data.possible_root_cause}
          accentColor="amber"
          hexColor="#f59e0b"
          bgTint="rgba(245,158,11,0.03)"
          defaultOpen={true}
        />
        
        <MissionCard 
          icon={<Activity className="h-4 w-4 text-red-500" />}
          title="IMPACT"
          badge="POTENTIAL IMPACT"
          content={data.potential_impact}
          accentColor="red"
          hexColor="#ef4444"
          bgTint="rgba(239,68,68,0.03)"
          defaultOpen={true}
        />
        
        <MissionCard 
          icon={<ShieldCheck className="h-4 w-4 text-green-500" />}
          title="RECOMMENDATIONS"
          badge="RECOVERY PLAN"
          content={data.recommended_actions}
          accentColor="green"
          hexColor="#22c55e"
          bgTint="rgba(34,197,94,0.03)"
          defaultOpen={true}
          isRecommendations={true}
        />
      </div>
    </div>
  );
}

const highlightWords = (text: string) => {
  const redWords = ['critical', 'failure', 'loss', 'disconnect', 'emergency', 'urgent', 'imminent', 'severe'];
  const amberWords = ['warning', 'elevated', 'anomaly', 'degraded', 'spike', 'threshold', 'inconsistency'];
  const greenWords = ['nominal', 'stable', 'healthy', 'optimal', 'passed'];
  
  const words = text.split(/(\b[\w-]+\b)/);
  
  return words.map((word, i) => {
    const lowerWord = word.toLowerCase();
    if (redWords.includes(lowerWord)) return <span key={i} className="text-red-400 font-bold">{word}</span>;
    if (amberWords.includes(lowerWord)) return <span key={i} className="text-amber-500 font-bold">{word}</span>;
    if (greenWords.includes(lowerWord)) return <span key={i} className="text-green-400 font-bold">{word}</span>;
    return word;
  });
};

function MissionCard({ 
  icon, 
  title, 
  badge, 
  content, 
  accentColor, 
  hexColor, 
  bgTint, 
  defaultOpen = true,
  isRecommendations = false
}: { 
  icon: React.ReactNode, 
  title: string, 
  badge: string, 
  content: string, 
  accentColor: string, 
  hexColor: string, 
  bgTint: string, 
  defaultOpen?: boolean,
  isRecommendations?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = isRecommendations ? content.split('\n').map((a: string) => a.replace(/^\d+\.\s*/, '').trim()).filter(Boolean) : [];

  return (
    <div 
      className={cn("rounded border border-border/30 overflow-hidden flex flex-col glass-panel")}
      style={{ backgroundColor: bgTint, borderTop: `3px solid ${hexColor}` }}
    >
      <button 
        className={cn(
          "w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-left",
          isOpen ? "border-b" : ""
        )}
        style={{ borderBottomColor: isOpen ? `${hexColor}33` : 'transparent' }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon}
          <div className="flex items-center gap-2">
            <h3 className="font-mono uppercase tracking-[0.15em] font-bold text-foreground text-xs">{title}</h3>
            <span 
              className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-bold bg-white/10"
              style={{ color: hexColor }}
            >
              {badge}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div 
            role="button"
            tabIndex={0}
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied && <span className="text-[10px] text-green-500 font-mono">Copied!</span>}
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 relative group text-xs text-muted-foreground font-mono leading-relaxed">
              {!isRecommendations ? (
                <div className="whitespace-pre-wrap">
                  {highlightWords(content)}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {actions.map((action: string, idx: number) => {
                    let priority = "LOW";
                    let pColor = "bg-blue-500/20 text-blue-400 border border-blue-500/30";
                    let iconColor = "text-blue-400";
                    
                    if (idx === 0) { 
                      priority = "HIGH"; 
                      pColor = "bg-red-500/20 text-red-400 border border-red-500/30"; 
                      iconColor = "text-red-400";
                    } else if (idx === 1) { 
                      priority = "MED"; 
                      pColor = "bg-amber-500/20 text-amber-500 border border-amber-500/30"; 
                      iconColor = "text-amber-500";
                    }

                    return (
                      <div key={idx} className="flex gap-3 items-start p-2.5 rounded bg-black/20 border border-border/20">
                        <span className={cn("text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-bold shrink-0 mt-0.5", pColor)}>
                          {priority}
                        </span>
                        <Square className={cn("h-4 w-4 shrink-0 mt-0.5 opacity-80", iconColor)} />
                        <span className="text-foreground/90">{highlightWords(action)}</span>
                      </div>
                    );
                  })}
                  <div className="mt-3 pt-3 border-t border-border/20 flex flex-col gap-1 text-[10px] uppercase text-muted-foreground/70">
                    <div className="flex gap-2"><span className="text-cyan-500/70">ESTIMATED RECOVERY:</span> 8 min</div>
                    <div className="flex gap-2"><span className="text-cyan-500/70">AFFECTED:</span> Ground Station, Core Router</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}