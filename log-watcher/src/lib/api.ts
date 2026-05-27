const API_BASE = "http://127.0.0.1:8000";

export interface Stats {
  total_logs: number;
  info_logs: number;
  warning_logs: number;
  error_logs: number;
  critical_logs: number;
  total_anomalies: number;
  error_rate_percent: number;
  anomaly_rate_percent: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  status: string;
  message: string;
  anomaly: boolean;
  anomaly_score: number;
  level: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  priority: number;
}

export interface LogsResponse {
  total_logs: number;
  total_pages: number;
  current_page: number;
  logs: LogEntry[];
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchLogs(page = 1, limit = 10): Promise<LogsResponse> {
  const res = await fetch(`${API_BASE}/logs?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export async function fetchAlerts(): Promise<LogEntry[]> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}
