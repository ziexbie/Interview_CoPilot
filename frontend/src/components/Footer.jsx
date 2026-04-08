import { HiArrowUpRight, HiSparkles } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const isInterview = location.pathname.startsWith("/interview/");

  const navigationLinks = isAuthenticated
    ? [
        { label: "Home", to: "/" },
        { label: "Dashboard", to: "/dashboard" },
      ]
    : [
        { label: "Home", to: "/" },
        { label: "Sign in", to: "/login" },
        { label: "Create account", to: "/signup" },
      ];

  const links = isInterview
    ? [...navigationLinks, { label: "Current session", to: location.pathname }]
    : navigationLinks;

  return (
    <footer className="section-wrap relative pb-8 pt-6 sm:pb-10">
      <div className="glass-panel surface-outline overflow-hidden px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-night-950">
                <HiSparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-yellow-200">
                  Interview Copilot
                </p>
                <p className="text-base font-semibold text-slate-50">
                  Practice sharper with a calmer review flow.
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Build role-based workspaces, generate tailored questions, and turn
              every prompt into a clearer answer.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]"
          >
            {links.map((link) => (
              <Link
                key={`${link.label}-${link.to}`}
                to={link.to}
                className="group rounded-2xl border border-night-700 bg-night-850/80 px-4 py-3 text-sm font-semibold text-slate-100 transition duration-300 hover:border-yellow-400/45 hover:bg-night-800"
              >
                <span className="flex items-center justify-between gap-3">
                  {link.label}
                  <HiArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-yellow-200" />
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-night-700/70 pt-4 text-xs uppercase tracking-[0.2em] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Structured prep for frontend, MERN, Java, and beyond.</p>
          <p>{new Date().getFullYear()} Interview Copilot</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
