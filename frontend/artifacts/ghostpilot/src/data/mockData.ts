export interface TelemetryData {
  latency: number;
  packet_loss: number;
  cpu: number;
}

export interface AnalysisResult {
  id: string;
  status: "success" | "error";
  network_status: "Healthy" | "Warning" | "Critical";
  predicted_risk: number;
  generated_at: string;
  model: string;
  telemetry: TelemetryData;
  reason: string;
  possible_root_cause: string;
  potential_impact: string;
  recommended_actions: string;
  summary: string;
}

export const mockVariants: Partial<AnalysisResult>[] = [
  {
    network_status: "Healthy",
    predicted_risk: 12,
    reason: "All network parameters are within established nominal ranges. Telemetry flow is stable with optimal routing efficiency.",
    possible_root_cause: "N/A - System operating optimally.",
    potential_impact: "Nominal operations. Data integrity guaranteed.",
    recommended_actions: "Continue standard monitoring. No immediate action required.",
    summary: "System health verified. AI confidence: 96%."
  },
  {
    network_status: "Warning",
    predicted_risk: 55,
    reason: "Elevated latency detected in cross-orbital relays. Packet loss slightly above threshold on secondary links.",
    possible_root_cause: "Interference from solar activity affecting S-band receivers, or partial node synchronization delay.",
    potential_impact: "Minor delays in telemetry data rendering. Possible jitter in high-frequency data streams.",
    recommended_actions: "1. Monitor S-band signal strength.\n2. Prepare to reroute non-essential traffic to tertiary links.\n3. Increase packet error correction redundancy.",
    summary: "System experiencing moderate stress. Precautionary measures advised. AI confidence: 82%."
  },
  {
    network_status: "Critical",
    predicted_risk: 83,
    reason: "Severe packet loss exceeding 15% on primary telemetry link. CPU load on primary routing node pegged at 98%.",
    possible_root_cause: "Cascade failure in routing tables for Sector 4, likely triggered by buffer overflow in packet queuing.",
    potential_impact: "Imminent loss of real-time telemetry. High risk of ground station disconnect if unmitigated.",
    recommended_actions: "1. URGENT: Initiate manual failover to backup links.\n2. Reboot primary routing node.\n3. Suspend all non-critical orbital asset syncs immediately.",
    summary: "Critical network failure detected. Immediate manual intervention required. AI confidence: 91%."
  },
  {
    network_status: "Warning",
    predicted_risk: 41,
    reason: "CPU utilization showing anomalous spikes. Intermittent packet drops observed over the last 5 minutes.",
    possible_root_cause: "Background diagnostic routine consuming excess compute resources, overlapping with normal data bursts.",
    potential_impact: "Reduced processing bandwidth for new telemetry connections. Slight risk of data queuing delays.",
    recommended_actions: "1. Terminate low-priority diagnostic sweeps.\n2. Allocate additional compute resources to primary queue.\n3. Monitor CPU thermals.",
    summary: "Resource utilization warning. Adjust compute allocations to stabilize. AI confidence: 78%."
  }
];

export const initialMockResult: AnalysisResult = {
  id: "ANL-7892",
  status: "success",
  network_status: "Warning",
  predicted_risk: 55,
  generated_at: "2026-06-28 23:56:16",
  model: "phi3",
  telemetry: { latency: 45, packet_loss: 2, cpu: 60 },
  reason: "Network latency elevated above threshold. Packet loss within acceptable range but trending upward. CPU load approaching warning threshold on primary nodes.",
  possible_root_cause: "Potential routing table inconsistency detected in sector 3-B. Secondary link utilization at 78% may be contributing to latency spikes.",
  potential_impact: "Continued degradation could lead to packet drops affecting real-time telemetry feeds. Mission-critical data streams at moderate risk if trend continues for 15+ minutes.",
  recommended_actions: "1. Audit routing tables on nodes N-07 through N-12.\n2. Redistribute load from secondary to tertiary links.\n3. Enable adaptive QoS for priority telemetry channels.\n4. Schedule diagnostic sweep within next 30 minutes.",
  summary: "Network operating under moderate stress. Immediate action recommended to prevent escalation to Critical status. AI confidence: 87%."
};

