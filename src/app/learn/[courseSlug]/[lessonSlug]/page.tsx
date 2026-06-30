"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  BookOpen, ChevronRight, CheckCircle2, Circle, PlayCircle, 
  HelpCircle, CheckCircle, XCircle, ArrowRight, Download, Award, FileText, ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  introMalayalam: string;
  explanation: string;
  realLifeExample: string;
  visualConcept: string | null;
  practicalDemo: string | null;
  summary: string;
  miniChallenge: string | null;
  videoUrl: string | null;
  durationMinutes: number;
  moduleId: string;
  downloads: { id: string; title: string; fileUrl: string; fileType: string }[];
  quizzes: Quiz[];
  assignments: { id: string; title: string; description: string }[];
  module: {
    title: string;
    course: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

interface SyllabusCourse {
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

export default function LessonWorkspace({ params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }) {
  const resolvedParams = use(params);
  const courseSlug = resolvedParams.courseSlug;
  const lessonSlug = resolvedParams.lessonSlug;

  const { data: session, status } = useSession();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [syllabus, setSyllabus] = useState<SyllabusCourse | null>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"intro" | "explanation" | "example" | "visual" | "demo" | "challenge">("intro");
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ isCorrect: boolean; correctAnswerIndex: number; xpEarned: number } | null>(null);
  
  const [completing, setCompleting] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [xpAmount, setXpAmount] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function loadWorkspaceData() {
      try {
        // Fetch lesson detail
        const lessonRes = await fetch(`/api/learn/lessons?slug=${lessonSlug}`);
        if (lessonRes.ok) {
          const lessonData = await lessonRes.json();
          setLesson(lessonData.lesson);
          setCompleted(lessonData.completed);
        }

        // Fetch course syllabus & progress
        const coursesRes = await fetch("/api/learn/courses");
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setProgress(coursesData.progress || []);
          
          const matchingCourse = coursesData.courses.find((c: any) => c.slug === courseSlug);
          if (matchingCourse) {
            setSyllabus(matchingCourse);
          }
        }
      } catch (e) {
        console.error("Failed to load workspace data:", e);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      loadWorkspaceData();
    }
  }, [status, courseSlug, lessonSlug]);

  const handleCompleteLesson = async () => {
    if (!lesson || completing) return;
    setCompleting(true);

    try {
      const res = await fetch("/api/learn/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: lesson.module.course.id,
          lessonId: lesson.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCompleted(true);
        setXpAmount(data.xpEarned);
        setShowXpPopup(true);
        // Refresh local progress list
        const progRes = await fetch("/api/learn/courses");
        if (progRes.ok) {
          const progData = await progRes.json();
          setProgress(progData.progress || []);
        }
        setTimeout(() => setShowXpPopup(false), 4000);
      }
    } catch (e) {
      console.error("Failed to submit lesson completion:", e);
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizSubmit = async (quizId: string) => {
    if (!lesson || selectedQuizOption === null || quizSubmitted) return;

    try {
      const res = await fetch("/api/learn/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          quizId,
          selectedOptionIndex: selectedQuizOption
        })
      });

      if (res.ok) {
        const data = await res.json();
        setQuizResult({
          isCorrect: data.isCorrect,
          correctAnswerIndex: data.correctAnswerIndex,
          xpEarned: data.xpEarned
        });
        setQuizSubmitted(true);
        if (data.isCorrect) {
          setXpAmount(data.xpEarned);
          setShowXpPopup(true);
          setTimeout(() => setShowXpPopup(false), 4000);
        }
      }
    } catch (e) {
      console.error("Quiz submission error:", e);
    }
  };

  // Find next lesson slug
  const getNextLessonLink = () => {
    if (!syllabus || !lesson) return null;
    
    // Flatten all lessons
    const allLessons = syllabus.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      return `/learn/${courseSlug}/${allLessons[currentIndex + 1].slug}`;
    }
    return null;
  };

  const nextLessonUrl = getNextLessonLink();

  if (status === "loading" || loading || !lesson || !syllabus) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest bg-[#050912]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span>Setting Up Lesson Environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050912] flex flex-col md:flex-row relative">
      
      {/* XP award popup notification */}
      <AnimatePresence>
        {showXpPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2.5"
          >
            <Award className="w-5 h-5" />
            <span>+{xpAmount} XP Earned! Streak Updated.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Sidebar: Course Outline / Syllabus */}
      <aside className="w-full md:w-80 shrink-0 bg-[#070b16]/95 border-b md:border-b-0 md:border-r border-slate-900/60 flex flex-col h-auto md:h-screen md:sticky md:top-0 z-30">
        
        {/* Course Header link */}
        <div className="p-5 border-b border-slate-900/60 bg-slate-950/20">
          <Link
            href="/learn"
            className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Roadmap Overview</span>
          </Link>
          <h2 className="text-sm font-black text-white uppercase tracking-tight mt-2 leading-tight">
            {syllabus.title}
          </h2>
        </div>

        {/* Modules & Syllabus Chapters */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
          {syllabus.modules.map((mod) => (
            <div key={mod.id} className="space-y-2">
              <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-950 pb-1 px-1">
                {mod.title}
              </h3>
              
              <div className="space-y-1.5">
                {mod.lessons.map((les) => {
                  const isActive = les.slug === lessonSlug;
                  const isLesCompleted = progress.find(p => p.lessonId === les.id)?.completed || false;

                  return (
                    <Link
                      key={les.id}
                      href={`/learn/${courseSlug}/${les.slug}`}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs group transition-all ${
                        isActive 
                          ? "bg-yellow-400 text-slate-950 font-black shadow-lg shadow-yellow-400/5" 
                          : "text-slate-400 hover:bg-slate-900/30 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={isActive ? "text-slate-950" : isLesCompleted ? "text-emerald-400" : "text-slate-700"}>
                          {isLesCompleted ? (
                            <CheckCircle2 className="w-4 h-4 fill-current bg-slate-950 rounded-full" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </div>
                        <span className="line-clamp-1">{les.title}</span>
                      </div>
                      <span className={`text-[9px] font-mono shrink-0 ${isActive ? "text-slate-950" : "text-slate-655"}`}>
                        {les.durationMinutes}m
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Right Content Area: Custom Player + Tabs Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        
        {/* Workspace Title bar */}
        <section className="space-y-1">
          <p className="text-[9px] text-[#ffff3f] font-black uppercase tracking-widest">
            {lesson.module.title}
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <span>{lesson.title}</span>
            {completed && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          </h1>
        </section>

        {/* Video Player Section */}
        {lesson.videoUrl && (
          <section className="relative aspect-video w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-slate-900 shadow-xl mx-auto">
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </section>
        )}

        {/* Action Panel: Complete / Next lesson buttons */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto p-5 bg-[#070b16]/40 border border-slate-900/60 rounded-2xl">
          <div className="text-center sm:text-left leading-tight">
            <p className="text-xs font-bold text-white uppercase tracking-wide">Finished with the video?</p>
            <p className="text-[10px] text-slate-500">Submit completion to unlock your Roadmap experience points.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCompleteLesson}
              disabled={completed || completing}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                completed 
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                  : "bg-yellow-400 hover:bg-yellow-500 text-slate-950 shadow-md shadow-yellow-400/5"
              }`}
            >
              {completed ? "Lesson Completed ✓" : completing ? "Completing..." : "Complete & Earn +10 XP"}
            </button>

            {completed && nextLessonUrl && (
              <Link
                href={nextLessonUrl}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#070b16] hover:bg-slate-900 border border-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </section>

        {/* Content Tabs Selector */}
        <section className="space-y-6 max-w-4xl mx-auto">
          {/* Tabs bar */}
          <div className="flex gap-1.5 overflow-x-auto w-full no-scrollbar border-b border-slate-900/60 pb-3">
            {[
              { id: "intro", label: "Introduction" },
              { id: "explanation", label: "Explanation" },
              { id: "example", label: "Real-Life Example" },
              { id: "visual", label: "Visual Chart" },
              { id: "demo", label: "Practical Demo" },
              { id: "challenge", label: "Mini Challenge" }
            ].map((tab) => {
              const active = activeTab === tab.id;
              
              // Don't render empty visual or demo tabs
              if (tab.id === "visual" && !lesson.visualConcept) return null;
              if (tab.id === "demo" && !lesson.practicalDemo) return null;
              if (tab.id === "challenge" && !lesson.miniChallenge) return null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    active 
                      ? "bg-yellow-400 text-slate-950 font-black shadow" 
                      : "text-slate-450 hover:bg-slate-900/40 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Tab Content Panel */}
          <div className="glassmorphism p-6 sm:p-8 rounded-3xl border border-slate-900/60 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-slate-350 leading-relaxed text-sm"
              >
                {activeTab === "intro" && (
                  <div className="space-y-4">
                    <p className="text-[#ffff3f] font-mono text-xs font-bold">// MENTOR INSTRUCTION</p>
                    <p className="italic text-base text-slate-200 pl-4 border-l-2 border-yellow-400 font-sans">
                      &quot;{lesson.introMalayalam}&quot;
                    </p>
                    <div className="pt-4 border-t border-slate-900/60 space-y-2">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Lesson Summary Checklist</p>
                      <div className="text-xs space-y-2">
                        {lesson.summary.split("\n").map((point, i) => (
                          <p key={i} className="flex items-start gap-2 text-slate-400">
                            <span className="text-yellow-400 select-none">•</span>
                            <span>{point.replace(/^•\s*/, "")}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "explanation" && (
                  <div className="space-y-3 whitespace-pre-line font-sans text-slate-300">
                    {lesson.explanation}
                  </div>
                )}

                {activeTab === "example" && (
                  <div className="space-y-3 whitespace-pre-line font-sans text-slate-300">
                    <p className="text-xs text-sky-400 font-bold uppercase tracking-wider">// REAL LIFE ANALOGY</p>
                    {lesson.realLifeExample}
                  </div>
                )}

                {activeTab === "visual" && lesson.visualConcept && (
                  <div className="space-y-3">
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">// VISUAL REPRESENTATION</p>
                    <pre className="p-5 bg-black/40 border border-slate-950 rounded-2xl text-xs text-emerald-400 font-mono overflow-x-auto">
                      {lesson.visualConcept}
                    </pre>
                  </div>
                )}

                {activeTab === "demo" && lesson.practicalDemo && (
                  <div className="space-y-3">
                    <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">// DEMO WORKFLOW</p>
                    <div className="text-xs whitespace-pre-line font-sans text-slate-300">
                      {lesson.practicalDemo}
                    </div>
                  </div>
                )}

                {activeTab === "challenge" && lesson.miniChallenge && (
                  <div className="space-y-3">
                    <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">// STUDENT CHALLENGE</p>
                    <div className="p-5 bg-amber-500/5 border border-amber-500/10 text-amber-400/80 rounded-2xl text-xs font-sans whitespace-pre-line">
                      {lesson.miniChallenge}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Student Downloads and Attachments */}
        {lesson.downloads.length > 0 && (
          <section className="space-y-4 max-w-4xl mx-auto">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Lesson Attachments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lesson.downloads.map((dl) => (
                <div key={dl.id} className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-center justify-between hover:border-slate-800 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-red-400" />
                    <div className="text-left leading-tight">
                      <p className="text-xs font-bold text-slate-200">{dl.title}</p>
                      <p className="text-[9px] text-slate-500 uppercase font-mono">{dl.fileType}</p>
                    </div>
                  </div>
                  <a 
                    href={dl.fileUrl} 
                    className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Quick Quiz Section */}
        {lesson.quizzes.length > 0 && (
          <section className="space-y-4 max-w-4xl mx-auto pt-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Knowledge Check (Quiz)</h3>
            
            {lesson.quizzes.map((quiz) => (
              <div key={quiz.id} className="glassmorphism p-6 sm:p-8 rounded-3xl border border-slate-900/60 space-y-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide leading-snug">{quiz.question}</h4>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {quiz.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const showCorrect = quizSubmitted && quiz.answerIndex === idx;
                    const showIncorrect = quizSubmitted && isSelected && quiz.answerIndex !== idx;

                    return (
                      <button
                        key={idx}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedQuizOption(idx)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          showCorrect 
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                            : showIncorrect 
                              ? "bg-rose-500/10 border-rose-500 text-rose-400" 
                              : isSelected 
                                ? "bg-yellow-400 border-yellow-400 text-slate-950" 
                                : "bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900/30 hover:border-slate-800"
                        }`}
                      >
                        <span>{option}</span>
                        {showCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        {showIncorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    disabled={selectedQuizOption === null}
                    onClick={() => handleQuizSubmit(quiz.id)}
                    className="px-5 py-3 bg-[#ffff3f] hover:bg-yellow-500 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest shadow transition-all cursor-pointer"
                  >
                    Submit Quiz Answer
                  </button>
                ) : (
                  <div className="pt-2 flex items-center gap-2">
                    {quizResult?.isCorrect ? (
                      <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>Correct! You earned +15 XP bonus points.</span>
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        <span>Incorrect. The correct answer was option: &quot;{quiz.options[quiz.answerIndex]}&quot;.</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

      </main>
    </div>
  );
}
