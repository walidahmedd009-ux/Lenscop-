import { useState } from 'react';
import { Course, UserProgress } from '../types/course';
import { Clock, BookOpen, Sparkles, Trash2, ArrowRight } from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  progress: UserProgress;
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (courseId: string) => void;
  onDeleteCustomCourse: (courseId: string) => void;
  onOpenGenerator: () => void;
}

export function CourseCatalog({
  courses,
  progress,
  onSelectCourse,
  onEnrollCourse,
  onDeleteCustomCourse,
  onOpenGenerator,
}: CourseCatalogProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getCourseProgress = (course: Course) => {
    let totalLessons = 0;
    let completedCount = 0;

    course.modules.forEach((mod) => {
      mod.chapters.forEach((chap) => {
        chap.lessons.forEach((les) => {
          totalLessons++;
          if (progress.completedLessonIds.includes(les.id)) {
            completedCount++;
          }
        });
      });
    });

    const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    return { totalLessons, completedCount, percent };
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      (selectedDifficulty === 'enrolled' && progress.enrolledCourseIds.includes(course.id)) ||
      course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Course Library
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick a course to start learning, or create your own with AI.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {['all', 'Beginner', 'enrolled'].map((tab) => {
              const label = tab === 'enrolled' ? 'My Courses' : tab === 'all' ? 'All Courses' : 'Beginner Friendly';
              const isActive = selectedDifficulty === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedDifficulty(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-14 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mt-8 p-6">
          <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No courses found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You can type any topic and our AI will build you a friendly course in 10 seconds.
          </p>
          <button
            onClick={onOpenGenerator}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Make This Course with AI</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredCourses.map((course) => {
            const isEnrolled = progress.enrolledCourseIds.includes(course.id);
            const { totalLessons, completedCount, percent } = getCourseProgress(course);

            return (
              <div
                key={course.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs hover:shadow-sm"
              >
                <div>
                  {/* Image header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={course.heroImage}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-slate-200">
                      <span className="font-medium text-white">{course.category}</span>
                      <div className="flex items-center gap-1 font-mono text-slate-200">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{course.estimatedHours}h total</span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>{course.modules.length} Modules</span>
                      <span aria-hidden="true">·</span>
                      <span>{totalLessons || course.totalLessons} Lessons</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.difficulty}</span>
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {course.tagline || course.description}
                    </p>

                    {/* Simple Skills */}
                    {course.skillsAcquired && course.skillsAcquired.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {course.skillsAcquired.slice(0, 3).join(' · ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 pt-1">
                  {isEnrolled && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>Progress</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                          {completedCount}/{totalLessons} lessons ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {course.isAiGenerated && (
                      <button
                        type="button"
                        onClick={() => onDeleteCustomCourse(course.id)}
                        title="Delete course"
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (!isEnrolled) onEnrollCourse(course.id);
                        onSelectCourse(course);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-xs"
                    >
                      <span>{isEnrolled ? 'Continue Learning' : 'Start Free Course'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
