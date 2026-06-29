import { motion, AnimatePresence } from "framer-motion";
import { Download, Zap, FileText, BrainCircuit, ShieldCheck, CheckCircle, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      setCurrentStep(0);
      
      const startTime = Date.now();
      const duration = 2000;
      
      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(currentProgress);
        
        if (elapsed < duration) {
          requestAnimationFrame(animateProgress);
        }
      };
      
      requestAnimationFrame(animateProgress);

      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev < 6 ? prev + 1 : prev));
      }, 333);

      return () => clearInterval(stepInterval);
    }
  }, [isVisible]);

  const steps = [
    { label: "Receiving Telemetry", icon: Download },
    { label: "Running Rule Engine", icon: Zap },
    { label: "Generating AI Prompt", icon: FileText },
    { label: "Analyzing with Phi-3", icon: BrainCircuit },
    { label: "Generating Recommendations", icon: ShieldCheck },
    { label: "Mission Report Ready", icon: CheckCircle },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-panel p-8 rounded-xl flex flex-col w-full max-w-md border-primary/20 relative overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col mb-4">
              <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">Mission Processing</h2>
              <p className="text-xs text-muted-foreground/60">AI Mission Control is analyzing telemetry...</p>
            </div>
            
            <div className="w-full h-px bg-border/50 mb-4" />
            
            <div className="flex flex-col gap-2 mb-6 flex-1">
              {steps.map((step, index) => {
                const isWaiting = currentStep < index;
                const isActive = currentStep === index;
                const isDone = currentStep > index;

                const Icon = step.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isActive || isDone ? 1 : 0.4, x: 0 }}
                    className={`flex items-center justify-between p-2 rounded transition-colors duration-300 ${
                      isActive ? 'bg-cyan-500/5 border-l-2 border-cyan-500/50' : 
                      isDone ? 'bg-green-500/5 border-l-2 border-green-500/30' : 
                      'bg-transparent border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isWaiting && <Clock className="h-4 w-4 text-muted-foreground/30" />}
                      {isActive && <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />}
                      {isDone && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                      <span className="font-mono text-sm text-foreground/90">{step.label}</span>
                    </div>
                    <div>
                      {isActive && (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-[9px] font-mono text-cyan-400">PROCESSING...</span>
                        </div>
                      )}
                      {isDone && (
                        <span className="text-[9px] font-mono text-green-400">COMPLETE</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Overall Progress</span>
                <span className="text-xs font-mono text-primary/80">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-secondary/30 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500/50 to-cyan-400 rounded-full transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
