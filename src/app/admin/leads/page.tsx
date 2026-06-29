"use client";

import { useEffect, useState } from "react";
import { Mail, Download, Search, MessageSquare, Filter, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLeadsManager() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
          setFilteredLeads(data);
        }
      } catch (e) {
        console.error("Failed to load leads:", e);
      } finally {
        setLoading(false);
      }
    }
    loadLeads();
  }, []);

  useEffect(() => {
    let result = leads;
    if (filterType !== "all") {
      result = result.filter((l) => l.type === filterType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) => 
          l.name.toLowerCase().includes(q) || 
          l.email.toLowerCase().includes(q) || 
          l.message.toLowerCase().includes(q)
      );
    }
    setFilteredLeads(result);
  }, [filterType, search, leads]);

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Subject", "Message", "Type", "Status", "Date"];
    const rows = filteredLeads.map((l) => [
      l.name,
      l.email,
      l.subject || "",
      l.message,
      l.type,
      l.status,
      new Date(l.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `arjundev-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Lead Hub...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Lead Contacts <Mail className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Track inquiries, newsletters, and capstone bookings.
          </p>
        </div>
        
        <button
          onClick={exportToCSV}
          disabled={filteredLeads.length === 0}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters Grid */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950/20 border border-slate-900 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3.5 py-2.5 rounded-xl w-full sm:max-w-xs focus-within:border-yellow-400/40">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full bg-transparent outline-none border-none text-xs text-white placeholder-slate-600 font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white cursor-pointer font-bold w-full sm:w-auto"
          >
            <option value="all" className="bg-slate-950 text-white font-bold">ALL LEADS</option>
            <option value="contact" className="bg-slate-950 text-white font-bold">CONTACT FORMS</option>
            <option value="booking" className="bg-slate-950 text-white font-bold">BOOKINGS</option>
            <option value="newsletter" className="bg-slate-950 text-white font-bold">NEWSLETTERS</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glassmorphism rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-900 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="p-4 px-6">Name</th>
                <th className="p-4 px-6">Email</th>
                <th className="p-4 px-6">Type</th>
                <th className="p-4 px-6">Message excerpt</th>
                <th className="p-4 px-6 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/40 text-xs text-slate-300">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center font-semibold text-slate-500 uppercase tracking-widest">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-slate-600" />
                      <span>No leads match search conditions</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="p-4 px-6 font-bold text-white">{lead.name}</td>
                    <td className="p-4 px-6 font-mono">{lead.email}</td>
                    <td className="p-4 px-6">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase border ${
                        lead.type === "newsletter" 
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                          : lead.type === "booking"
                          ? "bg-amber-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {lead.type}
                      </span>
                    </td>
                    <td className="p-4 px-6 max-w-xs truncate" title={lead.message}>
                      {lead.message}
                    </td>
                    <td className="p-4 px-6 text-right text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
