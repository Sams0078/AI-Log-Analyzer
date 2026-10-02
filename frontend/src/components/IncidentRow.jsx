import {
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

function formatTime(timestamp) {
  if (!timestamp) {
    return "—";
  }

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

function IncidentRow({
  incident,
  onOpen,
  onSave,
  saved,
}) {
  return (
    <div className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.012] p-5 text-left transition hover:bg-white/[0.025]">
      <button
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/10 bg-amber-300/[0.02]">
          <ShieldAlert
            size={17}
            className="text-amber-300/60"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] text-white/25">
              INC-
              {String(
                incident.incident_id
              ).padStart(
                3,
                "0"
              )}
            </span>

            <span className="rounded-full border border-amber-300/15 px-2 py-1 text-[8px] uppercase tracking-widest text-amber-300/70">
              investigation
            </span>
          </div>

          <div className="mt-2 truncate text-sm text-white/70">
            {incident.services?.join(
              " · "
            ) ||
              "Unknown service"}
          </div>

          <div className="mt-1 text-[10px] text-white/25">
            {incident.anomaly_count}{" "}
            anomalous event
            {incident.anomaly_count !==
            1
              ? "s"
              : ""}{" "}
            ·{" "}
            {formatTime(
              incident.start_time
            )}
          </div>
        </div>

        <ChevronRight
          size={17}
          className="shrink-0 text-white/20 transition group-hover:translate-x-1 group-hover:text-cyan-300"
        />
      </button>

      <button
        onClick={onSave}
        className={`shrink-0 rounded-lg border px-3 py-2 text-[8px] uppercase tracking-widest transition ${
          saved
            ? "border-cyan-300/20 bg-cyan-300/[0.04] text-cyan-300"
            : "border-white/[0.07] text-white/20 hover:text-white/60"
        }`}
      >
        {saved
          ? "Saved"
          : "Save"}
      </button>
    </div>
  );
}

export default IncidentRow;
