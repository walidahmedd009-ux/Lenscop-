import { useState } from 'react';
import { Course, UserProgress } from '../types/course';
import {
  Flame,
  BookOpen,
  Award,
  ArrowRight,
  FileText,
  CheckCircle2,
  Printer,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LearningDashboardProps {
  courses: Course[];
  progress: UserProgress;
  onSelectCourse: (course: Course) => void;
  onOpenGenerator: () => void;
}

export function LearningDashboard({
  courses,
  progress,
  onSelectCourse,
  onOpenGenerator,
}: LearningDashboardProps) {
  const [selectedCertificateCourse, setSelectedCertificateCourse] = useState<Course | null>(null);

  const enrolledCourses = courses.filter((c) => progress.enrolledCourseIds.includes(c.id));
  const totalCompletedCount = progress.completedLessonIds.length;
  const activeCourse =
    courses.find((c) => c.id === progress.activeCourseId) || enrolledCourses[0] || courses[0];

  const handleOpenCertificate = (course: Course) => {
    setSelectedCertificateCourse(course);
    try {
      confetti({ particleCount: 70, spread: 70 });
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            My Learning
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            See your streak, finished lessons, and jump back in.
          </p>
        </div>

        <button
          onClick={onOpenGenerator}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Learn Something New</span>
        </button>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Enrolled</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {enrolledCourses.length}
          </div>
          <div className="text-[11px] text-slate-400">courses active</div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Finished</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {totalCompletedCount}
          </div>
          <div className="text-[11px] text-slate-400">lessons completed</div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {progress.learningStreakDays} <span className="text-xs font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-slate-400">keep it going!</div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Time Logged</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {progress.totalStudyMinutes} <span className="text-xs font-normal text-slate-400">min</span>
          </div>
          <div className="text-[11px] text-slate-400">total learning time</div>
        </div>
      </div>

      {/* Resume Card */}
      {activeCourse && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Resume where you left off
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">
              {activeCourse.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {activeCourse.tagline}
            </p>
          </div>

          <button
            onClick={() => onSelectCourse(activeCourse)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <span>Continue Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Enrolled Courses */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
          My Enrolled Courses
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {enrolledCourses.map((course) => {
            const allCourseLessons = course.modules.flatMap((m) => m.chapters.flatMap((ch) => ch.lessons));
            const doneCount = allCourseLessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;
            const percent =
              allCourseLessons.length > 0
                ? Math.round((doneCount / allCourseLessons.length) * 100)
                : 0;
            const isFinished = percent === 100;

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5">
                  <div className="text-xs text-slate-500">{course.category}</div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {course.title}
                  </h4>

                  <div className="pt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span className="font-mono">{doneCount}/{allCourseLessons.length} lessons ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  {isFinished ? (
                    <button
                      onClick={() => handleOpenCertificate(course)}
                      className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">
                      {allCourseLessons.length - doneCount} left
                    </span>
                  )}

                  <button
                    onClick={() => onSelectCourse(course)}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Open Course →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      {Object.keys(progress.notes).length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              My Saved Notes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(progress.notes).map(([lessonId, noteText]) => {
              if (!noteText.trim()) return null;
              return (
                <div
                  key={lessonId}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1"
                >
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    Lesson Note
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {noteText}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertificateCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 dark:border-indigo-900 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Personal AI University
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Certificate of Completion
              </h3>
              <p className="text-xs text-slate-500">
                You successfully completed all lessons and activities for:
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white">
              {selectedCertificateCourse.title}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setSelectedCertificateCourse(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
