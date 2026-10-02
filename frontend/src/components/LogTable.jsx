import { Search } from "lucide-react";

function LogTable({
  filteredLogs,
  searchQuery,
  setSearchQuery,
  bookmarks,
  toggleBookmark,
}) {
  return (
    <div className="glass-panel mt-10 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/25">
          Event explorer
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2">
          <Search
            size={13}
            className="text-white/20"
          />

          <input
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Filter events..."
            className="w-40 bg-transparent text-[10px] text-white outline-none placeholder:text-white/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.07] text-[9px] uppercase tracking-[0.2em] text-white/25">
              <th className="px-5 py-4">
                Time
              </th>

              <th className="px-5 py-4">
                Level
              </th>

              <th className="px-5 py-4">
                Service
              </th>

              <th className="px-5 py-4">
                Message
              </th>

              <th className="px-5 py-4">
                Signal
              </th>

              <th className="px-5 py-4">
                Mark
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.length ? (
              filteredLogs
                .slice(0, 15)
                .map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-white/[0.05] transition hover:bg-white/[0.025]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-[11px] text-white/30">
                      {formatTime(log.timestamp)}
                    </td>

                    <td className="px-5 py-4">
                      <LevelBadge level={log.level} />
                    </td>

                    <td className="px-5 py-4 text-xs text-white/60">
                      {log.service || "unknown"}
                    </td>

                    <td className="max-w-[440px] truncate px-5 py-4 text-sm text-white/75">
                      {log.message}
                    </td>

                    <td className="px-5 py-4">
                      {log.is_anomaly === 1 ? (
                        <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                          anomaly
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/25">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                          normal
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleBookmark(log)}
                        className={`rounded-lg border px-2.5 py-1.5 text-[9px] uppercase tracking-widest transition ${
                          bookmarks.some(
                            (item) => item.id === log.id
                          )
                            ? "border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300"
                            : "border-white/[0.07] text-white/20 hover:text-white/60"
                        }`}
                      >
                        {bookmarks.some(
                          (item) => item.id === log.id
                        )
                          ? "Marked"
                          : "Mark"}
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <EmptyRow
                text={
                  searchQuery
                    ? "No matching events."
                    : "No logs available."
                }
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LevelBadge({ level }) {
  const normalized = String(
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
        classes[normalized] || classes.INFO
      }`}
    >
      {normalized}
    </span>
  );
}

function EmptyRow({ text }) {
  return (
    <tr>
      <td
        colSpan="6"
        className="px-5 py-12 text-center text-xs text-white/25"
      >
        {text}
      </td>
    </tr>
  );
}

function formatTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default LogTable;