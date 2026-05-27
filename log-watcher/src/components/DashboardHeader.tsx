import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function DashboardHeader() {
  const queryClient = useQueryClient();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
      <h2 className="text-sm font-medium text-foreground">Monitoring Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-mono">
          {new Date().toLocaleString()}
        </span>
        <button
          onClick={() => queryClient.invalidateQueries()}
          className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
