import ErrorChart from "./charts/ErrorChart";

import LogLevelChart from "./charts/LogLevelChart";

import ServiceChart from "./charts/ServiceChart";

import Dashboard from "./pages/Dashboard";

import { useEffect, useMemo, useState } from "react";

import Navbar from "./components/Navbar";

import UploadBox from "./components/UploadBox";

import AnomalyCard, { LevelBadge } from "./components/AnomalyCard";

import IncidentRow from "./components/IncidentRow";

import IncidentDrawer from "./components/IncidentDrawer";

import PipelineSection from "./components/PipelineSection";

import MenuOverlay from "./components/MenuOverlay";

import LoginModal from "./components/LoginModal";
import Header from "./components/Header";
import GlobalBackground from "./components/GlobalBackground";
import Metric from "./components/Metric";
import WorkspaceView from "./components/WorkspaceView";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import StatusCard from "./components/StatusCard";
import SignalPill from "./components/SignalPill";
import ServiceNode from "./components/ServiceNode";

import {
  EmptyRow,
  formatTime,
  formatDateTime,
  totalFormat,
  getViewTitle,
} from "./utils/appUtils";

import {
  DrawerMetric,
  DrawerTitle,
} from "./components/DrawerHelpers";

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
} from "./components/WorkspaceHelpers";

import {
  SectionHeader,
  AIPlaceholder,
  AIThinking,
  AIResult,
} from "./components/AIComponents";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Database,
  Github,
  Layers3,
  Menu,
  Search,
  Server,
  Settings,
  ShieldAlert,
  Sparkles,
  Terminal,
  User,
  X,
  Zap,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api, {
  analyzeIncidentWithAI,
  getAnalysis,
} from "./services/api";

/* ========================================================= */
/* CONSTANTS */
/* ========================================================= */

/* ========================================================= */
/* MENU GROUPS */
/* ========================================================= */

const MENU_GROUPS = [
  {
    title: "ACCOUNT",
    items: [
      {
        number: "01",
        label: "User Account",
        key: "account",
        description: "Manage your workspace identity and preferences.",
        icon: User,
      },
      {
        number: "02",
        label: "Activity",
        key: "activity",
        description: "Review recent workspace activity.",
        icon: Activity,
      },
    ],
  },

  {
    title: "WORKSPACE",
    items: [
      {
        number: "03",
        label: "Overview",
        key: "overview",
        description: "Return to the observability command center.",
        icon: Layers3,
      },
      {
        number: "04",
        label: "Saved Investigations",
        key: "saved",
        description: "Keep important investigations for later.",
        icon: BrainCircuit,
      },
      {
        number: "05",
        label: "Bookmarks",
        key: "bookmarks",
        description: "Mark important logs and incidents.",
        icon: CheckCircle2,
      },
    ],
  },

  {
    title: "SYSTEM",
    items: [
      {
        number: "06",
        label: "Settings",
        key: "settings",
        description: "Configure your local analyzer workspace.",
        icon: Settings,
      },
      {
        number: "07",
        label: "System Health",
        key: "health",
        description: "Inspect API, database and AI availability.",
        icon: Server,
      },
    ],
  },

  {
    title: "ADMINISTRATION",
    items: [
      {
        number: "08",
        label: "Administrator",
        key: "administrator",
        description: "Administrative workspace controls.",
        icon: ShieldAlert,
      },
      {
        number: "09",
        label: "Audit & Security",
        key: "security",
        description: "Review security and audit information.",
        icon: ShieldAlert,
      },
    ],
  },

  {
    title: "SUPPORT",
    items: [
      {
        number: "10",
        label: "Documentation",
        key: "documentation",
        description: "Understand the analyzer and its pipeline.",
        icon: CircleHelp,
      },
      {
        number: "11",
        label: "Help & Feedback",
        key: "help",
        description: "Get help or leave feedback.",
        icon: CircleHelp,
      },
    ],
  },
];

