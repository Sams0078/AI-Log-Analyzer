import { useState } from "react";
import { ArrowRight, X } from "lucide-react";

function LoginModal({
  onClose,
  onLogin,
}) {
  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  function submit(
    event
  ) {
    event.preventDefault();

    if (
      !username.trim() ||
      !password.trim()
    ) {
      setError(
        "Enter your username and password."
      );
      return;
    }

    const success =
      onLogin(
        username,
        password
      );

    if (!success) {
      setError(
        "Unable to sign in."
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-5 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#0a0a0a] p-7 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-cyan-300/60">
              Workspace access
            </div>

            <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
              Sign in
            </h2>

            <p className="mt-2 text-xs leading-5 text-white/25">
              Access your analyzer
              workspace and
              administrative controls.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/25 transition hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <form
          onSubmit={
            submit
          }
          className="mt-8 space-y-4"
        >
          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-white/25">
              Username
            </label>

            <input
              value={
                username
              }
              onChange={(
                event
              ) =>
                setUsername(
                  event.target
                    .value
                )
              }
              placeholder="admin"
              className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/15 focus:border-cyan-300/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-white/25">
              Password
            </label>

            <input
              type="password"
              value={
                password
              }
              onChange={(
                event
              ) =>
                setPassword(
                  event.target
                    .value
                )
              }
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/15 focus:border-cyan-300/30"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-300/10 bg-red-300/[0.03] px-3 py-2 text-xs text-red-300/70">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-semibold text-black transition hover:bg-cyan-200"
          >
            Continue

            <ArrowRight
              size={14}
            />
          </button>
        </form>

        <div className="mt-5 text-center text-[9px] leading-5 text-white/15">
          UI authentication
          state only. Connect
          FastAPI + JWT before
          production use.
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
