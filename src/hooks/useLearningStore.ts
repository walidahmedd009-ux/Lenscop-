import { useState, useEffect, useCallback } from 'react';
import { Course, UserProgress } from '../types/course';
import { SEED_COURSES } from '../data/seedCourses';

const STORAGE_COURSES_KEY = 'ai_university_courses_v2';
const STORAGE_PROGRESS_KEY = 'ai_university_progress_v2';

const INITIAL_PROGRESS: UserProgress = {
  enrolledCourseIds: ['course-ai-basics'],
  activeCourseId: 'course-ai-basics',
  completedLessonIds: ['les-ai-1-1-1'],
  bookmarkedLessonIds: ['les-ai-1-1-2'],
  quizScores: {
    'mod-ai-1': { score: 2, total: 2, passed: true, timestamp: new Date().toISOString() }
  },
  notes: {
    'les-ai-1-1-1': 'AI learns from examples, like practicing a recipe!'
  },
  learningStreakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalStudyMinutes: 24
};

function safeGetStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // safely ignore storage exceptions in iframes
  }
}

export function useLearningStore() {
  const [courses, setCourses] = useState<Course[]>(() => {
    const stored = safeGetStorage(STORAGE_COURSES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const seedIds = new Set(SEED_COURSES.map(c => c.id));
        const customCourses = parsed.filter((c: Course) => !seedIds.has(c.id));
        return [...SEED_COURSES, ...customCourses];
      } catch {
        return SEED_COURSES;
      }
    }
    return SEED_COURSES;
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = safeGetStorage(STORAGE_PROGRESS_KEY);
    if (stored) {
      try {
        return { ...INITIAL_PROGRESS, ...JSON.parse(stored) };
      } catch {
        return INITIAL_PROGRESS;
      }
    }
    return INITIAL_PROGRESS;
  });

  // Save courses on change
  useEffect(() => {
    safeSetStorage(STORAGE_COURSES_KEY, JSON.stringify(courses));
  }, [courses]);

  // Save progress on change
  useEffect(() => {
    safeSetStorage(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const enrollCourse = useCallback((courseId: string) => {
    setProgress(prev => {
      if (prev.enrolledCourseIds.includes(courseId)) {
        return { ...prev, activeCourseId: courseId };
      }
      return {
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
        activeCourseId: courseId
      };
    });
  }, []);

  const setActiveCourse = useCallback((courseId: string | null) => {
    setProgress(prev => ({ ...prev, activeCourseId: courseId }));
  }, []);

  const toggleLessonComplete = useCallback((lessonId: string, durationMinutes: number = 15) => {
    setProgress(prev => {
      const isCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = isCompleted
        ? prev.completedLessonIds.filter(id => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      
      const newTotalMinutes = isCompleted
        ? Math.max(0, prev.totalStudyMinutes - durationMinutes)
        : prev.totalStudyMinutes + durationMinutes;

      return {
        ...prev,
        completedLessonIds: newCompleted,
        totalStudyMinutes: newTotalMinutes
      };
    });
  }, []);

  const toggleBookmark = useCallback((lessonId: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedLessonIds.includes(lessonId);
      return {
        ...prev,
        bookmarkedLessonIds: isBookmarked
          ? prev.bookmarkedLessonIds.filter(id => id !== lessonId)
          : [...prev.bookmarkedLessonIds, lessonId]
      };
    });
  }, []);

  const saveNote = useCallback((lessonId: string, noteText: string) => {
    setProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [lessonId]: noteText
      }
    }));
  }, []);

  const recordQuizScore = useCallback((moduleId: string, score: number, total: number, passed: boolean) => {
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [moduleId]: { score, total, passed, timestamp: new Date().toISOString() }
      }
    }));
  }, []);

  const addGeneratedCourse = useCallback((course: Course) => {
    setCourses(prev => [course, ...prev]);
    enrollCourse(course.id);
  }, [enrollCourse]);

  const deleteCustomCourse = useCallback((courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setProgress(prev => ({
      ...prev,
      enrolledCourseIds: prev.enrolledCourseIds.filter(id => id !== courseId),
      activeCourseId: prev.activeCourseId === courseId ? null : prev.activeCourseId
    }));
  }, []);

  return {
    courses,
    progress,
    enrollCourse,
    setActiveCourse,
    toggleLessonComplete,
    toggleBookmark,
    saveNote,
    recordQuizScore,
    addGeneratedCourse,
    deleteCustomCourse
  };
}
