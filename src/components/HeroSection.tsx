import { useState } from 'react';
import { Sparkles, ArrowRight, Video, CheckCircle2, Bot, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  onSearchOrGenerate: (topic: string) => void;
  onExploreCourses: () => void;
}

export function HeroSection({ onSearchOrGenerate, onExploreCourses }: HeroSectionProps) {
  const [topicInput, setTopicInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicInput.trim()) {
      onSearchOrGenerate(topicInput.trim());
    }
  };

  const sampleTopics = [
    'How AI Works',
    'Phone Photography',
    'Healthy Habits',
    'Public Speaking',
    'Cooking Basics',
    'Drawing for Beginners'
  ];

  return (
    <div className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Vision & Input */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                Personal AI University · Simple Learning
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-display text-balance leading-tight">
                Learn any skill in simple, comfortable steps.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Type what you want to learn. Our friendly AI turns it into an easy roadmap with short videos, simple real-world examples, and your own personal tutor.
              </p>
            </div>

            {/* Quick Generator Bar */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="What would you like to learn today? (e.g. Photography)..."
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 transition-all shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Course</span>
              </button>
            </form>

            {/* Quick Inspiration Topics */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">Try an easy topic:</span>
              {sampleTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setTopicInput(topic);
                    onSearchOrGenerate(topic);
                  }}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Explore button */}
            <div className="pt-1 flex items-center gap-4">
              <button
                onClick={onExploreCourses}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>Browse Ready-Made Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900 shadow-md group">
              <img
                src="/src/assets/images/hero_ai_university_1793630989695.jpg"
                alt="Personal AI University Learning Commons"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-102"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                  Comfortable & Stress-Free
                </div>
                <div className="text-base font-bold font-display mt-0.5">
                  Learn at your own pace without confusing words
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Bite-sized lessons · Helpful videos · 1-on-1 AI Tutor
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars Strip with low reading level words */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Easy Roadmaps</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Divided into short, bite-sized lessons you can finish in 10 minutes.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
              <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Short Videos</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Hand-picked educational clips that explain things visually.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Fun Quick Checks</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Easy 2-minute activities and quick quizzes to test your understanding.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Friendly AI Tutor</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Ask anything anytime. Get simple analogies that make total sense.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
