"use client";

import { useEffect, useState } from "react";
import { Linkedin, Plus, Trash2, Save, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LinkedinPost {
  id: string;
  title: string;
  url: string;
  description: string;
  date: string;
  createdAt: string;
}

export default function AdminLinkedinPosts() {
  const [posts, setPosts] = useState<LinkedinPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    date: ""
  });

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const res = await fetch("/api/admin/linkedin-posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error("Failed to load LinkedIn posts:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url || !form.description) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/linkedin-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: form.date || new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        })
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ title: "", url: "", description: "", date: "" });
        setShowAddForm(false);
        await loadPosts();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save post:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this LinkedIn post item?")) return;

    try {
      const res = await fetch(`/api/admin/linkedin-posts?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await loadPosts();
      }
    } catch (e) {
      console.error("Failed to delete post:", e);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading LinkedIn Feed Curator...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            LinkedIn Feed Curator <Linkedin className="w-5 h-5 text-sky-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Add LinkedIn updates manually to bypass API blocks.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Post</span>
        </button>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold max-w-2xl"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>LinkedIn post aggregated successfully! Live feed cache invalidated.</span>
        </motion.div>
      )}

      {/* Form overlay/container */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glassmorphism p-6 rounded-2xl border border-slate-900 space-y-4 max-w-2xl overflow-hidden"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Post Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Master OOP Theme Architecture in WordPress"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-sans"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn Post URL</label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://www.linkedin.com/posts/..."
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Display Date (Optional)</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="e.g., Jun 30, 2026"
                  className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Post Content Teaser</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Write or copy-paste a quick preview of your LinkedIn post..."
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 transition-colors resize-none font-sans"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Post..." : "Save to Feed"}</span>
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setForm({ title: "", url: "", description: "", date: "" }); }}
                className="px-5 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* List items */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Curated Posts ({posts.length})</h2>
        
        {posts.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 border border-slate-900 rounded-2xl">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No curated LinkedIn posts found.</p>
            <p className="text-[10px] text-slate-600 mt-1">Click &quot;Add Custom Post&quot; above to add your first update.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="glassmorphism p-5 rounded-2xl border border-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-800 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">{post.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 max-w-3xl leading-relaxed">{post.description}</p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="View Original Post"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2.5 bg-red-950/40 hover:bg-red-900 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
