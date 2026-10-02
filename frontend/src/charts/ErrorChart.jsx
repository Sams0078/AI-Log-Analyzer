import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function ErrorChart({ data = [], logs = [] }) {
  const chartData = useMemo(() => {
    /*
     * Supports:
     * 1. data={[{ time: "10:00", errors: 2 }]}
     * 2. data={[{ timestamp: "...", error_count: 2 }]}
     * 3. logs={[{ timestamp: "...", level: "ERROR" }]}
     */

    if (Array.isArray(data) && data.length > 0) {
      return data
        .map((item, index) => ({
          time:
            item.time ??
            item.label ??
            item.timestamp ??
            `Event ${index + 1}`,
          errors:
            Number(
              item.errors ??
                item.error_count ??
                item.errorCount ??
                item.value ??
                0
            ) || 0,
        }))
        .filter((item) => item.errors >= 0);
    }

    if (!Array.isArray(logs) || logs.length === 0) {
      return [];
    }

    const buckets = new Map();

    logs.forEach((log) => {
      const level = String(log.level ?? "").toUpperCase();

      if (level !== "ERROR" && level !== "CRITICAL") {
        return;
      }

      const rawTimestamp = log.timestamp;

      if (!rawTimestamp) {
        const key = "Unknown";
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
        return;
      }

      const date = new Date(rawTimestamp);

      if (Number.isNaN(date.getTime())) {
        const key = String(rawTimestamp);
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
        return;
      }

      /*
       * Group errors by minute.
       * This avoids creating a separate bar for every log event.
       */
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const key = `${hours}:${minutes}`;

      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, errors]) => ({
        time,
        errors,
      }));
  }, [data, logs]);

  const totalErrors = useMemo(
    () => chartData.reduce((sum, item) => sum + item.errors, 0),
    [chartData]
  );

  const peakErrors = useMemo(
    () =>
      chartData.length
        ? Math.max(...chartData.map((item) => item.errors))
        : 0,
    [chartData]
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/30">
            Error activity
          </p>

          <h3 className="mt-1 text-sm font-medium text-white/80">
            Errors over time
          </h3>
        </div>

        <div className="text-right">
          <div className="text-lg font-medium tracking-tight text-white">
            {totalErrors}
          </div>

          <div className="text-[9px] uppercase tracking-[0.16em] text-white/25">
            total errors
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="flex h-[230px] items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.01]">
          <div className="text-center">
            <div className="mx-auto mb-3 h-2 w-2 rounded-full bg-cyan-300/60 shadow-[0_0_18px_rgba(103,232,249,.45)]" />

            <p className="text-xs text-white/40">
              No error activity detected
            </p>

            <p className="mt-1 text-[10px] text-white/20">
              Error events will appear here after analysis.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[230px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 8,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,.045)"
              />

              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "rgba(255,255,255,.28)",
                  fontSize: 9,
                }}
                minTickGap={28}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={30}
                domain={[0, Math.max(peakErrors, 1)]}
                tick={{
                  fill: "rgba(255,255,255,.22)",
                  fontSize: 9,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(103,232,249,.035)",
                }}
                contentStyle={{
                  background: "rgba(8,8,8,.96)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: "12px",
                  boxShadow: "0 16px 50px rgba(0,0,0,.4)",
                  padding: "10px 12px",
                }}
                labelStyle={{
                  color: "rgba(255,255,255,.45)",
                  fontSize: 10,
                  marginBottom: 4,
                }}
                itemStyle={{
                  color: "#67e8f9",
                  fontSize: 11,
                }}
                formatter={(value) => [
                  `${value} error${value === 1 ? "" : "s"}`,
                  "Activity",
                ]}
              />

              <Bar
                dataKey="errors"
                name="Errors"
                fill="#67e8f9"
                radius={[4, 4, 0, 0]}
                maxBarSize={34}
                isAnimationActive
                animationDuration={700}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ErrorChart;