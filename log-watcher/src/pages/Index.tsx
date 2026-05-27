import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { LogLevelChart } from "@/components/LogLevelChart";
import { LogsOverTimeChart } from "@/components/LogsOverTimeChart";
import { AlertsPanel } from "@/components/AlertsPanel";
import { LogsTable } from "@/components/LogsTable";

const Index = () => {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LogLevelChart />
            <LogsOverTimeChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <LogsTable />
            </div>
            <AlertsPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
