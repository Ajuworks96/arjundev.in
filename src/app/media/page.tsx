"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Video, Youtube, ExternalLink, Calendar } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  category: "YouTube" | "Reels" | "Talks";
  date: string;
  duration: string;
  url: string;
  description: string;
}

const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "wp-tutorial",
    title: "How to Build a Custom WordPress Theme (OOP Boilerplate)",
    category: "YouTube",
    date: "May 15, 2026",
    duration: "42:15",
    url: "https://youtube.com",
    description: "An in-depth coding guide building a WordPress theme with modern PHP namespaces, separate view scripts, and custom tailwind setups."
  },
  {
    id: "cashier-mindset",
    title: "The Cashier to Developer Transition Mindset",
    category: "Reels",
    date: "Jun 02, 2026",
    duration: "0:58",
    url: "https://instagram.com",
    description: "A short clip on how to manage cognitive fatigue, study effectively after long work shifts, and maintain consistency."
  },
  {
    id: "nextjs-shopify",
    title: "Speed Audits: Building a Headless Shopify Storefront",
    category: "YouTube",
    date: "Apr 29, 2026",
    duration: "28:40",
    url: "https://youtube.com",
    description: "Benchmarking standard liquid themes against custom next.js page setups, optimizing images, and syncing cart tokens."
  },
  {
    id: "wp-headless-talk",
    title: "WordPress in the Age of Headless Web & AI Engines",
    category: "Talks",
    date: "Mar 12, 2026",
    duration: "18:22",
    url: "https://youtube.com",
    description: "A conference talk examining how custom block structures and API layers keep WordPress competitive alongside modern JS frameworks."
  }
];

export default function Media() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredMedia = MEDIA_ITEMS.filter(item => 
    activeCategory === "All" || item.category === activeCategory
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">MEDIA HUB</span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Media &amp; Video Library
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Watch code walkthroughs, design guides, and podcasts documenting the developer journey.
        </p>
      </section>

      {/* Category filters */}
      <div className="flex gap-1.5 overflow-x-auto w-full no-scrollbar justify-start sm:justify-center border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        {["All", "YouTube", "Reels", "Talks"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                : "bg-slate-100 hover:bg-slate-200/60 text-slate-650 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMedia.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className="glassmorphism rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Visual Header representing Video thumbnail */}
            <div className="aspect-video bg-slate-950 flex items-center justify-center relative group overflow-hidden">
              {/* Overlay play details */}
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 z-10">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <span className="absolute bottom-3 right-3 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded font-bold">{item.duration}</span>
              
              {/* Category indicator badge */}
              <span className="absolute top-3 left-3 text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            {/* Description Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  <span>Watch Content</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
