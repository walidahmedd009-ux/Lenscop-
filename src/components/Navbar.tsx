import { Sun, Moon, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'hub' | 'dashboard' | 'generator' | 'tutor';
  onSelectTab: (tab: 'hub' | 'dashboard' | 'generator' | 'tutor') => void;
  onOpenGenerator: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  enrolledCount: number;
}

export function Navbar({
  currentTab,
  onSelectTab,
  onOpenGenerator,
  isDarkMode,
  onToggleTheme,
  enrolledCount
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab('hub')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 font-display hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Personal AI University
        </button>

        {/* Zone 2: Simple, Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('hub')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'hub'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Courses
            {currentTab === 'hub' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'dashboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Progress
            {enrolledCount > 0 && (
              <span className="ml-1 text-xs text-slate-400 font-mono">
                ({enrolledCount})
              </span>
            )}
            {currentTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('generator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'generator'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Course
            {currentTab === 'generator' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('tutor')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'tutor'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            AI Tutor
            {currentTab === 'tutor' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ New Course</span>
          </button>
        </div>
      </div>
    </header>
  );
}
