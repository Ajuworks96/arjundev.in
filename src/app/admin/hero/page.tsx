"use client";

import { useEffect, useState } from "react";
import { Sparkles, Save, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminHeroManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    headline: "",
    animatedText: "",
    subtitle: "",
    ctaPrimary: "",
    ctaPrimaryUrl: "",
    ctaSecondary: "",
    ctaSecondaryUrl: "",
  });

  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetch("/api/admin/hero");
        if (res.ok) {
          const data = await res.json();
          setForm({
            headline: data.headline || "",
            animatedText: data.animatedText || "",
            subtitle: data.subtitle || "",
            ctaPrimary: data.ctaPrimary || "",
            ctaPrimaryUrl: data.ctaPrimaryUrl || "",
            ctaSecondary: data.ctaSecondary || "",
            ctaSecondaryUrl: data.ctaSecondaryUrl || "",
          });
        }
      } catch (e) {
        console.error("Failed to load hero data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadHero();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bgSettings: {} // Maintain default empty JSON placeholder
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save hero settings:", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Hero Manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Hero Settings <Sparkles className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Manage your landing page headlines, rotating highlights, and CTAs.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Hero settings updated successfully! Live page headline has synchronized.</span>
          </motion.div>
        )}

        <div className="glassmorphism p-6 rounded-2xl border border-slate-900 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Static Base Headline</label>
            <input
              type="text"
              required
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="e.g. Build Websites."
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Animated Rotating Headings (Comma Separated)</label>
            <input
              type="text"
              required
              value={form.animatedText}
              onChange={(e) => setForm({ ...form, animatedText: e.target.value })}
              placeholder="e.g. Build Websites.,Develop Careers.,Ship Products."
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subtitle Description</label>
            <textarea
              rows={3}
              required
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary button Label</label>
              <input
                type="text"
                required
                value={form.ctaPrimary}
                onChange={(e) => setForm({ ...form, ctaPrimary: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Button URL Target</label>
              <input
                type="text"
                required
                value={form.ctaPrimaryUrl}
                onChange={(e) => setForm({ ...form, ctaPrimaryUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Secondary Button Label</label>
              <input
                type="text"
                required
                value={form.ctaSecondary}
                onChange={(e) => setForm({ ...form, ctaSecondary: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Secondary Button URL Target</label>
              <input
                type="text"
                required
                value={form.ctaSecondaryUrl}
                onChange={(e) => setForm({ ...form, ctaSecondaryUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Hero Layout"}</span>
        </button>
      </form>
    </div>
  );
}
