export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface CuratedVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  whyRecommended: string;
  keyTopic: string;
  youtubeId?: string;
  searchUrl: string;
  embedUrl?: string;
}

export interface PracticalExercise {
  title: string;
  description: string;
  steps: string[];
  starterCodeOrPrompt?: string;
  sampleSolution?: string;
  deliverable: string;
}

export interface RealWorldProject {
  title: string;
  summary: string;
  instructions: string[];
  toolsRecommended: string[];
  expectedOutcome: string;
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  durationMinutes: number;
  summary: string;
  detailedExplanation: string; // Rich markdown with deep explanation, analogies, diagrams
  keyTakeaways: string[];
  curatedVideos: CuratedVideo[];
  practicalExercise: PracticalExercise;
  realWorldProject?: RealWorldProject;
}

export interface Chapter {
  id: string;
  order: number;
  title: string;
  overview: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptionAlert?: string;
}

export interface ModuleQuiz {
  title: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  chapters: Chapter[];
  quiz?: ModuleQuiz;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  totalLessons: number;
  heroImage: string;
  skillsAcquired: string[];
  prerequisites: string[];
  targetAudience: string;
  createdAt: string;
  whatItIs?: string; // Meaning and definition of this niche or skill
  guidelines?: string[]; // Core guidelines for this niche or skill
  modules: CourseModule[];
  capstoneProject?: RealWorldProject;
  isAiGenerated?: boolean;
}

export interface UserProgress {
  enrolledCourseIds: string[];
  activeCourseId: string | null;
  completedLessonIds: string[]; // Set of lesson IDs completed
  bookmarkedLessonIds: string[];
  quizScores: Record<string, { score: number; total: number; passed: boolean; timestamp: string }>; // moduleId -> score
  notes: Record<string, string>; // lessonId -> user note text
  learningStreakDays: number;
  lastActiveDate: string;
  totalStudyMinutes: number;
}

export interface TutorChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: 'mentor' | 'eli5' | 'socratic' | 'deep_dive';
  suggestedFollowUps?: string[];
}
