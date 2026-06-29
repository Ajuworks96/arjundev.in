"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, GraduationCap, Laptop, Sparkles, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// Headline cycle for Cinematic Hero
const HERO_HEADLINES = [
  "Build Websites.",
  "Build Skills.",
  "Build Careers.",
  "Build Your Future.",
];

// Currently Building items
const BUILDING_CARDS = [
  {
    title: "WordPress Projects",
    description: "Architecting high-performance client portals & bespoke plugin architectures.",
    icon: <Code className="w-5 h-5 text-blue-500" />,
    tag: "Production",
  },
  {
    title: "Shopify Stores",
    description: "Developing robust e-commerce setups with lightning-fast checkouts.",
    icon: <Laptop className="w-5 h-5 text-indigo-500" />,
    tag: "Client Work",
  },
  {
    title: "Mentoring Students",
    description: "Guiding 1000+ career transitioners through real-world developer tracks.",
    icon: <GraduationCap className="w-5 h-5 text-sky-500" />,
    tag: "Community",
  },
  {
    title: "AI Experiments",
    description: "Integrating Gemini LLMs into web-based automated workflows.",
    icon: <Sparkles className="w-5 h-5 text-purple-500" />,
    tag: "Research",
  },
  {
    title: "Velvetbyte",
    description: "Designing high-end web experiences and digital UI kits.",
    icon: <Code className="w-5 h-5 text-rose-500" />,
    tag: "Founder",
  },
  {
    title: "Learning New Stacks",
    description: "Diving deeper into Rust & React Server Components.",
    icon: <Laptop className="w-5 h-5 text-emerald-500" />,
    tag: "Growth",
  },
];

