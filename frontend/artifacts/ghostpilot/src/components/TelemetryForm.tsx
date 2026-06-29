import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Send, Activity, Wifi, Cpu, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  latency: z.coerce.number().min(0, "Must be >= 0").max(2000, "Must be <= 2000"),
  packetLoss: z.coerce.number().min(0, "Must be >= 0").max(100, "Must be <= 100"),
  cpuUsage: z.coerce.number().min(0, "Must be >= 0").max(100, "Must be <= 100"),
});

interface TelemetryFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

export function TelemetryForm({ onSubmit, isLoading }: TelemetryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latency: 45,
      packetLoss: 2,
      cpuUsage: 60,
    },
    mode: "onChange"
  });

  const latency = form.watch("latency");
  const packetLoss = form.watch("packetLoss");
  const cpuUsage = form.watch("cpuUsage");

  const getLatencyStatus = (val: number) => {
    if (isNaN(val)) return { status: "UNKNOWN", color: "border-muted/50", text: "text-muted-foreground", bg: "bg-muted/10" };
    if (val > 100) return { status: "CRITICAL", color: "border-red-500", text: "text-red-500", bg: "bg-red-500/10" };
    if (val >= 50) return { status: "ELEVATED", color: "border-amber-500", text: "text-amber-500", bg: "bg-amber-500/10" };
    return { status: "NOMINAL", color: "border-green-500", text: "text-green-500", bg: "bg-green-500/10" };
  };

  const getLossStatus = (val: number) => {
    if (isNaN(val)) return { status: "UNKNOWN", color: "border-muted/50", text: "text-muted-foreground", bg: "bg-muted/10" };
    if (val > 10) return { status: "CRITICAL", color: "border-red-500", text: "text-red-500", bg: "bg-red-500/10" };
    if (val >= 2) return { status: "ELEVATED", color: "border-amber-500", text: "text-amber-500", bg: "bg-amber-500/10" };
    return { status: "NOMINAL", color: "border-green-500", text: "text-green-500", bg: "bg-green-500/10" };
  };

  const getCpuStatus = (val: number) => {
    if (isNaN(val)) return { status: "UNKNOWN", color: "border-muted/50", text: "text-muted-foreground", bg: "bg-muted/10" };
    if (val > 90) return { status: "CRITICAL", color: "border-red-500", text: "text-red-500", bg: "bg-red-500/10" };
    if (val >= 70) return { status: "ELEVATED", color: "border-amber-500", text: "text-amber-500", bg: "bg-amber-500/10" };
    return { status: "NOMINAL", color: "border-green-500", text: "text-green-500", bg: "bg-green-500/10" };
  };

  const latStat = getLatencyStatus(latency);
  const lossStat = getLossStatus(packetLoss);
  const cpuStat = getCpuStatus(cpuUsage);

  const isValid = form.formState.isValid;

  return (
    <div className="glass-panel rounded-lg p-6 h-full flex flex-col">
      <div className="mb-5">
        <h2 className="text-[10px] uppercase tracking-[0.15em] font-mono text-muted-foreground">Telemetry Modules</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow flex flex-col">
          
          <div className="flex flex-col gap-4">
            {/* Latency Card */}
            <div className={cn("glass-panel border-l-4 rounded p-4 flex flex-col gap-3 transition-colors duration-300", latStat.color)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground font-mono uppercase tracking-widest text-[10px]">
                  <Activity className="h-3 w-3" />
                  <span>Network Latency</span>
                  <span className="bg-secondary/50 px-1 rounded">ms</span>
                </div>
                <span className={cn("text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold", latStat.bg, latStat.text)}>
                  {latStat.status}
                </span>
              </div>
              <FormField
                control={form.control}
                name="latency"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input 
                        type="number" 
                        disabled={isLoading} 
                        className="bg-transparent border-b border-border/50 rounded-none px-0 font-mono text-2xl h-10 focus-visible:ring-0 focus-visible:border-cyan-500" 
                        {...field} 
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <span className="text-[9px] font-mono text-muted-foreground/60">Normal Range: &lt; 50ms</span>
                      {fieldState.error && <span className="text-[9px] font-mono text-red-500">{fieldState.error.message}</span>}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Packet Loss Card */}
            <div className={cn("glass-panel border-l-4 rounded p-4 flex flex-col gap-3 transition-colors duration-300", lossStat.color)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground font-mono uppercase tracking-widest text-[10px]">
                  <Wifi className="h-3 w-3" />
                  <span>Packet Loss</span>
                  <span className="bg-secondary/50 px-1 rounded">%</span>
                </div>
                <span className={cn("text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold", lossStat.bg, lossStat.text)}>
                  {lossStat.status}
                </span>
              </div>
              <FormField
                control={form.control}
                name="packetLoss"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        disabled={isLoading} 
                        className="bg-transparent border-b border-border/50 rounded-none px-0 font-mono text-2xl h-10 focus-visible:ring-0 focus-visible:border-cyan-500" 
                        {...field} 
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <span className="text-[9px] font-mono text-muted-foreground/60">Normal Range: &lt; 2%</span>
                      {fieldState.error && <span className="text-[9px] font-mono text-red-500">{fieldState.error.message}</span>}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* CPU Load Card */}
            <div className={cn("glass-panel border-l-4 rounded p-4 flex flex-col gap-3 transition-colors duration-300", cpuStat.color)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground font-mono uppercase tracking-widest text-[10px]">
                  <Cpu className="h-3 w-3" />
                  <span>CPU Usage</span>
                  <span className="bg-secondary/50 px-1 rounded">%</span>
                </div>
                <span className={cn("text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold", cpuStat.bg, cpuStat.text)}>
                  {cpuStat.status}
                </span>
              </div>
              <FormField
                control={form.control}
                name="cpuUsage"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input 
                        type="number" 
                        disabled={isLoading} 
                        className="bg-transparent border-b border-border/50 rounded-none px-0 font-mono text-2xl h-10 focus-visible:ring-0 focus-visible:border-cyan-500" 
                        {...field} 
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <span className="text-[9px] font-mono text-muted-foreground/60">Normal Range: &lt; 70%</span>
                      {fieldState.error && <span className="text-[9px] font-mono text-red-500">{fieldState.error.message}</span>}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="mt-auto pt-6">
            <Button 
              type="submit" 
              className={cn(
                "w-full font-mono uppercase tracking-widest font-bold transition-all h-12 text-sm",
                isValid 
                  ? "bg-primary/20 border border-primary/50 hover:bg-primary/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]" 
                  : "bg-muted/10 border-muted/30 text-muted-foreground opacity-50 cursor-not-allowed"
              )}
              disabled={isLoading || !isValid}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Processing..." : "Run Analysis"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}