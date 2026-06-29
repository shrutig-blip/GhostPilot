import { useAlertCycle } from "@/hooks/useAlertCycle";
import { AlertCircle, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function AlertBanner() {
  const status = useAlertCycle(6000);

  const getStatusConfig = () => {
    switch (status) {
      case "Healthy":
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
          bg: "bg-green-500/10 border-b-green-500/30",
          text: "text-green-500",
          dot: "bg-green-500",
          message: "All network systems operating within nominal parameters. Telemetry streams stable."
        };
      case "Warning":
        return {
          icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
          bg: "bg-amber-500/10 border-b-amber-500/30",
          text: "text-amber-500",
          dot: "bg-amber-500",
          message: "Elevated latency detected in sector 4. Automatic QoS balancing in progress. Monitor link stability."
        };
      case "Critical":
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          bg: "bg-red-500/10 border-b-red-500/30",
          text: "text-red-500",
          dot: "bg-red-500",
          message: "CRITICAL: Packet loss exceeding 10% on primary telemetry link. Failover recommended immediately."
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`w-full border-b transition-colors duration-500 ${config.bg}`}>
      <div className="container mx-auto px-6 h-8 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-3 h-3">
            <div className={`absolute w-3 h-3 rounded-full opacity-30 animate-pulse ${config.dot}`} />
            <div className={`absolute w-1.5 h-1.5 rounded-full animate-pulse ${config.dot}`} />
          </div>
          <span className={`text-xs font-mono font-bold tracking-wider uppercase ${config.text}`}>
            SYSTEM STATUS: {status}
          </span>
        </div>
        
        <div className="flex-1 ml-8 overflow-hidden relative h-full flex items-center text-xs font-mono text-foreground/80">
           <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis font-mono text-xs"
            >
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              {config.message}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
