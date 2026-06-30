"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, BookOpen, GraduationCap, Laptop, Sparkles, 
  MapPin, CheckCircle, Lightbulb, Compass, Award, ScreenShare 
} from "lucide-react";

// Journey milestones dataset
interface Milestone {
  id: string;
  role: string;
  period: string;
  organization: string;
  description: string;
  lessons: string[];
  achievements: string[];
  technologies: string[];
  mindset: string;
}

const MILESTONES: Milestone[] = [
  {
    id: "iti",
    role: "ITI Student",
    period: "The Foundation",
    organization: "Technical Institute",
    description: "Ventured into vocational studies, discovering how mechanisms operate. First brush with technical architectures, learning diagnostics and physical problem-solving.",
    lessons: ["Every system has a logical structure.", "Hands-on diagnostic thinking starts here."],
    achievements: ["Scored top ranks in practical certifications.", "Developed discipline for complex system repair."],
    technologies: ["Engineering Graphics", "Diagnostic Tools"],
    mindset: "Uncertain about tech, but curious about mechanisms and structures."
  },
  {
    id: "cashier",
    role: "Supermarket Cashier",
    period: "Human Interface",
    organization: "Retail Chain",
    description: "Stood on the front lines of customer service. Processed transactions, managed inventory metrics, and dealt with hundreds of unique human personalities daily.",
    lessons: ["Patience is the foundation of customer experience.", "Speed and accuracy are non-negotiable."],
    achievements: ["Awarded star cashier of the month for zero-variance registers.", "Mastered high-pressure multitasking."],
    technologies: ["POS Terminal Systems", "Inventory Tracking"],
    mindset: "Striving for financial survival while observing user flow and human psychology."
  },
  {
    id: "marketing",
    role: "Marketing Manager",
    period: "Growth & Strategy",
    organization: "Digital Agency",
    description: "Led digital marketing initiatives, constructed optimized landing pages, and managed lead-gen conversion metrics. Leveraged web metrics to shape organic brand growth.",
    lessons: ["A beautiful site is useless if it doesn't convert.", "Branding is telling a consistent story."],
    achievements: ["Boosted client organic leads by 120% using content loops.", "Designed high-converting sales funnels."],
    technologies: ["WordPress Basics", "SEO Tools", "Google Analytics"],
    mindset: "Bridged design, communication, and basic HTML. Realizing that the web is a branding canvas."
  },
  {
    id: "developer",
    role: "Web Developer",
    period: "Self-Taught Execution",
    organization: "Freelance / Agency",
    description: "Began coding full-time. Customizing WordPress themes via PHP OOP, scripting custom JS interactions, and executing complex layouts from Figma mocks.",
    lessons: ["Clean code is readable code.", "WordPress is a robust application framework when built custom."],
    achievements: ["Shipped 50+ bespoke client websites.", "Developed modular plugin architectures for e-commerce checkouts."],
    technologies: ["WordPress PHP OOP", "JavaScript", "CSS Grid", "MySQL"],
    mindset: "Obsessed with clean code, standard conventions, and micro-interactions."
  },
  {
    id: "department-head",
    role: "Department Head",
    period: "Technical Leadership",
    organization: "Web Development Agency",
    description: "Managed a team of developers and designers. Oversaw architecture planning, code reviews, client delivery timelines, and project scope management.",
    lessons: ["Empower your team with clean specifications and standards.", "Align engineering goals with business objectives."],
    achievements: ["Standardized theme boilerplate, cutting delivery time by 30%.", "Supervised delivery of 25+ simultaneous projects."],
    technologies: ["Next.js", "Git Workflows", "Project Management Standards"],
    mindset: "System thinker, focusing on architectural efficiency, scale, and mentoring junior engineers."
  },
  {
    id: "mentor",
    role: "Career Mentor",
    period: "Empowering Others",
    organization: "Personal Brand",
    description: "Transitioned to sharing knowledge. Designing real-world bootcamps that bypass useless college theory and focus on building production-ready projects.",
    lessons: ["The best way to master a concept is to teach it.", "Practical portfolios land jobs, not degrees."],
    achievements: ["Guided over 1000 students to digital skills.", "Constructed customized career transition roadmap widgets."],
    technologies: ["Next.js", "Tailwind CSS", "Interactive Learning UI"],
    mindset: "Teacher-builder. Believing that background does not limit your trajectory."
  },
  {
    id: "brand-builder",
    role: "Personal Brand Builder",
    period: "Present Day",
    organization: "arjundev.in & Velvetbyte",
    description: "Documenting coding workflows, Shopify tricks, and AI automations in public. Building high-end client applications and creating assets for digital creators.",
    lessons: ["Build in public to build credibility.", "An online brand acts as a career multiplier."],
    achievements: ["Grown an organic follower footprint of digital professionals.", "Shaping Velvetbyte into a premium digital product studio."],
    technologies: ["Next.js App Router", "Shopify API", "Gemini AI Integrations"],
    mindset: "Visionary creator, looking to make arjundev.in the gold standard personal brand hub in India."
  }
];

