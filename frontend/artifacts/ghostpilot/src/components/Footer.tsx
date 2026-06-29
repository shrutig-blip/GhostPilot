import { Shield, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-6 mt-auto bg-background/90 transition-colors duration-300 border-t border-cyan-500/10 shadow-[0_-1px_0_rgba(6,182,212,0.1)] relative z-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-primary font-display font-medium">
          <Shield className="h-4 w-4" />
          <span>GhostPilot Network Security Dashboard</span>
        </div>
        <div className="font-mono text-muted-foreground uppercase tracking-widest text-center">
          Offline AI | Phi-3 via Ollama | No Internet Required | Powered by Local AI
        </div>
        <div className="font-mono text-muted-foreground flex gap-4 items-center">
          <span className="border border-border/30 rounded px-2 py-0.5">v1.0.0-beta.4</span>
          <span className="hidden md:inline text-border/40">|</span>
          <div className="hidden md:flex items-center gap-1.5 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full px-2 py-0.5 font-bold">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px]">SYSTEM SECURE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
