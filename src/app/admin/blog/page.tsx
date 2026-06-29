"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Edit2, Trash2, Save, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBlogManager() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [success, setSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState("");
  const [draft, setDraft] = useState(true);

  const loadArticles = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (e) {
      console.error("Failed to load articles:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openAddModal = () => {
    setEditingArticle(null);
    setTitle("");
    setSlug("");
    setContent("");
    setTags("");
    setCategories("");
    setDraft(true);
    setModalOpen(true);
  };

  const openEditModal = (art: any) => {
    setEditingArticle(art);
    setTitle(art.title);
    setSlug(art.slug);
    setContent(art.content);
    setTags(art.tags?.join(", ") || "");
    setCategories(art.categories?.join(", ") || "");
    setDraft(art.draft);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        loadArticles();
      }
    } catch (e) {
      console.error("Error deleting article:", e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: editingArticle?.id,
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      content,
      tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      categories: categories.split(",").map(s => s.trim()).filter(Boolean),
      draft,
    };

    try {
      const url = "/api/admin/blog";
      const method = editingArticle ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        loadArticles();
      }
    } catch (e) {
      console.error("Error saving article:", e);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Blog Manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Blog Articles <FileText className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Draft, publish, and structure technical articles and newsletters.
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Articles synchronized successfully! Blog section refreshed.</span>
        </motion.div>
      )}

      {/* Articles Grid */}
      <div className="glassmorphism rounded-2xl border border-slate-900 overflow-hidden shadow-2xl divide-y divide-slate-900/60">
        {articles.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            No articles drafted yet. Get started by clicking New Article!
          </div>
        ) : (
          articles.map((art) => (
            <div key={art.id} className="p-5 flex items-center justify-between gap-6 hover:bg-slate-900/10 transition-colors">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-white">{art.title}</h3>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase border ${
                    art.draft 
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" 
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}>
                    {art.draft ? "Draft" : "Published"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">/{art.slug}</p>
                <p className="text-[10px] text-slate-500">
                  Created: {new Date(art.createdAt).toLocaleDateString()} 
                  {art.publishedAt && ` &bull; Published: ${new Date(art.publishedAt).toLocaleDateString()}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(art)}
                  className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-yellow-400 cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(art.id)}
                  className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Modal Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#070b16] border border-slate-855 rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-4 px-6 border-b border-slate-900/60 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  {editingArticle ? "Edit Article" : "Write Article"}
                </h3>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 hover:bg-slate-900/60 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Article Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!editingArticle) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                      }}
                      placeholder="e.g. Master OOP WordPress"
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Slug (URL Target)</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="master-oop-wordpress"
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="WordPress, PHP, Tutorial"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categories (Comma Separated)</label>
                    <input
                      type="text"
                      value={categories}
                      onChange={(e) => setCategories(e.target.value)}
                      placeholder="WordPress, Web Dev"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Markdown Content Body</label>
                  <textarea
                    rows={12}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Your Article Markdown Goes Here..."
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-mono leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 select-none">
                  <input
                    type="checkbox"
                    id="draft-check"
                    checked={draft}
                    onChange={(e) => setDraft(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-yellow-400 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="draft-check" className="text-xs font-bold uppercase tracking-wider text-slate-300 cursor-pointer">
                    Keep as Draft (Unpublished)
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-900/60 flex items-center justify-end gap-3 bg-[#070b16] sticky bottom-0 z-10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Article</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
