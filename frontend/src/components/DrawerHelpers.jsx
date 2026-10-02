export function DrawerMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.07] p-4">
      <div className="text-[9px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </div>

      <div className="mt-2 text-xl text-white/75">
        {value}
      </div>
    </div>
  );
}

export function DrawerTitle({ title }) {
  return (
    <div className="text-[9px] uppercase tracking-[0.25em] text-white/25">
      {title}
    </div>
  );
}