"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, ArrowLeft, Code, Figma, Database, 
  ExternalLink, Layers, Search, LayoutList, Trophy 
} from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  tagline: string;
  summary: string;
  problem: string;
  research: string;
  process: string;
  design: string;
  development: string;
  result: string;
  stack: string[];
  role: string;
  impact: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "clinic-booking",
    title: "VB Clinic Booking Pro",
    category: "WordPress OOP Plugin",
    tagline: "Custom appointment scheduler built with modular, object-oriented PHP and MySQL.",
    summary: "Created a high-converting WordPress plugin replacing bulky, slow calendar scripts with a clean glassmorphic wizard, custom SQL queries, and administrative controls.",
    problem: "Existing booking plugins generated massive database bloat, lacked slot capacity rules, and looked like generic 2012 portals, driving bounce rates on client scheduling pages.",
    research: "Analyzed 15 dental and medical clinics. Found that users abandon scheduling if the time selector takes more than 3 steps or fails to load instantly on mobile devices.",
    process: "Mapped database entities. Built custom MySQL tables (`wp_vb_bookings`, `wp_vb_doctors`) to isolate queries from main WordPress options tables. Coded admin routing controllers.",
    design: "Designed a floating wizard with soft glassmorphism filters, large finger-friendly time block cards, and step-by-step navigation cues that keep layout shifts to zero.",
    development: "Coded using strict Object-Oriented Programming (OOP) in PHP, decoupling the UI renderer from DB actions. Integrated responsive AJAX handlers to dynamically check slot availability.",
    result: "Reduced average scheduling completion time from 4 minutes to 45 seconds. Cut plugin load times by 75% compared to legacy competitors. Zero SQL queries leak outside isolated booking requests.",
    stack: ["WordPress PHP OOP", "MySQL Custom Tables", "AJAX", "Tailwind CSS"],
    role: "Lead Plugin Architect",
    impact: "+40% Increase in Completed Bookings"
  },
  {
    id: "velvetbyte-storefront",
    title: "Velvetbyte Brand Store",
    category: "Next.js & Shopify Web App",
    tagline: "High-end headless commerce engine with dynamic animations and instant loads.",
    summary: "Built a customized Shopify storefront using Next.js App Router and Tailwind, connecting products via Shopify Storefront GraphQL API to yield premium page transitions.",
    problem: "Standard Liquid themes on Shopify struggled to provide elegant smooth page transitions, causing jarring jumps that interrupted visual immersion on high-end design assets.",
    research: "Benchmarked premium UI stores (Linear, Raycast, Apple). Identified that smooth route transitions and pre-loaded assets increase cart values by keeping visual focus consistent.",
    process: "Created a centralized state engine for cart synchronization. Set up webhooks to sync product metadata. Configured static route generation with incremental static regeneration.",
    design: "Structured dark-mode glass layouts, slide-in sidebar overlays, and visual item reveals utilizing Framer Motion's shared layout capabilities.",
    development: "Written fully in TypeScript. Leveraged Next.js route caching. Integrated Lenis scroll kinetics and CSS-driven backdrop blur filters to achieve premium UI mechanics.",
    result: "Achieved a 98/100 Lighthouse performance rating. Decreased load latency to under 300ms, and increased digital catalog product views by 65%.",
    stack: ["Next.js App Router", "Shopify GraphQL API", "Framer Motion", "TypeScript"],
    role: "Senior Frontend Engineer & Founder",
    impact: "98 Lighthouse Score & Under 300ms Load"
  },
  {
    id: "lms-career-hub",
    title: "Mentor Mode LMS",
    category: "Next.js Learning Platform",
    tagline: "Practical developer roadmap builder and student tracking portal.",
    summary: "Designed and engineered an online learning management system from scratch to support personalized onboarding roadmaps and review logging for career transitioners.",
    problem: "Generic LMS portals (Udemy, Teachable) treat all students the same. Self-taught aspirants need customized tracks, interactive roadmaps, and active mentoring checkpoints.",
    research: "Interviewed 50 coding students. Discovered that lack of structure, rather than lack of content, is the #1 reason why students fail to complete self-paced coding courses.",
    process: "Constructed onboarding wizard database tables. Coded personalized recommendation logic. Set up real-time progress logging triggers on milestone completions.",
    design: "Applied a dashboard grid showing current goals, active modules, and teacher review queues. Kept visual density low to prevent cognitive overload for beginners.",
    development: "Engineered client-side dashboard routing using Next.js route handlers. Implemented custom tracking middleware and responsive layout modules.",
    result: "Helped 1000+ students chart their learning schedules. Increased course completion metrics by 3.5x compared to standard slide-based courses.",
    stack: ["Next.js App Router", "PostgreSQL", "Tailwind CSS", "Lucide React"],
    role: "Full-Stack Architect",
    impact: "3.5x Higher Course Completion Rate"
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-16">
      
      {/* Page Header */}
      {!selectedProject && (
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">PORTFOLIO ARCHIVES</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Premium Case Studies
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            I don&apos;t just post screenshots. Here are detailed breakdowns of real problems, technical architecture, and the final results.
          </p>
        </section>
      )}

      <AnimatePresence mode="wait">
        {!selectedProject ? (
          // Grid View
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {CASE_STUDIES.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -6 }}
                className="glassmorphism p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                    <span>{project.category}</span>
                    <span className="text-blue-600 dark:text-blue-500">{project.impact}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{project.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{project.tagline}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.stack.map((item) => (
                      <span key={item} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-850 text-slate-550 dark:text-slate-400 rounded-md border border-slate-200/50 dark:border-slate-850/50">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-slate-800/40">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full flex items-center justify-center gap-1.5 py-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold rounded-2xl shadow-md transition-colors cursor-pointer"
                  >
                    <span>Read Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Detail Case Study View
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            {/* Back button & Header metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Case Studies</span>
              </button>
              
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <span>Role: {selectedProject.role}</span>
                <span>&bull;</span>
                <span className="text-emerald-500 font-bold">{selectedProject.impact}</span>
              </div>
            </div>

            {/* Title Block */}
            <div className="space-y-4 border-b border-slate-200/40 dark:border-slate-800/40 pb-8">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">{selectedProject.category}</span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">{selectedProject.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">{selectedProject.summary}</p>
            </div>

            {/* Grid structure for case analysis */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              {/* Left Column (Content sections) */}
              <div className="md:col-span-8 space-y-8">
                
                {/* PROBLEM */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-rose-500" />
                    The Problem
                  </h3>
                  <p className="text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">{selectedProject.problem}</p>
                </div>

                {/* RESEARCH */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-amber-500" />
                    Research &amp; Analysis
                  </h3>
                  <p className="text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">{selectedProject.research}</p>
                </div>

                {/* PROCESS */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <LayoutList className="w-4 h-4 text-indigo-500" />
                    The Process &amp; Architecture
                  </h3>
                  <p className="text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">{selectedProject.process}</p>
                </div>

                {/* DESIGN */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Figma className="w-4 h-4 text-pink-500" />
                    Design &amp; Interactive Flow
                  </h3>
                  <p className="text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">{selectedProject.design}</p>
                </div>

                {/* DEVELOPMENT */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-sky-500" />
                    Development &amp; Engineering
                  </h3>
                  <p className="text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">{selectedProject.development}</p>
                </div>

                {/* RESULTS */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    Final Results &amp; Legacy
                  </h3>
                  <p className="text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">{selectedProject.result}</p>
                </div>

              </div>

              {/* Right Column (Sidebar specs) */}
              <div className="md:col-span-4 space-y-6">
                <div className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Case Specifications</h4>
                  
                  <div>
                    <span className="text-[10px] text-slate-450 uppercase block font-semibold">Tech Stack</span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedProject.stack.map((item) => (
                        <span key={item} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-slate-200/50 dark:bg-slate-800/50" />

                  <div>
                    <span className="text-[10px] text-slate-450 uppercase block font-semibold">Project Role</span>
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-150 block mt-1">{selectedProject.role}</span>
                  </div>

                  <div className="h-px bg-slate-200/50 dark:bg-slate-800/50" />

                  <div>
                    <span className="text-[10px] text-slate-450 uppercase block font-semibold">Direct Outcome</span>
                    <span className="text-xs font-black text-emerald-500 block mt-1">{selectedProject.impact}</span>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-full flex items-center justify-center gap-1.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Projects</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
