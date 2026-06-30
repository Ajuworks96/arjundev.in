"use client";

import { usePathname, useRouter } from "next/navigation";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { 
  LayoutDashboard, User, Sparkles, Milestone, Briefcase, 
  FileText, Image, Mail, Settings, LogOut, ChevronRight, Menu, X, Linkedin
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state checks
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050912] text-slate-400 font-semibold uppercase tracking-wider text-xs">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span>Synchronizing Brand Session...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Profile Settings", href: "/admin/profile", icon: User },
    { label: "Hero Banner", href: "/admin/hero", icon: Sparkles },
    { label: "Journey Timeline", href: "/admin/journey", icon: Milestone },
    { label: "Projects / Case Studies", href: "/admin/projects", icon: Briefcase },
    { label: "Blog Editor", href: "/admin/blog", icon: FileText },
    { label: "LinkedIn Posts", href: "/admin/linkedin-posts", icon: Linkedin },
    { label: "Media Library", href: "/admin/media", icon: Image },
    { label: "Lead Contacts", href: "/admin/leads", icon: Mail },
    { label: "CMS Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#050912] text-slate-100 selection:bg-yellow-500/20 relative overflow-hidden">
      {/* Background canvas elements */}
      <div className="absolute inset-0 grid-bg opacity-[0.06] grid-mask pointer-events-none" />

      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:flex flex-col w-64 shrink-0 bg-[#070b16]/80 border-r border-slate-900/60 backdrop-blur-xl relative z-30 transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full -mr-64"
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-slate-900/60 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-white uppercase">
              arjundev<span className="text-yellow-400">.in</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 font-bold border border-yellow-400/20">ADMIN</span>
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider group transition-all ${
                  active 
                    ? "bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/10 font-black" 
                    : "text-slate-400 hover:bg-slate-900/40 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-slate-950" : "text-slate-500 group-hover:text-yellow-400 transition-colors"}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${active ? "text-slate-950" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"}`} />
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-900/60 bg-slate-950/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-xs">
              AJ
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-[120px]">{session?.user?.name || "Arjun"}</p>
              <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">SuperAdmin</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="p-1.5 hover:bg-slate-900/60 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-20">
        {/* Top Header bar */}
        <header className="h-16 border-b border-slate-900/60 px-6 bg-[#050912]/80 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-900/60 text-slate-400 hover:text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-black tracking-tight text-white uppercase">
              {navItems.find((item) => item.href === pathname)?.label || "Overview Control"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span>Server Time: {new Date().toLocaleDateString()}</span>
            <Link 
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300 hover:text-white transition-all"
            >
              Preview Live Site &rarr;
            </Link>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
