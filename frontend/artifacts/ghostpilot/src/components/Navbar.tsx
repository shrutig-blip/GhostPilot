import { Activity, ShieldCheck, Database, Moon, Sun, Clock, Rocket, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const [time, setTime] = useState(new Date());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `T+${h}:${m}:${s}`;
  };

  return (
    <nav className="border-b border-white/[0.04] sticky top-0 z-40 bg-background/90 transition-colors duration-300">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-foreground leading-none font-display">
                GhostPilot
              </h1>
              <span className="tracking-[0.2em] text-[9px] font-mono text-primary leading-none mt-1">
                ISRO AI NETWORK COPILOT
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-sm border border-border/50 text-xs font-mono uppercase tracking-wider text-muted-foreground ml-4">
            <span>Mission:</span>
            <span className="text-foreground font-bold">CHANDRAYAAN-NG</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-4 bg-background/50 px-4 py-1.5 rounded-full border border-primary/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">UTC</span>
              <span className="font-mono text-cyan-400 tracking-widest">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">MET</span>
              <span className="font-mono text-orange-400 tracking-widest">{formatElapsed(elapsed)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1.5 rounded border border-green-500/30 shadow-[0_0_10px_-2px_rgba(34,197,94,0.3)]">
            <Database className="h-3.5 w-3.5" />
            <span>Backend Connected</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded hover:bg-primary/20 text-primary transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