// Digital DNA items
const DNA_NODES = [
  { name: "Developer", desc: "Crafting modular, optimized Next.js frameworks, PHP plugins, and e-commerce layers." },
  { name: "Mentor", desc: "Providing actionable paths for tech aspirants to transition into coding roles." },
  { name: "Creator", desc: "Writing code breakdowns, sharing strategies, and publishing developer videos." },
  { name: "Teacher", desc: "Breaking down complex programming concepts into digestible, real-world examples." },
  { name: "Entrepreneur", desc: "Co-founding Velvetbyte to build premium templates and custom client builds." },
  { name: "Learner", desc: "Continuously experimenting with Rust, AI integrations, and fresh UI patterns." },
  { name: "Builder", desc: "Putting systems together, writing boilerplates, and launching products publicly." },
  { name: "Public Speaker", desc: "Sharing transition stories and technical frameworks at meetups." }
];

// Workspace items
const WORKSPACE_ITEMS = [
  { id: "macbook", name: "MacBook Pro", x: "32%", y: "45%", desc: "The core compiler. Hosts Docker, VS Code, and standard browser testing suites." },
  { id: "vscode", name: "VS Code", x: "42%", y: "30%", desc: "Customized coding hub with Geist Mono fonts and strict ESLint triggers." },
  { id: "camera", name: "Camera Setup", x: "72%", y: "20%", desc: "Used to record high-definition tutorial videos, reels, and course assets." },
  { id: "mic", name: "Studio Mic", x: "62%", y: "38%", desc: "Ensures crystal-clear audio during mentoring sessions and podcast chats." },
  { id: "figma", name: "Figma UI", x: "20%", y: "55%", desc: "Where all case studies and custom client styles begin their visual design." },
  { id: "notebook", name: "Paper Notebook", x: "50%", y: "70%", desc: "Analog thoughts. Used to write algorithmic ideas and database schemas before coding." }
];

