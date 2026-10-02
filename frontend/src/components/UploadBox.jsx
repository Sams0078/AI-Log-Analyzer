import { useRef, useState } from "react";
import {
  CheckCircle2,
  FileUp,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";

function UploadBox({
  onUpload,
  loading = false,
  result = null,
  error = null,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const file = files?.[0];

    if (!file) return;

    const allowed = [".log", ".txt", ".json"];
    const valid = allowed.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!valid) {
      return;
    }

    onUpload?.(file);
  };

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.018] p-4">
      <input
        ref={inputRef}
        type="file"
        accept=".log,.txt,.json"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`flex min-h-44 w-full flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center transition ${
          dragging
            ? "border-cyan-300/40 bg-cyan-300/[0.05]"
            : "border-white/[0.09] bg-black/10 hover:border-cyan-300/20 hover:bg-white/[0.02]"
        }`}
      >
        {loading ? (
          <>
            <Loader2
              size={22}
              className="animate-spin text-cyan-300"
            />

            <div className="mt-4 text-[10px] uppercase tracking-[0.15em] text-white/60">
              Processing logs
            </div>

            <div className="mt-1 text-[8px] text-white/20">
              Parsing · Normalizing · Analyzing
            </div>
          </>
        ) : result ? (
          <>
            <CheckCircle2 size={22} className="text-cyan-300" />

            <div className="mt-4 text-[10px] uppercase tracking-[0.15em] text-white/60">
              Upload complete
            </div>

            <div className="mt-1 text-[8px] text-white/25">
              {result.logs_processed ?? 0} logs processed
            </div>
          </>
        ) : (
          <>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04]">
              <UploadCloud size={19} className="text-cyan-300/70" />
            </div>

            <div className="mt-4 text-[10px] font-medium uppercase tracking-[0.15em] text-white/60">
              Drop logs here
            </div>

            <div className="mt-1 text-[8px] text-white/20">
              or click to browse
            </div>

            <div className="mt-4 flex items-center gap-2">
              {[".LOG", ".TXT", ".JSON"].map((type) => (
                <span
                  key={type}
                  className="rounded border border-white/[0.06] px-2 py-1 text-[7px] tracking-[0.12em] text-white/25"
                >
                  {type}
                </span>
              ))}
            </div>
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-300/10 bg-red-300/[0.04] p-3 text-[9px] text-red-300/70">
          <X size={12} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 text-[8px] text-white/15">
        <FileUp size={11} />
        Supported formats: LOG, TXT, JSON
      </div>
    </div>
  );
}

export default UploadBox;