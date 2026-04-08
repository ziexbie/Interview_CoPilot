import {
  HiArrowRightOnRectangle,
  HiBars3,
  HiSparkles,
  HiXMark,
} from "react-icons/hi2";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ compact = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isInterview = location.pathname.startsWith("/interview");

  return (
    <header className="sticky top-0 z-30 border-b border-night-700/70 bg-night-900/95 backdrop-blur-xl">
      <div className="section-wrap">
        <div className={`flex items-center justify-between ${compact ? "py-3" : "py-4"}`}>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-3 rounded-full border border-night-700 bg-night-850 px-4 py-2 text-left text-sm font-semibold text-slate-50 transition hover:border-yellow-400/60 hover:bg-night-800"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-night-950">
              <HiSparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.24em] text-yellow-200">
                Interview Copilot
              </span>
              <span className="block text-sm font-semibold text-slate-50">
                AI Interview Workspace
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className={`nav-button ${isDashboard ? "bg-yellow-400 text-night-950 border-yellow-400" : ""}`}
                >
                  Dashboard
                </button>
                {isInterview && (
                  <button
                    type="button"
                    onClick={() => navigate(location.pathname)}
                    className="nav-button bg-yellow-400 text-night-950 border-yellow-400"
                  >
                    Session
                  </button>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="pink-button px-4! py-2.5!"
                >
                  <HiArrowRightOnRectangle className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="ghost-button rounded-full! px-3! py-3!"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <HiXMark className="h-5 w-5" /> : <HiBars3 className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="fade-up pb-4 md:hidden">
            <div className="soft-panel flex flex-col gap-2 p-3">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className={`nav-button w-full justify-center ${isDashboard ? "bg-yellow-400 text-night-950 border-yellow-400" : ""}`}
                  >
                    Workspace
                  </button>
                  {isInterview && (
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(false)}
                      className="nav-button w-full justify-center bg-yellow-400 text-night-950 border-yellow-400"
                    >
                      Current session
                    </button>
                  )}
                  <button type="button" onClick={logout} className="pink-button w-full">
                    <HiArrowRightOnRectangle className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                    className="ghost-button w-full"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/signup");
                    }}
                    className="pink-button w-full"
                  >
                    Create account
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
