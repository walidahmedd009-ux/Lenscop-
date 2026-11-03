import { useState, useEffect } from 'react';
import {
  Course,
  CourseModule,
  Lesson,
  QuizQuestion,
  UserProgress,
  CuratedVideo,
} from '../types/course';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  Video,
  FileText,
  Code2,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Bot,
  Lightbulb,
  Award,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseStudyViewProps {
  course: Course;
  progress: UserProgress;
  onBackToCatalog: () => void;
  onToggleLessonComplete: (lessonId: string, durationMinutes?: number) => void;
  onToggleBookmark: (lessonId: string) => void;
  onSaveNote: (lessonId: string, noteText: string) => void;
  onRecordQuizScore: (moduleId: string, score: number, total: number, passed: boolean) => void;
  onOpenTutorWithContext: (context: {
    courseTitle: string;
    moduleTitle: string;
    lessonTitle: string;
    lessonContent: string;
    initialMessage?: string;
  }) => void;
}

export function CourseStudyView({
  course,
  progress,
  onBackToCatalog,
  onToggleLessonComplete,
  onToggleBookmark,
  onSaveNote,
  onRecordQuizScore,
  onOpenTutorWithContext,
}: CourseStudyViewProps) {
  const firstModule = course.modules[0];
  const firstLesson = firstModule?.chapters[0]?.lessons[0];

  const [activeLessonId, setActiveLessonId] = useState<string>(firstLesson?.id || '');
  const [activeTab, setActiveTab] = useState<'guide' | 'videos' | 'lab' | 'quiz'>('guide');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    course.modules.forEach((m, idx) => {
      init[m.id] = idx === 0;
    });
    return init;
  });

  const [scratchpadText, setScratchpadText] = useState<string>('');
  const [showSampleSolution, setShowSampleSolution] = useState(false);
  const [labSubmitted, setLabSubmitted] = useState(false);

  const [customVideos, setCustomVideos] = useState<Record<string, CuratedVideo[]>>({});
  const [discoveringVideos, setDiscoveringVideos] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [diagnosingMistake, setDiagnosingMistake] = useState<string | null>(null);
  const [mistakeExplanation, setMistakeExplanation] = useState<Record<string, string>>({});

  let activeLesson: Lesson | undefined;
  let activeModule: CourseModule | undefined;

  for (const mod of course.modules) {
    for (const chap of mod.chapters) {
      for (const les of chap.lessons) {
        if (les.id === activeLessonId) {
          activeLesson = les;
          activeModule = mod;
          break;
        }
      }
      if (activeLesson) break;
    }
    if (activeLesson) break;
  }

  useEffect(() => {
    if (activeLessonId) {
      setScratchpadText(progress.notes[activeLessonId] || '');
      setShowSampleSolution(false);
      setLabSubmitted(false);
      setQuizSubmitted(false);
      setSelectedAnswers({});
      setMistakeExplanation({});
    }
  }, [activeLessonId, progress.notes]);

  const toggleModuleExpand = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const isLessonCompleted = activeLesson ? progress.completedLessonIds.includes(activeLesson.id) : false;
  const isBookmarked = activeLesson ? progress.bookmarkedLessonIds.includes(activeLesson.id) : false;

  const allLessons: { lesson: Lesson; module: CourseModule }[] = [];
  course.modules.forEach((mod) => {
    mod.chapters.forEach((chap) => {
      chap.lessons.forEach((les) => {
        allLessons.push({ lesson: les, module: mod });
      });
    });
  });

  const currentIndex = allLessons.findIndex((item) => item.lesson.id === activeLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleCompleteAndNext = () => {
    if (activeLesson && !isLessonCompleted) {
      onToggleLessonComplete(activeLesson.id, activeLesson.durationMinutes);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch {}
    }
    if (nextLesson) {
      setActiveLessonId(nextLesson.lesson.id);
      setActiveTab('guide');
    }
  };

  const handleDiscoverMoreVideos = async () => {
    if (!activeLesson) return;
    setDiscoveringVideos(true);
    try {
      const res = await fetch('/api/videos/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: course.title,
          lessonTitle: activeLesson.title,
          difficulty: course.difficulty,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.videos)) {
        setCustomVideos((prev) => ({
          ...prev,
          [activeLesson.id]: data.videos,
        }));
      }
    } catch (e) {
      console.error('Error discovering videos:', e);
    } finally {
      setDiscoveringVideos(false);
    }
  };

  const handleQuizSubmit = (quizQuestions: QuizQuestion[]) => {
    if (!activeModule) return;
    let score = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    setQuizSubmitted(true);
    const passed = (score / quizQuestions.length) >= 0.5;
    onRecordQuizScore(activeModule.id, score, quizQuestions.length, passed);

    if (passed) {
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleExplainMistake = async (q: QuizQuestion) => {
    const studentChoiceIndex = selectedAnswers[q.id];
    if (studentChoiceIndex === undefined) return;

    setDiagnosingMistake(q.id);
    try {
      const res = await fetch('/api/tutor/explain-mistake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          studentAnswer: q.options[studentChoiceIndex],
          correctAnswer: q.options[q.correctIndex],
        }),
      });
      const data = await res.json();
      if (data.success && data.explanation) {
        setMistakeExplanation((prev) => ({
          ...prev,
          [q.id]: data.explanation,
        }));
      }
    } catch (e) {
      console.error('Error diagnosing mistake:', e);
    } finally {
      setDiagnosingMistake(null);
    }
  };

  const currentVideos = [
    ...(activeLesson?.curatedVideos || []),
    ...(customVideos[activeLessonId] || []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Top Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-3 sticky top-16 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Courses</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
            {course.title}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 shrink-0">
          {activeLesson && (
            <button
              onClick={() => onToggleBookmark(activeLesson.id)}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Save for later'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}

          {activeLesson && (
            <button
              onClick={() =>
                onOpenTutorWithContext({
                  courseTitle: course.title,
                  moduleTitle: activeModule?.title || '',
                  lessonTitle: activeLesson.title,
                  lessonContent: activeLesson.detailedExplanation,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Ask AI Tutor</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Zone Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl w-full mx-auto">
        
        {/* Left Sidebar: Lesson List */}
        <aside className="w-full lg:w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Course Outline
            </h3>
            <div className="text-xs text-slate-500 mt-1">
              {progress.completedLessonIds.filter((id) =>
                allLessons.some((l) => l.lesson.id === id)
              ).length}{' '}
              of {allLessons.length} lessons finished
            </div>
          </div>

          <div className="space-y-3">
            {course.modules.map((mod, modIdx) => {
              const isOpen = expandedModules[mod.id] ?? false;
              const moduleLessons = mod.chapters.flatMap((c) => c.lessons);
              const quizRecord = progress.quizScores[mod.id];

              return (
                <div
                  key={mod.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden bg-slate-50/50 dark:bg-slate-900/60"
                >
                  <button
                    onClick={() => toggleModuleExpand(mod.id)}
                    className="w-full text-left p-3 flex items-center justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div>
                      <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        Part 0{modIdx + 1}
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                        {mod.title.replace(/^Module \d+:\s*/, '')}
                      </div>
                    </div>
                    <div className="text-slate-400">
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 dark:border-slate-800 p-2 space-y-1 bg-white dark:bg-slate-900">
                      {moduleLessons.map((les) => {
                        const isSelected = les.id === activeLessonId;
                        const isDone = progress.completedLessonIds.includes(les.id);

                        return (
                          <button
                            key={les.id}
                            onClick={() => {
                              setActiveLessonId(les.id);
                              setActiveTab('guide');
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors ${
                              isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <span className="truncate">{les.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {les.durationMinutes}m
                            </span>
                          </button>
                        );
                      })}

                      {mod.quiz && (
                        <button
                          onClick={() => {
                            if (moduleLessons[0]) setActiveLessonId(moduleLessons[0].id);
                            setActiveTab('quiz');
                          }}
                          className={`w-full text-left mt-2 px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between border border-dashed transition-colors ${
                            quizRecord?.passed
                              ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300'
                              : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Award className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="truncate">Quick Check</span>
                          </div>
                          {quizRecord && (
                            <span className="text-[10px] font-mono">
                              {quizRecord.score}/{quizRecord.total} {quizRecord.passed ? '✓' : ''}
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Stage: Reading & Practice */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeLesson ? (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Header */}
              <div className="space-y-2 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{activeModule?.title}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeLesson.durationMinutes} min read</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                    {activeLesson.title}
                  </h1>

                  <button
                    onClick={() =>
                      onToggleLessonComplete(activeLesson.id, activeLesson.durationMinutes)
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      isLessonCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600'
                    }`}
                  >
                    {isLessonCompleted ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Finished ✓</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Mark Finished</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeLesson.summary}
                </p>
              </div>

              {/* Study Mode Navigation Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl max-w-fit">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'guide'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Simple Guide</span>
                </button>

                <button
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'videos'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Short Videos</span>
                </button>

                <button
                  onClick={() => setActiveTab('lab')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === 'lab'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>2-Min Practice</span>
                </button>

                {activeModule?.quiz && (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === 'quiz'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Quick Quiz</span>
                  </button>
                )}
              </div>

              {/* TAB 1: SIMPLE GUIDE */}
              {activeTab === 'guide' && (
                <div className="space-y-6">
                  {/* Clean text with large comfortable font */}
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-base space-y-4">
                    {activeLesson.detailedExplanation.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3
                            key={pIdx}
                            className="text-lg font-bold text-slate-900 dark:text-white font-display pt-4"
                          >
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      return (
                        <p key={pIdx} className="leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* 3 Simple Takeaways */}
                  {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
                    <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2.5">
                      <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-semibold text-xs uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>3 Things to Remember</span>
                      </div>
                      <ul className="space-y-1.5">
                        {activeLesson.keyTakeaways.map((takeaway, tIdx) => (
                          <li key={tIdx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Friendly 1-Click Tutor Prompt */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Want this explained with a fun analogy?
                    </div>
                    <button
                      onClick={() =>
                        onOpenTutorWithContext({
                          courseTitle: course.title,
                          moduleTitle: activeModule?.title || '',
                          lessonTitle: activeLesson.title,
                          lessonContent: activeLesson.detailedExplanation,
                          initialMessage: `Can you explain the main idea of "${activeLesson.title}" in 2 simple sentences using an everyday analogy?`,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
                    >
                      Explain in Plain Words
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: SHORT VIDEOS */}
              {activeTab === 'videos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500">
                      Short, easy-to-follow video clips.
                    </div>
                    <button
                      onClick={handleDiscoverMoreVideos}
                      disabled={discoveringVideos}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${discoveringVideos ? 'animate-spin' : ''}`} />
                      <span>Find more videos</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentVideos.map((video, vIdx) => (
                      <div
                        key={vIdx}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{video.channel}</span>
                          <span>{video.duration}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {video.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {video.whyRecommended}
                        </p>
                        <div className="pt-2 flex justify-end">
                          <a
                            href={
                              video.searchUrl ||
                              `https://www.youtube.com/results?search_query=${encodeURIComponent(
                                `${video.channel} ${video.title}`
                              )}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Watch video</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: 2-MINUTE PRACTICE */}
              {activeTab === 'lab' && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                      {activeLesson.practicalExercise.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {activeLesson.practicalExercise.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Easy Steps:
                      </div>
                      <ol className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        {activeLesson.practicalExercise.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="font-semibold text-indigo-600">{sIdx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Simple notes scratchpad */}
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your notes (saved automatically):
                      </label>
                      <textarea
                        rows={3}
                        value={scratchpadText}
                        onChange={(e) => {
                          setScratchpadText(e.target.value);
                          onSaveNote(activeLesson.id, e.target.value);
                        }}
                        placeholder="Type any quick thoughts here..."
                        className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLabSubmitted(true);
                          if (!isLessonCompleted) {
                            onToggleLessonComplete(activeLesson.id, activeLesson.durationMinutes);
                          }
                          try {
                            confetti({ particleCount: 40, spread: 50 });
                          } catch {}
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                      >
                        {labSubmitted ? 'Completed ✓' : 'I Did This!'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: QUICK QUIZ */}
              {activeTab === 'quiz' && activeModule?.quiz && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                      {activeModule.quiz.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Check what you learned! No stress, you can try as many times as you like.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activeModule.quiz.questions.map((q, qIdx) => {
                      const selected = selectedAnswers[q.id];
                      const isCorrect = selected === q.correctIndex;

                      return (
                        <div
                          key={q.id}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
                        >
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {qIdx + 1}. {q.question}
                          </div>

                          <div className="space-y-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isChoiceSelected = selected === optIdx;
                              let style =
                                'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800';

                              if (quizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  style = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold';
                                } else if (isChoiceSelected) {
                                  style = 'border-red-400 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200';
                                }
                              } else if (isChoiceSelected) {
                                style = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100 font-semibold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    if (!quizSubmitted) {
                                      setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                    }
                                  }}
                                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-colors ${style}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="pt-2 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                              <p className={isCorrect ? 'text-emerald-600 font-medium' : 'text-slate-600'}>
                                {q.explanation}
                              </p>

                              {!isCorrect && (
                                <div>
                                  <button
                                    onClick={() => handleExplainMistake(q)}
                                    disabled={diagnosingMistake === q.id}
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                                  >
                                    {diagnosingMistake === q.id
                                      ? 'Thinking...'
                                      : 'Ask AI Tutor why in simple words'}
                                  </button>

                                  {mistakeExplanation[q.id] && (
                                    <div className="p-3 mt-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-slate-800 dark:text-slate-200">
                                      {mistakeExplanation[q.id]}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    {!quizSubmitted ? (
                      <button
                        onClick={() => handleQuizSubmit(activeModule.quiz!.questions)}
                        disabled={Object.keys(selectedAnswers).length < activeModule.quiz.questions.length}
                        className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors"
                      >
                        Check My Answers
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedAnswers({});
                          setMistakeExplanation({});
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Nav */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                {prevLesson ? (
                  <button
                    onClick={() => {
                      setActiveLessonId(prevLesson.lesson.id);
                      setActiveTab('guide');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back: {prevLesson.lesson.title}</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson && (
                  <button
                    onClick={handleCompleteAndNext}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                  >
                    <span>Next Lesson</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-sm">
              Pick a lesson on the left to start reading!
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
