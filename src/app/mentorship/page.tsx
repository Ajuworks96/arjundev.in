"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Briefcase, GraduationCap, Building, ListChecks, 
  ArrowRight, BookOpen, Star, HelpCircle, ShieldCheck 
} from "lucide-react";

interface ProfileOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  roadmapTitle: string;
  roadmapSteps: string[];
  recommendedPrograms: string[];
  ctaText: string;
}

const PROFILE_OPTIONS: ProfileOption[] = [
  {
    id: "student",
    label: "Aspiring Student",
    description: "Looking to break into tech, learn programming, and bypass traditional college theory.",
    icon: <GraduationCap className="w-5 h-5" />,
    roadmapTitle: "Frontend Career Transition Path",
    roadmapSteps: [
      "Master Semantic HTML & CSS responsive design rules.",
      "Dive into JavaScript ES6+ algorithms & DOM manipulation.",
      "Build 3 high-end portfolio items and host them publicly.",
      "Learn React & Next.js App Router for dynamic client state.",
      "Construct a resume showcasing portfolio problem-solving, not degree titles."
    ],
    recommendedPrograms: ["Zero to Developer Career Tracks", "Portfolio Accelerator Program"],
    ctaText: "Launch My Transition"
  },
  {
    id: "business-owner",
    label: "Business Owner / Founder",
    description: "Looking to build a premium web presence, launch Shopify, or set up client lead gen.",
    icon: <Building className="w-5 h-5" />,
    roadmapTitle: "High-Converting Sales Engine Roadmap",
    roadmapSteps: [
      "Analyze competitors to establish landing page visual branding.",
      "Set up WordPress (custom theme) or Shopify for ease of editing.",
      "Configure fast page loading metrics to minimize user drop-offs.",
      "Implement lead-gen forms and integrate CRM databases.",
      "Run AI automation scripts to handle initial client inquiries."
    ],
    recommendedPrograms: ["Founder Web Consulting", "Shopify/E-commerce Implementation"],
    ctaText: "Scale My Business Web"
  },
  {
    id: "freelancer",
    label: "Freelancer / Designer",
    description: "Looking to scale hourly pricing, standardise templates, and secure higher-ticket deals.",
    icon: <Briefcase className="w-5 h-5" />,
    roadmapTitle: "High-Ticket Freelancing Framework",
    roadmapSteps: [
      "Shift from hourly pricing to project-value packaging.",
      "Standardize development boilerplates (custom theme templates) to cut delivery times.",
      "Pitch problem-solving outcomes rather than just template installations.",
      "Build a personal brand site (like arjundev.in) to prove authority.",
      "Establish recurring support retainer agreements for passive earnings."
    ],
    recommendedPrograms: ["Freelancer Business Blueprints", "Personal Brand Accelerator"],
    ctaText: "Grow My Freelance Rates"
  },
  {
    id: "agency",
    label: "Digital Agency",
    description: "Looking to improve dev team performance, implement clean OOP coding, and review architectures.",
    icon: <Users className="w-5 h-5" />,
    roadmapTitle: "Engineering Excellence Path",
    roadmapSteps: [
      "Standardize coding guidelines (ESLint configurations, strict TS rules).",
      "Adopt modular, Object-Oriented patterns (PHP plugins, React hooks).",
      "Set up continuous deployment (CI/CD) pipelines to prevent client regressions.",
      "Establish code-review checkpoints to audit queries and load performance.",
      "Host internal design-to-code alignment sessions to minimize layout refactoring."
    ],
    recommendedPrograms: ["Technical Advisory Consulting", "Team Bootcamp Integrations"],
    ctaText: "Align My Tech Team"
  }
];

const TESTIMONIALS = [
  {
    quote: "Arjun completely changed my perspective on learning code. I was stuck in tutorial hell for months. Under his mentorship, I built 3 real websites and landed my first frontend role.",
    author: "Rohan S.",
    role: "Transitioned from Recruiter to React Dev"
  },
  {
    quote: "Our design agency's development delivery time dropped by 30% after implementing Arjun's custom WordPress boilerplate standards and git guidelines.",
    author: "Meera Nair",
    role: "Co-Founder, PixelCraft Studio"
  },
  {
    quote: "The personalized Shopify roadmap Arjun created saved us thousands in developer consultation fees. We launched our store in 3 weeks and saw conversion rate boosts.",
    author: "Amit K.",
    role: "Founder, Organics India"
  }
];

