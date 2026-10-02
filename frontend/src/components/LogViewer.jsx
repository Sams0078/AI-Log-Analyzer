import {
  AlertTriangle,
  Calendar,
  Cpu,
  Database,
  FileText,
  Gauge,
  HardDrive,
  Server,
  X,
} from "lucide-react";

function LogViewer({ log, onClose }) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        onClick={onClose}
        aria-label="Close log viewer"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 flex h-full w-[min(620px,94vw)] flex-col border-l border-white/[0.08] bg-[#08090b] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.04]">
              <FileText size={15} className="text-cyan-300/70" />
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                Log Event
              </div>
              <div className="mt-1 text-[8px] text-white/25">
                ID #{log.id ?? "—"}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/40 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Message */}
          <section>
            <div className="mb-2 text-[8px] uppercase tracking-[0.18em] text-white/20">
              Message
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 font-mono text-[11px] leading-relaxed text-white/70">
              {log.message || "No message"}
            </div>
          </section>

          {/* Core metadata */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <InfoBox
              icon={AlertTriangle}
              label="Level"
              value={log.level || "—"}
            />
            <InfoBox
              icon={Server}
              label="Service"
              value={log.service || "—"}
            />
            <InfoBox
              icon={Calendar}
              label="Timestamp"
              value={log.timestamp || "—"}
            />
            <InfoBox
              icon={FileText}
              label="Source"
              value={log.source || "—"}
            />
          </div>

          {/* Telemetry */}
          <div className="mt-7">
            <div className="mb-3 text-[8px] uppercase tracking-[0.18em] text-white/20">
              Telemetry
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoBox
                icon={Gauge}
                label="Latency"
                value={formatValue(log.latency_ms, " ms")}
              />

              <InfoBox
                icon={Server}
                label="Status"
                value={log.status_code ?? "—"}
              />

              <InfoBox
                icon={Cpu}
                label="CPU"
                value={formatValue(log.cpu_usage, "%")}
              />

              <InfoBox
                icon={HardDrive}
                label="Memory"
                value={formatValue(log.memory_usage, "%")}
              />

              <InfoBox
                icon={Database}
                label="DB Connections"
                value={log.db_connections ?? "—"}
              />

              <InfoBox
                icon={Gauge}
                label="Error Rate"
                value={formatValue(log.error_rate, "")}
              />
            </div>
          </div>

          {/* Raw JSON */}
          <div className="mt-7">
            <div className="mb-3 text-[8px] uppercase tracking-[0.18em] text-white/20">
              Raw Event
            </div>

            <pre className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30 p-4 text-[8px] leading-relaxed text-white/35">
              {JSON.stringify(log, null, 2)}
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
}

function formatValue(value, suffix = "") {
  if (value === undefined || value === null || value === "") return "—";
  return `${value}${suffix}`;
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.018] p-3">
      <div className="flex items-center gap-2 text-[7px] uppercase tracking-[0.14em] text-white/20">
        <Icon size={10} />
        {label}
      </div>

      <div className="mt-2 truncate text-[9px] text-white/55">
        {value}
      </div>
    </div>
  );
}

export default LogViewer;