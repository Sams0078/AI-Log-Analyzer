import {
  Activity,
  AlertTriangle,
  Database,
  Server,
  TrendingUp,
} from "lucide-react";

const icons = {
  activity: Activity,
  anomaly: AlertTriangle,
  database: Database,
  server: Server,
  trend: TrendingUp,
};

function StatCard({
  label,
  value = "—",
  subtext,
  icon = "activity",
  trend,
  loading = false,
}) {
  const Icon = icons[icon] || Activity;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.018] p-4 transition hover:border-cyan-300/15 hover:bg-white/[0.025]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-400/[0.035] blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025]">
              <Icon size={13} className="text-cyan-300/70" />
            </div>

            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/30">
              {label}
            </span>
          </div>

          <div className="text-2xl font-semibold tracking-tight text-white">
            {loading ? (
              <span className="inline-block h-7 w-16 animate-pulse rounded bg-white/[0.06]" />
            ) : (
              value
            )}
          </div>

          {subtext && (
            <div className="mt-1 text-[9px] text-white/25">
              {subtext}
            </div>
          )}
        </div>

        {trend && (
          <span className="rounded-md border border-cyan-300/10 bg-cyan-300/[0.04] px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-cyan-300/60">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;