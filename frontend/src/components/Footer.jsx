import { ArrowUpRight, Github, Zap } from "lucide-react";

function Footer({
  onNavigate,
  onMenuNavigate,
}) {
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/25">
                <Zap
                  size={13}
                  className="text-cyan-300"
                />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                AI Log Analyzer
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/30">
              A local-first intelligent
              observability platform
              for understanding what
              happened inside your
              systems.
            </p>
          </div>

          <FooterColumn
            title="Product"
            items={[
              [
                "Overview",
                "system",
              ],
              [
                "Logs",
                "logs",
              ],
              [
                "Anomalies",
                "anomalies",
              ],
              [
                "Incidents",
                "incidents",
              ],
              [
                "AI Analysis",
                "ai-analysis",
              ],
            ]}
            onNavigate={
              onNavigate
            }
          />

          <FooterColumn
            title="Workspace"
            items={[
              [
                "User Account",
                "account",
              ],
              [
                "Saved Investigations",
                "saved",
              ],
              [
                "Bookmarks",
                "bookmarks",
              ],
              [
                "Settings",
                "settings",
              ],
            ]}
            onNavigate={
              onMenuNavigate
            }
          />

          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-white/20">
              Project
            </div>

            <a
              href="https://github.com/Sams0078/AI-Log-Analyzer"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
            >
              <Github
                size={15}
              />

              GitHub

              <ArrowUpRight
                size={13}
              />
            </a>

            <div className="mt-7 text-[10px] leading-5 text-white/20">
              Built as an engineering
              project exploring
              machine learning,
              retrieval, and local AI.
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-6 text-[9px] uppercase tracking-[0.18em] text-white/15 sm:flex-row">
          <span>
            © 2026 AI Log Analyzer
          </span>

          <span>
            Built with React ·
            FastAPI · ML · Qwen3
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  onNavigate,
}) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.25em] text-white/20">
        {title}
      </div>

      <div className="mt-4 space-y-3">
        {items.map(
          ([label, target]) => (
            <button
              key={label}
              onClick={() =>
                onNavigate(
                  target
                )
              }
              className="block text-sm text-white/35 transition hover:text-white"
            >
              {label}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Footer;
