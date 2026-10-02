import {
  BrainCircuit,
  Sparkles,
  X,
} from "lucide-react";

import { LevelBadge } from "./AnomalyCard";

function formatTime(timestamp) {
  if (!timestamp) return "—";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function DrawerMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] p-4">
      <div className="text-[8px] uppercase tracking-[0.2em] text-white/20">
        {label}
      </div>

      <div className="mt-2 font-mono text-lg text-white/70">
        {value}
      </div>
    </div>
  );
}

function DrawerTitle({
  title,
}) {
  return (
    <div className="text-[9px] uppercase tracking-[0.25em] text-white/25">
      {title}
    </div>
  );
}

function IncidentDrawer({
  incident,
  onClose,
  onAI,
  onSave,
  saved,
  aiLoading,
  aiResult,
}) {
  return (
    <div
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-[#080808] shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-cyan-300/60">
              Incident investigation
            </div>

            <div className="mt-2 font-mono text-sm">
              INC-
              {String(
                incident.incident_id
              ).padStart(
                3,
                "0"
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-2 gap-3">
            <DrawerMetric
              label="Anomalies"
              value={
                incident.anomaly_count ||
                0
              }
            />

            <DrawerMetric
              label="Duration"
              value={`${incident.duration_seconds || 0}s`}
            />
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={onSave}
              className={`flex-1 rounded-xl border px-4 py-3 text-[10px] uppercase tracking-widest transition ${
                saved
                  ? "border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300"
                  : "border-white/10 text-white/40 hover:text-white"
              }`}
            >
              {saved
                ? "Saved investigation"
                : "Save investigation"}
            </button>
          </div>

          <div className="mt-8">
            <DrawerTitle
              title="Affected services"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {(
                incident.services ||
                []
              ).map(
                (service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/45"
                  >
                    {service}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="mt-8">
            <DrawerTitle
              title="Evidence"
            />

            <div className="mt-3 space-y-2">
              {(
                incident.logs ||
                []
              )
                .slice(0, 8)
                .map(
                  (
                    log,
                    index
                  ) => (
                    <div
                      key={
                        log.id ||
                        index
                      }
                      className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <LevelBadge
                          level={
                            log.level
                          }
                        />

                        <span className="font-mono text-[9px] text-white/20">
                          {formatTime(
                            log.timestamp
                          )}
                        </span>
                      </div>

                      <div className="mt-3 text-xs leading-5 text-white/55">
                        {log.message}
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onAI}
              disabled={aiLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:opacity-50"
            >
              <BrainCircuit
                size={16}
              />

              {aiLoading
                ? "Analyzing incident..."
                : "Explain with local AI"}
            </button>
          </div>

          {aiResult?.ai_analysis && (
            <div className="mt-8 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.025] p-5">
              <div className="mb-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-cyan-300/60">
                <Sparkles
                  size={13}
                />

                AI reasoning
              </div>

              <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-white/60">
                {aiResult.ai_analysis}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IncidentDrawer;