import { Course, UserProgress } from '../types/course';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Trash2, Moon, Sun, Flame, CheckCircle2, Circle, ChevronRight, X } from 'lucide-react';

interface ChatGptSidebarProps {
  courses: Course[];
  activeCourseId: string | null;
  progress: UserProgress;
  onSelectCourse: (course: Course) => void;
  onNewCourse: () => void;
  onDeleteCourse: (courseId: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  activeLessonId?: string | null;
  onSelectLesson?: (lessonId: string) => void;
  onToggleLessonComplete?: (lessonId: string, durationMinutes?: number) => void;
}

export function ChatGptSidebar({
  courses,
  activeCourseId,
  progress,
  onSelectCourse,
  onNewCourse,
  onDeleteCourse,
  isDarkMode,
  onToggleTheme,
  isOpenMobile,
  onCloseMobile,
  activeLessonId,
  onSelectLesson,
  onToggleLessonComplete
}: ChatGptSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 flex flex-col justify-between border-r transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 text-black dark:text-white`}
      >
        {/* Top: Header & New Course Button */}
        <div className="p-3.5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={onNewCourse}
              className="text-sm font-bold tracking-tight uppercase font-display hover:opacity-80 transition-opacity"
            >
              Lenscop
            </button>
            <button
              onClick={onCloseMobile}
              className="p-1 md:hidden text-neutral-500 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onNewCourse}
            className="w-full h-10 px-3 flex items-center justify-between rounded-xl border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>New Course</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">⌘N</span>
          </button>
        </div>

        {/* Middle: Course List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="px-2 pt-2 pb-1 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Your Courses
          </div>

          {courses.map((course) => {
            const isActive = course.id === activeCourseId;
            const allLessons = course.modules.flatMap((m) => m.chapters.flatMap((ch) => ch.lessons));
            const completedCount = allLessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;
            const percent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

            return (
              <div key={course.id} className="space-y-0.5">
                <div
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-900 font-semibold text-black dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-black dark:hover:text-white'
                  }`}
                  onClick={() => {
                    onSelectCourse(course);
                    onCloseMobile();
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{course.title.replace(/:.*/, '')}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-neutral-400">
                      {percent}%
                    </span>
                    {course.isAiGenerated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCourse(course.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity cursor-pointer"
                        title="Delete custom course"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Active Course Lessons with Tactile Framer Motion Checkmarks */}
                {isActive && allLessons.length > 0 && (
                  <div className="pl-3 pr-1 py-1 space-y-0.5 border-l border-neutral-200 dark:border-neutral-800 ml-3">
                    {allLessons.map((les, lIdx) => {
                      const isLesDone = progress.completedLessonIds.includes(les.id);
                      const isLesCurrent = les.id === activeLessonId;

                      return (
                        <div
                          key={les.id}
                          onClick={() => {
                            onSelectLesson?.(les.id);
                            onCloseMobile();
                          }}
                          className={`group/les flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] cursor-pointer transition-colors ${
                            isLesCurrent
                              ? 'bg-neutral-200/80 dark:bg-neutral-800 font-medium text-black dark:text-white'
                              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-1">
                            {lIdx + 1}. {les.title}
                          </span>

                          {/* Framer Motion Checkmark Toggle Button */}
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.25 }}
                            whileTap={{ scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLessonComplete?.(les.id, les.durationMinutes);
                            }}
                            className="p-0.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700/60 cursor-pointer shrink-0"
                            title={isLesDone ? 'Done (click to undo)' : 'Mark done'}
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {isLesDone ? (
                                <motion.div
                                  key="side-done"
                                  initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="side-undone"
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 0.4 }}
                                  exit={{ scale: 0.8, opacity: 0 }}
                                  transition={{ duration: 0.12 }}
                                >
                                  <Circle className="w-3.5 h-3.5" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom: Streak & Theme Switch */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          {/* Simple Stats Pill */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-black dark:text-white" />
              <span className="font-semibold">{progress.learningStreakDays} Day Streak</span>
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">
              {progress.completedLessonIds.length} done
            </span>
          </div>

          {/* Theme switch */}
          <button
            onClick={onToggleTheme}
            className="w-full h-9 px-2.5 flex items-center justify-between rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
