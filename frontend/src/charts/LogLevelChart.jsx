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

function LogLevelChart({ data = [], logs = [] }) {
  const chartData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      return data
        .map((item) => ({
          level: String(
            item.level ??
              item.name ??
              item.label ??
              "UNKNOWN"
          ).toUpperCase(),

          count:
            Number(
              item.count ??
                item.value ??
                item.total ??
                0
            ) || 0,
        }))
        .filter((item) => item.count >= 0);
    }

    if (!Array.isArray(logs) || logs.length === 0) {
      return [];
    }

    const levels = {
      INFO: 0,
      WARNING: 0,
      ERROR: 0,
      CRITICAL: 0,
      DEBUG: 0,
    };

    logs.forEach((log) => {
      const level = String(
        log.level ?? "UNKNOWN"
      ).toUpperCase();

      if (Object.prototype.hasOwnProperty.call(levels, level)) {
        levels[level] += 1;
      }
    });

    return Object.entries(levels)
      .filter(([, count]) => count > 0)
      .map(([level, count]) => ({
        level,
        count,
      }));
  }, [data, logs]);

  const total = useMemo(
    () =>
      chartData.reduce(
        (sum, item) => sum + item.count,
        0
      ),
    [chartData]
  );

  const dominantLevel = useMemo(() => {
    if (!chartData.length) {
      return "—";
    }

    return chartData.reduce(
      (highest, item) =>
        item.count > highest.count
          ? item
          : highest,
      chartData[0]
    ).level;
  }, [chartData]);

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/30">
            Log distribution
          </p>

          <h3 className="mt-1 text-sm font-medium text-white/80">
            Events by level
          </h3>
        </div>

        <div className="text-right">
          <div className="text-lg font-medium tracking-tight text-white">
            {total.toLocaleString()}
          </div>

          <div className="text-[9px] uppercase tracking-[0.16em] text-white/25">
            total events
          </div>
        </div>
      </div>

      {/* CHART */}
      {chartData.length === 0 ? (
        <div className="flex h-[230px] items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.01]">
          <div className="text-center">
            <div className="mx-auto mb-3 h-2 w-2 rounded-full bg-cyan-300/60 shadow-[0_0_18px_rgba(103,232,249,.45)]" />

            <p className="text-xs text-white/40">
              No log levels available
            </p>

            <p className="mt-1 text-[10px] text-white/20">
              Analyze logs to populate this chart.
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
                dataKey="level"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "rgba(255,255,255,.30)",
                  fontSize: 9,
                }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={34}
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
                  border:
                    "1px solid rgba(255,255,255,.08)",
                  borderRadius: "12px",
                  boxShadow:
                    "0 16px 50px rgba(0,0,0,.4)",
                  padding: "10px 12px",
                }}
                labelStyle={{
                  color:
                    "rgba(255,255,255,.45)",
                  fontSize: 10,
                  marginBottom: 4,
                }}
                itemStyle={{
                  color: "#67e8f9",
                  fontSize: 11,
                }}
                formatter={(value) => [
                  `${Number(value).toLocaleString()} event${
                    Number(value) === 1
                      ? ""
                      : "s"
                  }`,
                  "Count",
                ]}
              />

              <Bar
                dataKey="count"
                name="Events"
                fill="#67e8f9"
                radius={[4, 4, 0, 0]}
                maxBarSize={42}
                isAnimationActive
                animationDuration={700}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* FOOTER SUMMARY */}
      {chartData.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-[9px] uppercase tracking-[0.18em] text-white/20">
            Dominant level
          </span>

          <span className="text-[10px] font-medium uppercase tracking-widest text-cyan-300/60">
            {dominantLevel}
          </span>
        </div>
      )}
    </div>
  );
}

export default LogLevelChart;