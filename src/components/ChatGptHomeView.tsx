import { Course } from '../types/course';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface ChatGptHomeViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onSelectTopic: (topic: string) => void;
}

export function ChatGptHomeView({ courses, onSelectCourse, onSelectTopic }: ChatGptHomeViewProps) {
  const starterCards = [
    {
      title: 'Beginner Guitar',
      desc: 'First chords, strumming rhythms, and playing your first simple song.',
      icon: '🎸'
    },
    {
      title: 'How AI Works',
      desc: 'How smart machines spot patterns and predict words in plain English.',
      icon: '🤖'
    },
    {
      title: 'Phone Photography',
      desc: 'Master soft window light and clean angles with any phone camera.',
      icon: '📸'
    },
    {
      title: 'Personal Finance',
      desc: 'The simple 50/30/20 budget, emergency funds, and index fund investing.',
      icon: '💰'
    },
    {
      title: 'Cooking Fundamentals',
      desc: 'Knife safety, heat control, and seasoning food so it tastes amazing.',
      icon: '🍳'
    },
    {
      title: 'Faster Learning & Memory',
      desc: 'The 2-minute rule, spaced repetition, and building habits that stick.',
      icon: '🧠'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-16 space-y-10">
      
      {/* Central Welcome Lockup */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white font-display">
          What do you want to learn?
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Type any skill into the box below. Lenscop turns it into an easy, bite-sized course with clear lessons and interactive checks.
        </p>
      </div>

      {/* 6 Quick Starter Cards (Black & White Minimalist Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {starterCards.map((card, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectTopic(card.title)}
            className="text-left p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-black dark:hover:border-white transition-all group shadow-2xs"
          >
            <div className="flex items-center justify-between text-base mb-1">
              <span className="text-xl">{card.icon}</span>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-sm font-bold text-black dark:text-white mt-1">
              {card.title}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {card.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Available Ready Courses */}
      {courses.length > 0 && (
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Ready-Made Curricula
          </div>
          <div className="space-y-2">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between hover:border-black dark:hover:border-white transition-colors cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <div className="text-xs font-bold text-black dark:text-white truncate">
                    {course.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                    {course.tagline}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white shrink-0">
                  <span>Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
