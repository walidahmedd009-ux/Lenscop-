import { useState, useEffect } from 'react';
import { Course, Lesson, QuizQuestion, TutorChatMessage } from '../types/course';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Check,
  Bot,
  User,
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseReaderViewProps {
  course: Course;
  completedLessonIds: string[];
  onToggleComplete: (lessonId: string, durationMinutes?: number) => void;
  tutorMessages: TutorChatMessage[];
  activeLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
}

export function CourseReaderView({
  course,
  completedLessonIds,
  onToggleComplete,
  tutorMessages,
  activeLessonId: controlledActiveLessonId,
  onSelectLesson
}: CourseReaderViewProps) {
  const allLessons: Lesson[] = course.modules.flatMap((m) =>
    m.chapters.flatMap((ch) => ch.lessons)
  );

  const [localLessonId, setLocalLessonId] = useState<string>(allLessons[0]?.id || '');
  const activeLessonId = controlledActiveLessonId || localLessonId;

  useEffect(() => {
    if (allLessons.length > 0 && !allLessons.some((l) => l.id === activeLessonId)) {
      setLocalLessonId(allLessons[0].id);
    }
  }, [course.id]);

  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const isLessonDone = activeLesson ? completedLessonIds.includes(activeLesson.id) : false;

  const currentIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleSelectLesson = (id: string) => {
    setLocalLessonId(id);
    onSelectLesson?.(id);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleNextLesson = () => {
    if (activeLesson && !isLessonDone) {
      onToggleComplete(activeLesson.id, activeLesson.durationMinutes);
      try {
        confetti({ particleCount: 40, spread: 50 });
      } catch {}
    }
    if (nextLesson) {
      handleSelectLesson(nextLesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const completedCount = allLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const percent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  // Find module quiz if applicable
  const activeModule = course.modules.find((m) =>
    m.chapters.some((ch) => ch.lessons.some((l) => l.id === activeLessonId))
  );
  const quiz = activeModule?.quiz;
  const sampleQuestion = quiz?.questions[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 pb-32">
      
      {/* Course Header Banner (Black & White) */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>{course.category}</span>
          <span className="font-mono">{completedCount}/{allLessons.length} finished ({percent}%)</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white font-display">
          {course.title}
        </h1>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {course.tagline || course.description}
        </p>

        {/* Minimalist Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-black dark:bg-white rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Lesson Selector Bar (Simple segmented pill list) */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-1">
          Select Lesson:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {allLessons.map((les, idx) => {
            const isSelected = les.id === activeLessonId;
            const isDone = completedLessonIds.includes(les.id);

            return (
              <motion.button
                key={les.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => handleSelectLesson(les.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 border cursor-pointer select-none ${
                  isSelected
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white'
                }`}
              >
                <motion.span
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(les.id, les.durationMinutes);
                  }}
                  className="inline-flex items-center justify-center p-0.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700/60"
                  title={isDone ? 'Mark as not done' : 'Mark as done'}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isDone ? (
                      <motion.div
                        key="pill-done"
                        initial={{ scale: 0, rotate: -40, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-current" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pill-undone"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                      >
                        <Circle className="w-3.5 h-3.5 shrink-0" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.span>
                <span>{idx + 1}. {les.title}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Lesson Content (Low Reading Level, High Comfort) */}
      {activeLesson && (
        <div className="space-y-6">
          
          {/* Lesson Title & Checkbox */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="text-xs text-neutral-500 font-mono mb-1">
                {activeLesson.durationMinutes} min read · Beginner friendly
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white font-display">
                {activeLesson.title}
              </h2>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => onToggleComplete(activeLesson.id, activeLesson.durationMinutes)}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap shrink-0 cursor-pointer select-none overflow-hidden ${
                isLessonDone
                  ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-black dark:text-white shadow-xs'
                  : 'bg-black text-white dark:bg-white dark:text-black border-transparent hover:opacity-95 shadow-xs'
              }`}
              title={isLessonDone ? 'Click to unmark' : 'Click to mark complete'}
            >
              {/* Subtle expanding tactile ripple on complete */}
              <AnimatePresence>
                {isLessonDone && (
                  <motion.span
                    key={`pulse-${activeLesson.id}`}
                    initial={{ scale: 0.8, opacity: 0.4 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-xl bg-current opacity-25 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className="relative flex items-center justify-center w-3.5 h-3.5">
                <AnimatePresence mode="wait" initial={false}>
                  {isLessonDone ? (
                    <motion.div
                      key="checked"
                      initial={{ scale: 0, rotate: -40, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unchecked"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.5 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Circle className="w-3.5 h-3.5 stroke-[2]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {isLessonDone ? 'Done' : 'Mark Done'}
              </motion.span>
            </motion.button>
          </div>

            {/* Simple Explanation Content (Bigger lines, spacious line height, zero asterisks) */}
            <div className="space-y-6 text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-8 sm:leading-9">
              {activeLesson.detailedExplanation.split('\n\n').map((para, pIdx) => {
                const cleanPara = para.replace(/\*/g, '').trim();
                if (!cleanPara) return null;

                if (cleanPara.startsWith('### ')) {
                  return (
                    <h3
                      key={pIdx}
                      className="text-lg sm:text-xl font-bold text-black dark:text-white font-display pt-3 pb-1"
                    >
                      {cleanPara.replace('### ', '')}
                    </h3>
                  );
                }

                return (
                  <p key={pIdx} className="leading-8 sm:leading-9 font-normal">
                    {cleanPara}
                  </p>
                );
              })}
            </div>

            {/* Key Takeaways */}
            {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
                <div className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                  Key Points
                </div>
                <div className="space-y-2 text-sm sm:text-base text-neutral-800 dark:text-neutral-200 leading-7 sm:leading-8">
                  {activeLesson.keyTakeaways.map((point, ptIdx) => {
                    const cleanPoint = point.replace(/\*/g, '').trim();
                    return (
                      <div key={ptIdx} className="flex items-start gap-3">
                        <span className="font-bold text-black dark:text-white text-base">·</span>
                        <span>{cleanPoint}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Short Video Recommendation */}
          {activeLesson.curatedVideos && activeLesson.curatedVideos.length > 0 && (
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-semibold text-black dark:text-white">Watch Short Video</span>
                <span>{activeLesson.curatedVideos[0].duration}</span>
              </div>
              <div className="text-sm font-bold text-black dark:text-white">
                {activeLesson.curatedVideos[0].title}
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {activeLesson.curatedVideos[0].whyRecommended}
              </p>
              <div className="pt-2">
                <a
                  href={
                    activeLesson.curatedVideos[0].searchUrl ||
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(
                      activeLesson.curatedVideos[0].title
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Open Video on YouTube</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </div>
            </div>
          )}

          {/* 2-Minute Practice (Bigger lines) */}
          {activeLesson.practicalExercise && (
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
              <div className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                2-Minute Practice: {activeLesson.practicalExercise.title.replace(/\*/g, '')}
              </div>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-7 sm:leading-8">
                {activeLesson.practicalExercise.description.replace(/\*/g, '')}
              </p>
              <div className="space-y-2 text-sm sm:text-base text-neutral-800 dark:text-neutral-200 pt-1 leading-7">
                {activeLesson.practicalExercise.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-3">
                    <span className="font-bold text-black dark:text-white">{sIdx + 1}.</span>
                    <span>{step.replace(/\*/g, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Check Quiz Question */}
          {sampleQuestion && (
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              <div className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                Quick 1-Question Check
              </div>
              <div className="text-base sm:text-lg font-bold text-black dark:text-white leading-7">
                {sampleQuestion.question.replace(/\*/g, '')}
              </div>

              <div className="space-y-2">
                {sampleQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedQuizAnswer === optIdx;
                  let optStyle =
                    'border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800';

                  if (quizSubmitted) {
                    if (optIdx === sampleQuestion.correctIndex) {
                      optStyle = 'border-black dark:border-white font-bold bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white';
                    } else if (isSelected) {
                      optStyle = 'border-neutral-400 line-through text-neutral-400';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-black dark:border-white font-semibold bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => {
                        if (!quizSubmitted) {
                          setSelectedQuizAnswer(optIdx);
                          setQuizSubmitted(true);
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm sm:text-base leading-6 transition-colors ${optStyle}`}
                    >
                      {opt.replace(/\*/g, '')}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="pt-2 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-7">
                  {selectedQuizAnswer === sampleQuestion.correctIndex
                    ? `✓ Correct! ${sampleQuestion.explanation.replace(/\*/g, '')}`
                    : `Notice: ${sampleQuestion.explanation.replace(/\*/g, '')}`}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 dark:border-neutral-800">
            {prevLesson ? (
              <button
                onClick={() => handleSelectLesson(prevLesson.id)}
                className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => onToggleComplete(activeLesson.id, activeLesson.durationMinutes)}
                className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all whitespace-nowrap cursor-pointer select-none overflow-hidden ${
                  isLessonDone
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-black dark:text-white shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white shadow-xs'
                }`}
                title={isLessonDone ? 'Click to unmark' : 'Click to mark complete'}
              >
                <AnimatePresence>
                  {isLessonDone && (
                    <motion.span
                      key={`bottom-pulse-${activeLesson.id}`}
                      initial={{ scale: 0.8, opacity: 0.4 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-xl bg-current opacity-20 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="relative flex items-center justify-center w-4 h-4">
                  <AnimatePresence mode="wait" initial={false}>
                    {isLessonDone ? (
                      <motion.div
                        key="btm-done"
                        initial={{ scale: 0, rotate: -40, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 stroke-[2.75]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="btm-undone"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Circle className="w-4 h-4 stroke-[2]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {isLessonDone ? 'Finished' : 'Mark Finished'}
                </motion.span>
              </motion.button>

              {nextLesson && (
                <button
                  onClick={handleNextLesson}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Tutor Chat Stream (Questions asked via the bottom dashboard bar) */}
      {tutorMessages.length > 0 && (
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-500 uppercase tracking-wider">
            <Bot className="w-4 h-4 text-black dark:text-white" />
            <span>AI Tutor Answers</span>
          </div>

          <div className="space-y-3">
            {tutorMessages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[90%] p-4 rounded-2xl text-sm sm:text-base leading-7 sm:leading-8 whitespace-pre-wrap ${
                      isUser
                        ? 'bg-black text-white dark:bg-white dark:text-black rounded-br-xs'
                        : 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white rounded-bl-xs'
                    }`}
                  >
                    {msg.content.replace(/\*/g, '')}
                  </div>
                  <span className="text-xs text-neutral-400 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
