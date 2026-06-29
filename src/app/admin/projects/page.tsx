"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Plus, Edit2, Trash2, Globe, Github, Save, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [success, setSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [client, setClient] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("Draft");

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error("Failed to load projects:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setCategory("");
    setClient("");
    setRole("");
    setDuration("");
    setTechnologies("");
    setProblem("");
    setResult("");
    setGithubUrl("");
    setLiveUrl("");
    setFeatured(false);
    setStatus("Draft");
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category);
    setClient(p.client || "");
    setRole(p.role || "");
    setDuration(p.duration || "");
    setTechnologies(p.technologies?.join(", ") || "");
    setProblem(p.problem || "");
    setResult(p.result || "");
    setGithubUrl(p.githubUrl || "");
    setLiveUrl(p.liveUrl || "");
    setFeatured(p.featured || false);
    setStatus(p.status || "Draft");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        loadProjects();
      }
    } catch (e) {
      console.error("Error deleting project:", e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: editingProject?.id,
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      category,
      client,
      role,
      duration,
      technologies: technologies.split(",").map(s => s.trim()).filter(Boolean),
      problem,
      result,
      githubUrl,
      liveUrl,
      featured,
      status,
    };

    try {
      const url = "/api/admin/projects";
      const method = editingProject ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        loadProjects();
      }
    } catch (e) {
      console.error("Error saving project:", e);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Projects Manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Featured Projects <Briefcase className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Manage your visual web portfolios and case studies details.
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Case studies synchronized! Live projects grid updated.</span>
        </motion.div>
      )}

      {/* List items */}
      <div className="glassmorphism rounded-2xl border border-slate-900 overflow-hidden shadow-2xl divide-y divide-slate-900/60">
        {projects.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            No projects added. Get started by clicking Add Project!
          </div>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="p-5 flex items-center justify-between gap-6 hover:bg-slate-900/10 transition-colors">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-white">{p.title}</h3>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase border ${
                    p.status === "Published" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  }`}>
                    {p.status}
                  </span>
                  {p.featured && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-black uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      FEATURED
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">{p.category} &bull; {p.duration}</p>
                <div className="flex items-center gap-2 pt-1">
                  {p.liveUrl && <Link href={p.liveUrl} target="_blank" className="text-slate-500 hover:text-white transition-colors" title="Live Link"><Globe className="w-3.5 h-3.5" /></Link>}
                  {p.githubUrl && <Link href={p.githubUrl} target="_blank" className="text-slate-500 hover:text-white transition-colors" title="Github"><Github className="w-3.5 h-3.5" /></Link>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-yellow-400 cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
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
              className="bg-[#070b16] border border-slate-850 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-4 px-6 border-b border-slate-900/60 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  {editingProject ? "Edit Project" : "Add Project"}
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Project Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!editingProject) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                      }}
                      placeholder="e.g. Velvetbyte E-Commerce"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Slug (URL Target)</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="velvetbyte-ecommerce"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Next.js SaaS"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Client</label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="Agency Name"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 3 Weeks"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role In Project</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Lead Full-Stack"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white cursor-pointer font-bold"
                    >
                      <option value="Draft" className="bg-slate-950 text-white font-bold">Draft Mode</option>
                      <option value="Published" className="bg-slate-950 text-white font-bold">Publish to Grid</option>
                      <option value="Archived" className="bg-slate-950 text-white font-bold">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Technologies Utilized (Comma Separated)</label>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="React, Next.js, Framer Motion"
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Problem &amp; Goal Statement</label>
                  <textarea
                    rows={2}
                    required
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="What problem did the client have and what was your goal?"
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Result &amp; Case Study Conclusion</label>
                  <textarea
                    rows={3}
                    required
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="Details about outcomes, achievements, load-time reductions, etc."
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live URL</label>
                    <input
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://client-project.com"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GitHub Repository URL</label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/arjun/repo"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 select-none">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-yellow-400 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="featured-check" className="text-xs font-bold uppercase tracking-wider text-slate-300 cursor-pointer">
                    Feature on Homepage Grid
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
                    <span>Save Project</span>
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
