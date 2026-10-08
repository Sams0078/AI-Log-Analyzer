import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  CircleHelp,
  Database,
  Server,
  Settings,
  ShieldAlert,
  User,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  WorkspacePanel,
  MiniStat,
  EmptyWorkspace,
  SettingRow,
  HealthCard,
  AdminCard,
  SecurityCard,
  DocCard,
  FeedbackView,
} from "./WorkspaceHelpers";

import {
  getSystems,
  registerSystem,
} from "../services/api";


function formatTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}


function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function WorkspaceView({
  view,
  analysis,
  logs,
  incidents,
  savedInvestigations,
  setSavedInvestigations,
  bookmarks,
  setBookmarks,
  activity,
  loggedIn,
  onLogin,
  onLogout,
  onBack,
  onNavigate,
}) {
  /* ======================================================= */
  /* ADMIN STATE */
  /* ======================================================= */

  const [adminSystems, setAdminSystems] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [registeringSystem, setRegisteringSystem] = useState(false);
  const [createdSystem, setCreatedSystem] = useState(null);

  const [newSystem, setNewSystem] = useState({
    name: "",
    environment: "production",
    source_type: "http",
    endpoint: "",
  });


  /* ======================================================= */
  /* ADMIN FUNCTIONS */
  /* ======================================================= */

  async function loadAdminSystems() {
    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      setAdminError("Admin login required.");
      return;
    }

    try {
      setAdminLoading(true);
      setAdminError("");

      const data = await getSystems(token);

      setAdminSystems(data || []);
    } catch (error) {
      console.error(
        "Failed to load admin systems:",
        error
      );

      setAdminError(
        error.response?.data?.detail ||
          "Failed to load connected systems."
      );
    } finally {
      setAdminLoading(false);
    }
  }


  async function handleRegisterSystem(event) {
    event.preventDefault();

    const token = sessionStorage.getItem("admin_token");

    if (!token) {
      setAdminError("Admin login required.");
      return;
    }

    if (!newSystem.name.trim()) {
      setAdminError("System name is required.");
      return;
    }

    try {
      setRegisteringSystem(true);
      setAdminError("");
      setCreatedSystem(null);

      const result = await registerSystem(token, {
        name: newSystem.name.trim(),
        environment: newSystem.environment,
        source_type: newSystem.source_type,
        endpoint:
          newSystem.endpoint.trim() || null,
      });

      setCreatedSystem(result);

      setNewSystem({
        name: "",
        environment: "production",
        source_type: "http",
        endpoint: "",
      });

      await loadAdminSystems();
    } catch (error) {
      console.error(
        "Failed to register system:",
        error
      );

      setAdminError(
        error.response?.data?.detail ||
          "Failed to register system."
      );
    } finally {
      setRegisteringSystem(false);
    }
  }


  /* ======================================================= */
  /* LOAD ADMIN SYSTEMS WHEN ADMIN PAGE OPENS */
  /* ======================================================= */

  useEffect(() => {
    if (view === "administrator" && loggedIn) {
      loadAdminSystems();
    }
  }, [view, loggedIn]);


  /* ======================================================= */
  /* PAGE TITLES */
  /* ======================================================= */

  const titles = {
    account: {
      eyebrow: "ACCOUNT",
      title: "User Account",
      description:
        "Manage your local workspace identity.",
      icon: User,
    },

    activity: {
      eyebrow: "ACCOUNT",
      title: "Activity",
      description:
        "Recent workspace and investigation activity.",
      icon: Activity,
    },

    saved: {
      eyebrow: "WORKSPACE",
      title: "Saved Investigations",
      description:
        "Investigations you decided to keep for later.",
      icon: BrainCircuit,
    },

    bookmarks: {
      eyebrow: "WORKSPACE",
      title: "Bookmarks",
      description:
        "Important logs and signals marked for later review.",
      icon: CheckCircle2,
    },

    settings: {
      eyebrow: "SYSTEM",
      title: "Settings",
      description:
        "Configure the behavior of your local analyzer workspace.",
      icon: Settings,
    },

    health: {
      eyebrow: "SYSTEM",
      title: "System Health",
      description:
        "Inspect the current state of your analyzer stack.",
      icon: Activity,
    },

    administrator: {
      eyebrow: "ADMINISTRATION",
      title: "Administrator",
      description:
        "Administrative workspace controls.",
      icon: ShieldAlert,
    },

    security: {
      eyebrow: "ADMINISTRATION",
      title: "Audit & Security",
      description:
        "Review security and audit information.",
      icon: ShieldAlert,
    },

    documentation: {
      eyebrow: "SUPPORT",
      title: "Documentation",
      description:
        "Understand how the analyzer transforms telemetry into intelligence.",
      icon: CircleHelp,
    },

    help: {
      eyebrow: "SUPPORT",
      title: "Help & Feedback",
      description:
        "Get help or leave feedback.",
      icon: CircleHelp,
    },
  };


  const current =
    titles[view] ||
    titles.account;

  const Icon =
    current.icon;


  /* ======================================================= */
  /* RENDER */
  /* ======================================================= */

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="mx-auto max-w-[1200px] px-6 py-12 lg:px-10 lg:py-16">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-10 flex items-start justify-between gap-6">
          <div>

            <div className="mb-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-cyan-300/60">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.8)]" />

              {current.eyebrow}
            </div>

            <div className="flex items-center gap-4">

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.025] text-cyan-300/60 sm:flex">
                <Icon size={19} />
              </div>

              <h1 className="text-4xl font-medium tracking-[-0.045em] text-white md:text-5xl">
                {current.title}
              </h1>

            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/30">
              {current.description}
            </p>

          </div>

          <button
            onClick={onBack}
            className="hidden items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] text-white/40 transition hover:border-white/20 hover:text-white sm:flex"
          >
            <ArrowRight
              size={13}
              className="rotate-180"
            />

            Overview
          </button>
        </div>


        {/* ================================================= */}
        {/* ACCOUNT */}
        {/* ================================================= */}

        {view === "account" && (
          <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">

            <WorkspacePanel>

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.04]">
                  <User
                    size={22}
                    className="text-cyan-300"
                  />
                </div>

                <div>

                  <div className="text-sm font-medium text-white/75">
                    {loggedIn
                      ? "Workspace User"
                      : "Guest User"}
                  </div>

                  <div className="mt-1 text-[10px] text-white/25">
                    Local analyzer workspace
                  </div>

                </div>

              </div>

              <div className="mt-8 flex gap-2">

                {!loggedIn ? (
                  <button
                    onClick={onLogin}
                    className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-cyan-200"
                  >
                    Sign in
                  </button>
                ) : (
                  <button
                    onClick={onLogout}
                    className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/45 hover:text-white"
                  >
                    Sign out
                  </button>
                )}

              </div>

            </WorkspacePanel>


            <WorkspacePanel>

              <div className="grid gap-3 sm:grid-cols-3">

                <MiniStat
                  label="Logs"
                  value={logs.length}
                />

                <MiniStat
                  label="Incidents"
                  value={incidents.length}
                />

                <MiniStat
                  label="Saved"
                  value={savedInvestigations.length}
                />

              </div>

            </WorkspacePanel>

          </div>
        )}


        {/* ================================================= */}
        {/* ACTIVITY */}
        {/* ================================================= */}

        {view === "activity" && (
          <WorkspacePanel>

            {activity.length ? (
              <div className="space-y-2">

                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.06] px-4 py-4"
                  >

                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/60" />

                    <div className="flex-1 text-sm text-white/55">
                      {item.label}
                    </div>

                    <div className="font-mono text-[9px] text-white/20">
                      {formatDateTime(
                        item.timestamp
                      )}
                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <EmptyWorkspace
                icon={Activity}
                title="No activity yet"
                description="Workspace activity will appear here as you investigate the system."
              />
            )}

          </WorkspacePanel>
        )}


        {/* ================================================= */}
        {/* SAVED */}
        {/* ================================================= */}

        {view === "saved" && (
          <WorkspacePanel>

            {savedInvestigations.length ? (
              <div className="space-y-3">

                {savedInvestigations.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.012] p-5"
                    >

                      <div className="flex items-start justify-between gap-5">

                        <div>

                          <div className="font-mono text-[9px] uppercase tracking-widest text-cyan-300/50">
                            INC-
                            {String(item.id).padStart(
                              3,
                              "0"
                            )}
                          </div>

                          <div className="mt-2 text-sm text-white/70">
                            {item.title}
                          </div>

                          <div className="mt-2 text-[10px] text-white/20">
                            Saved{" "}
                            {formatDateTime(
                              item.date
                            )}
                          </div>

                        </div>

                        <button
                          onClick={() =>
                            setSavedInvestigations(
                              (items) =>
                                items.filter(
                                  (saved) =>
                                    saved.id !==
                                    item.id
                                )
                            )
                          }
                          className="text-[9px] uppercase tracking-widest text-white/20 hover:text-red-300"
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <EmptyWorkspace
                icon={BrainCircuit}
                title="No saved investigations"
                description="Open an incident and save it when you want to revisit the investigation later."
              />
            )}

          </WorkspacePanel>
        )}


        {/* ================================================= */}
        {/* BOOKMARKS */}
        {/* ================================================= */}

        {view === "bookmarks" && (
          <WorkspacePanel>

            {bookmarks.length ? (
              <div className="space-y-2">

                {bookmarks.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 rounded-xl border border-white/[0.06] p-4"
                    >

                      <div className="mt-1 h-2 w-2 rounded-full bg-cyan-300/60" />

                      <div className="flex-1">

                        <div className="text-sm text-white/65">
                          {item.title}
                        </div>

                        <div className="mt-2 text-xs leading-5 text-white/30">
                          {item.message}
                        </div>

                        <div className="mt-2 font-mono text-[9px] text-white/15">
                          {item.level}{" "}
                          ·{" "}
                          {formatTime(
                            item.timestamp
                          )}
                        </div>

                      </div>

                      <button
                        onClick={() =>
                          setBookmarks(
                            (items) =>
                              items.filter(
                                (bookmark) =>
                                  bookmark.id !==
                                  item.id
                              )
                          )
                        }
                        className="text-[9px] uppercase tracking-widest text-white/20 hover:text-red-300"
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>
            ) : (
              <EmptyWorkspace
                icon={CheckCircle2}
                title="No bookmarks yet"
                description="Mark important events from the overview and they will appear here."
              />
            )}

          </WorkspacePanel>
        )}


        {/* ================================================= */}
        {/* SETTINGS */}
        {/* ================================================= */}

        {view === "settings" && (
          <div className="space-y-3">

            <SettingRow
              title="Local AI"
              description="Local reasoning through Ollama."
              value="Qwen3 4B"
            />

            <SettingRow
              title="Database"
              description="Primary persistence layer for normalized logs."
              value="PostgreSQL"
            />

            <SettingRow
              title="Vector Search"
              description="Historical similarity retrieval."
              value="FAISS"
            />

            <SettingRow
              title="Anomaly Detection"
              description="Behavioral anomaly scoring."
              value="Isolation Forest"
            />

            <SettingRow
              title="Clustering"
              description="Pattern grouping across telemetry."
              value="KMeans"
            />

          </div>
        )}


        {/* ================================================= */}
        {/* HEALTH */}
        {/* ================================================= */}

        {view === "health" && (
          <div className="grid gap-4 md:grid-cols-3">

            <HealthCard
              label="Backend API"
              status={
                analysis
                  ? "Operational"
                  : "Unavailable"
              }
              detail="FastAPI"
              icon={Server}
            />

            <HealthCard
              label="Database"
              status="Configured"
              detail="PostgreSQL"
              icon={Database}
            />

            <HealthCard
              label="Local AI"
              status="Configured"
              detail="Ollama / Qwen3"
              icon={BrainCircuit}
            />

          </div>
        )}


        {/* ================================================= */}
        {/* ADMIN */}
        {/* ================================================= */}

        {view === "administrator" && (
          <div className="space-y-5">

            {!loggedIn ? (
              <WorkspacePanel>

                <div className="text-sm text-white/55">
                  Administrator access requires an active admin session.
                </div>

                <button
                  onClick={onLogin}
                  className="mt-5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-cyan-200"
                >
                  Sign in
                </button>

              </WorkspacePanel>
            ) : (
              <>

                {/* ADMIN SUMMARY */}

                <div className="grid gap-4 md:grid-cols-2">

                  <AdminCard
                    title="Workspace administration"
                    description="Manage connected systems and privileged analyzer operations."
                  />

                  <AdminCard
                    title="Model controls"
                    description="Review local AI configuration and model availability."
                  />

                  <AdminCard
                    title="Data management"
                    description={`${logs.length} logs and ${incidents.length} incidents are currently available.`}
                  />

                  <AdminCard
                    title="Access control"
                    description="JWT-protected administrator session is active."
                  />

                </div>


                {/* CONNECTED SYSTEMS */}

                <WorkspacePanel>

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <div className="text-sm font-medium text-white/75">
                        Connected systems
                      </div>

                      <div className="mt-1 text-xs text-white/25">
                        Systems registered for log ingestion.
                      </div>

                    </div>

                    <button
                      onClick={loadAdminSystems}
                      disabled={adminLoading}
                      className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest text-white/45 hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {adminLoading
                        ? "Loading..."
                        : "Refresh"}
                    </button>

                  </div>


                  {/* ERROR */}

                  {adminError && (
                    <div className="mt-5 rounded-xl border border-red-400/10 bg-red-400/[0.03] px-4 py-3 text-xs text-red-300/70">
                      {adminError}
                    </div>
                  )}


                  {/* REGISTER FORM */}

                  <form
                    onSubmit={handleRegisterSystem}
                    className="mt-6 grid gap-3 md:grid-cols-2"
                  >

                    <input
                      value={newSystem.name}
                      onChange={(event) =>
                        setNewSystem(
                          (current) => ({
                            ...current,
                            name: event.target.value,
                          })
                        )
                      }
                      placeholder="System name"
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
                    />


                    <select
                      value={newSystem.environment}
                      onChange={(event) =>
                        setNewSystem(
                          (current) => ({
                            ...current,
                            environment:
                              event.target.value,
                          })
                        )
                      }
                      className="rounded-xl border border-white/[0.08] bg-[#080808] px-4 py-3 text-xs text-white/60 outline-none"
                    >
                      <option value="production">
                        production
                      </option>

                      <option value="staging">
                        staging
                      </option>

                      <option value="development">
                        development
                      </option>
                    </select>


                    <select
                      value={newSystem.source_type}
                      onChange={(event) =>
                        setNewSystem(
                          (current) => ({
                            ...current,
                            source_type:
                              event.target.value,
                          })
                        )
                      }
                      className="rounded-xl border border-white/[0.08] bg-[#080808] px-4 py-3 text-xs text-white/60 outline-none"
                    >
                      <option value="http">
                        http
                      </option>

                      <option value="agent">
                        agent
                      </option>

                      <option value="database">
                        database
                      </option>

                      <option value="file">
                        file
                      </option>
                    </select>


                    <input
                      value={newSystem.endpoint}
                      onChange={(event) =>
                        setNewSystem(
                          (current) => ({
                            ...current,
                            endpoint:
                              event.target.value,
                          })
                        )
                      }
                      placeholder="Endpoint (optional)"
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-cyan-300/30"
                    />


                    <button
                      type="submit"
                      disabled={
                        registeringSystem
                      }
                      className="rounded-full bg-white px-4 py-3 text-xs font-semibold text-black hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40 md:col-span-2"
                    >
                      {registeringSystem
                        ? "Registering..."
                        : "Register system"}
                    </button>

                  </form>


                  {/* NEW INGESTION KEY */}

                  {createdSystem?.ingestion_key && (
                    <div className="mt-5 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.025] p-4">

                      <div className="text-[9px] uppercase tracking-widest text-cyan-300/50">
                        Ingestion key
                      </div>

                      <div className="mt-2 break-all font-mono text-xs text-white/65">
                        {createdSystem.ingestion_key}
                      </div>

                      <div className="mt-3 text-[10px] leading-5 text-white/25">
                        Save this key now. It is only returned during system registration.
                      </div>

                    </div>
                  )}


                  {/* SYSTEM LIST */}

                  <div className="mt-6 space-y-2">

                    {adminLoading ? (
                      <div className="py-8 text-center text-xs text-white/25">
                        Loading connected systems...
                      </div>
                    ) : adminSystems.length ? (

                      adminSystems.map(
                        (system) => (
                          <div
                            key={system.id}
                            className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] px-4 py-4"
                          >

                            <div>

                              <div className="text-sm text-white/70">
                                {system.name}
                              </div>

                              <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/20">
                                {system.environment}
                                {" · "}
                                {system.source_type}
                              </div>

                              {system.endpoint && (
                                <div className="mt-1 max-w-[500px] truncate text-[10px] text-white/20">
                                  {system.endpoint}
                                </div>
                              )}

                            </div>


                            <div className="shrink-0 text-[9px] uppercase tracking-widest text-cyan-300/50">
                              {system.status ||
                                "ready"}
                            </div>

                          </div>
                        )
                      )

                    ) : (
                      <div className="py-8 text-center text-xs text-white/25">
                        No connected systems yet.
                      </div>
                    )}

                  </div>

                </WorkspacePanel>

              </>
            )}

          </div>
        )}


        {/* ================================================= */}
        {/* SECURITY */}
        {/* ================================================= */}

        {view === "security" && (
          <WorkspacePanel>

            <div className="grid gap-4 md:grid-cols-2">

              <SecurityCard
                title="Authentication"
                value={
                  loggedIn
                    ? "Signed in"
                    : "Guest"
                }
              />

              <SecurityCard
                title="Local storage"
                value="Enabled"
              />

              <SecurityCard
                title="API transport"
                value="Local network"
              />

              <SecurityCard
                title="Audit events"
                value={`${activity.length} recorded`}
              />

            </div>

          </WorkspacePanel>
        )}


        {/* ================================================= */}
        {/* DOCUMENTATION */}
        {/* ================================================= */}

        {view === "documentation" && (
          <div className="grid gap-4 md:grid-cols-2">

            <DocCard
              number="01"
              title="Ingestion"
              text="Upload .log, .txt or .json events into the analyzer."
            />

            <DocCard
              number="02"
              title="Normalization"
              text="Different log formats are converted into a common schema."
            />

            <DocCard
              number="03"
              title="Detection"
              text="Isolation Forest identifies unusual behavioral patterns."
            />

            <DocCard
              number="04"
              title="Correlation"
              text="Related anomalies are grouped into incidents."
            />

            <DocCard
              number="05"
              title="Retrieval"
              text="FAISS retrieves historically similar events."
            />

            <DocCard
              number="06"
              title="Reasoning"
              text="Local Qwen3 reasons over evidence and historical context."
            />

          </div>
        )}


        {/* ================================================= */}
        {/* HELP */}
        {/* ================================================= */}

        {view === "help" && (
          <FeedbackView />
        )}


        {/* ================================================= */}
        {/* MOBILE BACK */}
        {/* ================================================= */}

        <button
          onClick={onBack}
          className="mt-8 flex items-center gap-2 text-[10px] text-white/25 sm:hidden"
        >

          <ArrowRight
            size={13}
            className="rotate-180"
          />

          Back to overview

        </button>

      </section>
    </main>
  );
}


export default WorkspaceView;