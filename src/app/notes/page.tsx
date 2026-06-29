"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, Tag, BookOpen } from "lucide-react";

interface Note {
  id: string;
  title: string;
  category: "Coding" | "E-Commerce" | "Career";
  date: string;
  readTime: string;
  summary: string;
  content: string;
}

const NOTES: Note[] = [
  {
    id: "css-grid",
    title: "Why CSS Grid is Superior to Flexbox for App Layouts",
    category: "Coding",
    date: "Jun 24, 2026",
    readTime: "5 min read",
    summary: "Flexbox is perfect for one-dimensional layouts, but structuring whole application dashboards requires CSS Grid to maintain layout shifts at zero.",
    content: "When designing high-performance interfaces, layout shift (CLS) is a critical performance killer. Flexbox calculates widths dynamically based on item content, which can cause subtle jumps during initial renders as font styles load. CSS Grid defines column structures explicitly, ensuring that slots are reserved in the DOM before content mounts. Use Flexbox inside small UI modules (like navigation headers) and CSS Grid for layout layouts."
  },
  {
    id: "shopify-performance",
    title: "The 3 Pillars of Headless Shopify Store Performance",
    category: "E-Commerce",
    date: "Jun 18, 2026",
    readTime: "7 min read",
    summary: "How static route caching, image compression nodes, and light payment scripts decrease checkout latency to under 300ms.",
    content: "Speed directly impacts conversions. By taking Shopify headless with Next.js: first, leverage static site generation (SSG) with incremental static regeneration so users hit cached pages instantly. Second, route images through Next.js Image optimization components to compress layouts automatically. Third, defer non-essential scripts (like social widgets) until after the cart interaction occurs."
  },
  {
    id: "career-transition",
    title: "How I Transitioned from HR Recruiting to Full-Time Coding",
    category: "Career",
    date: "Jun 10, 2026",
    readTime: "8 min read",
    summary: "The practical roadmap, portfolio rules, and interview strategies I used to bridge the self-taught tech gap.",
    content: "My transition out of HR was challenging. Reading resumes taught me that hiring managers are bored of standard template portfolios. They want to see problem-solving logic. When I learned PHP OOP and JavaScript, I built tools that solved problems (like automating Excel exports) rather than simple generic clone scripts. Highlight your process, explain your failures, and display functional github code."
  },
  {
    id: "wordpress-oop",
    title: "WordPress OOP: The Standard for Modern Scale Plugins",
    category: "Coding",
    date: "May 28, 2026",
    readTime: "6 min read",
    summary: "Decoupling databases, actions, and views in WordPress PHP plugins using clean Object-Oriented design patterns.",
    content: "Most WordPress plugins fail because they dump procedural code into a single file. By adopting OOP: separate your main logic into Controller classes, abstract database queries into isolated Repository modules, and restrict template renders to isolated View scripts. This makes testing easy and prevents conflicts with other plugins."
  }
];

export default function Notes() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const filteredNotes = NOTES.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) || 
                          note.summary.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag === "All" || note.category === activeTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
      
      {/* Header */}
      {!selectedNote && (
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">WEEKLY INSIGHTS</span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Notes &amp; Writings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Deep-dives into frontend architecture, e-commerce optimization, and career transition experiences.
          </p>
        </section>
      )}

      <AnimatePresence mode="wait">
        {!selectedNote ? (
          // List/Grid View
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
              {/* Tags */}
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                {["All", "Coding", "E-Commerce", "Career"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTag === tag
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                        : "bg-slate-100 hover:bg-slate-200/60 text-slate-650 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-400"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Search bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  whileHover={{ y: -4 }}
                  className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase">
                      <span className="text-blue-650 dark:text-blue-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {note.category}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {note.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {note.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                    <button
                      onClick={() => setSelectedNote(note)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group cursor-pointer"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {filteredNotes.length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-400 text-sm">
                  No articles matched your current filters.
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          // Single Note Detail view
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <button
              onClick={() => setSelectedNote(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer w-fit"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Articles</span>
            </button>

            <div className="space-y-4 border-b border-slate-200/40 dark:border-slate-800/40 pb-6">
              <div className="flex flex-wrap gap-3 items-center text-[10px] text-slate-400 font-bold uppercase">
                <span className="text-blue-600 dark:text-blue-450">{selectedNote.category}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedNote.date}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedNote.readTime}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">{selectedNote.title}</h1>
              <p className="text-slate-555 dark:text-slate-400 text-sm leading-relaxed italic">{selectedNote.summary}</p>
            </div>

            <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p className="whitespace-pre-wrap">{selectedNote.content}</p>
            </article>

            <div className="pt-8 border-t border-slate-200/40 dark:border-slate-800/40 flex justify-end">
              <button
                onClick={() => setSelectedNote(null)}
                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-750 dark:text-slate-350 text-xs font-bold rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Return to Directory
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
