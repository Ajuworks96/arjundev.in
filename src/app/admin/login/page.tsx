"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050912] px-6 text-slate-100 selection:bg-yellow-500/30">
      {/* Background Grids & Aura */}
      <div className="absolute inset-0 grid-bg opacity-[0.12] grid-mask pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-yellow-500/[0.04] rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            arjundev<span className="text-yellow-400">.in</span>
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Brand Management Portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glassmorphism p-8 rounded-2xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@arjundev.in"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-sm text-white placeholder-slate-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-sm text-white placeholder-slate-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 group transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Authenticating Portal..." : "Enter Brand Suite"}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>
        </div>

        {/* Footer hints */}
        <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-wider select-none">
          Secured with NextAuth / Credentials adapter
        </p>
      </motion.div>
    </div>
  );
}
