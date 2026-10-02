import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleHelp,
  ShieldAlert,
} from "lucide-react";

export function WorkspacePanel({ children }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 shadow-[0_20px_70px_rgba(0,0,0,.18)]">
      {children}
    </div>
  );
}

export function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
      <div className="text-[9px] uppercase tracking-[0.2em] text-white/20">
        {label}
      </div>

      <div className="mt-3 text-2xl font-medium text-white/80">
        {value}
      </div>
    </div>
  );
}

export function EmptyWorkspace({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.03] text-cyan-300/50">
        <Icon size={20} />
      </div>

      <div className="mt-5 text-sm font-medium text-white/60">
        {title}
      </div>

      <p className="mt-2 max-w-md text-xs leading-6 text-white/25">
        {description}
      </p>
    </div>
  );
}

export function SettingRow({
  title,
  description,
  value,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm text-white/65">
          {title}
        </div>

        <div className="mt-1 text-[10px] leading-5 text-white/25">
          {description}
        </div>
      </div>

      <div className="rounded-lg border border-white/[0.07] px-3 py-2 font-mono text-[9px] text-cyan-300/60">
        {value}
      </div>
    </div>
  );
}

export function HealthCard({
  label,
  status,
  detail,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-cyan-300/60">
          <Icon size={16} />
        </div>

        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.8)]" />
      </div>

      <div className="mt-8 text-[9px] uppercase tracking-[0.2em] text-white/20">
        {label}
      </div>

      <div className="mt-2 text-sm text-white/65">
        {status}
      </div>

      <div className="mt-1 text-[10px] text-white/20">
        {detail}
      </div>
    </div>
  );
}

export function AdminCard({
  title,
  description,
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-5">
      <div className="flex items-center gap-3">
        <ShieldAlert
          size={15}
          className="text-cyan-300/50"
        />

        <div className="text-sm text-white/60">
          {title}
        </div>
      </div>

      <p className="mt-3 text-xs leading-6 text-white/25">
        {description}
      </p>
    </div>
  );
}

export function SecurityCard({
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-5">
      <div className="text-[9px] uppercase tracking-[0.2em] text-white/20">
        {title}
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
        {value}
      </div>
    </div>
  );
}

export function DocCard({
  number,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 transition hover:bg-white/[0.025]">
      <div className="flex items-center justify-between">
        <div className="text-[9px] uppercase tracking-[0.25em] text-cyan-300/50">
          {number}
        </div>

        <ArrowUpRight
          size={14}
          className="text-white/15"
        />
      </div>

      <div className="mt-8 text-sm font-medium text-white/65">
        {title}
      </div>

      <p className="mt-3 text-xs leading-6 text-white/25">
        {text}
      </p>
    </div>
  );
}

export function FeedbackView() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (!feedback.trim()) {
      return;
    }

    localStorage.setItem(
      "ai-log-feedback",
      feedback
    );

    setFeedback("");
    setSubmitted(true);
  }

  return (
    <WorkspacePanel>
      {/* yahan tumhara existing FeedbackView JSX exactly same rahega */}
    </WorkspacePanel>
  );
}