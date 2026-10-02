import { Server } from "lucide-react";

function ServiceNode({ service, index }) {
  const rate =
    service.total > 0
      ? ((service.anomalies / service.total) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="group min-h-[205px] p-6 transition hover:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/10 text-cyan-300/50">
          <Server size={16} />
        </div>

        <span className="font-mono text-[9px] text-white/15">
          0{index + 1}
        </span>
      </div>

      <div className="mt-7 text-sm text-white/60">
        {service.name}
      </div>

      <div className="mt-2 text-[10px] text-white/20">
        {new Intl.NumberFormat("en-US").format(service.total)} events
      </div>

      <div className="mt-4 h-px bg-white/[0.06]">
        <div
          className="h-px bg-cyan-300/40"
          style={{
            width: `${Math.min(Number(rate), 100)}%`,
          }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[9px] uppercase tracking-widest text-white/15">
        <span>anomaly rate</span>

        <span>{rate}%</span>
      </div>
    </div>
  );
}

export default ServiceNode;