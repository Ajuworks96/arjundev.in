"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, Plus, Trash2, Edit3, ChevronRight, ChevronDown, 
  Layers, FileText, Save, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  durationMinutes: number;
  introMalayalam: string;
  explanation: string;
  realLifeExample: string;
  visualConcept: string | null;
  practicalDemo: string | null;
  summary: string;
  miniChallenge: string | null;
  videoUrl: string | null;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  difficulty: string;
  modules: Module[];
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Modals visibility states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState({ id: "", title: "", slug: "", description: "", duration: "3 Hours", difficulty: "Beginner" });
  const [moduleForm, setModuleForm] = useState({ id: "", title: "", description: "", courseId: "" });
  const [lessonForm, setLessonForm] = useState({
    id: "", title: "", slug: "", introMalayalam: "", explanation: "", realLifeExample: "",
    visualConcept: "", practicalDemo: "", summary: "", miniChallenge: "",
    videoUrl: "", durationMinutes: 10, moduleId: ""
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (e) {
      console.error("Failed to load admin courses:", e);
    } finally {
      setLoading(false);
    }
  }

  // Course handlers
  const openCreateCourse = () => {
    setCourseForm({ id: "", title: "", slug: "", description: "", duration: "3 Hours", difficulty: "Beginner" });
    setIsEditing(false);
    setShowCourseModal(true);
  };

  const openEditCourse = (course: Course) => {
    setCourseForm({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      duration: course.duration,
      difficulty: course.difficulty
    });
    setIsEditing(true);
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const action = isEditing ? "updateCourse" : "createCourse";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload: courseForm })
      });
      if (res.ok) {
        setShowCourseModal(false);
        setSuccess(true);
        await loadCourses();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Error saving course:", e);
    } finally {
      setSaving(false);
    }
  };

  // Module handlers
  const openCreateModule = (courseId: string) => {
    setModuleForm({ id: "", title: "", description: "", courseId });
    setIsEditing(false);
    setShowModuleModal(true);
  };

  const openEditModule = (mod: Module) => {
    setModuleForm({
      id: mod.id,
      title: mod.title,
      description: mod.description || "",
      courseId: ""
    });
    setIsEditing(true);
    setShowModuleModal(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const action = isEditing ? "updateModule" : "createModule";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload: moduleForm })
      });
      if (res.ok) {
        setShowModuleModal(false);
        setSuccess(true);
        await loadCourses();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Error saving module:", e);
    } finally {
      setSaving(false);
    }
  };

  // Lesson handlers
  const openCreateLesson = (moduleId: string) => {
    setLessonForm({
      id: "", title: "", slug: "", introMalayalam: "", explanation: "", realLifeExample: "",
      visualConcept: "", practicalDemo: "", summary: "", miniChallenge: "",
      videoUrl: "", durationMinutes: 10, moduleId
    });
    setIsEditing(false);
    setShowLessonModal(true);
  };

  const openEditLesson = (les: Lesson) => {
    setLessonForm({
      id: les.id,
      title: les.title,
      slug: les.slug,
      introMalayalam: les.introMalayalam,
      explanation: les.explanation,
      realLifeExample: les.realLifeExample,
      visualConcept: les.visualConcept || "",
      practicalDemo: les.practicalDemo || "",
      summary: les.summary,
      miniChallenge: les.miniChallenge || "",
      videoUrl: les.videoUrl || "",
      durationMinutes: les.durationMinutes,
      moduleId: ""
    });
    setIsEditing(true);
    setShowLessonModal(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const action = isEditing ? "updateLesson" : "createLesson";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload: lessonForm })
      });
      if (res.ok) {
        setShowLessonModal(false);
        setSuccess(true);
        await loadCourses();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Error saving lesson:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type: "course" | "module" | "lesson", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}? All nested contents will be lost.`)) return;

    try {
      const res = await fetch(`/api/admin/courses?type=${type}&id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await loadCourses();
      }
    } catch (e) {
      console.error("Failed to delete course entity:", e);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Courses Manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Learn Course Manager <BookOpen className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Manage and edit your Malayalam courses, chapters, and lessons.
          </p>
        </div>
        <button
          onClick={openCreateCourse}
          className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Course</span>
        </button>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold max-w-2xl"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Curriculum structure updated successfully!</span>
        </motion.div>
      )}

      {/* Courses Accordion List */}
      <div className="space-y-4">
        {courses.map((course) => {
          const isCourseActive = activeCourseId === course.id;

          return (
            <div
              key={course.id}
              className="glassmorphism rounded-2xl border border-slate-900 overflow-hidden"
            >
              {/* Course Row Header */}
              <div 
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/10 transition-colors"
                onClick={() => setActiveCourseId(isCourseActive ? null : course.id)}
              >
                <div className="flex items-center gap-3">
                  {isCourseActive ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider leading-tight">{course.title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      {course.difficulty} • {course.duration} • {course.modules.length} Modules
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openCreateModule(course.id)}
                    className="px-2.5 py-1.5 bg-[#070b16] hover:bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Add Module
                  </button>
                  <button
                    onClick={() => openEditCourse(course)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-yellow-400 rounded-xl transition-colors cursor-pointer"
                    title="Edit Course Config"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete("course", course.id)}
                    className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Modules details block */}
              {isCourseActive && (
                <div className="border-t border-slate-950 bg-slate-950/20 p-5 space-y-4">
                  {course.modules.length === 0 ? (
                    <p className="text-[10px] text-slate-655 font-bold uppercase py-2">No module chapters found in this course.</p>
                  ) : (
                    course.modules.map((mod) => {
                      const isModActive = activeModuleId === mod.id;

                      return (
                        <div
                          key={mod.id}
                          className="bg-[#070b16]/60 border border-slate-900/60 rounded-xl overflow-hidden"
                        >
                          {/* Module row header */}
                          <div
                            className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/20 transition-colors"
                            onClick={() => setActiveModuleId(isModActive ? null : mod.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Layers className="w-4 h-4 text-yellow-400/80" />
                              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">{mod.title}</span>
                            </div>

                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => openCreateLesson(mod.id)}
                                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Add Lesson
                              </button>
                              <button
                                onClick={() => openEditModule(mod)}
                                className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-yellow-450 rounded-lg transition-colors cursor-pointer"
                                title="Edit Module"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete("module", mod.id)}
                                className="p-1.5 bg-red-950/20 hover:bg-red-900 border border-red-500/10 text-red-400 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Lessons lists block */}
                          {isModActive && (
                            <div className="bg-slate-950/10 border-t border-slate-950/40 p-3.5 grid grid-cols-1 gap-2">
                              {mod.lessons.length === 0 ? (
                                <p className="text-[10px] text-slate-655 font-bold uppercase py-1">No lessons added to this chapter.</p>
                              ) : (
                                mod.lessons.map((les) => (
                                  <div
                                    key={les.id}
                                    className="flex items-center justify-between p-3 bg-slate-950/30 border border-slate-900 rounded-xl hover:border-slate-850 transition-colors text-xs"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                                      <span className="font-semibold text-slate-300">{les.title}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className="text-[9px] font-mono text-slate-500">{les.durationMinutes} mins</span>
                                      <button
                                        onClick={() => openEditLesson(les)}
                                        className="text-slate-500 hover:text-yellow-450 transition-colors cursor-pointer"
                                        title="Edit Lesson content"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDelete("lesson", les.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* 1. Course Modal (Create & Edit) */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveCourse} className="glassmorphism border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-2">
              {isEditing ? "Edit Course Config" : "Create New Course"}
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Title</label>
              <input
                type="text"
                required
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="e.g. Website Basics"
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slug (Unique Link Identifier)</label>
              <input
                type="text"
                required
                value={courseForm.slug}
                onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                placeholder="e.g. website-basics"
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
              <textarea
                required
                rows={3}
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Brief summary of the course in Malayalam..."
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</label>
                <input
                  type="text"
                  required
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  placeholder="e.g. 3 Hours"
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</label>
                <input
                  type="text"
                  required
                  value={courseForm.difficulty}
                  onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                  placeholder="e.g. Beginner"
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Update Course" : "Save Course"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Module Modal (Create & Edit) */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveModule} className="glassmorphism border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-2">
              {isEditing ? "Edit Module Chapter" : "Add Module Chapter"}
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Module Title</label>
              <input
                type="text"
                required
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                placeholder="e.g. അടിസ്ഥാന തത്വങ്ങൾ (Foundations)"
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Module Description</label>
              <textarea
                rows={2}
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                placeholder="Optional chapter focus detail..."
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white resize-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Update Module" : "Save Module"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowModuleModal(false)}
                className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Lesson Modal (Create & Edit) */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <form onSubmit={handleSaveLesson} className="glassmorphism border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 my-8 shadow-2xl relative">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-2">
              {isEditing ? "Edit Syllabus Lesson" : "Create Syllabus Lesson"}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Domain എന്താണ്?"
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slug</label>
                <input
                  type="text"
                  required
                  value={lessonForm.slug}
                  onChange={(e) => setLessonForm({ ...lessonForm, slug: e.target.value })}
                  placeholder="e.g. what-is-domain"
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mentor Intro (Conversational Malayalam)</label>
              <textarea
                required
                rows={2}
                value={lessonForm.introMalayalam}
                onChange={(e) => setLessonForm({ ...lessonForm, introMalayalam: e.target.value })}
                placeholder="e.g. ഹായ്, ഞാൻ അർജുൻ. ഇന്നത്തെ ക്ലാസ്സിൽ നമുക്ക് ഡൊമൈൻ എന്താണെന്ന് പഠിക്കാം."
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Core Explanation (Malayalam)</label>
              <textarea
                required
                rows={3}
                value={lessonForm.explanation}
                onChange={(e) => setLessonForm({ ...lessonForm, explanation: e.target.value })}
                placeholder="Detailed concepts explanation..."
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Real-life Example (Analogy)</label>
              <textarea
                required
                rows={2}
                value={lessonForm.realLifeExample}
                onChange={(e) => setLessonForm({ ...lessonForm, realLifeExample: e.target.value })}
                placeholder="e.g. നിങ്ങളുടെ വീട്ടുപേര് പോലെയാണ് ഡൊമൈൻ വിലാസം..."
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Video Embed URL</label>
                <input
                  type="url"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/embed/..."
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  value={lessonForm.durationMinutes}
                  onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: parseInt(e.target.value) || 10 })}
                  className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Summary Bullets (one per line)</label>
              <textarea
                required
                rows={2}
                value={lessonForm.summary}
                onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })}
                placeholder="• Point 1&#10;• Point 2"
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-yellow-400/40 rounded-xl outline-none text-xs text-white resize-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Update Lesson" : "Save Lesson"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLessonModal(false)}
                className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
