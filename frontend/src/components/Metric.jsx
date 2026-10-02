function Metric({
  label,
  value,
  detail,
  alert,
}) {
  return (
    <div className="border-r border-white/[0.07] px-5 py-6 last:border-r-0">
      <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/25">
        {alert && (
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        )}

        {label}
      </div>

      <div className="mt-3 text-2xl font-medium tracking-tight text-white/80">
        {value}
      </div>

      <div className="mt-1 text-[10px] text-white/20">
        {detail}
      </div>
    </div>
  );
}

export default Metric;