export default function Home() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [hero, setHero] = useState<any>(null);
  const [headlines, setHeadlines] = useState<string[]>(HERO_HEADLINES);
  
  // Ref & Scroll controls for What I Believe text highlight
  const believeSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: believeSectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, hRes] = await Promise.all([
          fetch("/api/admin/profile"),
          fetch("/api/admin/hero")
        ]);
        if (pRes.ok) {
          const pData = await pRes.json();
          setProfile(pData);
        }
        if (hRes.ok) {
          const hData = await hRes.json();
          setHero(hData);
          if (hData.animatedText) {
            setHeadlines(hData.animatedText.split(",").map((s: string) => s.trim()).filter(Boolean));
          }
        }
      } catch (e) {
        console.error("Error loading home page DB configs:", e);
      }
    }
    loadData();
  }, []);

  // Cycle hero headlines every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [headlines]);

  const believeText = "Skills over degrees. Consistency beats talent. Learning never stops. Teach what you learn. Build in public. Technology should empower people.";
  const believeWords = believeText.split(" ");

  return (
    <div className="relative w-full">
      {/* ----------------- SECTION 01: CINEMATIC HERO ----------------- */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid-bg grid-mask -z-10" />
        
        {/* Redesigned Background watermark photo */}
        <div className="absolute right-0 bottom-0 w-full max-w-[480px] h-[75%] opacity-[0.03] dark:opacity-[0.02] pointer-events-none mix-blend-luminosity blur-[0.5px] select-none -z-10">
          <Image
            src={profile?.avatarUrl || "/arjun_photo.jpg"}
            alt="Arjun Background shadow"
            fill
            priority
            className="object-contain object-right-bottom"
          />
        </div>


        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Animated Hero Headline Loop */}
          <div className="h-[72px] sm:h-[96px] md:h-[120px] flex items-center justify-center mb-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={headlineIndex}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white"
              >
                {headlines[headlineIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Subheading & Core branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-500 tracking-wide uppercase">
              {profile?.tagline || "Web Developer by Profession • Mentor by Passion"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-balance-custom">
              {hero?.subtitle || "Helping aspiring developers, business owners, and startup founders master WordPress, Shopify, and modern web development through hands-on learning."}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 mt-10 justify-center w-full max-w-xs sm:max-w-none"
          >
            <Link
              href={hero?.ctaPrimaryUrl || "/journey"}
              className="px-8 py-3.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 dark:hover:bg-white flex items-center justify-center gap-2 group transition-all duration-200"
            >
              <span>{hero?.ctaPrimary || "Explore My Journey"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={hero?.ctaSecondaryUrl || "/contact"}
              className="px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-center transition-all duration-200"
            >
              {hero?.ctaSecondary || "Work With Me"}
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-10 flex flex-col items-center text-slate-400 dark:text-slate-600 select-none pointer-events-none cursor-pointer"
        >
          <span className="text-[10px] font-bold tracking-widest uppercase mb-1">Scroll to view</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ----------------- SECTION 02: WHO IS ARJUN ----------------- */}
      <section className="py-24 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-35 transition duration-1000" />
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-end p-8 text-white shadow-xl">
            {/* Real Profile Image Render */}
            <Image
              src={profile?.avatarUrl || "/arjun_photo.jpg"}
              alt="Arjun Portrait"
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Elegant text backdrop overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">Background</span>
              <h3 className="text-xl font-black mt-3">From Cashier to Department Head</h3>
              <p className="text-xs text-slate-300 mt-2">A self-taught transition mapping skills over traditional university titles.</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">DOCUMENTARY INTRO</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {profile?.journeyIntro || "I wasn't born into tech. I built my career one step at a time."}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {profile?.biography || "I began my journey away from keyboards and code. I was an ITI student, worked as a supermarket cashier, and managed digital platforms as a marketing manager before finding my true calling in code. I spent nights debugging, teaching myself WordPress, e-commerce, and javascript architectures."}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-semibold">
            {profile?.about || "Now, my mission is to break down the walls of entry. I help aspirants find their footing in tech without needing formal degrees, empowering them to start coding and building public portfolios."}
          </p>
          <div className="pt-2">
            <Link
              href="/journey"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group"
            >
              <span>Read the full documentary</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 05: CURRENTLY BUILDING ----------------- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/20 border-y border-slate-100 dark:border-slate-900/60 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">REALTIME WORKFLOW</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">Currently Building</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Projects, experiments, and mentoring activities I am actively running today.</p>
        </div>

        <div className="relative w-full overflow-x-auto no-scrollbar pb-6 px-6">
          <div className="flex gap-6 max-w-5xl mx-auto sm:grid sm:grid-cols-2 md:grid-cols-3">
            {BUILDING_CARDS.map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
                className="w-[280px] sm:w-auto flex-shrink-0 glassmorphism p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-fit">
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mt-4 text-slate-900 dark:text-white">{card.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 07: WHAT I BELIEVE (SCROLL REVEAL) ----------------- */}
      <section 
        ref={believeSectionRef}
        className="py-32 max-w-5xl mx-auto px-6 flex flex-col justify-center items-start min-h-[50vh]"
      >
        <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500 mb-6">CORE PHILOSOPHY</span>
        
        {/* Apple style Scroll Reveal text grid */}
        <div className="flex flex-wrap max-w-4xl text-3xl sm:text-5xl font-black leading-tight tracking-tight">
          {believeWords.map((word, i) => {
            const start = i / believeWords.length;
            const end = (i + 1) / believeWords.length;
            
            // Map opacity based on section scroll depth
            const opacity = useTransform(scrollYProgress, [start * 0.8, end * 0.8], [0.15, 1]);
            
            return (
              <motion.span 
                key={i} 
                style={{ opacity }} 
                className="inline-block mr-4 text-slate-900 dark:text-white"
              >
                {word}
              </motion.span>
            );
          })}
        </div>
      </section>

      {/* ----------------- FINAL TEASER & CTA ----------------- */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden rounded-3xl max-w-5xl mx-auto my-12 px-8 sm:px-16 text-center border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Ready to chart a new course?
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
          Whether you are a beginner looking to write your first line of code, a startup founder looking for Web design advice, or looking to collaborate, let&apos;s build together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/mentorship"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-colors w-full sm:w-auto"
          >
            Start Mentorship
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors w-full sm:w-auto"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
