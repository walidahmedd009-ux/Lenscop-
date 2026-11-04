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

function cleanLatexAndMath(raw: string): string {
  return raw
    // Clean LaTeX fractions: \frac{a}{b} -> (a / b)
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    // Clean \text{...} -> ...
    .replace(/\\text\{([^}]+)\}/g, '$1')
    // Remove block math delimiters $$...$$
    .replace(/\$\$([^$]+)\$\$/g, '$1')
    // Remove inline math dollar signs like $72 / 8 = 9$ while preserving currency amounts like $10,000 or $20k
    .replace(/\$([0-9\s.+\-*/=()a-zA-Z]+)\$/g, (_match, inner) => {
      if (/^\s*\d+([,.]\d+)?[kKmMbB]?\s*$/.test(inner)) {
        return `$${inner.trim()}`;
      }
      return inner.trim();
    })
    .replace(/\\/g, '')
    .trim();
}

function getSkillMeaning(title: string, category: string, desc: string): string {
  const clean = title.replace(/:.*/, '').trim();
  const lower = clean.toLowerCase();

  if (lower.includes('guitar')) {
    return 'Guitar is a fretted string instrument. Playing guitar means using your fretting hand to press strings against fret wires to form specific chord shapes and notes, while your picking hand rhythmically strikes strings to produce harmonious acoustic or electric music.';
  }
  if (lower.includes('finance') || lower.includes('money') || lower.includes('invest')) {
    return 'Personal finance is the system of allocating capital between spending, saving, and investing. Its meaning is putting surplus capital into compounding productive assets while eliminating high-interest debt and unnecessary fees, so your capital works for you instead of you solely working for capital.';
  }
  if (lower.includes('ai') || lower.includes('machine learning')) {
    return 'Artificial Intelligence is software designed to recognize statistical patterns in large datasets and make accurate predictions or generate responses. Its meaning is moving from rigid manual programming to adaptive models that learn directly from feedback and examples.';
  }
  if (lower.includes('photo') || lower.includes('camera')) {
    return 'Photography literally translates to drawing with light. It is the craft of capturing three-dimensional visual reality into a two-dimensional frame by controlling light quality, direction, camera perspective, and composition.';
  }
  if (lower.includes('cook') || lower.includes('culinary')) {
    return 'Cooking is the craft of applying heat, acidity, and seasoning to transform raw ingredients into balanced, nourishing food by controlling moisture, surface caramelization, and flavor balance.';
  }
  if (lower.includes('learn') || lower.includes('memory')) {
    return 'Accelerated learning is the science of acquiring and retaining skills rapidly using neurological principles like spaced repetition, retrieval practice, and active recall rather than passive rereading.';
  }
  if (lower.includes('code') || lower.includes('python') || lower.includes('web') || lower.includes('programming')) {
    return 'Programming is the craft of writing structured logical instructions that computers execute. Its meaning is translating human goals into precise algorithmic steps that automate workflows and build digital tools.';
  }
  return `${clean} is a practical discipline centered on ${desc ? desc.toLowerCase() : 'mastering foundational principles, techniques, and repeatable workflows to achieve dependable, high-quality outcomes'}.`;
}

