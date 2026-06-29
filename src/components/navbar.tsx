"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { Search, Moon, Sun, Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { href: "/journey", label: "Journey" },
  { href: "/projects", label: "Projects" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/notes", label: "Notes" },
  { href: "/media", label: "Media" },
  { href: "/now", label: "Now" },
];

export default function Navbar({ 
  onOpenSearch 
}: { 
  onOpenSearch: () => void 
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-40">
      <nav className="glassmorphism rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg border border-slate-200/50 dark:border-slate-800/50">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-base font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-150">
            arjundev<span className="text-blue-600 dark:text-blue-500 font-bold group-hover:text-blue-700">.in</span>
          </span>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5">
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`relative px-3.5 py-1.5 text-xs font-semibold select-none rounded-lg transition-colors duration-150 ${
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {/* Active Indicator Slider */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Hover Slider */}
                {!isActive && hoveredLink === link.href && (
                  <motion.span
                    layoutId="hoverNavBackground"
                    className="absolute inset-0 bg-slate-100 dark:bg-slate-800/40 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2">
          {/* Cmd+K Search trigger (Desktop) */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/40 dark:border-slate-800/40 text-[10px] font-medium transition-colors cursor-pointer select-none"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded text-[8px] border border-slate-300/40 dark:border-slate-700/40">⌘K</kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Book Call CTA button */}
          <Link
            href="/contact"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span>Let&apos;s Build</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[80px] bg-slate-950/20 dark:bg-slate-950/40 backdrop-blur-sm z-30"
            />
            {/* Sliding Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[72px] left-0 w-full glassmorphism rounded-2xl p-4 shadow-xl border border-slate-200/50 dark:border-slate-800/50 z-40 flex flex-col gap-2"
            >
              {LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-blue-600/10 text-blue-600 dark:text-blue-400" 
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="h-px bg-slate-200/60 dark:bg-slate-800/60 my-2" />

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenSearch(); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 w-full text-left cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Portal (⌘K)</span>
              </button>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl text-center shadow-md"
              >
                <span>Let&apos;s Build Something Meaningful</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
