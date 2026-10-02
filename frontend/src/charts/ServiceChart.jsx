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

function ServiceChart({ data = [], logs = [] }) {
  const chartData = useMemo(() => {
    /*
     * Explicit chart data has priority.
     */
    if (Array.isArray(data) && data.length > 0) {
      return data
        .map((item) => ({
          service: String(
            item.service ??
              item.name ??
              item.label ??
              "unknown"
          ),

          count:
            Number(
              item.count ??
                item.total ??
                item.value ??
                item.events ??
                0
            ) || 0,

          anomalies:
            Number(
              item.anomalies ??
                item.anomaly_count ??
                item.anomalyCount ??
                0
            ) || 0,
        }))
        .filter((item) => item.count >= 0)
        .sort((a, b) => b.count - a.count);
    }

    /*
     * Build service statistics directly
     * from the analyzed log stream.
     */
    if (!Array.isArray(logs) || logs.length === 0) {
      return [];
    }

    const serviceMap = new Map();

    logs.forEach((log) => {
      const service = String(
        log.service ?? "unknown"
      );

      if (!serviceMap.has(service)) {
        serviceMap.set(service, {
          service,
          count: 0,
          anomalies: 0,
        });
      }

      const current = serviceMap.get(service);

      current.count += 1;

      if (
        log.is_anomaly === 1 ||
        log.is_anomaly === true ||
        Number(log.is_anomaly) === 1
      ) {
        current.anomalies += 1;
      }
    });

    return Array.from(serviceMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [data, logs]);

  /*
   * Total events.
   */
  const totalEvents = useMemo(() => {
    return chartData.reduce(
      (sum, item) => sum + item.count,
      0
    );
  }, [chartData]);

  /*
   * Total anomalies.
   */
  const totalAnomalies = useMemo(() => {
    return chartData.reduce(
      (sum, item) => sum + item.anomalies,
      0
    );
  }, [chartData]);

  return (
    <div className="w-full">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/30">
            Service activity
          </p>

          <h3 className="mt-1 text-sm font-medium text-white/80">
            Events by service
          </h3>
        </div>

        <div className="flex items-end gap-7">
          {/* EVENTS */}

          <div className="min-w-[48px] text-right">
            <div className="text-lg font-medium tracking-tight text-white">
              {totalEvents.toLocaleString()}
            </div>

            <div className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-white/25">
              events
            </div>
          </div>

          {/* ANOMALIES */}

          <div className="min-w-[62px] text-right">
            <div className="text-lg font-medium tracking-tight text-amber-300/80">
              {totalAnomalies.toLocaleString()}
            </div>

            <div className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-white/25">
              anomalies
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* EMPTY STATE */}
      {/* ================================================= */}

      {chartData.length === 0 ? (
        <div className="flex h-[230px] items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.01]">
          <div className="text-center">
            <div className="mx-auto mb-3 h-2 w-2 rounded-full bg-cyan-300/60 shadow-[0_0_18px_rgba(103,232,249,.45)]" />

            <p className="text-xs text-white/40">
              No service activity available
            </p>

            <p className="mt-1 text-[10px] text-white/20">
              Service data will appear after logs are analyzed.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ================================================= */}
          {/* CHART */}
          {/* ================================================= */}

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
                  dataKey="service"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,.28)",
                    fontSize: 9,
                  }}
                  tickFormatter={formatServiceName}
                  interval={0}
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
                    color: "rgba(255,255,255,.45)",
                    fontSize: 10,
                    marginBottom: 5,
                  }}
                  itemStyle={{
                    color: "#67e8f9",
                    fontSize: 11,
                  }}
                  formatter={(value) => [
                    `${Number(value).toLocaleString()} events`,
                    "Activity",
                  ]}
                />

                <Bar
                  dataKey="count"
                  name="Events"
                  fill="#67e8f9"
                  fillOpacity={0.78}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={38}
                  isAnimationActive
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ================================================= */}
          {/* SERVICE SUMMARY — KEEPING THE ORIGINAL BOXES */}
          {/* ================================================= */}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {chartData.slice(0, 3).map((item) => {
              const anomalyRate =
                item.count > 0
                  ? (
                      (item.anomalies / item.count) *
                      100
                    ).toFixed(1)
                  : "0.0";

              return (
                <div
                  key={item.service}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.012] px-3 py-2.5"
                >
                  {/* SERVICE */}

                  <div className="truncate text-[9px] text-white/35">
                    {item.service}
                  </div>

                  {/* COUNT + RATE */}

                  <div className="mt-1 flex items-end justify-between gap-2">
                    <span className="text-xs text-white/65">
                      {item.count.toLocaleString()}
                    </span>

                    <span
                      className={`text-[8px] ${
                        Number(anomalyRate) > 0
                          ? "text-amber-300/60"
                          : "text-cyan-300/45"
                      }`}
                    >
                      {anomalyRate}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ========================================================= */
/* SERVICE LABEL FORMATTER */
/* ========================================================= */

function formatServiceName(value) {
  const text = String(value ?? "");

  if (text.length <= 12) {
    return text;
  }

  return `${text.slice(0, 10)}…`;
}

export default ServiceChart;