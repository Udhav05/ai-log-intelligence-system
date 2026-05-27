import { useStats } from "@/lib/hooks";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS: Record<string, string> = {
  INFO: "hsl(210, 80%, 55%)",
  WARNING: "hsl(38, 92%, 55%)",
  ERROR: "hsl(25, 95%, 55%)",
  CRITICAL: "hsl(0, 85%, 45%)",
};

export function LogLevelChart() {
  const { data, isLoading } = useStats();

  const chartData = data
    ? [
        { level: "INFO", count: data.info_logs },
        { level: "WARNING", count: data.warning_logs },
        { level: "ERROR", count: data.error_logs },
        { level: "CRITICAL", count: data.critical_logs },
      ]
    : [];

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">Log Level Distribution</h3>
      {isLoading ? (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="level" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 90%)",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.level} fill={COLORS[entry.level]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
