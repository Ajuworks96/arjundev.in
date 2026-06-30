"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Flame, Star, Award, BookOpen, CheckCircle2, ChevronRight, FileText, DownloadCloud, PlayCircle } from "lucide-react";
import Link from "next/link";

interface Stats {
  xp: number;
  streak: number;
  badgeList: string[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
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

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

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
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest bg-[#050912]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span>Syncing Dashboard...</span>
        </div>
      </div>
    );
  }

  // Find the last visited lesson, or fallback to the first lesson of the first course
  const getLastVisitedLesson = () => {
    if (progress.length > 0) {
      // Find latest updated progress
      const latestProgress = [...progress].sort((a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime())[0];
      if (latestProgress) {
        // Find matching course/lesson
        for (const course of courses) {
          if (course.id === latestProgress.courseId) {
            for (const mod of course.modules) {
              const les = mod.lessons.find(l => l.id === latestProgress.lessonId);
              if (les) {
                return { course, lesson: les };
              }
            }
          }
        }
      }
    }

    // Default Fallback
    if (courses.length > 0 && courses[0].modules.length > 0 && courses[0].modules[0].lessons.length > 0) {
      return { course: courses[0], lesson: courses[0].modules[0].lessons[0] };
    }
    return null;
  };

  const lastLessonInfo = getLastVisitedLesson();

  // Evaluate badge icons and details
  const getBadgeColor = (badgeName: string) => {
    if (badgeName === "Explorer") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (badgeName === "Builder") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    if (badgeName === "Creator") return "text-sky-400 bg-sky-500/10 border-sky-500/20";
    return "text-[#ffff3f] bg-yellow-400/10 border-yellow-400/20";
  };

  return (
    <div className="min-h-screen bg-[#050912] text-slate-100 py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.05] grid-mask pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Header Dashboard Welcome */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Student Dashboard</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Welcome back, <span className="text-[#ffff3f]">{session?.user?.name || "Student"}</span>. Continue your web development roadmap.
            </p>
          </div>
          <Link
            href="/learn"
            className="px-4 py-2 border border-slate-900 hover:border-slate-800 bg-[#070b16]/80 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            &larr; View Path Roadmap
          </Link>
        </section>

        {/* Gamification Level stats panel */}
        {stats && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Streak card */}
            <div className="glassmorphism p-5 rounded-2xl border border-slate-900/60 flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Streak</p>
                <h3 className="text-lg font-black text-white">{stats.streak} Days</h3>
              </div>
            </div>

            {/* XP card */}
            <div className="glassmorphism p-5 rounded-2xl border border-slate-900/60 flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total XP points</p>
                <h3 className="text-lg font-black text-white">{stats.xp} XP</h3>
              </div>
            </div>

            {/* Badge Ranking card */}
            <div className="glassmorphism p-5 rounded-2xl border border-slate-900/60 flex items-center gap-4">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Milestone Rank</p>
                <h3 className="text-lg font-black text-white">{stats.badgeList[stats.badgeList.length - 1] || "Explorer"}</h3>
              </div>
            </div>

            {/* Level calculations */}
            <div className="glassmorphism p-5 rounded-2xl border border-slate-900/60 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lessons Finished</p>
                <h3 className="text-lg font-black text-white">
                  {progress.filter(p => p.completed).length} Completed
                </h3>
              </div>
            </div>
          </section>
        )}

        {/* Continue Learning Callout card */}
        {lastLessonInfo && (
          <section className="glassmorphism p-6 rounded-3xl border border-slate-900/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-400/10 transition-colors" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-black text-yellow-400 uppercase tracking-wider">
                  <PlayCircle className="w-4 h-4" />
                  <span>CONTINUE LEARNING</span>
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  {lastLessonInfo.lesson.title}
                </h2>
                <p className="text-xs text-slate-400">
                  Course: <span className="font-semibold text-white uppercase">{lastLessonInfo.course.title}</span> • Level timeline item.
                </p>
              </div>

              <Link
                href={`/learn/${lastLessonInfo.course.slug}/${lastLessonInfo.lesson.slug}`}
                className="w-full md:w-auto px-6 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-400/10 transition-all"
              >
                <span>Resume Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Syllabus Completion checklist */}
          <section className="md:col-span-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Your Curriculum</h2>
              <p className="text-base font-bold text-white uppercase tracking-tight">Syllabus Completion Checklist</p>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="glassmorphism p-5 rounded-2xl border border-slate-900/60 space-y-4"
                >
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-950 pb-2 flex justify-between items-center">
                    <span>{course.title}</span>
                    <span className="text-[10px] text-slate-500 font-bold lowercase tracking-wider">
                      {progress.filter(p => p.courseId === course.id && p.completed).length} / {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                    </span>
                  </h3>

                  <div className="space-y-3.5">
                    {course.modules.map((mod) => (
                      <div key={mod.id} className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{mod.title}</p>
                        
                        <div className="grid grid-cols-1 gap-2 pl-2">
                          {mod.lessons.map((les) => {
                            const isCompleted = progress.find(p => p.lessonId === les.id)?.completed || false;
                            
                            return (
                              <Link
                                key={les.id}
                                href={`/learn/${course.slug}/${les.slug}`}
                                className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-950 rounded-xl hover:border-slate-900 hover:bg-slate-900/20 transition-all text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-0.5 rounded-full ${isCompleted ? "text-emerald-400" : "text-slate-700"}`}>
                                    <CheckCircle2 className="w-4 h-4 fill-current bg-slate-950 rounded-full" />
                                  </div>
                                  <span className={`font-semibold ${isCompleted ? "text-slate-300" : "text-slate-450"}`}>{les.title}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono">{les.durationMinutes}m</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Badges & Downloads */}
          <section className="md:col-span-4 space-y-8">
            
            {/* Badges overview */}
            <div className="glassmorphism p-5 rounded-2xl border border-slate-900/60 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-400" />
                <span>Earned Badges</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {stats?.badgeList.map((badge) => (
                  <span
                    key={badge}
                    className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getBadgeColor(badge)}`}
                  >
                    {badge}
                  </span>
                ))}
                {(!stats || stats.badgeList.length === 0) && (
                  <span className="text-[10px] text-slate-655 font-bold uppercase">No badges unlocked yet.</span>
                )}
              </div>
            </div>

            {/* Downloads organizer */}
            <div className="glassmorphism p-5 rounded-2xl border border-slate-900/60 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <DownloadCloud className="w-4 h-4 text-yellow-400" />
                <span>PDF Downloads & Sheets</span>
              </h3>

              <div className="space-y-2">
                <div className="p-3 bg-slate-950/40 border border-slate-950 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-red-400" />
                    <div className="text-left leading-tight">
                      <p className="text-xs font-bold text-slate-300">Website Roadmap Guide</p>
                      <p className="text-[9px] text-slate-500">PDF • 1.2 MB</p>
                    </div>
                  </div>
                  <a 
                    href="#" 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Download"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-3 bg-slate-950/40 border border-slate-950 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <div className="text-left leading-tight">
                      <p className="text-xs font-bold text-slate-300">CMS Glossary Cheat Sheet</p>
                      <p className="text-[9px] text-slate-500">PDF • 800 KB</p>
                    </div>
                  </div>
                  <a 
                    href="#" 
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Download"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </section>

        </div>

      </div>
    </div>
  );
}
