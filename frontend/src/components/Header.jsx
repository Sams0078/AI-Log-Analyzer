import { ArrowUpRight, Menu, Search, Zap } from "lucide-react";

const MAIN_NAV = [
  ["Overview", "system"],
  ["Logs", "logs"],
  ["Anomalies", "anomalies"],
  ["Incidents", "incidents"],
  ["AI", "ai-analysis"],
];

function Header({
  onMenu,
  onCommand,
  onLogin,
  loggedIn,
  onLogout,
  onNavigate,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050505]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        {/* BRAND */}
        <button
          onClick={() =>
            onNavigate("system")
          }
          className="flex items-center gap-3"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/30">
            <Zap
              size={13}
              className="text-cyan-300"
            />
          </div>

          <div className="text-[11px] font-semibold uppercase tracking-[0.22em]">
            AI Log Analyzer
          </div>

          <span className="hidden text-[9px] uppercase tracking-widest text-white/20 sm:block">
            / local intelligence
          </span>
        </button>

        {/* MAIN NAV */}
        <div className="hidden items-center gap-7 md:flex">
          {MAIN_NAV.map(
            ([label, target]) => (
              <button
                key={label}
                onClick={() =>
                  onNavigate(
                    target
                  )
                }
                className="text-[9px] uppercase tracking-[0.18em] text-white/30 transition hover:text-white"
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* SEARCH */}
          <button
            onClick={onCommand}
            className="hidden items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] text-white/35 transition hover:border-white/15 hover:text-white/70 sm:flex"
          >
            <Search size={13} />

            <span>
              Search
            </span>

            <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[9px]">
              ⌘K
            </kbd>
          </button>

          {/* LOGIN / ACCOUNT */}
          <button
            onClick={
              loggedIn
                ? onLogout
                : onLogin
            }
            className="rounded-lg border border-white/[0.08] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.18em] text-white/45 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.03] hover:text-white"
          >
            {loggedIn
              ? "Sign out"
              : "Login"}
          </button>

          {/* MENU */}
          <button
            onClick={onMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/60 transition hover:border-white/20 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;