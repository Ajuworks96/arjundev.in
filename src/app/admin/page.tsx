"use client";

import { useEffect, useState } from "react";
import { 
  Users, Mail, Briefcase, Settings, 
  ArrowRight, ShieldAlert, Sparkles, MessageSquare 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboardOverview() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    leadsCount: 0,
    projectsCount: 0,
    cmsProvider: "Local Database",
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [leadsRes, projectsRes, cmsRes] = await Promise.all([
          fetch("/api/leads"),
          fetch("/api/admin/projects"),
          fetch("/api/admin/settings")
        ]);

        if (leadsRes.ok && projectsRes.ok && cmsRes.ok) {
          const leadsData = await leadsRes.json();
          const projectsData = await projectsRes.json();
          const cmsData = await cmsRes.json();

          setLeads(leadsData.slice(0, 5)); // show top 5 recent leads
          setStats({
            leadsCount: leadsData.length,
            projectsCount: projectsData.length,
            cmsProvider: cmsData.provider || "Local Database",
          });
        }
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const statCards = [
    { label: "Total Leads Captured", value: stats.leadsCount, icon: Mail, color: "text-yellow-400", bg: "bg-yellow-400/5" },
    { label: "Active Case Studies", value: stats.projectsCount, icon: Briefcase, color: "text-indigo-400", bg: "bg-indigo-400/5" },
    { label: "Active CMS Adapter", value: stats.cmsProvider, icon: Settings, color: "text-emerald-400", bg: "bg-emerald-400/5" },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Control Center...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glassmorphism p-8 rounded-2xl border border-slate-900 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Control Center <Sparkles className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Manage your personal brand, courses, and consults.
          </p>
        </div>
        <Link 
          href="/admin/settings"
          className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all self-start md:self-auto cursor-pointer"
        >
          <span>CMS Settings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              key={card.label}
              className="glassmorphism p-6 rounded-2xl border border-slate-900 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.label}</p>
                <p className="text-xl font-black text-white">{card.value}</p>
              </div>
              <div className={`p-3.5 rounded-xl ${card.bg} ${card.color} border border-slate-800/60`}>
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Leads Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Incoming Leads &amp; Signups</h3>
            <Link href="/admin/leads" className="text-[10px] font-bold text-yellow-400 hover:underline uppercase tracking-wide">
              View All Leads &rarr;
            </Link>
          </div>

          <div className="glassmorphism rounded-2xl border border-slate-900 overflow-hidden divide-y divide-slate-900/60">
            {leads.length === 0 ? (
              <div className="p-8 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest flex flex-col items-center gap-2">
                <MessageSquare className="w-6 h-6 text-slate-600" />
                <span>No message leads received yet</span>
              </div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/10 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <p className="text-xs font-black text-white">{lead.name}</p>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase border ${
                        lead.type === "newsletter" 
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {lead.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{lead.email}</p>
                    <p className="text-xs text-slate-350 line-clamp-1 mt-1">{lead.message}</p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Operations Bento */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Quick Operations</h3>
          <div className="glassmorphism p-6 rounded-2xl border border-slate-900 space-y-4 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500/[0.015] rounded-full blur-[80px] pointer-events-none" />
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Brand Nodes</p>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/admin/profile"
                className="p-3 bg-slate-950/60 hover:bg-slate-900/60 border border-slate-800 rounded-xl text-center text-xs font-bold text-slate-300 hover:text-white transition-all uppercase tracking-wide"
              >
                Edit Bio
              </Link>
              <Link 
                href="/admin/hero"
                className="p-3 bg-slate-950/60 hover:bg-slate-900/60 border border-slate-800 rounded-xl text-center text-xs font-bold text-slate-300 hover:text-white transition-all uppercase tracking-wide"
              >
                Hero Text
              </Link>
              <Link 
                href="/admin/journey"
                className="p-3 bg-slate-950/60 hover:bg-slate-900/60 border border-slate-800 rounded-xl text-center text-xs font-bold text-slate-300 hover:text-white transition-all uppercase tracking-wide"
              >
                Milestones
              </Link>
              <Link 
                href="/admin/projects"
                className="p-3 bg-slate-950/60 hover:bg-slate-900/60 border border-slate-800 rounded-xl text-center text-xs font-bold text-slate-300 hover:text-white transition-all uppercase tracking-wide"
              >
                Case Studies
              </Link>
            </div>
            <div className="pt-2 border-t border-slate-900/60 flex items-center gap-2 text-[10px] text-yellow-400 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>System security is optimal.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
