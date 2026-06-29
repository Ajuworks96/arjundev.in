"use client";

import { useEffect, useState } from "react";
import { Milestone, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminJourneyManager() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);
  const [success, setSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [mindset, setMindset] = useState("");
  const [lessons, setLessons] = useState("");
  const [achievements, setAchievements] = useState("");
  const [technologies, setTechnologies] = useState("");

  const loadJourney = async () => {
    try {
      const res = await fetch("/api/admin/journey");
      if (res.ok) {
        const data = await res.json();
        setMilestones(data);
      }
    } catch (e) {
      console.error("Failed to load journey:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourney();
  }, []);

  const openAddModal = () => {
    setEditingMilestone(null);
    setRole("");
    setOrganization("");
    setPeriod("");
    setDescription("");
    setMindset("");
    setLessons("");
    setAchievements("");
    setTechnologies("");
    setModalOpen(true);
  };

  const openEditModal = (ms: any) => {
    setEditingMilestone(ms);
    setRole(ms.role);
    setOrganization(ms.organization);
    setPeriod(ms.period);
    setDescription(ms.description);
    setMindset(ms.mindset || "");
    setLessons(ms.lessons?.join(", ") || "");
    setAchievements(ms.achievements?.join(", ") || "");
    setTechnologies(ms.technologies?.join(", ") || "");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      const res = await fetch(`/api/admin/journey?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        loadJourney();
      }
    } catch (e) {
      console.error("Error deleting milestone:", e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: editingMilestone?.id,
      role,
      organization,
      period,
      description,
      mindset,
      lessons: lessons.split(",").map(s => s.trim()).filter(Boolean),
      achievements: achievements.split(",").map(s => s.trim()).filter(Boolean),
      technologies: technologies.split(",").map(s => s.trim()).filter(Boolean),
      orderIndex: editingMilestone ? editingMilestone.orderIndex : milestones.length,
    };

    try {
      const url = "/api/admin/journey";
      const method = editingMilestone ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        loadJourney();
      }
    } catch (e) {
      console.error("Error saving milestone:", e);
    }
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= milestones.length) return;

    const items = [...milestones];
    // Swap Order Indices
    const temp = items[index].orderIndex;
    items[index].orderIndex = items[targetIndex].orderIndex;
    items[targetIndex].orderIndex = temp;

    // Swap elements in local state array
    const [movedItem] = items.splice(index, 1);
    items.splice(targetIndex, 0, movedItem);

    setMilestones(items);

    try {
      await fetch("/api/admin/journey", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items.map((it, idx) => ({ id: it.id, orderIndex: idx }))),
      });
    } catch (e) {
      console.error("Failed to save reordering:", e);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Journey Map...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Journey Milestones <Milestone className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Add career milestones and reorder your brand story timeline.
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Timeline synchronized successfully! Live interactive map is updated.</span>
        </motion.div>
      )}

      {/* List items */}
      <div className="glassmorphism rounded-2xl border border-slate-900 overflow-hidden shadow-2xl divide-y divide-slate-900/60">
        {milestones.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            No milestones added. Get started by clicking Add Milestone!
          </div>
        ) : (
          milestones.map((ms, index) => (
            <div key={ms.id} className="p-5 flex items-center justify-between gap-6 hover:bg-slate-900/10 transition-colors">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-white">{ms.role}</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 font-bold">{ms.period}</span>
                </div>
                <p className="text-xs text-slate-400 font-semibold">{ms.organization}</p>
                <p className="text-xs text-slate-450 line-clamp-1 max-w-2xl">{ms.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-slate-500 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === milestones.length - 1}
                  className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-slate-500 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => openEditModal(ms)}
                  className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-yellow-400 cursor-pointer ml-2"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(ms.id)}
                  className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
              className="bg-[#070b16] border border-slate-850 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-4 px-6 border-b border-slate-900/60 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  {editingMilestone ? "Edit Milestone" : "Add Milestone"}
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role / Job Title</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Web Developer"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Organization</label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Velvetbyte"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Period / Timeline tag</label>
                    <input
                      type="text"
                      required
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      placeholder="e.g. 2024 - Present"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mindset Quote</label>
                    <input
                      type="text"
                      value={mindset}
                      onChange={(e) => setMindset(e.target.value)}
                      placeholder="e.g. Immersed in OOP scripts"
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of responsibilities..."
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Lessons Learned (Comma Separated)</label>
                  <input
                    type="text"
                    value={lessons}
                    onChange={(e) => setLessons(e.target.value)}
                    placeholder="Patience is key, Clean CSS structures"
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Achievements (Comma Separated)</label>
                  <input
                    type="text"
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    placeholder="Shipped 30+ shops, Reduced load times"
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Technologies Utilized (Comma Separated)</label>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="Next.js, Tailwind v4, Prisma"
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white placeholder-slate-655 font-mono"
                  />
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
                    <span>Save Milestone</span>
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
