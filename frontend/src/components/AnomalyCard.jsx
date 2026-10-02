import {
  ArrowUpRight,
} from "lucide-react";

function LevelBadge({
  level,
}) {
  const normalized =
    String(
      level || "INFO"
    ).toUpperCase();

  const classes = {
    ERROR:
      "border-red-300/15 bg-red-300/[0.03] text-red-300/70",
    CRITICAL:
      "border-red-300/20 bg-red-300/[0.04] text-red-300",
    WARNING:
      "border-amber-300/15 bg-amber-300/[0.03] text-amber-300/70",
    INFO:
      "border-cyan-300/10 bg-cyan-300/[0.025] text-cyan-300/60",
    DEBUG:
      "border-white/10 bg-white/[0.02] text-white/30",
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 text-[8px] uppercase tracking-widest ${
        classes[
          normalized
        ] ||
        classes.INFO
      }`}
    >
      {normalized}
    </span>
  );
}

function formatTime(timestamp) {
  if (!timestamp) {
    return "—";
  }

  const date = new Date(
    timestamp
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );
}

function AnomalyCard({
  log,
  onClick,
  onBookmark,
  bookmarked,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (
          event.key ===
            "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          onClick();
        }
      }}
      className="group glass-panel p-5 text-left transition hover:border-amber-300/15 hover:bg-white/[0.025]"
    >
      <div className="flex items-center justify-between">
        <LevelBadge
          level={
            log.level
          }
        />

        <div className="flex items-center gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onBookmark();
            }}
            className={`rounded-lg border px-2 py-1 text-[8px] uppercase tracking-widest ${
              bookmarked
                ? "border-cyan-300/20 text-cyan-300"
                : "border-white/10 text-white/20"
            }`}
          >
            {bookmarked
              ? "Marked"
              : "Mark"}
          </button>

          <ArrowUpRight
            size={14}
            className="text-white/15 transition group-hover:text-cyan-300"
          />
        </div>
      </div>

      <div className="mt-6 text-[9px] uppercase tracking-[0.2em] text-white/20">
        {log.service ||
          "unknown"}
      </div>

      <div className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">
        {log.message}
      </div>

      <div className="mt-6 flex items-center justify-between font-mono text-[9px] text-white/20">
        <span>
          {formatTime(
            log.timestamp
          )}
        </span>

        <span className="text-amber-300/60">
          anomaly
        </span>
      </div>
    </div>
  );
}

export {
  AnomalyCard,
  LevelBadge,
};

export default AnomalyCard;