export default function Journey() {
  const [milestones, setMilestones] = useState<any[]>(MILESTONES);
  const [activeMilestone, setActiveMilestone] = useState<any>(MILESTONES[3]); // Defaults to Web Developer
  const [activeDna, setActiveDna] = useState<string | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);

  useEffect(() => {
    async function loadMilestones() {
      try {
        const res = await fetch("/api/admin/journey");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setMilestones(data);
            const devIndex = data.findIndex((m: any) => m.role === "Web Developer");
            setActiveMilestone(devIndex !== -1 ? data[devIndex] : data[0]);
          }
        }
      } catch (e) {
        console.error("Error loading milestones:", e);
      }
    }
    loadMilestones();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-24">
      
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">MY HISTORY</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          The Career Documentary
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          I started in non-technical roles, grinding cash registers and resume screens. Today, I lead development teams and mentor hundreds. Explore the timeline below.
        </p>
      </section>

      {/* ----------------- SECTION 03: INTERACTIVE CAREER TIMELINE ----------------- */}
      <section className="space-y-12">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Click milestones to unpack the archives</span>
          
          {/* Desktop/Tablet Horizontal Interactive Timeline Track */}
          <div className="hidden md:block w-full relative py-12 px-6 overflow-hidden">
            {/* Background line track */}
            <div className="absolute top-[60px] left-10 right-10 h-0.5 bg-slate-200 dark:bg-slate-800" />
            
            {/* Filled highlight line track */}
            <div 
              className="absolute top-[60px] left-10 h-0.5 bg-blue-650 dark:bg-blue-500 transition-all duration-500"
              style={{
                width: `calc(${(milestones.findIndex(m => m.id === activeMilestone.id) / (milestones.length - 1)) * 100}% - 40px)`
              }}
            />

            <div className="flex justify-between relative">
              {milestones.map((ms, index) => {
                const isSelected = activeMilestone.id === ms.id;
                const activeIndex = milestones.findIndex(m => m.id === activeMilestone.id);
                const isCompleted = activeIndex >= index;

                return (
                  <div key={ms.id} className="flex flex-col items-center flex-1 relative">
                    {/* Role Label */}
                    <span className={`text-[10px] font-black uppercase tracking-wider text-center h-8 mb-4 transition-colors duration-300 ${
                      isSelected 
                        ? "text-blue-650 dark:text-blue-400 font-extrabold" 
                        : isCompleted 
                          ? "text-slate-700 dark:text-slate-200" 
                          : "text-slate-400 dark:text-slate-500"
                    }`}>
                      {ms.role}
                    </span>

                    {/* Timeline Node dot */}
                    <button
                      onClick={() => setActiveMilestone(ms)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? "bg-blue-600 text-white scale-125 border-4 border-white dark:border-slate-950 ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/30" 
                          : isCompleted
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-white text-slate-400 border-2 border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-400"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    </button>

                    {/* Period Date text */}
                    <span className={`text-[9px] font-bold mt-3 transition-colors duration-305 ${
                      isSelected ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                    }`}>
                      {ms.period}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Vertical Stepper Navigation */}
          <div className="md:hidden w-full max-w-sm px-4 py-4">
            <div className="relative pl-6 space-y-4">
              {/* Vertical track background */}
              <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-slate-200 dark:bg-slate-800" />
              
              {/* Vertical track active highlight */}
              <div 
                className="absolute top-2 left-[19px] w-0.5 bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                style={{
                  height: `${(milestones.findIndex(m => m.id === activeMilestone.id) / (milestones.length - 1)) * 100}%`,
                  maxHeight: "calc(100% - 16px)"
                }}
              />

              {milestones.map((ms, index) => {
                const isSelected = activeMilestone.id === ms.id;
                const activeIndex = milestones.findIndex(m => m.id === activeMilestone.id);
                const isCompleted = activeIndex >= index;

                return (
                  <button
                    key={ms.id}
                    onClick={() => setActiveMilestone(ms)}
                    className="w-full flex items-center text-left relative focus:outline-none"
                  >
                    {/* Node circle */}
                    <div className={`absolute left-[-16px] w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-blue-600 ring-4 ring-blue-500/20 text-white"
                        : isCompleted 
                          ? "bg-blue-500 text-white"
                          : "bg-white border-2 border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-400"
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>

                    <div className={`p-3 pl-6 rounded-xl border transition-all duration-200 flex-1 ${
                      isSelected
                        ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-500/30"
                        : "border-transparent"
                    }`}>
                      <p className={`text-xs font-black uppercase tracking-wider ${isSelected ? "text-blue-600 dark:text-blue-450" : "text-slate-650 dark:text-slate-350"}`}>
                        {ms.role}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{ms.period}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Milestone Detail Card */}
        <div className="min-h-[380px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 glassmorphism p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl"
            >
              {/* Left Column - Intro */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{activeMilestone.period}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{activeMilestone.role}</h2>
                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">{activeMilestone.organization}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-2">{activeMilestone.description}</p>
                
                <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Milestone Mindset</p>
                  <p className="text-xs italic text-slate-600 dark:text-slate-400 mt-1 flex items-start gap-2">
                    <Compass className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>&ldquo;{activeMilestone.mindset}&rdquo;</span>
                  </p>
                </div>
              </div>

              {/* Right Column - Deep Details */}
              <div className="md:col-span-7 space-y-6">
                {/* Lessons */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Key Lessons
                  </h4>
                  <ul className="space-y-2">
                    {activeMilestone.lessons?.map((lesson: string, i: number) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    Milestone Achievements
                  </h4>
                  <ul className="space-y-2">
                    {activeMilestone.achievements?.map((ach: string, i: number) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-blue-500" />
                    Tools &amp; Skills Acquired
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMilestone.technologies?.map((tech: string, i: number) => (
                      <span key={i} className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ----------------- SECTION 04: DIGITAL DNA (FLOATING NETWORK GRID) ----------------- */}
      <section className="space-y-8 py-8 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">THE IDENTITY MATRIX</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Digital DNA</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hover over the facets of my professional configuration to examine descriptions.
          </p>
        </div>

        {/* Nodes Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {DNA_NODES.map((node) => {
            const isHovered = activeDna === node.name;
            return (
              <div
                key={node.name}
                onMouseEnter={() => setActiveDna(node.name)}
                onMouseLeave={() => setActiveDna(null)}
                className="relative group p-6 rounded-2xl bg-slate-50 hover:bg-blue-600/5 dark:bg-slate-900 dark:hover:bg-blue-500/5 border border-slate-200/50 dark:border-slate-800/50 cursor-pointer select-none transition-all duration-200 flex flex-col items-center text-center justify-center min-h-[120px]"
              >
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {node.name}
                </span>

                {/* Micro description box below or overlay */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[240px] z-20 p-4 bg-slate-950 text-white rounded-xl shadow-xl text-xs leading-relaxed text-center pointer-events-none border border-white/10"
                    >
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-950" />
                      {node.desc}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- SECTION 09: MY WORKSPACE ----------------- */}
      <section className="space-y-8 py-8 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">THE LAB SETUP</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Workspace &amp; Equipment</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A mapping of my daily developer workspace. Hover or click nodes to check their utility.
          </p>
        </div>

        {/* Desk hotspot mock representation */}
        <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
          {/* Subtle grid lines inside desk area for design texture */}
          <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

          <p className="text-xs font-semibold text-slate-400/80 dark:text-slate-600 uppercase tracking-widest select-none pointer-events-none">Interactive Workspace Blueprint</p>

          {/* Render interactive hotspots */}
          {WORKSPACE_ITEMS.map((item) => {
            const isActive = activeWorkspace === item.id;
            return (
              <div
                key={item.id}
                style={{ left: item.x, top: item.y }}
                className="absolute"
              >
                <button
                  onMouseEnter={() => setActiveWorkspace(item.id)}
                  onMouseLeave={() => setActiveWorkspace(null)}
                  onClick={() => setActiveWorkspace(isActive ? null : item.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white scale-125 border-2 border-white ring-4 ring-blue-500/20" 
                      : "bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                  }`}
                >
                  &bull;
                </button>

                {/* Hotspot details overlay */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute z-20 top-8 left-1/2 -translate-x-1/2 w-[220px] p-3.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl shadow-xl border border-white/10 dark:border-slate-200/50"
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider">{item.name}</h4>
                      <p className="text-[10px] mt-1.5 leading-normal opacity-90">{item.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brief Statement Footer */}
      <section className="text-center py-12 max-w-2xl mx-auto space-y-4">
        <h3 className="text-lg italic text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          &ldquo;Your origin does not dictate your destination. Keep building, one milestone at a time.&rdquo;
        </h3>
        <p className="text-xs uppercase font-bold tracking-widest text-slate-400">&mdash; Arjun</p>
      </section>
    </div>
  );
}
