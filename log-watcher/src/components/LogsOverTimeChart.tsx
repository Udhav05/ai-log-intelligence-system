import { useLogs } from "@/lib/hooks";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

export function LogsOverTimeChart() {
  const { data, isLoading } = useLogs(1, 100);

  const chartData = useMemo(() => {
    if (!data?.logs) return [];
    const buckets: Record<string, number> = {};
    data.logs.forEach((log) => {
      const d = new Date(log.timestamp);
      const key = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
      buckets[key] = (buckets[key] || 0) + 1;
    });
    return Object.entries(buckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, count]) => ({ time, count }));
  }, [data]);

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Logs Over Time</h3>
      {isLoading ? (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="time" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 90%)",
              }}
            />
            <Line type="monotone" dataKey="count" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
