function StatusCard({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-cyan-300/60">
          <Icon
            size={16}
          />
        </div>

        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.8)]" />
      </div>

      <div className="mt-7 text-[9px] uppercase tracking-[0.2em] text-white/20">
        {label}
      </div>

      <div className="mt-2 text-sm text-white/65">
        {value}
      </div>

      <div className="mt-1 text-[10px] text-white/20">
        {detail}
      </div>
    </div>
  );
}

export default StatusCard;
