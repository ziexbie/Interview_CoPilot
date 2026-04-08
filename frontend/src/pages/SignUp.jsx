import { useState } from "react";
import { HiEnvelope, HiLockClosed, HiSparkles, HiUser } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(API_PATHS.AUTH.SIGNUP, form);
      navigate("/login");
    } catch (error) {
      console.log(error.response || error);
      alert(error.response?.data?.message || "Unable to create account.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-night-950">
      <Navbar />
      <div className="app-shell ambient-grid flex flex-1 min-h-0 items-center justify-center px-4 py-10">
        <div className="ambient-orb -left-20 top-16 h-72 w-72 bg-yellow-400/10" />
        <div className="ambient-orb -right-16 bottom-10 h-72 w-72 bg-slate-400/10" />

        <div className="glass-panel relative w-full max-w-md overflow-hidden p-8 sm:p-10">
          <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] border border-night-700 bg-night-850 text-yellow-300">
              <HiSparkles className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-semibold text-slate-50">Create your account</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Set up your workspace and start generating tailored interview questions.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                <HiUser className="h-4 w-4" />
                Name
              </span>
              <input
                type="text"
                placeholder="Your name"
                className="pink-input"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                <HiEnvelope className="h-4 w-4" />
                Email
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                className="pink-input"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                <HiLockClosed className="h-4 w-4" />
                Password
              </span>
              <input
                type="password"
                placeholder="Create a strong password"
                className="pink-input"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            <button type="button" onClick={handleSignup} className="pink-button mt-3 w-full">
              Create account
            </button>
          </div>

          <div className="my-6 h-px bg-linear-to-r from-transparent via-night-700 to-transparent opacity-70" />

          <p className="text-center text-sm text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-yellow-300 hover:text-yellow-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
