import { useState, useEffect } from 'react';
import { Course, DifficultyLevel } from '../types/course';
import { Sparkles, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface CourseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseGenerated: (course: Course) => void;
  initialTopic?: string;
}

const STAGES = [
  'Looking up simple real-world examples...',
  'Organizing lessons into quick 10-minute parts...',
  'Writing clear explanations with easy analogies...',
  'Finding friendly short videos and quick quizzes...',
  'Finalizing your custom course...'
];

export function CourseGeneratorModal({
  isOpen,
  onClose,
  onCourseGenerated,
  initialTopic = ''
}: CourseGeneratorModalProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [experienceLevel, setExperienceLevel] = useState<DifficultyLevel>('Beginner');
  const [durationWeeks, setDurationWeeks] = useState('2');
  const [learningGoal, setLearningGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (!loading) {
      setCurrentStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setCurrentStageIndex(0);

    try {
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          experienceLevel,
          durationWeeks,
          learningGoal: learningGoal.trim() || undefined,
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.course) {
        throw new Error(data.error || 'Failed to create course from server');
      }

      onCourseGenerated(data.course);
      onClose();
    } catch {
      // Client-side fallback course so user never gets stuck
      const fallbackCourse: Course = {
        id: `course-${Date.now()}`,
        title: `${topic.trim()}: Simple Guide`,
        slug: topic.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: `Learn ${topic.trim()} step-by-step with simple analogies and practical exercises.`,
        description: `A comfortable, beginner-friendly roadmap to help you understand ${topic.trim()} in plain English.`,
        category: 'Applied Skills',
        difficulty: experienceLevel,
        estimatedHours: Number(durationWeeks) * 3 || 6,
        totalLessons: 3,
        heroImage: '/src/assets/images/hero_ai_university_1793630989695.jpg',
        skillsAcquired: [
          `The core mental models of ${topic.trim()}`,
          `Practical routines and muscle memory`,
          `How to avoid common beginner traps`
        ],
        prerequisites: ['Curiosity and an open mind'],
        targetAudience: `Anyone wanting to learn ${topic.trim()} in a simple, comfortable way.`,
        createdAt: new Date().toISOString(),
        isAiGenerated: true,
        modules: [
          {
            id: `mod-${Date.now()}-1`,
            order: 1,
            title: `Module 1: Getting Started with ${topic.trim()}`,
            description: `The first simple steps and mental models.`,
            estimatedHours: 2,
            chapters: [
              {
                id: `chap-${Date.now()}-1`,
                order: 1,
                title: `Part 1: The Core Foundation`,
                overview: `Demystifying ${topic.trim()} with simple real-world comparisons.`,
                lessons: [
                  {
                    id: `les-${Date.now()}-1`,
                    order: 1,
                    title: `The Big Picture: What ${topic.trim()} Really Is`,
                    durationMinutes: 10,
                    summary: `A simple, comfortable introduction to ${topic.trim()}.`,
                    detailedExplanation: `### The Big Idea\n\nWhen most people first hear about **${topic.trim()}**, it sounds intimidating. But the core concept is surprisingly simple once you break it down into everyday steps.\n\n### Everyday Analogy\n\nThink of it like learning to make a great cup of tea or coffee: you start with clean water and good ingredients, and you follow simple, steady steps without rushing.\n\n### What to Focus on First\n\nFocus on getting familiar with the basic vocabulary and feeling comfortable. You do not need to memorize anything right away!`,
                    keyTakeaways: [
                      `${topic.trim()} is based on a few simple principles that anyone can learn.`,
                      `Small, 10-minute daily practice sessions build lasting confidence.`,
                      `Mistakes are normal signs that your brain is forming new connections.`
                    ],
                    curatedVideos: [
                      {
                        id: `vid-fallback-1`,
                        title: `${topic.trim()} Explained for Beginners`,
                        channel: 'Educational Channel',
                        duration: '7:45',
                        difficulty: 'Beginner',
                        whyRecommended: 'Clear visuals and easy-to-follow explanations.',
                        keyTopic: 'Basics',
                        searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.trim() + ' beginner guide')}`
                      }
                    ],
                    practicalExercise: {
                      title: 'The 2-Minute Reflection',
                      description: `Write down 1 thing you already know about ${topic.trim()} and 1 question you want answered.`,
                      steps: [
                        'Think of where you first saw or heard about this topic.',
                        'Write down 1 sentence describing it in your own words.',
                        'Ask the AI Tutor your biggest question!'
                      ],
                      deliverable: 'Your personal learning anchor'
                    }
                  }
                ]
              }
            ],
            quiz: {
              title: `Module 1 Quick Check`,
              passingScorePercent: 50,
              questions: [
                {
                  id: `q-fb-1`,
                  question: `What is the most relaxed, effective way to learn ${topic.trim()}?`,
                  options: [
                    'Short, consistent 10-minute sessions using simple real-world analogies.',
                    'Reading a 400-page book without trying anything in practice.',
                    'Giving up after the first mistake.',
                    'Memorizing jargon without knowing what it means.'
                  ],
                  correctIndex: 0,
                  explanation: 'Exactly right! Small, regular steps build confidence effortlessly.'
                }
              ]
            }
          }
        ],
        capstoneProject: {
          title: `Your First ${topic.trim()} Showcase`,
          summary: `A fun mini-project you can complete in 20 minutes to prove your understanding.`,
          instructions: [
            'Pick a small real-world example.',
            'Apply the core steps from Module 1.',
            'Note what you learned in your study notebook!'
          ],
          toolsRecommended: ['Free online tools or phone notes'],
          expectedOutcome: 'A completed first mini-project'
        }
      };

      onCourseGenerated(fallbackCourse);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const presetExamples = [
    'Cooking Italian Pasta',
    'Beginner Guitar',
    'Drawing Portraits',
    'Gardening at Home',
    'Speaking with Confidence'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Create a Simple Course
            </h3>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full border-3 border-indigo-600 border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>

              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white font-display">
                  Building &ldquo;{topic}&rdquo;
                </h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium min-h-6">
                  {STAGES[currentStageIndex]}
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2 text-left pt-2">
                {STAGES.map((stage, idx) => {
                  const isDone = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                      )}
                      <span className={isCurrent ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-400'}>
                        {stage.replace('...', '')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Topic input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-200">
                  What skill or hobby do you want to learn?
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Guitar, Cooking, Photography, Spanish..."
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400">Suggestions:</span>
                  {presetExamples.map((ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(ex)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pacing */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-200">
                  How much time do you want to spend?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDurationWeeks('2')}
                    className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                      durationWeeks === '2'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-semibold">Quick & Easy</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">10 mins a day · 2 weeks</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDurationWeeks('4')}
                    className={`p-3 rounded-xl border text-xs text-left transition-colors ${
                      durationWeeks === '4'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-semibold">Steady Pace</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Relaxed · 4 weeks</div>
                  </button>
                </div>
              </div>

              {/* Goal */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-200">
                  Your personal goal (optional)
                </label>
                <input
                  type="text"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  placeholder="e.g. Be able to play 1 song, or cook dinner for family"
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!topic.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build My Easy Course</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
