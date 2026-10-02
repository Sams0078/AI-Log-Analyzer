import React from "react";

function Dashboard({
  children,
  logs,
  anomalyLogs,
  incidents,
  criticalCount,
  warningCount,
  anomalyRate,
  loading,
  apiError,
  navigateToSection,
  totalFormat,
  SignalPill,
  Metric,
}) {
  return (
    <main>
      {children}
    </main>
  );
}

export default Dashboard;