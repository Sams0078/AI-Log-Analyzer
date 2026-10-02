import {
  Activity,
  BrainCircuit,
  Layers3,
  Search,
  Server,
  Terminal,
} from "lucide-react";

import UploadBox from "./UploadBox";
import { SectionHeader } from "./AIComponents";

function PipelineSection({
  onUpload,
  loading,
  result,
  error,
}) {
  const steps = [
    {
      number: "01",
      title: "Ingest",
      text: "Upload .log, .txt or .json events.",
      icon: Terminal,
    },
    {
      number: "02",
      title: "Normalize",
      text: "Convert different log formats into one schema.",
      icon: Layers3,
    },
    {
      number: "03",
      title: "Detect",
      text: "Isolation Forest scores unusual behavior.",
      icon: Activity,
    },
    {
      number: "04",
      title: "Correlate",
      text: "Related anomalies become incidents.",
      icon: Server,
    },
    {
      number: "05",
      title: "Retrieve",
      text: "FAISS finds historically similar events.",
      icon: Search,
    },
    {
      number: "06",
      title: "Reason",
      text: "Local Qwen3 explains evidence and cause.",
      icon: BrainCircuit,
    },
  ];

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10">
      <SectionHeader
        eyebrow="Analysis pipeline / 07"
        title="From raw logs to reasoning."
        description="The complete local-first path used to transform telemetry into actionable intelligence."
      />

      <div className="mt-10">
        <UploadBox
          onUpload={onUpload}
          loading={loading}
          result={result}
          error={error}
        />
      </div>

      <div className="mt-10 overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.012]">
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group min-h-[230px] border-b border-white/[0.06] p-7 transition hover:bg-white/[0.02] md:nth-[2n]:border-l md:lg:nth-[3n]:border-l"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.025] text-cyan-300/60 transition group-hover:border-cyan-300/25 group-hover:text-cyan-300">
                    <Icon size={17} />
                  </div>

                  <span className="font-mono text-[9px] text-cyan-300/30">
                    {step.number}
                  </span>
                </div>

                <div className="mt-9 text-sm font-medium text-white/60">
                  {step.title}
                </div>

                <p className="mt-2 max-w-xs text-xs leading-5 text-white/30">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PipelineSection;