function getSkillGuidelines(title: string, skills: string[]): string[] {
  const clean = title.replace(/:.*/, '').trim();
  const lower = clean.toLowerCase();

  if (lower.includes('guitar')) {
    return [
      'Guideline 1: Place fretting fingertips directly behind metal fret wires, not in the middle of frets, to produce clean tone with 70% less finger pressure.',
      'Guideline 2: Keep your strumming hand in constant rhythm even when switching chords. Muscle memory catches up when rhythm never stops.',
      'Guideline 3: Practice in short 10-minute daily blocks rather than occasional long sessions to build finger calluses and effortless chord transitions.'
    ];
  }
  if (lower.includes('finance') || lower.includes('invest')) {
    return [
      'Guideline 1: Pay yourself first by automatically routing 15-20% into an investment account on payday before discretionary spending.',
      'Guideline 2: Keep 3 to 6 months of basic living expenses in an emergency fund before taking speculative risks.',
      'Guideline 3: Rely on low-cost broad-market index funds over decades instead of trying to time short-term market fluctuations.'
    ];
  }
  if (lower.includes('photo')) {
    return [
      'Guideline 1: Light always beats camera gear. Shoot near large, soft natural light sources like north-facing daytime windows.',
      'Guideline 2: Clean the background. Move your camera or subject to eliminate visual distractions before pressing the shutter.',
      'Guideline 3: Lock focus and exposure deliberately on your primary subject before framing your composition.'
    ];
  }
  if (lower.includes('ai')) {
    return [
      'Guideline 1: Provide clear context, specific constraints, and desired output formats rather than open-ended vague requests.',
      'Guideline 2: Iterate step-by-step by breaking complex tasks into sequential prompts rather than one giant prompt.',
      'Guideline 3: Always verify factual assertions and code logic against real execution and domain documentation.'
    ];
  }
  return [
    `Guideline 1: Master the primary 20% of foundational mechanics that produce 80% of results in ${clean}.`,
    `Guideline 2: Practice deliberate, slow-motion repetitions to build pristine neurological patterns before attempting speed.`,
    `Guideline 3: Establish an immediate feedback loop after every repetition so you catch and correct mistakes in seconds.`
  ];
}

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
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 pb-60 sm:pb-64">
      
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

      {/* What It Is (The Meaning) & The Guidelines (First thing shown when a person asks for a skill or niche) */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4 shadow-2xs">
        <div>
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white shrink-0" />
            <span>What It Is & The Meaning</span>
          </div>
          <p className="text-sm sm:text-base text-black dark:text-white leading-7 sm:leading-8">
            {course.whatItIs || getSkillMeaning(course.title, course.category, course.description)}
          </p>
        </div>

        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            The Guidelines
          </div>
          <div className="space-y-2">
            {(course.guidelines || getSkillGuidelines(course.title, course.skillsAcquired)).map((g, gIdx) => (
              <div key={gIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-6 sm:leading-7">
                <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white mt-2.5 shrink-0" />
                <span>{g}</span>
              </div>
            ))}
          </div>
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
              {activeLesson.detailedExplanation.split('\n\n').map((block, bIdx) => {
                const cleanedBlock = cleanLatexAndMath(block.replace(/\*/g, '')).trim();
                if (!cleanedBlock) return null;

                if (cleanedBlock.startsWith('### ')) {
                  return (
                    <h3
                      key={bIdx}
                      className="text-lg sm:text-xl font-bold text-black dark:text-white font-display pt-3 pb-1"
                    >
                      {cleanedBlock.replace('### ', '')}
                    </h3>
                  );
                }

                // Check for lines within this block (e.g. bullet points or formula lines)
                const lines = cleanedBlock.split('\n').map((l) => l.trim()).filter(Boolean);

                if (lines.some((l) => l.startsWith('- ') || l.startsWith('• '))) {
                  return (
                    <div key={bIdx} className="space-y-3">
                      {lines.map((line, lIdx) => {
                        const isBullet = line.startsWith('- ') || line.startsWith('• ');
                        const text = isBullet ? line.replace(/^[-•]\s*/, '') : line;

                        if (isBullet) {
                          return (
                            <div key={lIdx} className="flex items-start gap-3 pl-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white mt-3.5 shrink-0 opacity-80" />
                              <span className="leading-8 sm:leading-9 flex-1">{text}</span>
                            </div>
                          );
                        }

                        // Check if it is a formula or calculation
                        const isFormula = text.includes(' = ') && (text.includes(' / ') || text.includes('divided by'));
                        if (isFormula) {
                          return (
                            <div
                              key={lIdx}
                              className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-sm sm:text-base text-black dark:text-white leading-relaxed my-2"
                            >
                              {text}
                            </div>
                          );
                        }

                        return (
                          <p key={lIdx} className="leading-8 sm:leading-9 font-normal">
                            {text}
                          </p>
                        );
                      })}
                    </div>
                  );
                }

                // Check if the entire block is a formula line
                const isFormulaBlock = cleanedBlock.includes(' = ') && (cleanedBlock.includes(' / ') || cleanedBlock.includes('divided by'));
                if (isFormulaBlock && lines.length === 1) {
                  return (
                    <div
                      key={bIdx}
                      className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-sm sm:text-base text-black dark:text-white leading-relaxed my-2"
                    >
                      {cleanedBlock}
                    </div>
                  );
                }

                return (
                  <p key={bIdx} className="leading-8 sm:leading-9 font-normal">
                    {cleanedBlock}
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
