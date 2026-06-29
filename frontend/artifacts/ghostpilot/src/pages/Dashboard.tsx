import { useState, useEffect, useRef } from "react";
import { AlertBanner } from "@/components/AlertBanner";
import { Navbar } from "@/components/Navbar";
import { StatusCard } from "@/components/StatusCard";
import { TelemetryForm } from "@/components/TelemetryForm";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { HistorySidebar } from "@/components/HistorySidebar";
import { HealthChart } from "@/components/HealthChart";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Footer } from "@/components/Footer";
import { LiveTelemetry } from "@/components/LiveTelemetry";
import { MissionTopology } from "@/components/MissionTopology";
import { TelemetryFeed, FeedEvent } from "@/components/TelemetryFeed";
import { MissionLog, LogEntry } from "@/components/MissionLog";
import { MissionStats } from "@/components/MissionStats";
import { MultiTrendChart } from "@/components/MultiTrendChart";
import { StarField } from "@/components/StarField";
import { historyMockData, mockVariants, AnalysisResult, mockSatellites } from "@/data/mockData";
import { formatTimestamp } from "@/utils/formatters";
import { ShieldAlert, ActivitySquare, Cpu, Server, Clock, Satellite, RadioReceiver, BrainCircuit } from "lucide-react";

export function Dashboard() {
  const [history, setHistory] = useState<AnalysisResult[]>(historyMockData);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(historyMockData[0]?.id || null);
  const [isLoading, setIsLoading] = useState(false);
  const [telemetryProcessed, setTelemetryProcessed] = useState(1247);
  const [extraEvents, setExtraEvents] = useState<FeedEvent[]>([]);
  const [extraLogs, setExtraLogs] = useState<LogEntry[]>([]);
  
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const activeAnalysis = history.find(item => item.id === activeAnalysisId) || null;

  const handleTelemetrySubmit = (values: any) => {
    setIsLoading(true);
    
    // Add logs/events for starting
    setExtraLogs([{ id: Date.now(), timestamp: new Date().toISOString(), level: "INFO", message: "New analysis triggered by operator" }]);
    setExtraEvents([{ id: Date.now(), timestamp: new Date().toISOString(), type: "AI_ANALYSIS", desc: "Manual analysis started", isAnomaly: false }]);
    
    setTimeout(() => {
      const newId = `ANL-${Math.floor(Math.random() * 10000)}`;
      
      let risk = 15;
      let status: "Healthy" | "Warning" | "Critical" = "Healthy";
      
      if (values.latency > 100 || values.packetLoss > 10 || values.cpuUsage > 90) {
        risk = Math.min(95, Math.max(80, (values.latency/2) + values.packetLoss*2 + values.cpuUsage/2));
        status = "Critical";
      } else if (values.latency > 50 || values.packetLoss > 2 || values.cpuUsage > 70) {
        risk = Math.min(79, Math.max(40, (values.latency/2) + values.packetLoss*2 + values.cpuUsage/2));
        status = "Warning";
      } else {
        risk = Math.min(39, Math.max(5, (values.latency/2) + values.packetLoss*2 + values.cpuUsage/2));
        status = "Healthy";
      }

      const matchingVariants = mockVariants.filter(v => v.network_status === status);
      const variant = matchingVariants.length > 0 
        ? matchingVariants[Math.floor(Math.random() * matchingVariants.length)]
        : mockVariants[Math.floor(Math.random() * mockVariants.length)];

      const newAnalysis: AnalysisResult = {
        id: newId,
        status: "success",
        network_status: status,
        predicted_risk: Math.round(risk),
        generated_at: new Date().toISOString(),
        model: "Phi-3 Local",
        telemetry: {
          latency: values.latency,
          packet_loss: values.packetLoss,
          cpu: values.cpuUsage
        },
        reason: variant.reason || "",
        possible_root_cause: variant.possible_root_cause || "",
        potential_impact: variant.potential_impact || "",
        recommended_actions: variant.recommended_actions || "",
        summary: variant.summary || ""
      };

      setHistory(prev => [newAnalysis, ...prev].slice(0, 10));
      setActiveAnalysisId(newId);
      setIsLoading(false);
      setTelemetryProcessed(prev => prev + 1);

      const isAnomaly = status !== "Healthy";
      setExtraEvents([
        { id: Date.now() + 1, timestamp: new Date().toISOString(), type: "REPORT_GEN", desc: `Report generated: ${status}`, isAnomaly },
      ]);
      setExtraLogs([{ id: Date.now() + 1, timestamp: new Date().toISOString(), level: status === "Healthy" ? "INFO" : (status === "Warning" ? "WARNING" : "CRITICAL"), message: `Analysis complete. Status: ${status}` }]);

    }, 2000);
  };

  const getStatusColorMapped = (status?: string): "green" | "yellow" | "red" | undefined => {
    if (!status) return undefined;
    if (status === "Healthy") return "green";
    if (status === "Warning") return "yellow";
    if (status === "Critical") return "red";
    return undefined;
  };

  const alertsCount = history.filter(h => h.network_status !== "Healthy").length;
  const parseConfidence = (summary: string) => {
    const match = summary.match(/confidence:?\s*(\d+)%/i);
    return match ? parseInt(match[1]) : (100 - (activeAnalysis?.predicted_risk || 0));
  };
  const confidence = activeAnalysis ? parseConfidence(activeAnalysis.summary) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#050816] text-foreground transition-colors duration-300">
      <StarField />
      <LoadingOverlay isVisible={isLoading} />
      
      <AlertBanner />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="flex-1 container mx-auto px-6 py-6 flex flex-col gap-4 max-w-[1600px]">
        
        {/* Status Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
          <StatusCard 
            label="Network Status" 
            value={activeAnalysis?.network_status || "Unknown"} 
            statusColor={getStatusColorMapped(activeAnalysis?.network_status)}
            icon={<ShieldAlert />}
          />
          <StatusCard 
            label="AI Confidence" 
            value={confidence}
            isPercentage
            statusColor="cyan"
            icon={<BrainCircuit />}
          />
          <StatusCard 
            label="Risk Score" 
            value={activeAnalysis?.predicted_risk || 0}
            isPercentage={true}
            statusColor={activeAnalysis && activeAnalysis.predicted_risk > 70 ? "red" : activeAnalysis && activeAnalysis.predicted_risk > 30 ? "yellow" : "green"}
            icon={<ActivitySquare />}
          />
          <StatusCard 
            label="AI Model" 
            value={activeAnalysis?.model || "Phi-3 Local"} 
            icon={<Server />}
          />
          <StatusCard 
            label="Last Analysis" 
            value={activeAnalysis ? formatTimestamp(activeAnalysis.generated_at).split(' ')[0] : "--"} 
            icon={<Clock />}
          />
          <StatusCard 
            label="Active Satellites" 
            value={`${mockSatellites.online} / ${mockSatellites.total}`} 
            statusColor="green"
            icon={<Satellite />}
          />
          <StatusCard 
            label="Ground Stations" 
            value={`${mockSatellites.groundStationsActive} Active`} 
            statusColor="amber"
            icon={<RadioReceiver />}
          />
        </div>

        <div className="border-t border-white/[0.04] my-1"></div>

        {/* 3-column row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <LiveTelemetry data={activeAnalysis} />
          </div>
          <div className="lg:col-span-4">
            <MissionTopology status={activeAnalysis?.network_status || "Healthy"} />
          </div>
          <div className="lg:col-span-5">
            <TelemetryForm onSubmit={handleTelemetrySubmit} isLoading={isLoading} />
          </div>
        </div>

        <div className="border-t border-white/[0.04] my-1"></div>

        {/* 2-column row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <AnalysisPanel data={activeAnalysis} />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex-1 min-h-[200px]">
              <TelemetryFeed externalEvents={extraEvents} />
            </div>
            <div className="flex-1 min-h-[200px]">
              <MissionLog externalLogs={extraLogs} />
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/[0.04] my-1"></div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <MultiTrendChart />
          </div>
          <div className="lg:col-span-4">
            <HealthChart />
          </div>
        </div>

        <div className="border-t border-white/[0.04] my-1"></div>

        {/* MissionStats full width */}
        <MissionStats 
          telemetryProcessed={telemetryProcessed} 
          alertsCount={alertsCount} 
          avgLatency={activeAnalysis?.telemetry?.latency}
          avgCpu={activeAnalysis?.telemetry?.cpu}
          avgLoss={activeAnalysis?.telemetry?.packet_loss}
        />

        <div className="border-t border-white/[0.04] my-1"></div>

        {/* History Sidebar (Horizontal) */}
        <HistorySidebar 
          history={history} 
          activeId={activeAnalysisId} 
          onSelect={setActiveAnalysisId} 
        />
        
      </main>
      
      <Footer />
    </div>
  );
}
