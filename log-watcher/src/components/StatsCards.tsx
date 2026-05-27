import { useStats } from "@/lib/hooks";
import { FileText, AlertTriangle, TrendingUp, Activity } from "lucide-react";

const cards = [
  { key: "total_logs" as const, label: "Total Logs", icon: FileText, color: "text-info" },
  { key: "total_anomalies" as const, label: "Total Anomalies", icon: AlertTriangle, color: "text-warning" },
  { key: "error_rate_percent" as const, label: "Error Rate %", icon: TrendingUp, color: "text-destructive" },
  { key: "anomaly_rate_percent" as const, label: "Anomaly Rate %", icon: Activity, color: "text-primary" },
];

export function StatsCards() {
  const { data, isLoading } = useStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-card border border-border rounded-lg p-5 glow-primary transition-all hover:border-primary/30"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{card.label}</span>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </div>
          <p className="text-2xl font-semibold font-mono text-foreground">
            {isLoading ? "—" : (
              card.key.includes("percent")
                ? `${(data?.[card.key] ?? 0).toFixed(1)}%`
                : (data?.[card.key] ?? 0).toLocaleString()
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
