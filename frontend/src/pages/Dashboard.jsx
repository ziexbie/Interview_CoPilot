import { useCallback, useEffect, useState } from "react";
import {
  HiArrowTrendingUp,
  HiBriefcase,
  HiClock,
  HiFire,
  HiPlus,
  HiSparkles,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const fetchSessions = useCallback(async () => {
    try {
      const res = await axios.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data.sessions || []);
    } catch (error) {
      console.log(error.response || error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  const createSession = async () => {
    if (!role || !experience) {
      alert("Enter both role and experience level.");
      return;
    }

    try {
      setIsCreating(true);
      const res = await axios.post(API_PATHS.SESSION.CREATE, {
        role,
        experience,
      });

      setRole("");
      setExperience("");
      navigate(`/interview/${res.data.session._id}`);
    } catch (error) {
      console.log(error.response || error);
      alert(error.response?.data?.message || "Unable to create workspace.");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="app-shell ambient-grid">
      <div className="ambient-orb -left-24 top-24 h-72 w-72 bg-yellow-400/10" />
      <div className="ambient-orb -right-24 top-40 h-72 w-72 bg-slate-400/10" />

      <Navbar />

      <main className="section-wrap relative py-12">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="max-w-2xl">
            <span className="pill fade-up mb-5">
              <HiSparkles className="h-3.5 w-3.5" />
              Workspace
            </span>
            <h1 className="section-title fade-up-delay-1">
              Create a focused interview workspace.
            </h1>
            <p className="fade-up-delay-2 mt-4 max-w-xl text-base leading-7 text-slate-300">
              Define the role and experience level, then generate tailored questions in a dedicated prep workspace.
            </p>
            <div className="fade-up-delay-3 mt-8 grid gap-4 sm:grid-cols-3">
              <div className="metric-card">
                <p className="text-2xl font-semibold text-slate-50">{sessions.length}</p>
                <p className="mt-2 text-sm text-slate-300">workspaces</p>
              </div>
              <div className="metric-card">
                <p className="text-2xl font-semibold text-slate-50">Tailored</p>
                <p className="mt-2 text-sm text-slate-300">question sets</p>
              </div>
              <div className="metric-card">
                <p className="text-2xl font-semibold text-slate-50">Structured</p>
                <p className="mt-2 text-sm text-slate-300">review flow</p>
              </div>
            </div>
          </div>

          <div className="glass-panel surface-outline fade-up-delay-2 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-night-950">
                <HiBriefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-50">New workspace</h2>
                <p className="text-sm text-slate-300">Define the role and experience level.</p>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-night-700 bg-night-850 px-3 py-1 text-xs font-semibold text-yellow-200">
                Frontend
              </span>
              <span className="rounded-full border border-night-700 bg-night-850 px-3 py-1 text-xs font-semibold text-yellow-200">
                MERN
              </span>
              <span className="rounded-full border border-night-700 bg-night-850 px-3 py-1 text-xs font-semibold text-yellow-200">
                Java
              </span>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Role</span>
                <input
                  placeholder="Frontend Developer"
                  value={role}
                  className="pink-input"
                  onChange={(e) => setRole(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Experience level</span>
                <input
                  placeholder="2 years"
                  value={experience}
                  className="pink-input"
                  onChange={(e) => setExperience(e.target.value)}
                />
              </label>

              <button
                type="button"
                onClick={createSession}
                disabled={isCreating}
                className="pink-button mt-2 w-full"
              >
                <HiPlus className="h-5 w-5" />
                {isCreating ? "Creating workspace..." : "Create workspace"}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-50">Recent workspaces</h2>
            <p className="mt-1 text-sm text-slate-300">
              Open any workspace to continue generating or reviewing questions.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-200 md:flex">
            <HiFire className="h-4 w-4" />
            Stay interview-ready
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="glass-panel px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-night-700 bg-night-850 text-yellow-300">
              <HiArrowTrendingUp className="h-8 w-8" />
            </div>
            <p className="mt-5 text-xl font-semibold text-slate-50">No workspaces yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300">
              Create your first workspace to start generating tailored interview questions.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => (
              <button
                type="button"
                key={session._id}
                onClick={() => navigate(`/interview/${session._id}`)}
                className="soft-panel group cursor-pointer p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-night-800"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-night-950">
                    <HiBriefcase className="h-6 w-6" />
                  </span>
                  <span className="rounded-full border border-night-700 bg-night-900 px-3 py-1 text-xs font-semibold text-yellow-200">
                    Open workspace
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-50">{session.role}</h3>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                  <HiClock className="h-4 w-4 text-slate-400" />
                  {session.experience} experience
                </div>
                <p className="mt-5 text-sm text-slate-300 transition group-hover:text-yellow-200">
                  Open this workspace
                </p>
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
