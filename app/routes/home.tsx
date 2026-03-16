import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useAuth } from "~/hooks/useAuth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In" },
    { name: "description", content: "Sign in to My Todos" },
  ];
}

export default function Login() {
  const { user, hydrated, login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && user) {
      navigate("/todos");
    }
  }, [hydrated, user, navigate]);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
      navigate("/todos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError("");
  }

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* App icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-[22px] bg-[#007AFF] flex items-center justify-center shadow-xl shadow-blue-300/40 dark:shadow-blue-900/40">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h1 className="text-[28px] font-bold text-gray-900 dark:text-white text-center mb-1 tracking-tight">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-[15px] text-gray-500 dark:text-[#636366] text-center mb-8">
          {isLogin ? "Sign in to your account" : "Sign up to get started"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm overflow-hidden mb-4">
            <div className="flex items-center gap-3 px-4 h-12 border-b border-gray-100 dark:border-[#38383A]">
              <label
                htmlFor="username"
                className="w-24 text-[15px] text-gray-900 dark:text-white font-medium shrink-0"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                autoComplete="username"
                autoCapitalize="none"
                className="flex-1 text-[15px] bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-[#48484A]"
              />
            </div>
            <div className="flex items-center gap-3 px-4 h-12">
              <label
                htmlFor="password"
                className="w-24 text-[15px] text-gray-900 dark:text-white font-medium shrink-0"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="flex-1 text-[15px] bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-[#48484A]"
              />
            </div>
          </div>

          {error && (
            <p className="text-[#FF3B30] text-[13px] text-center mb-4 -mt-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="w-full h-12 rounded-2xl bg-[#007AFF] disabled:bg-[#007AFF]/40 text-white text-[17px] font-semibold transition-all cursor-pointer disabled:cursor-default active:scale-[0.98]"
          >
            {loading ? (isLogin ? "Signing in…" : "Creating account…") : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-gray-500 dark:text-[#636366]">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          {" "}
          <button
            onClick={switchMode}
            className="text-[#007AFF] font-medium cursor-pointer"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>

      </div>
    </div>
  );
}
