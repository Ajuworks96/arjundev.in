"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Lock, Unlock, CheckCircle2, ChevronRight, Award, Flame, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  difficulty: string;
  orderIndex: number;
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      slug: string;
      durationMinutes: number;
    }[];
  }[];
}

interface Stats {
  xp: number;
  streak: number;
  badgeList: string[];
}

export default function LearnLanding() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/learn/courses");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
          setStats(data.stats);
          setProgress(data.progress || []);
        }
      } catch (e) {
        console.error("Failed to fetch learn routing data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const roadmapLevels = [
    { level: 0, title: "Welcome & Onboarding", desc: "Introduction to the platform and how to learn effectively.", requiredCourse: "" },
    { level: 1, title: "Website Basics", desc: "വളരെ ലളിതമായി വെബ്‌സൈറ്റിന്റെ ഘടന മനസ്സിലാക്കാം.", requiredCourse: "website-basics" },
    { level: 2, title: "Internet Fundamentals", desc: "ഇന്റർനെറ്റും സർവറുകളും എങ്ങനെ കണക്റ്റ് ആകുന്നു എന്ന് പഠിക്കാം.", requiredCourse: "website-basics" },
    { level: 3, title: "Domain & Hosting", desc: "സ്വന്തമായി വിലാസവും ഡിജിറ്റൽ സ്പേസും വാങ്ങുന്നത് എങ്ങനെ?", requiredCourse: "website-basics" },
    { level: 4, title: "Website Types & Files", desc: "Static & Dynamic വെബ്‌സൈറ്റുകളുടെ വ്യത്യാസം അറിയാം.", requiredCourse: "website-basics" },
    { level: 5, title: "CMS Basics", desc: "കോഡിങ് ഇല്ലാതെ വെബ്‌സൈറ്റ് കൺട്രോൾ ചെയ്യുന്ന സിസ്റ്റങ്ങൾ.", requiredCourse: "website-basics" },
    { level: 6, title: "WordPress Installer", desc: "ലോക്കൽ സിസ്റ്റത്തിലും സർവറിലും വേർഡ്പ്രെസ്സ് സെറ്റ് ചെയ്യാം.", requiredCourse: "wordpress-malayalam" },
    { level: 7, title: "Elementor Builder", desc: "ഡ്രാഗ് ആൻഡ് ഡ്രോപ്പ് വഴി മനോഹരമായ ലാൻഡിങ് പേജുകൾ ഡിസൈൻ ചെയ്യാം.", requiredCourse: "wordpress-malayalam" },
    { level: 8, title: "WooCommerce Shop", desc: "ഉല്പന്നങ്ങൾ ഓൺലൈൻ ആയി വിൽക്കാൻ ഇ-കൊമേഴ്‌സ് സ്റ്റോർ സജ്ജമാക്കാം.", requiredCourse: "wordpress-malayalam" },
    { level: 9, title: "Shopify Storefront", desc: "Shopify പ്ലാറ്റ്‌ഫോം ഉപയോഗിച്ച് പ്രൊഫഷണൽ സ്റ്റോർ ക്രിയേറ്റ് ചെയ്യാം.", requiredCourse: "shopify-malayalam" },
    { level: 10, title: "Real Client Projects", desc: "യഥാർത്ഥ പ്രൊജക്റ്റുകൾ ചെയ്ത് നിങ്ങളുടെ പോർട്ട്ഫോളിയോ ബിൽഡ് ചെയ്യാം.", requiredCourse: "shopify-malayalam" }
  ];

  // Logic to calculate unlocked levels
  // Level 0 is always unlocked. Levels 1-5 unlocked if user exists or Website Basics has started.
  // Level 6-8 unlocked if WordPress course is initialized. Level 9 unlocked if Shopify course is initialized.
  const isLevelUnlocked = (index: number) => {
    if (index === 0) return true;
    if (!session) return index <= 3; // Guests can preview up to Level 3

    // Check completed lessons count
    const completedCount = progress.filter(p => p.completed).length;
    if (index <= 5) return true; // Level 1-5 always accessible once logged in
    if (index <= 8) return completedCount >= 3; // WordPress unlocked after completing 3 basics
    return completedCount >= 5; // Shopify and onwards unlocked after 5 completions
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest bg-[#050912]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span>Generating Roadmaps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050912] text-slate-100 relative overflow-hidden">
      
      {/* Background patterns */}
      <div className="absolute inset-0 grid-bg opacity-[0.06] grid-mask pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-24 relative z-10">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-8">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[#ffff3f] text-xs font-black uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>LEARN WITH ARJUN</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white uppercase text-balance-custom"
          >
            Learn Web Development <br />
            <span className="text-[#ffff3f]">In Malayalam</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 font-semibold tracking-wide text-balance-custom max-w-2xl mx-auto leading-relaxed"
          >
            &quot;Web Development പഠിക്കാൻ Coding അറിയേണ്ട. <br />
            വളരെ ലളിതമായി മലയാളത്തിൽ പഠിക്കാം.&quot; <br />
            <span className="text-xs text-slate-500 uppercase tracking-widest block mt-2 font-bold">Whether you&apos;re a student, freelancer or business owner, start from absolute zero.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={session ? "/learn/dashboard" : "/admin/login"}
              className="w-full sm:w-auto px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-yellow-400/10 transition-all text-center"
            >
              {session ? "Go to Dashboard" : "Start Learning (Login)"}
            </Link>
            <a
              href="#roadmap"
              className="w-full sm:w-auto px-8 py-4 bg-[#070b16]/80 hover:bg-slate-900 border border-slate-900 text-slate-300 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-center"
            >
              Browse Course Levels
            </a>
          </motion.div>
        </section>

        {/* Stats dock for logged in users */}
        {session && stats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glassmorphism p-6 rounded-3xl border border-slate-900/60 max-w-2xl mx-auto grid grid-cols-3 gap-6 text-center"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Streaks</p>
              <p className="text-lg font-black text-white flex items-center justify-center gap-1.5">
                <Flame className="w-5 h-5 text-orange-500 fill-current" />
                <span>{stats.streak} Days</span>
              </p>
            </div>
            <div className="space-y-1 border-x border-slate-900/60">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Experience</p>
              <p className="text-lg font-black text-yellow-400 flex items-center justify-center gap-1.5">
                <Star className="w-5 h-5 fill-current" />
                <span>{stats.xp} XP</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rank</p>
              <p className="text-lg font-black text-sky-400 flex items-center justify-center gap-1.5">
                <Award className="w-5 h-5" />
                <span>{stats.badgeList[stats.badgeList.length - 1] || "Explorer"}</span>
              </p>
            </div>
          </motion.div>
        )}

        {/* Course Catalog Grid */}
        <section className="space-y-8">
          <div className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Available Courses</h2>
            <p className="text-xl font-bold text-white uppercase tracking-tight">Structured Malayalam Programs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => {
              // Calculate completion progress
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              const completedLessons = progress.filter(p => p.courseId === course.id && p.completed).length;
              const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

              return (
                <div
                  key={course.id}
                  className="glassmorphism rounded-2xl border border-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-slate-800 transition-colors"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-yellow-400/10 text-[#ffff3f] border border-yellow-400/20 uppercase tracking-widest">
                        {course.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white leading-tight uppercase tracking-wide">{course.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{course.description}</p>
                    </div>

                    {session && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <span>Syllabus Progress</span>
                          <span className="text-[#ffff3f]">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                          <div 
                            className="bg-[#ffff3f] h-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-slate-950 bg-slate-950/20">
                    <Link
                      href={session ? `/learn/${course.slug}/${course.modules[0]?.lessons[0]?.slug || ""}` : "/admin/login"}
                      className="w-full flex items-center justify-center gap-1.5 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow"
                    >
                      <span>Start Course</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Roadmap section */}
        <section id="roadmap" className="space-y-12 pt-8">
          <div className="text-center space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Learning Path</h2>
            <p className="text-2xl font-bold text-white uppercase tracking-tight">Your level-by-level journey</p>
          </div>

          {/* Roadmap timeline wrapper */}
          <div className="relative max-w-xl mx-auto pl-8 sm:pl-0">
            {/* Center line for desktop, left line for mobile */}
            <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-[2px] bg-slate-900/60 transform sm:-translate-x-1/2 pointer-events-none" />

            <div className="space-y-12">
              {roadmapLevels.map((lvl, index) => {
                const unlocked = isLevelUnlocked(index);
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={lvl.level}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                      isEven ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    
                    {/* Circle Indicator */}
                    <div 
                      className={`absolute left-0 sm:left-1/2 top-1 sm:top-1/2 transform -translate-x-1/2 sm:-translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-all ${
                        unlocked 
                          ? "bg-slate-950 border-[#ffff3f] text-[#ffff3f] shadow-lg shadow-yellow-400/5 scale-110" 
                          : "bg-slate-950 border-slate-900 text-slate-655"
                      }`}
                    >
                      {unlocked ? (
                        <Unlock className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Roadmap Card */}
                    <div className={`w-full sm:w-[45%] pl-8 sm:pl-0 ${isEven ? "sm:text-right sm:pr-8" : "sm:pl-8"}`}>
                      <div 
                        className={`p-5 rounded-2xl border transition-all duration-300 ${
                          unlocked 
                            ? "glassmorphism border-slate-800 hover:border-slate-700" 
                            : "bg-slate-950/40 border-slate-950 opacity-50"
                        }`}
                      >
                        <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${unlocked ? "text-[#ffff3f]" : "text-slate-600"}`}>
                          LEVEL {lvl.level}
                        </span>
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight mb-1.5">{lvl.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{lvl.desc}</p>
                      </div>
                    </div>

                    {/* Empty spacer spacer block for desktop symmetry */}
                    <div className="hidden sm:block w-[45%]" />

                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
