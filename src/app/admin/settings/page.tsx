"use client";

import { useEffect, useState } from "react";
import { Settings, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    provider: "Local",
    apiUrl: "",
    apiKey: "",
    youtubeChannelId: "",
    youtubeApiKey: "",
    instagramAccessToken: "",
    linkedinFeedUrl: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setForm({
            provider: data.provider || "Local",
            apiUrl: data.apiUrl || "",
            apiKey: data.apiKey || "",
            youtubeChannelId: data.youtubeChannelId || "",
            youtubeApiKey: data.youtubeApiKey || "",
            instagramAccessToken: data.instagramAccessToken || "",
            linkedinFeedUrl: data.linkedinFeedUrl || "",
          });
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save settings:", e);
    } finally {
      setSaving(false);
    }
  };

  const providers = ["Local", "WordPress", "Strapi", "Payload", "Sanity", "Directus"];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Settings Panel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            CMS Settings <Settings className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Choose your core content management source and map api parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Active CMS configuration updated successfully! CMS adapter instantiated dynamically.</span>
          </motion.div>
        )}

        <div className="glassmorphism p-6 rounded-2xl border border-slate-900 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Content Provider</label>
            <select
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white transition-colors cursor-pointer font-bold"
            >
              {providers.map((p) => (
                <option key={p} value={p} className="bg-slate-950 text-white font-bold">{p} CMS</option>
              ))}
            </select>
          </div>

          {form.provider !== "Local" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-5 pt-3 border-t border-slate-900/60"
            >
              <div className="p-3 bg-yellow-400/5 border border-yellow-400/10 rounded-xl text-yellow-400 text-[10px] uppercase font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Ensure headless CMS layout schema matches our custom typescript adapter specification.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">CMS Base API URL</label>
                <input
                  type="url"
                  required
                  value={form.apiUrl}
                  onChange={(e) => setForm({ ...form, apiUrl: e.target.value })}
                  placeholder="https://cms.arjundev.in"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Authentication / API Token</label>
                <input
                  type="password"
                  value={form.apiKey}
                  onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                  placeholder="Bearer Token or Key"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 transition-colors font-mono"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Social Feed Credentials Card */}
        <div className="glassmorphism p-6 rounded-2xl border border-slate-900 space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-slate-900 pb-2">Social Feed Integrations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">YouTube Channel ID</label>
              <input
                type="text"
                value={form.youtubeChannelId}
                onChange={(e) => setForm({ ...form, youtubeChannelId: e.target.value })}
                placeholder="e.g. UCxxxxxxxxx"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">YouTube Data API Key</label>
              <input
                type="password"
                value={form.youtubeApiKey}
                onChange={(e) => setForm({ ...form, youtubeApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Instagram Access Token</label>
              <input
                type="password"
                value={form.instagramAccessToken}
                onChange={(e) => setForm({ ...form, instagramAccessToken: e.target.value })}
                placeholder="IGQVJ..."
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn RSS Feed URL</label>
              <input
                type="text"
                value={form.linkedinFeedUrl}
                onChange={(e) => setForm({ ...form, linkedinFeedUrl: e.target.value })}
                placeholder="https://rss.app/feeds/..."
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                ⚠️ LinkedIn blocks direct profile URL access. You must convert your public LinkedIn posts to an RSS feed using a free service like <a href="https://rss.app" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">RSS.app</a> or <a href="https://fetchrss.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">FetchRSS</a>, and paste the generated XML URL here.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving CMS Settings..." : "Save Settings"}</span>
        </button>
      </form>
    </div>
  );
}