export const historyMockData: AnalysisResult[] = [
  initialMockResult,
  {
    id: "ANL-7891",
    status: "success",
    network_status: "Healthy",
    predicted_risk: 12,
    generated_at: "2026-06-28 23:45:00",
    model: "phi3",
    telemetry: { latency: 15, packet_loss: 0.1, cpu: 22 },
    reason: "All metrics nominal.",
    possible_root_cause: "N/A",
    potential_impact: "None.",
    recommended_actions: "Continue standard monitoring.",
    summary: "Network operating perfectly."
  },
  {
    id: "ANL-7890",
    status: "success",
    network_status: "Critical",
    predicted_risk: 89,
    generated_at: "2026-06-28 23:30:11",
    model: "phi3",
    telemetry: { latency: 120, packet_loss: 15, cpu: 98 },
    reason: "Severe latency and packet loss. CPU pegged.",
    possible_root_cause: "DDoS or cascade failure in sector 2-A.",
    potential_impact: "Loss of telemetry. Ground station disconnect.",
    recommended_actions: "1. Failover to backup links immediately.\n2. Restart primary routing node.",
    summary: "Critical network failure imminent."
  },
  {
    id: "ANL-7889",
    status: "success",
    network_status: "Warning",
    predicted_risk: 65,
    generated_at: "2026-06-28 23:15:00",
    model: "phi3",
    telemetry: { latency: 60, packet_loss: 5, cpu: 75 },
    reason: "Elevated metrics across the board.",
    possible_root_cause: "High traffic from orbital asset sync.",
    potential_impact: "Degraded data fidelity.",
    recommended_actions: "Throttle non-critical syncs.",
    summary: "System under heavy load."
  },
  {
    id: "ANL-7888",
    status: "success",
    network_status: "Healthy",
    predicted_risk: 25,
    generated_at: "2026-06-28 23:00:00",
    model: "phi3",
    telemetry: { latency: 20, packet_loss: 0.5, cpu: 35 },
    reason: "All metrics within normal operating bounds.",
    possible_root_cause: "N/A",
    potential_impact: "None.",
    recommended_actions: "Maintain current posture.",
    summary: "Nominal conditions."
  }
];

export const riskTrendData = [
  { time: "22:45", risk: 20 },
  { time: "23:00", risk: 25 },
  { time: "23:15", risk: 35 },
  { time: "23:30", risk: 65 },
  { time: "23:45", risk: 89 },
  { time: "00:00", risk: 41 },
  { time: "00:15", risk: 12 },
  { time: "00:30", risk: 55 }
];

export const cpuTrendData = [
  { time: "22:45", value: 30 },
  { time: "23:00", value: 35 },
  { time: "23:15", value: 45 },
  { time: "23:30", value: 75 },
  { time: "23:45", value: 98 },
  { time: "00:00", value: 50 },
  { time: "00:15", value: 25 },
  { time: "00:30", value: 40 }
];

export const latencyTrendData = [
  { time: "22:45", value: 15 },
  { time: "23:00", value: 20 },
  { time: "23:15", value: 30 },
  { time: "23:30", value: 80 },
  { time: "23:45", value: 150 },
  { time: "00:00", value: 60 },
  { time: "00:15", value: 20 },
  { time: "00:30", value: 45 }
];

export const packetLossTrendData = [
  { time: "22:45", value: 0.1 },
  { time: "23:00", value: 0.5 },
  { time: "23:15", value: 1.2 },
  { time: "23:30", value: 5.0 },
  { time: "23:45", value: 15.0 },
  { time: "00:00", value: 2.5 },
  { time: "00:15", value: 0.2 },
  { time: "00:30", value: 1.0 }
];

export const mockSatellites = {
  online: 4,
  total: 6,
  groundStationsActive: 3
};

export const healthPieData = [
  { name: "Healthy", value: 45, color: "#22c55e" },
  { name: "Degraded", value: 30, color: "#3b82f6" },
  { name: "Warning", value: 18, color: "#eab308" },
  { name: "Critical", value: 7, color: "#ef4444" },
];