/* ========================================================= */
/* APP */
/* ========================================================= */

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const [activeView, setActiveView] = useState("overview");

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const [selectedIncident, setSelectedIncident] = useState(null);

  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [savedInvestigations, setSavedInvestigations] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("ai-log-saved-investigations") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("ai-log-bookmarks") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [activity, setActivity] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("ai-log-activity") || "[]"
      );
    } catch {
      return [];
    }
  });

  /* ------------------------------------------------------- */
  /* INITIAL LOAD */
  /* ------------------------------------------------------- */

  useEffect(() => {
    loadAnalysis();
  }, []);

  /* ------------------------------------------------------- */
  /* PERSIST LOCAL WORKSPACE */
  /* ------------------------------------------------------- */

  useEffect(() => {
    localStorage.setItem(
      "ai-log-saved-investigations",
      JSON.stringify(savedInvestigations)
    );
  }, [savedInvestigations]);

  useEffect(() => {
    localStorage.setItem(
      "ai-log-bookmarks",
      JSON.stringify(bookmarks)
    );
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(
      "ai-log-activity",
      JSON.stringify(activity.slice(0, 50))
    );
  }, [activity]);

  /* ------------------------------------------------------- */
  /* KEYBOARD */
  /* ------------------------------------------------------- */

  useEffect(() => {
    const handler = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
        setMenuOpen(false);
        setLoginOpen(false);
        setSelectedIncident(null);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  /* ------------------------------------------------------- */
  /* DATA */
  /* ------------------------------------------------------- */

  async function loadAnalysis() {
    try {
      setLoading(true);
      setApiError("");

      const data = await getAnalysis();

      setAnalysis(data);

      addActivity("Analysis data refreshed");
    } catch (error) {
      console.error(error);
      setApiError(
        "Backend unavailable. Showing the local interface."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogUpload(file) {
    try {
      setUploadLoading(true);
      setUploadError("");
      setUploadResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/logs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadResult(response.data);

      await loadAnalysis();
    } catch (error) {
      console.error(error);

      setUploadError(
        error.response?.data?.detail ||
          "Failed to upload logs. Please check the backend."
      );
    } finally {
      setUploadLoading(false);
    }
  }

  /* ------------------------------------------------------- */
  /* ACTIVITY */
  /* ------------------------------------------------------- */

  function addActivity(label) {
    setActivity((items) => [
      {
        id: Date.now(),
        label,
        timestamp: new Date().toISOString(),
      },
      ...items,
    ].slice(0, 50));
  }

  /* ------------------------------------------------------- */
  /* NAVIGATION */
  /* ------------------------------------------------------- */

  function navigateTo(target) {
    setMenuOpen(false);
    setCommandOpen(false);

    if (target === "overview") {
      setActiveView("overview");

      window.setTimeout(() => {
        document
          .getElementById("system")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 50);

      return;
    }

    setActiveView(target);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    addActivity(
      `Opened ${getViewTitle(target)}`
    );
  }

  function navigateToSection(id) {
    setActiveView("overview");
    setMenuOpen(false);
    setCommandOpen(false);

    window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  /* ------------------------------------------------------- */
  /* LOGIN */
  /* ------------------------------------------------------- */

  function handleLogin(username, password) {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    /*
     * Frontend-only login state for now.
     *
     * Real authentication should later be connected
     * to FastAPI + JWT + environment credentials.
     */

    setLoggedIn(true);
    setLoginOpen(false);

    addActivity("Signed in to workspace");

    return true;
  }

  function handleLogout() {
    setLoggedIn(false);
    addActivity("Signed out of workspace");
  }

  /* ------------------------------------------------------- */
  /* AI */
  /* ------------------------------------------------------- */

  async function handleAIAnalysis(incident) {
    try {
      setAiLoading(true);
      setAiError("");
      setAiResult(null);

      addActivity(
        `Started AI investigation for incident ${incident.incident_id}`
      );

      const result = await analyzeIncidentWithAI(
        incident
      );

      setAiResult(result);

      addActivity(
        `AI investigation completed for incident ${incident.incident_id}`
      );
    } catch (error) {
      console.error(error);

      setAiError(
        "AI analysis failed. Check Ollama and the backend."
      );
    } finally {
      setAiLoading(false);
    }
  }

  /* ------------------------------------------------------- */
  /* SAVE INVESTIGATION */
  /* ------------------------------------------------------- */

  function saveInvestigation(incident) {
    const id = incident.incident_id;

    const exists = savedInvestigations.some(
      (item) => item.id === id
    );

    if (exists) {
      setSavedInvestigations((items) =>
        items.filter((item) => item.id !== id)
      );

      addActivity(
        `Removed incident ${id} from saved investigations`
      );

      return;
    }

    const item = {
      id,
      title:
        incident.services?.join(" · ") ||
        `Incident ${id}`,
      date: new Date().toISOString(),
      incident,
    };

    setSavedInvestigations((items) => [
      item,
      ...items,
    ]);

    addActivity(
      `Saved investigation ${id}`
    );
  }

  /* ------------------------------------------------------- */
  /* BOOKMARK */
  /* ------------------------------------------------------- */

  function toggleBookmark(log) {
    const exists = bookmarks.some(
      (item) => item.id === log.id
    );

    if (exists) {
      setBookmarks((items) =>
        items.filter((item) => item.id !== log.id)
      );

      addActivity(
        `Removed log ${log.id} from bookmarks`
      );

      return;
    }

    const item = {
      id: log.id,
      title:
        log.service ||
        "Unknown service",
      message:
        log.message ||
        "No message",
      level:
        log.level ||
        "UNKNOWN",
      timestamp:
        log.timestamp ||
        null,
    };

    setBookmarks((items) => [
      item,
      ...items,
    ]);

    addActivity(
      `Bookmarked log ${log.id}`
    );
  }

  /* ------------------------------------------------------- */
  /* DERIVED DATA */
  /* ------------------------------------------------------- */

  const logs = analysis?.logs || [];
  const incidents = analysis?.incidents || [];

  const anomalyLogs = useMemo(
    () =>
      logs.filter(
        (log) => log.is_anomaly === 1
      ),
    [logs]
  );

  const services = useMemo(() => {
    const map = {};

    logs.forEach((log) => {
      const service =
        log.service || "unknown";

      if (!map[service]) {
        map[service] = {
          name: service,
          total: 0,
          anomalies: 0,
        };
      }

      map[service].total += 1;

      if (log.is_anomaly === 1) {
        map[service].anomalies += 1;
      }
    });

    return Object.values(map);
  }, [logs]);

  const criticalCount = logs.filter(
    (log) =>
      log.level === "CRITICAL" ||
      log.level === "ERROR"
  ).length;

  const warningCount = logs.filter(
    (log) =>
      log.level === "WARNING"
  ).length;

  const anomalyRate =
    logs.length > 0
      ? (
          (anomalyLogs.length /
            logs.length) *
          100
        ).toFixed(1)
      : "0.0";

  const chartData = useMemo(() => {
    const timestamped = logs
      .filter((log) => log.timestamp)
      .map((log) => ({
        ...log,
        date: new Date(log.timestamp),
      }))
      .filter((log) => !Number.isNaN(log.date.getTime()))
      .sort((a, b) => a.date - b.date);

    if (!timestamped.length) {
      return [];
    }

    const buckets = new Map();

    timestamped.forEach((log) => {
      const date = log.date;
      const bucketMinute = Math.floor(date.getMinutes() / 15) * 15;
      const bucket = new Date(date);
      bucket.setMinutes(bucketMinute, 0, 0);

      const key = bucket.getTime();

      if (!buckets.has(key)) {
        buckets.set(key, {
          timestamp: key,
          time: bucket.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          value: 0,
          events: 0,
        });
      }

      const item = buckets.get(key);
      item.events += 1;

      if (Number(log.is_anomaly) === 1) {
        item.value += 1;
      }
    });

    return Array.from(buckets.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }, [logs]);

  /* ------------------------------------------------------- */
  /* SEARCH */
  /* ------------------------------------------------------- */

  const filteredLogs = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) {
      return logs;
    }

    return logs.filter((log) => {
      return (
        String(log.message || "")
          .toLowerCase()
          .includes(query) ||
        String(log.service || "")
          .toLowerCase()
          .includes(query) ||
        String(log.level || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [logs, searchQuery]);

  /* ======================================================= */
  /* RENDER */
  /* ======================================================= */

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-300 selection:text-black">
      <GlobalBackground />

      <div className="relative z-10">
        {/* HEADER */}
        <Header
          onMenu={() =>
            setMenuOpen(true)
          }
          onCommand={() =>
            setCommandOpen(true)
          }
          onLogin={() =>
            setLoginOpen(true)
          }
          loggedIn={loggedIn}
          onLogout={handleLogout}
          onNavigate={navigateToSection}
        />

        {/* MAIN */}
        {activeView === "overview" ? (
          <Dashboard>
            {/* ================================================= */}
            {/* HERO */}
            {/* ================================================= */}

            <section
              id="system"
              className="mx-auto max-w-[1440px] px-6 pb-20 pt-16 lg:px-10 lg:pt-20"
            >
              <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_.85fr]">
                <div>
                  <div className="mb-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-300/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.9)]" />

                    Intelligent observability / 01
                  </div>

                  <h1 className="max-w-5xl text-[clamp(3.5rem,6.5vw,6.5rem)] font-semibold leading-[0.86] tracking-[-0.075em]">
                    Your logs
                    <br />
                    know what
                    <br />
                    happened.
                  </h1>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() =>
                        navigateToSection(
                          "incidents"
                        )
                      }
                      className="group flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200"
                    >
                      Start investigation

                      <ArrowUpRight
                        size={16}
                        className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </button>

                    <button
                      onClick={() =>
                        navigateToSection(
                          "topology"
                        )
                      }
                      className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/55 transition hover:border-white/20 hover:text-white"
                    >
                      See architecture

                      <ChevronRight
                        size={15}
                      />
                    </button>
                  </div>

                  {apiError && (
                    <div className="mt-5 flex items-center gap-2 text-xs text-amber-300/80">
                      <CircleHelp
                        size={14}
                      />

                      {apiError}
                    </div>
                  )}
                </div>

                <div className="pb-1 lg:pl-12">
                  <div className="border-l border-white/10 pl-6">
                    <div className="mb-3 text-[9px] uppercase tracking-[0.3em] text-white/25">
                      Autonomous observability
                    </div>

                    <p className="max-w-lg text-lg leading-7 tracking-tight text-white/55">
                      Detect abnormal behavior,
                      connect incidents, retrieve
                      historical patterns, and let
                      local AI explain what changed
                      inside your systems.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2">
                      <SignalPill label="LOCAL AI" />
                      <SignalPill label="ML DETECTION" />
                      <SignalPill label="RAG" />
                      <SignalPill label="POSTGRES" />
                    </div>
                  </div>
                </div>
              </div>

              {/* METRICS */}
              <div className="mt-32 grid border-y border-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
                <Metric
                  label="Logs processed"
                  value={
                    loading
                      ? "—"
                      : totalFormat(
                          logs.length
                        )
                  }
                  detail="events in analysis"
                />

                <Metric
                  label="Anomalies"
                  value={
                    loading
                      ? "—"
                      : totalFormat(
                          anomalyLogs.length
                        )
                  }
                  detail={`${anomalyRate}% detected`}
                  alert={
                    anomalyLogs.length > 0
                  }
                />

                <Metric
                  label="Incidents"
                  value={
                    loading
                      ? "—"
                      : totalFormat(
                          incidents.length
                        )
                  }
                  detail="correlated events"
                />

                <Metric
                  label="Errors / critical"
                  value={
                    loading
                      ? "—"
                      : totalFormat(
                          criticalCount
                        )
                  }
                  detail={`${warningCount} warnings`}
                  alert={
                    criticalCount > 0
                  }
                />
              </div>
            </section>

            {/* ================================================= */}
            {/* LIVE SYSTEM */}
            {/* ================================================= */}

            <section
              id="live"
              className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10"
            >
              <SectionHeader
                eyebrow="System state / 02"
                title="What is happening now."
                description="A compact operational view of the signals detected across your logs."
              />

              <div className="mt-8 grid gap-4 lg:grid-cols-[1.45fr_.55fr]">
                <div className="glass-panel overflow-hidden p-5">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">
                        Anomaly activity
                      </div>

                      <div className="mt-1 text-xs text-white/30">
                        Detected anomalous
                        events over time
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-300/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      analysis
                    </div>
                  </div>

                  <div className="h-[250px]">
                    {chartData.length ? (
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <BarChart
                          data={chartData}
                          margin={{
                            top: 10,
                            right: 4,
                            left: -18,
                            bottom: 0,
                          }}
                          barCategoryGap="28%"
                        >
                          <CartesianGrid
                            vertical={false}
                            stroke="rgba(255,255,255,.05)"
                          />

                          <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            minTickGap={28}
                            tick={{
                              fill: "rgba(255,255,255,.24)",
                              fontSize: 9,
                            }}
                          />

                          <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            width={30}
                            tick={{
                              fill: "rgba(255,255,255,.18)",
                              fontSize: 9,
                            }}
                          />

                          <Tooltip
                            cursor={{
                              fill: "rgba(103,232,249,.035)",
                            }}
                            contentStyle={{
                              background: "#0b0b0b",
                              border:
                                "1px solid rgba(255,255,255,.08)",
                              borderRadius: "10px",
                              color: "#fff",
                              fontSize: 10,
                            }}
                            labelStyle={{
                              color: "rgba(255,255,255,.45)",
                              marginBottom: 4,
                            }}
                            formatter={(value) => [
                              `${value} anomal${Number(value) === 1 ? "y" : "ies"}`,
                              "Detected",
                            ]}
                          />

                          <Bar
                            dataKey="value"
                            name="Anomalies"
                            fill="#67e8f9"
                            fillOpacity={0.75}
                            radius={[3, 3, 0, 0]}
                            maxBarSize={28}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="max-w-xs text-center">
                          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-white/20">
                            <Activity size={16} />
                          </div>
                          <div className="mt-4 text-xs text-white/40">
                            No timestamped anomaly activity
                          </div>
                          <div className="mt-1 text-[10px] leading-5 text-white/20">
                            Upload timestamped events to populate this timeline.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StatusCard
                    icon={Terminal}
                    label="Ingestion"
                    value="Operational"
                    detail=".log · .txt · .json"
                  />

                  <StatusCard
                    icon={AlertCircle}
                    label="Detection"
                    value="Operational"
                    detail="Isolation Forest"
                  />

                  <StatusCard
                    icon={Layers3}
                    label="Pattern engine"
                    value="Operational"
                    detail="KMeans clustering"
                  />

                  <StatusCard
                    icon={BrainCircuit}
                    label="AI reasoning"
                    value="Local"
                    detail="Qwen3 4B / Ollama"
                  />
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* TOPOLOGY */}
            {/* ================================================= */}

            <section
              id="topology"
              className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10"
            >
              <SectionHeader
                eyebrow="System topology / 03"
                title="Where signals originate."
                description="Services are grouped from the logs currently available to the analyzer."
              />

              <div className="glass-panel mt-8 overflow-hidden">
                <div className={`grid divide-y divide-white/[0.07] md:divide-x md:divide-y-0 ${services.length >= 4 ? "md:grid-cols-4" : services.length === 3 ? "md:grid-cols-3" : services.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
                  {services.length ? (
                    services
                      .slice(0, 5)
                      .map(
                        (
                          service,
                          index
                        ) => (
                          <ServiceNode
                            key={
                              service.name
                            }
                            service={
                              service
                            }
                            index={
                              index
                            }
                          />
                        )
                      )
                  ) : (
                    [
                      "auth-service",
                      "api-service",
                      "database-service",
                      "payment-service",
                      "notification-service",
                    ].map(
                      (
                        service,
                        index
                      ) => (
                        <ServiceNode
                          key={
                            service
                          }
                          service={{
                            name: service,
                            total: 0,
                            anomalies: 0,
                          }}
                          index={
                            index
                          }
                        />
                      )
                    )
                  )}
                </div>

                <div className="border-t border-white/[0.07] px-5 py-4">
                  <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-white/25">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      Healthy signal
                    </span>

                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                      Anomaly signal
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* LOGS */}
            {/* ================================================= */}

            <section
              id="logs"
              className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10"
            >
              <SectionHeader
                eyebrow="Raw telemetry / 04"
                title="Every event, searchable."
                description="The normalized event stream feeding the detection pipeline."
              />

              <div className="glass-panel mt-10 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Event explorer
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2">
                    <Search
                      size={13}
                      className="text-white/20"
                    />

                    <input
                      value={
                        searchQuery
                      }
                      onChange={(event) =>
                        setSearchQuery(
                          event.target
                            .value
                        )
                      }
                      placeholder="Filter events..."
                      className="w-40 bg-transparent text-[10px] text-white outline-none placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-white/[0.07] text-[9px] uppercase tracking-[0.2em] text-white/25">
                        <th className="px-5 py-4">
                          Time
                        </th>

                        <th className="px-5 py-4">
                          Level
                        </th>

                        <th className="px-5 py-4">
                          Service
                        </th>

                        <th className="px-5 py-4">
                          Message
                        </th>

                        <th className="px-5 py-4">
                          Signal
                        </th>

                        <th className="px-5 py-4">
                          Mark
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredLogs.length ? (
                        filteredLogs
                          .slice(
                            0,
                            15
                          )
                          .map(
                            (log) => (
                              <tr
                                key={
                                  log.id
                                }
                                className="border-b border-white/[0.05] transition hover:bg-white/[0.025]"
                              >
                                <td className="whitespace-nowrap px-5 py-4 font-mono text-[11px] text-white/30">
                                  {formatTime(
                                    log.timestamp
                                  )}
                                </td>

                                <td className="px-5 py-4">
                                  <LevelBadge
                                    level={
                                      log.level
                                    }
                                  />
                                </td>

                                <td className="px-5 py-4 text-xs text-white/60">
                                  {log.service ||
                                    "unknown"}
                                </td>

                                <td className="max-w-[440px] truncate px-5 py-4 text-sm text-white/75">
                                  {
                                    log.message
                                  }
                                </td>

                                <td className="px-5 py-4">
                                  {log.is_anomaly ===
                                  1 ? (
                                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-300">
                                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                                      anomaly
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/25">
                                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                                      normal
                                    </span>
                                  )}
                                </td>

                                <td className="px-5 py-4">
                                  <button
                                    onClick={() =>
                                      toggleBookmark(
                                        log
                                      )
                                    }
                                    className={`rounded-lg border px-2.5 py-1.5 text-[9px] uppercase tracking-widest transition ${
                                      bookmarks.some(
                                        (
                                          item
                                        ) =>
                                          item.id ===
                                          log.id
                                      )
                                        ? "border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300"
                                        : "border-white/[0.07] text-white/20 hover:text-white/60"
                                    }`}
                                  >
                                    {bookmarks.some(
                                      (
                                        item
                                      ) =>
                                        item.id ===
                                        log.id
                                    )
                                      ? "Marked"
                                      : "Mark"}
                                  </button>
                                </td>
                              </tr>
                            )
                          )
                      ) : (
                        <EmptyRow
                          text={
                            searchQuery
                              ? "No matching events."
                              : "No logs available."
                          }
                        />
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* ANALYTICS */}
            {/* ================================================= */}

            <section
              id="analytics"
              className="mx-auto max-w-[1440px] px-6 py-10 lg:px-10"
            >
              <SectionHeader
                eyebrow="Telemetry analytics / 04.1"
                title="Read the system from every angle."
                description="A deeper view of event distribution and service activity derived directly from the analyzed log stream."
              />

              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                {/* LOG LEVEL */}
                <div className="glass-panel overflow-hidden p-5">
                  <LogLevelChart logs={logs} />
                </div>

                {/* SERVICES */}
                <div className="glass-panel overflow-hidden p-5">
                  <ServiceChart logs={logs} />
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* INCIDENTS */}
            {/* ================================================= */}

            <section
              id="incidents"
              className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10"
            >
              <SectionHeader
                eyebrow="Incident intelligence / 06"
                title="From noisy events to one problem."
                description="Related anomalies are correlated into incidents so engineers investigate the event, not thousands of individual lines."
              />

              <div className="mt-10 space-y-3">
                {incidents.length ? (
                  incidents.map(
                    (incident) => (
                      <IncidentRow
                        key={
                          incident.incident_id
                        }
                        incident={
                          incident
                        }
                        saved={savedInvestigations.some(
                          (item) =>
                            item.id ===
                            incident.incident_id
                        )}
                        onOpen={() => {
                          setSelectedIncident(
                            incident
                          );

                          addActivity(
                            `Opened incident ${incident.incident_id}`
                          );
                        }}
                        onSave={() =>
                          saveInvestigation(
                            incident
                          )
                        }
                      />
                    )
                  )
                ) : (
                  <div className="glass-panel p-10 text-center">
                    <ShieldAlert
                      className="mx-auto text-white/30"
                      size={24}
                    />

                    <p className="mt-4 text-sm text-white/40">
                      No correlated
                      incidents available.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ================================================= */}
            {/* AI */}
            {/* ================================================= */}

            <section
              id="ai-analysis"
              className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/10 bg-cyan-300/[0.025] p-7 md:p-10">
                <div className="absolute right-[-100px] top-[-160px] h-[400px] w-[400px] rounded-full bg-cyan-300/[0.05] blur-[100px]" />

                <div className="relative grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
                  <div>
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
                      <Sparkles size={14} />

                      Local reasoning layer
                    </div>

                    <h2 className="mt-5 max-w-xl text-4xl font-medium tracking-[-0.04em] md:text-6xl">
                      Ask the system
                      <br />
                      what changed.
                    </h2>

                    <p className="mt-5 max-w-lg text-sm leading-6 text-white/40">
                      Historical similarity
                      search retrieves related
                      events, then Qwen3 reasons
                      over the current incident
                      and its evidence.
                    </p>

                    {incidents.length > 0 && (
                      <button
                        onClick={() =>
                          handleAIAnalysis(
                            incidents[0]
                          )
                        }
                        disabled={
                          aiLoading
                        }
                        className="mt-8 flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:opacity-50"
                      >
                        <BrainCircuit
                          size={15}
                        />

                        {aiLoading
                          ? "Analyzing..."
                          : "Analyze latest incident"}

                        <ArrowRight
                          size={15}
                        />
                      </button>
                    )}

                    {!incidents.length && (
                      <div className="mt-8 text-xs text-white/25">
                        Run an analysis with
                        an incident to activate
                        AI reasoning.
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-5">
                    {aiLoading ? (
                      <AIThinking />
                    ) : aiError ? (
                      <div className="flex min-h-[280px] items-center justify-center text-sm text-amber-300/70">
                        {aiError}
                      </div>
                    ) : aiResult ? (
                      <AIResult
                        result={
                          aiResult
                        }
                      />
                    ) : (
                      <AIPlaceholder />
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* PIPELINE */}
            <PipelineSection
              onUpload={handleLogUpload}
              loading={uploadLoading}
              result={uploadResult}
              error={uploadError}
            />

            {/* FOOTER */}
            <Footer
              onNavigate={
                navigateToSection
              }
              onMenuNavigate={
                navigateTo
              }
            />
          </Dashboard>
        ) : (
          <WorkspaceView
            view={activeView}
            analysis={analysis}
            logs={logs}
            incidents={incidents}
            savedInvestigations={
              savedInvestigations
            }
            setSavedInvestigations={
              setSavedInvestigations
            }
            bookmarks={bookmarks}
            setBookmarks={setBookmarks}
            activity={activity}
            loggedIn={loggedIn}
            onLogin={() =>
              setLoginOpen(true)
            }
            onLogout={handleLogout}
            onBack={() =>
              navigateTo(
                "overview"
              )
            }
            onNavigate={
              navigateTo
            }
            onSaveInvestigation={
              saveInvestigation
            }
          />
        )}
      </div>

      {/* ===================================================== */}
      {/* MENU */}
      {/* ===================================================== */}

      {menuOpen && (
        <MenuOverlay
          onClose={() =>
            setMenuOpen(false)
          }
          onNavigate={navigateTo}
          menuGroups={MENU_GROUPS}
        />
      )}

      {/* ===================================================== */}
      {/* COMMAND PALETTE */}
      {/* ===================================================== */}

      {commandOpen && (
        <CommandPalette
          onClose={() =>
            setCommandOpen(false)
          }
          onNavigate={navigateTo}
          query={searchQuery}
          setQuery={setSearchQuery}
          menuGroups={MENU_GROUPS}
        />
      )}

      {/* ===================================================== */}
      {/* INCIDENT DRAWER */}
      {/* ===================================================== */}

      {selectedIncident && (
        <IncidentDrawer
          incident={
            selectedIncident
          }
          onClose={() => {
            setSelectedIncident(
              null
            );
            setAiResult(null);
            setAiError("");
          }}
          onAI={() =>
            handleAIAnalysis(
              selectedIncident
            )
          }
          onSave={() =>
            saveInvestigation(
              selectedIncident
            )
          }
          saved={savedInvestigations.some(
            (item) =>
              item.id ===
              selectedIncident.incident_id
          )}
          aiLoading={aiLoading}
          aiResult={aiResult}
        />
      )}

      {/* ===================================================== */}
      {/* LOGIN */}
      {/* ===================================================== */}

      {loginOpen && (
        <LoginModal
          onClose={() =>
            setLoginOpen(false)
          }
          onLogin={
            handleLogin
          }
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* BACKGROUND */
/* ========================================================= */


/* ========================================================= */
/* HEADER */
/* ========================================================= */

/* ========================================================= */
/* MENU */
/* ========================================================= */


/* ========================================================= */
/* COMMAND PALETTE */
/* ====        )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* WORKSPACE VIEWS */
/* ========================================================= */

/* ========================================================= */
/* PIPELINE */
/* ========================================================= */


/* ========================================================= */
/* INCIDENT DRAWER */
/* ========================================================= */


/* ========================================================= */
/* LOGIN */
/* ========================================================= */


/* ========================================================= */
/* FOOTER */
/* ========================================================= */

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */




export default App;