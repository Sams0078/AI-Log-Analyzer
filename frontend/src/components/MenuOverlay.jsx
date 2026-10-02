import {
  ArrowUpRight,
  X,
} from "lucide-react";

function MenuOverlay({
  onClose,
  onNavigate,
  menuGroups = [],
}) {
  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#050505]/96 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div
        className="mx-auto min-h-screen max-w-[1440px] px-6 py-6 lg:px-10"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">
          <div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-cyan-300/60">
              AI Log Analyzer
            </div>

            <div className="mt-2 text-xs text-white/25">
              Workspace
              navigation
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/45 transition hover:border-white/20 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mx-auto max-w-5xl py-10">
          {menuGroups.map((group) => (
            <div
              key={group.title}
              className="mb-9"
            >
              <div className="mb-3 px-1 text-[9px] font-medium uppercase tracking-[0.28em] text-cyan-300/45">
                {group.title}
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.012]">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.key}
                      onClick={() =>
                        onNavigate(item.key)
                      }
                      className="group flex w-full items-center gap-4 border-b border-white/[0.06] px-5 py-4 text-left transition last:border-b-0 hover:bg-white/[0.035]"
                    >
                      <span className="w-7 font-mono text-[9px] text-white/20">
                        {item.number}
                      </span>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.025] text-cyan-300/60 transition group-hover:border-cyan-300/25 group-hover:text-cyan-300">
                        <Icon size={15} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-white/65 transition group-hover:text-white">
                          {item.label}
                        </span>

                        <span className="mt-1 block text-[10px] leading-5 text-white/25">
                          {item.description}
                        </span>
                      </span>

                      <ArrowUpRight
                        size={15}
                        className="text-white/15 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.07] py-5">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-white/20">
            <span>
              Local-first
              observability
            </span>

            <span>
              ESC to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuOverlay;