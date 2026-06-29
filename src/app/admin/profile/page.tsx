"use client";

import { useEffect, useState } from "react";
import { User, Save, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminProfileManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    about: "",
    biography: "",
    journeyIntro: "",
    mission: "",
    vision: "",
    availability: "",
    avatarUrl: "",
    resumeUrl: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || "",
            tagline: data.tagline || "",
            about: data.about || "",
            biography: data.biography || "",
            journeyIntro: data.journeyIntro || "",
            mission: data.mission || "",
            vision: data.vision || "",
            availability: data.availability || "",
            avatarUrl: data.avatarUrl || "",
            resumeUrl: data.resumeUrl || "",
          });
        }
      } catch (e) {
        console.error("Failed to load profile data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          socialLinks: {} // Maintain default empty JSON placeholder
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save profile:", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Profile Manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Profile Settings <User className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Manage your personal biography and professional details.
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
            <span>Profile settings updated successfully! Changes are propagated immediately.</span>
          </motion.div>
        )}

        <div className="glassmorphism p-6 rounded-2xl border border-slate-900 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Display Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Tagline / Title</label>
              <input
                type="text"
                required
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">About Intro Teaser</label>
            <textarea
              rows={3}
              required
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Biography (Storytelling)</label>
            <textarea
              rows={5}
              required
              value={form.biography}
              onChange={(e) => setForm({ ...form, biography: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Availability Banner</label>
              <input
                type="text"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                placeholder="e.g. Available for contracts"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Photo URL</label>
              <input
                type="text"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Journey Introduction Paragraph</label>
              <textarea
                rows={2}
                value={form.journeyIntro}
                onChange={(e) => setForm({ ...form, journeyIntro: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors"
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
          <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
        </button>
      </form>
    </div>
  );
}
