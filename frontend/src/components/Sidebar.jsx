import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Database,
  FileSearch,
  FileText,
  Gauge,
  GitBranch,
  HelpCircle,
  History,
  LogOut,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react";

const groups = [
  {
    title: "WORKSPACE",
    items: [
      ["Overview", "system", Activity],
      ["Event Explorer", "logs", FileSearch],
      ["Incidents", "incidents", AlertTriangle],
      ["Services", "services", GitBranch],
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      ["Anomaly Detection", "anomalies", BarChart3],
      ["AI Investigation", "ai-analysis", BrainCircuit],
      ["Historical Search", "historical", History],
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      ["Log Ingestion", "ingestion", Database],
      ["System Health", "health", Gauge],
      ["Analysis Pipeline", "pipeline", Activity],
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      ["Settings", "settings", Settings],
      ["Audit & Security", "security", Shield],
      ["Administrator", "admin", User],
    ],
  },
];

function Sidebar({
  open = false,
  onClose,
  onNavigate,
  activeSection,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <aside className="absolute right-0 top-0 flex h-full w-[min(420px,92vw)] flex-col border-l border-white/[0.08] bg-[#08090b] shadow-2xl">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              Operations
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/25">
              AI Log Analyzer
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/40 transition hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {groups.map((group) => (
            <div key={group.title} className="mb-7">
              <div className="mb-2 px-2 text-[8px] font-semibold tracking-[0.24em] text-white/20">
                {group.title}
              </div>

              <div className="space-y-1">
                {group.items.map(([label, id, Icon]) => {
                  const active = activeSection === id;

                  return (
                    <button
                      key={id}
                      onClick={() => {
                        onNavigate?.(id);
                        onClose?.();
                      }}
                      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                        active
                          ? "bg-cyan-400/[0.07] text-cyan-200"
                          : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <Icon
                        size={14}
                        strokeWidth={1.6}
                        className={active ? "text-cyan-300" : "text-white/25"}
                      />

                      <span className="text-[10px] font-medium uppercase tracking-[0.11em]">
                        {label}
                      </span>

                      <span className="ml-auto text-[8px] text-white/10">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.07] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.06]">
              <User size={13} className="text-cyan-300" />
            </div>

            <div className="min-w-0">
              <div className="truncate text-[10px] font-medium text-white">
                Administrator
              </div>
              <div className="text-[8px] uppercase tracking-[0.14em] text-white/25">
                Local environment
              </div>
            </div>

            <button className="ml-auto text-white/25 transition hover:text-white">
              <Settings size={13} />
            </button>
          </div>

          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-white/30 transition hover:bg-red-400/[0.05] hover:text-red-300">
            <LogOut size={13} />
            <span className="text-[9px] uppercase tracking-[0.14em]">
              Sign out
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;