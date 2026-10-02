function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-technical-grid opacity-30" />

      <div className="ai-ambient ai-ambient-one" />
      <div className="ai-ambient ai-ambient-two" />

      <div className="signal-field">
        <span className="signal-node node-1" />
        <span className="signal-node node-2" />
        <span className="signal-node node-3" />
        <span className="signal-node node-4" />
        <span className="signal-node node-5" />

        <span className="signal-line line-1" />
        <span className="signal-line line-2" />
        <span className="signal-line line-3" />

        <span className="signal-pulse pulse-1" />
        <span className="signal-pulse pulse-2" />
      </div>

      <div className="data-particles">
        {Array.from({
          length: 14,
        }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="system-scanner" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_90%)]" />
    </div>
  );
}

export default GlobalBackground;