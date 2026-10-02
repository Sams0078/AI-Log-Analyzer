import { BrainCircuit, Sparkles } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
      <div className="text-[9px] uppercase tracking-[0.3em] text-cyan-300/45">
        {eyebrow}
      </div>

      <div>
        <h2 className="text-3xl font-medium tracking-[-0.04em] text-white/80 md:text-5xl">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/30">
          {description}
        </p>
      </div>
    </div>
  );
}

export function AIPlaceholder() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.03]">
        <BrainCircuit
          size={21}
          className="text-cyan-300/60"
        />
      </div>

      <div className="mt-5 text-sm text-white/50">
        AI reasoning output
      </div>

      <p className="mt-2 max-w-sm text-xs leading-5 text-white/25">
        Select an incident and ask
        the local model to explain
        the evidence, likely cause,
        impact, and next action.
      </p>
    </div>
  );
}

export function AIThinking() {
  return (
    <div className="flex min-h-[300px] flex-col justify-center">
      <div className="flex items-center gap-3 text-sm text-cyan-300/70">
        <Sparkles size={15} />

        Qwen3 is reasoning over
        incident evidence...
      </div>

      <div className="mt-6 space-y-2">
        <div className="ai-skeleton w-[80%]" />
        <div className="ai-skeleton w-[65%]" />
        <div className="ai-skeleton w-[90%]" />
        <div className="ai-skeleton w-[45%]" />
      </div>
    </div>
  );
}

export function AIResult({ result }) {
  const text =
    result.ai_analysis ||
    result.analysis ||
    "";

  return (
    <div className="max-h-[420px] overflow-y-auto">
      <div className="mb-5 flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-cyan-300/60">
        <Sparkles size={13} />

        AI analysis
      </div>

      <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-white/65">
        {text || "No AI analysis returned."}
      </pre>
    </div>
  );
}