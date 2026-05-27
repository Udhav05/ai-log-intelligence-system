import { useLogs } from "@/lib/hooks";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LogEntry } from "@/lib/api";

const LEVEL_STYLES: Record<string, string> = {
  INFO: "bg-info/20 text-info",
  WARNING: "bg-warning/20 text-warning",
  ERROR: "bg-destructive/20 text-destructive",
  CRITICAL: "bg-critical/20 text-critical",
};

export function LogsTable() {
  const [page, setPage] = useState(1);
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [anomalyFilter, setAnomalyFilter] = useState<string>("ALL");

  const { data, isLoading } = useLogs(page, 15);

  const filteredLogs = useMemo(() => {
    if (!data?.logs) return [];
    return data.logs.filter((log) => {
      if (levelFilter !== "ALL" && log.level !== levelFilter) return false;
      if (anomalyFilter === "true" && !log.anomaly) return false;
      if (anomalyFilter === "false" && log.anomaly) return false;
      return true;
    });
  }, [data, levelFilter, anomalyFilter]);

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Filters */}
      <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Filters</span>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="text-xs bg-secondary text-secondary-foreground border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARNING">WARNING</option>
          <option value="ERROR">ERROR</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
        <select
          value={anomalyFilter}
          onChange={(e) => setAnomalyFilter(e.target.value)}
          className="text-xs bg-secondary text-secondary-foreground border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="ALL">All Anomalies</option>
          <option value="true">Anomaly</option>
          <option value="false">Normal</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Timestamp", "Level", "Message", "Priority", "Anomaly"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : !filteredLogs.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No logs found</td></tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className={`border-b border-border/50 hover:bg-secondary/50 transition-colors ${log.anomaly ? "bg-destructive/5" : ""}`}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${LEVEL_STYLES[log.level] || ""}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-foreground max-w-md truncate">{log.message}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{log.priority}</td>
                  <td className="px-4 py-2.5">
                    {log.anomaly ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-destructive/20 text-destructive">ANOMALY</span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground">Normal</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Page {data?.current_page ?? page} of {data?.total_pages ?? 1}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-md border border-border hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (data?.total_pages ?? 1)}
            className="p-1.5 rounded-md border border-border hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
