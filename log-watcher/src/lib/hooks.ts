import { useQuery } from "@tanstack/react-query";
import { fetchStats, fetchLogs, fetchAlerts } from "./api";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchInterval: 5000,
  });
}

export function useLogs(page: number, limit = 10) {
  return useQuery({
    queryKey: ["logs", page, limit],
    queryFn: () => fetchLogs(page, limit),
    refetchInterval: 5000,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
    refetchInterval: 5000,
  });
}
