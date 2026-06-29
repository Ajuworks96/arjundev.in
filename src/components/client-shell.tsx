"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "./theme-provider";
import LenisProvider from "./lenis-provider";
import Navbar from "./navbar";
import CommandMenu from "./command-menu";
import AskArjunWidget from "./ask-arjun-widget";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Set variables for radial gradient follower
      document.documentElement.style.setProperty("--x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <ThemeProvider>
      <LenisProvider>
        {/* Global Premium Background Canvas (Clean mesh auroras and elegant grids) */}
        <div className="fixed inset-0 -z-50 overflow-hidden bg-white dark:bg-[#050912] pointer-events-none transition-colors duration-500 select-none">
          {/* Delicate grid lines overlay with a radial mask to fade at edges */}
          <div className="absolute inset-0 grid-bg grid-mask opacity-[0.16] dark:opacity-[0.09]" />
          
          {/* Ambient Cosmic Lights (Vibrant but premium, no busy particles) */}
          {/* Top-Right Solar Gold Aura */}
          <div className="absolute -top-[25%] -right-[15%] w-[65vw] h-[65vw] rounded-full bg-yellow-500/[0.08] dark:bg-yellow-500/[0.06] blur-[130px]" />
          
          {/* Top-Left Deep Indigo Aura */}
          <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-indigo-600/[0.06] dark:bg-indigo-500/[0.05] blur-[120px]" />
          
          {/* Center-Bottom Soft Warm Amber/Rose Aura */}
          <div className="absolute -bottom-[25%] left-1/3 w-[60vw] h-[60vw] rounded-full bg-rose-500/[0.05] dark:bg-amber-500/[0.04] blur-[140px]" />
        </div>

        {/* Cursor spotlight follower */}
        <div className="fixed inset-0 pointer-events-none z-0 cursor-glow" />

        {/* Global Navigation bar */}
        <Navbar onOpenSearch={() => setSearchOpen(true)} />

        {/* Command Menu Search Overlay */}
        <CommandMenu 
          open={searchOpen} 
          setOpen={setSearchOpen} 
          onOpenAI={() => setAiOpen(true)} 
        />

        {/* Ask Arjun Chat drawer */}
        <AskArjunWidget isOpen={aiOpen} setIsOpen={setAiOpen} />

        {/* Main Content Area */}
        <main className="flex-1 w-full relative z-10 pt-28">
          {children}
        </main>

        {/* Premium Cinematic Footer */}
        <footer className="relative z-10 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200/50 dark:border-slate-800/50 py-12 mt-20">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm font-black text-slate-900 dark:text-white">
                arjundev<span className="text-blue-600 dark:text-blue-500">.in</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Web Developer by Profession &bull; Mentor by Passion.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link href="/journey" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Journey</Link>
              <Link href="/projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Projects</Link>
              <Link href="/mentorship" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Mentorship</Link>
              <Link href="/notes" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Notes</Link>
              <Link href="/media" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Media</Link>
              <Link href="/now" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Now</Link>
              <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
            </div>

            <div className="text-xs text-slate-400 text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} Arjun. All rights reserved.</p>
              <p className="mt-1 flex items-center justify-center md:justify-end gap-1">
                Built with Next.js &amp; Tailwind &bull; 
                <button onClick={() => setSearchOpen(true)} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5">
                  Menu (⌘K) <ArrowUpRight className="w-3 h-3" />
                </button>
              </p>
            </div>
          </div>
        </footer>
      </LenisProvider>
    </ThemeProvider>
  );
}