const FAQS = [
  {
    q: "Do I need a computer science degree to start learning with you?",
    a: "Absolutely not. I didn't have one either. My mentorship programs are designed entirely around practical execution: building code in public, structuring github profiles, and solving real client-centric problems."
  },
  {
    q: "What programming languages do you focus on?",
    a: "We focus heavily on JavaScript (ES6+), React, Next.js, TypeScript, and backend architectures like WordPress PHP OOP and Shopify APIs. These are the most in-demand digital skillsets."
  },
  {
    q: "How does the onboarding consultation work?",
    a: "Select your profile in the Mentor Mode widget above. Once you see your personalized track, hit the CTA button to schedule a 30-minute diagnostic session where we audit your goals and resources."
  }
];

export default function Mentorship() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileOption>(PROFILE_OPTIONS[0]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-24">
      
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">MEMBER HUB</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Practical Skill Mentorship
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          I don&apos;t sell slide-deck courses. I build actionable roadmaps, audit architectures, and guide career transitioners from absolute scratch.
        </p>
      </section>

      {/* ----------------- SECTION 11: IMPACT STATS ----------------- */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center space-y-2">
          <p className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-500">1000+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">Students Guided</p>
          <p className="text-[10px] text-slate-400">Transitioned to developer roles, freelancing, and digital strategy.</p>
        </div>
        <div className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center space-y-2">
          <p className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-500">75+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">Projects Shipped</p>
          <p className="text-[10px] text-slate-400">Custom WordPress themes, Shopify shops, and custom NextJS web apps.</p>
        </div>
        <div className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center space-y-2">
          <p className="text-4xl sm:text-5xl font-black text-sky-600 dark:text-sky-500">5+ Years</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">Real Experience</p>
          <p className="text-[10px] text-slate-400">From self-learning Cashier, Marketing Manager, Developer, and Agency Head.</p>
        </div>
      </section>

      {/* ----------------- SECTION 10: MENTOR MODE (ONBOARDING WIZARD) ----------------- */}
      <section className="space-y-8 py-8 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">DIAGNOSTIC PORTAL</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Mentor Mode Activation</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tell me who you are to map out your custom digital career path instantly.
          </p>
        </div>

        {/* Wizard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Profile Selection */}
          <div className="md:col-span-5 space-y-3">
            {PROFILE_OPTIONS.map((profile) => {
              const isSelected = selectedProfile.id === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className={`w-full flex items-start gap-4 p-4 text-left rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10" 
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850 dark:border-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                    isSelected ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}>
                    {profile.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{profile.label}</h3>
                    <p className={`text-xs mt-1 leading-relaxed ${isSelected ? "text-blue-100" : "text-slate-450"}`}>
                      {profile.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Panel: Recommendations & Roadmap output */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProfile.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glassmorphism p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400">RECOMMENDED PATHWAY</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedProfile.roadmapTitle}</h3>
                </div>

                {/* Steps List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-blue-500" />
                    Step-by-Step Milestones
                  </h4>
                  <ol className="space-y-3">
                    {selectedProfile.roadmapSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-xs sm:text-sm text-slate-705 dark:text-slate-300">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-450 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="h-px bg-slate-200/40 dark:bg-slate-800/40" />

                {/* Programs */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Recommended Program Modules
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.recommendedPrograms.map((prog, idx) => (
                      <span key={idx} className="text-[10px] font-bold px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Consult Call CTA */}
                <div className="pt-4">
                  <a
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold rounded-2xl shadow-md transition-colors"
                  >
                    <span>{selectedProfile.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-8 py-8 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">SUCCESS CHRONICLES</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Student &amp; Client Stories</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Authentic review statements from collaborators and mentees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
                <p className="text-xs font-bold text-slate-850 dark:text-slate-150">{t.author}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8 py-8 border-t border-slate-200/40 dark:border-slate-800/40 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">COMMON CURIOSITIES</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">FAQ</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="glassmorphism p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
