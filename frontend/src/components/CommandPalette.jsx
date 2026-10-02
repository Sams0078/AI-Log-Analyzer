import { ArrowRight, Search } from "lucide-react";

function CommandPalette({
  onClose,
  onNavigate,
  query,
  setQuery,
  menuGroups,
}) {
  const allCommands =
    menuGroups.flatMap(
      (group) =>
        group.items.map(
          (item) => ({
            ...item,
            group:
              group.title,
          })
        )
    );

  const filtered =
    allCommands.filter(
      (item) => {
        const q =
          query
            .trim()
            .toLowerCase();

        if (!q) {
          return true;
        }

        return (
          item.label
            .toLowerCase()
            .includes(q) ||
          item.description
            .toLowerCase()
            .includes(q)
        );
      }
    );

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center bg-black/75 px-5 pt-[12vh] backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
          <Search
            size={16}
            className="text-white/30"
          />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Search workspace..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/20"
          />

          <kbd className="text-[9px] text-white/20">
            ESC
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {filtered.length ? (
            filtered.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <button
                    key={
                      item.key
                    }
                    onClick={() =>
                      onNavigate(
                        item.key
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.05]"
                  >
                    <Icon
                      size={14}
                      className="text-cyan-300/45"
                    />

                    <span className="flex-1">
                      <span className="block text-sm text-white/60">
                        {
                          item.label
                        }
                      </span>

                      <span className="text-[9px] text-white/20">
                        {
                          item.group
                        }
                      </span>
                    </span>

                    <ArrowRight
                      size={13}
                      className="text-white/15"
                    />
                  </button>
                );
              }
            )
          ) : (
            <div className="px-4 py-12 text-center text-xs text-white/25">
              No workspace
              destination found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
