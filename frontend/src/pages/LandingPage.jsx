import {
  HiArrowTrendingUp,
  HiBolt,
  HiChatBubbleBottomCenterText,
  HiSparkles,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const heroStats = [
  {
    title: "1,000+ questions",
    copy: "Curated by role and level.",
  },
  {
    title: "AI-powered insights",
    copy: "Smart prompts and answer guidance.",
  },
  {
    title: "Real interview flow",
    copy: "Practice with structured session steps.",
  },
];

const featureCards = [
  {
    icon: HiBolt,
    title: "Fast setup",
    copy: "Create a prep workspace with a role and experience level in seconds.",
  },
  {
    icon: HiChatBubbleBottomCenterText,
    title: "Tailored questions",
    copy: "Generate interview question sets aligned to your target role.",
  },
  {
    icon: HiArrowTrendingUp,
    title: "Clear review flow",
    copy: "Expand answers, revisit concepts, and keep the session organized.",
  },
];

const workspaceMetrics = [
  {
    label: "Workflow",
    value: "Role input, question generation, answer expansion",
  },
  {
    label: "Experience",
    value: "Difficulty aligned to junior, mid, or senior roles",
  },
];

const practiceSteps = [
  {
    title: "Define role",
    copy: "Set the target position and experience level before you begin.",
  },
  {
    title: "Generate questions",
    copy: "Create a focused set tailored to the job you want.",
  },
  {
    title: "Review answers",
    copy: "Refine responses with guided improvements and follow-ups.",
  },
];

const prepSupport = [
  {
    label: "Preview flow",
    value: "Question, answer draft, and final review in one place.",
  },
  {
    label: "Focus tip",
    value: "Keep each answer anchored to impact, tradeoffs, and outcomes.",
  },
  {
    label: "Activity",
    value: "Last practice set completed in 18 minutes with 6 guided prompts.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-shell ambient-grid">
      <Navbar />
      <div
        className="ambient-orb -left-32 top-20 h-64 w-64 bg-yellow-400/10"
        style={{ animation: "float-slow 8s ease-in-out infinite" }}
      />
      <div
        className="ambient-orb -right-24 top-12 h-72 w-72 bg-slate-400/10"
        style={{ animation: "pulse-glow 7s ease-in-out infinite" }}
      />

      <header className="hidden section-wrap py-4">
        <div className="flex flex-col gap-4 rounded-[28px] border border-night-700/70 bg-night-900/92 p-5 shadow-lg shadow-black/25 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-3 rounded-full border border-night-700 bg-night-850 px-4 py-2 text-left text-sm font-semibold text-slate-50 transition hover:border-yellow-400/60 hover:bg-night-800"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-night-950">
              <HiSparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.2em] text-yellow-200">
                Interview Copilot
              </span>
              <span className="block text-sm font-semibold text-slate-50">
                AI Interview Workspace
              </span>
            </span>
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="ghost-button"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="pink-button"
            >
              Create account
            </button>
          </div>
        </div>
      </header>

      <main className="section-wrap pt-4 pb-12">
        <div className="flex flex-col gap-6">
          <section className="glass-panel surface-outline relative overflow-hidden p-6 sm:p-7">
            <div className="pointer-events-none absolute -right-10 top-12 h-44 w-44 rounded-full bg-yellow-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-6">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-center">
                <div className="flex flex-col gap-5">
                  <span className="pill fade-up inline-flex items-center gap-2 self-start">
                    <HiSparkles className="h-4 w-4" />
                    AI Interview Preparation
                  </span>
                  <h1 className="section-title fade-up-delay-1 max-w-3xl text-4xl sm:text-5xl">
                    Build a sharper practice flow for interviews.
                  </h1>
                  <p className="fade-up-delay-2 max-w-2xl text-base leading-7 text-slate-300">
                    Organize questions, generate answers, and review concepts with
                    a clean, distraction-free study workspace.
                  </p>
                  <div className="fade-up-delay-3 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      className="pink-button"
                    >
                      <HiBolt className="h-5 w-5" />
                      Start free
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="ghost-button"
                    >
                      Open workspace
                    </button>
                  </div>
                </div>

                <div className="hidden lg:flex lg:justify-end">
                  <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-night-700/70 bg-night-950/80 p-5 shadow-lg shadow-black/30">
                    <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-yellow-400 to-transparent opacity-60" />
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Interview Flow
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-100">
                          Guided prep overview
                        </p>
                      </div>
                      <span className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-[11px] font-semibold text-yellow-200">
                        Live
                      </span>
                    </div>

                    <svg
                      viewBox="0 0 320 240"
                      className="h-auto w-full"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="heroLine" x1="0%" x2="100%" y1="0%" y2="0%">
                          <stop offset="0%" stopColor="rgba(241,190,50,0.15)" />
                          <stop offset="55%" stopColor="rgba(241,190,50,0.95)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.28)" />
                        </linearGradient>
                        <linearGradient id="heroFill" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(241,190,50,0.22)" />
                          <stop offset="100%" stopColor="rgba(241,190,50,0)" />
                        </linearGradient>
                      </defs>

                      <rect
                        x="14"
                        y="18"
                        width="292"
                        height="204"
                        rx="20"
                        fill="rgba(59,59,79,0.52)"
                        stroke="rgba(255,255,255,0.08)"
                      />
                      <g stroke="rgba(255,255,255,0.07)" strokeWidth="1">
                        <line x1="40" y1="60" x2="280" y2="60" />
                        <line x1="40" y1="102" x2="280" y2="102" />
                        <line x1="40" y1="144" x2="280" y2="144" />
                        <line x1="40" y1="186" x2="280" y2="186" />
                      </g>
                      <g fill="rgba(255,255,255,0.12)">
                        <rect x="40" y="34" width="72" height="10" rx="5" />
                        <rect x="118" y="34" width="48" height="10" rx="5" />
                      </g>
                      <path
                        d="M40 180C68 172 84 160 102 146C120 132 136 134 152 116C168 98 190 102 206 88C222 74 238 56 280 48V180H40Z"
                        fill="url(#heroFill)"
                      />
                      <path
                        d="M40 180C68 172 84 160 102 146C120 132 136 134 152 116C168 98 190 102 206 88C222 74 238 56 280 48"
                        fill="none"
                        stroke="url(#heroLine)"
                        strokeLinecap="round"
                        strokeWidth="4"
                      />
                      <g fill="#f1be32">
                        <circle cx="102" cy="146" r="5" />
                        <circle cx="152" cy="116" r="5" />
                        <circle cx="206" cy="88" r="5" />
                        <circle cx="280" cy="48" r="6" />
                      </g>
                      <g>
                        <rect
                          x="188"
                          y="124"
                          width="90"
                          height="60"
                          rx="14"
                          fill="rgba(10,10,35,0.9)"
                          stroke="rgba(241,190,50,0.22)"
                        />
                        <text
                          x="204"
                          y="148"
                          fill="#d1d5db"
                          fontSize="11"
                          fontFamily="Urbanist, sans-serif"
                        >
                          Answer quality
                        </text>
                        <text
                          x="204"
                          y="171"
                          fill="#f9fafb"
                          fontSize="22"
                          fontWeight="700"
                          fontFamily="Urbanist, sans-serif"
                        >
                          92%
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {heroStats.map(({ title, copy }) => (
                  <div key={title} className="panel-card-muted">
                    <p className="text-sm font-semibold text-slate-50">
                      {title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <section className="glass-panel surface-outline">
              <div className="panel-stack">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Sample question preview
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-50">
                    Optimize a React dashboard for live updates
                  </h2>
                  <p className="text-sm leading-6 text-slate-300">
                    Review how a polished response can stay structured from the
                    question prompt through the answer summary.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="panel-card">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Question
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-200">
                      How would you optimize rendering for a React dashboard
                      with frequent live data updates?
                    </p>
                  </div>
                  <div className="panel-card-muted">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Answer preview
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-300">
                      Use memoization, lazy loading, and normalized state to
                      keep the UI smooth as new data arrives.
                    </p>
                  </div>
                </div>

                <div className="panel-card-muted flex-1">
                  <div className="flex h-full flex-col gap-5">
                    <div className="flex flex-col gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Practice support
                      </p>
                      <h3 className="text-xl font-semibold text-slate-50">
                        Keep each session structured and measurable
                      </h3>
                      <p className="text-sm leading-6 text-slate-300">
                        Add a lightweight checkpoint area so the preview column
                        feels complete and stays visually balanced with the
                        workspace details on the right.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {prepSupport.map(({ label, value }) => (
                        <div key={label} className="panel-card">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            {label}
                          </p>
                          <p className="mt-3 text-sm font-semibold leading-6 text-slate-100">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="glass-panel surface-outline">
              <div className="panel-stack">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Workspace preview
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-50">
                      Frontend Developer
                    </h2>
                    <p className="text-sm leading-6 text-slate-300">
                      Tailored prep for mid-level interview practice with a
                      clean step-by-step workflow.
                    </p>
                  </div>
                  <div className="self-start rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-200">
                    2 years
                  </div>
                </div>

                <div className="grid gap-4">
                  {featureCards.map((card) => {
                    const { icon: Icon, title, copy } = card;
                    return (
                      <div key={title} className="soft-panel p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-yellow-400 text-night-950">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <h3 className="text-base font-semibold text-slate-50">
                              {title}
                            </h3>
                            <p className="text-sm leading-6 text-slate-300">
                              {copy}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {workspaceMetrics.map(({ label, value }) => (
                    <div key={label} className="metric-card">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        {label}
                      </p>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-100">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="panel-card-muted">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Practice in 3 steps
                  </p>
                  <ul className="mt-4 grid gap-4 text-sm leading-6 text-slate-300">
                    {practiceSteps.map(({ title, copy }, index) => (
                      <li key={title} className="panel-card">
                        <span className="font-semibold text-slate-50">
                          {index + 1}. {title}
                        </span>{" "}
                        {copy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
