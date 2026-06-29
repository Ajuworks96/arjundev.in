"use client";

import { motion } from "framer-motion";
import { Book, Target, Activity, Code, Calendar } from "lucide-react";

export default function Now() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">LIVE FEED</span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          What I&apos;m Doing Now
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          This is a &ldquo;now page&rdquo; inspired by Derek Sivers. It details my active focus, books, and current experiments.
        </p>
      </section>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        
        {/* Active Focus */}
        <div className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            <span>Active Focus</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <span>Developing premium code templates &amp; assets at <strong>Velvetbyte</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <span>Mentoring the current active cohort of 45 career transitioners.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <span>Writing clean OOP codebase integrations for clinical scheduling utilities.</span>
            </li>
          </ul>
        </div>

        {/* Learning Tracks */}
        <div className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-500" />
            <span>Learning Stacks</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span>Deepening knowledge in <strong>Rust Programming</strong> for compiled backend utilities.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span>Experimenting with advanced React 19 Server Components rendering rules.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span>Optimizing database indexing schemes for heavy e-commerce requests.</span>
            </li>
          </ul>
        </div>

        {/* Books Reading */}
        <div className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Book className="w-5 h-5 text-amber-500" />
            <span>Books Reading</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>&ldquo;Show Your Work!&rdquo;</strong> by Austin Kleon &mdash; mastering online sharing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>&ldquo;Refactoring UI&rdquo;</strong> by Adam Wathan &mdash; polishing developer design eye.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>&ldquo;Atomic Habits&rdquo;</strong> by James Clear &mdash; building consistency code tracks.</span>
            </li>
          </ul>
        </div>

        {/* Active Goals */}
        <div className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <span>Quarterly Goals</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Ship 3 premium React open-source UI kits to GitHub.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Record and release 15 advanced theme-development video tutorials.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <span>Launch the Next.js personal branding ecosystem successfully at arjundev.in.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer log time */}
      <div className="max-w-md mx-auto text-center flex items-center justify-center gap-2 text-xs text-slate-400 select-none">
        <Calendar className="w-4 h-4 text-blue-500" />
        <span>Last updated: June 29, 2026</span>
      </div>
    </div>
  );
}
