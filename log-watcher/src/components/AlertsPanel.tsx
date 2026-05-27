import { useAlerts } from "@/lib/hooks";
import { AlertTriangle } from "lucide-react";

export function AlertsPanel() {
  const { data: alerts, isLoading } = useAlerts();

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h3 className="text-sm font-medium text-foreground">Active Alerts</h3>
        {alerts && (
          <span className="ml-auto text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full font-mono">
            {alerts.length}
          </span>
        )}
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !alerts?.length ? (
          <p className="text-sm text-muted-foreground">No active alerts</p>
        ) : (
          alerts.slice(0, 20).map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-md border border-destructive/30 bg-destructive/5"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <LevelBadge level={alert.level} />
                  <span className="text-xs text-muted-foreground">P{alert.priority}</span>
                </div>
              </div>
              <p className="text-sm text-foreground truncate">{alert.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    INFO: "bg-info/20 text-info",
    WARNING: "bg-warning/20 text-warning",
    ERROR: "bg-destructive/20 text-destructive",
    CRITICAL: "bg-critical/20 text-critical",
  };
  return (
    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${styles[level] || "bg-muted text-muted-foreground"}`}>
      {level}
    </span>
  );
}
