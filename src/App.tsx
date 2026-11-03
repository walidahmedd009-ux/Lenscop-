import { useState, useEffect } from 'react';
import { ChatGptSidebar } from './components/ChatGptSidebar';
import { ChatGptHomeView } from './components/ChatGptHomeView';
import { CourseReaderView } from './components/CourseReaderView';
import { ChatGptInputBar } from './components/ChatGptInputBar';
import { useLearningStore } from './hooks/useLearningStore';
import { Course, TutorChatMessage } from './types/course';
import { createClientCourse } from './utils/createFallbackCourse';
import { getDomainAwareTutorReply } from './utils/tutorDomainReplies';
import { Menu, Sparkles } from 'lucide-react';

export default function App() {
  const {
    courses,
    progress,
    enrollCourse,
    setActiveCourse,
    toggleLessonComplete,
    addGeneratedCourse,
    deleteCustomCourse
  } = useLearningStore();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<TutorChatMessage[]>([]);

  // Dark mode state (defaults to true for sleek black & white aesthetic)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme_dark');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme_dark', String(isDarkMode));
    } catch {}
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Select a course
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveCourse(course.id);
    const firstId = course.modules[0]?.chapters[0]?.lessons[0]?.id || null;
    setActiveLessonId(firstId);
    setTutorMessages([]);
    setSidebarOpenMobile(false);
  };

  // Start fresh / Home
  const handleNewCourse = () => {
    setSelectedCourse(null);
    setActiveCourse(null);
    setActiveLessonId(null);
    setTutorMessages([]);
    setSidebarOpenMobile(false);
  };

  // Trigger course generation or selection from topic string
  const handleGenerateOrSearchCourse = async (topic: string) => {
    const cleanTopic = topic.trim();
    if (!cleanTopic) return;

    // Check if matching course exists
    const match = courses.find(
      (c) =>
        c.title.toLowerCase().includes(cleanTopic.toLowerCase()) ||
        c.slug.toLowerCase().includes(cleanTopic.toLowerCase())
    );

    if (match) {
      handleSelectCourse(match);
      return;
    }

    // Generate new course with adequate timeout and instant domain-aware fallback
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);

      const res = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          topic: cleanTopic,
          experienceLevel: 'Beginner',
          durationWeeks: '2'
        })
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.course) {
          addGeneratedCourse(data.course);
          handleSelectCourse(data.course);
          return;
        }
      }
      // If server responded without success, synthesize client course
      const localCourse = createClientCourse(cleanTopic);
      addGeneratedCourse(localCourse);
      handleSelectCourse(localCourse);
    } catch {
      // Immediate resilient fallback
      const localCourse = createClientCourse(cleanTopic);
      addGeneratedCourse(localCourse);
      handleSelectCourse(localCourse);
    } finally {
      setIsLoading(false);
    }
  };

  // Ask AI Tutor about current lesson
  const handleAskTutor = async (question: string) => {
    if (!selectedCourse) return;

    const userMsg: TutorChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTutorMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          history: tutorMessages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
          context: {
            courseTitle: selectedCourse.title,
            lessonTitle: 'Active Lesson',
            lessonContent: selectedCourse.description
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.message) {
          const botMsg: TutorChatMessage = {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            content: data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setTutorMessages((prev) => [...prev, botMsg]);
          return;
        }
      }
      throw new Error('Use fallback reply');
    } catch {
      const domainReply = getDomainAwareTutorReply(selectedCourse.title, 'Active Lesson', question);
      const fallbackMsg: TutorChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: domainReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTutorMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Central send handler from lower input bar
  const handleSendFromInput = (text: string) => {
    if (!selectedCourse) {
      handleGenerateOrSearchCourse(text);
    } else {
      handleAskTutor(text);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-black text-black dark:text-white antialiased font-sans transition-colors overflow-hidden">
      
      {/* ChatGPT-style Left Sidebar */}
      <ChatGptSidebar
        courses={courses}
        activeCourseId={selectedCourse?.id || null}
        progress={progress}
        onSelectCourse={handleSelectCourse}
        onNewCourse={handleNewCourse}
        onDeleteCourse={deleteCustomCourse}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        isOpenMobile={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
        activeLessonId={activeLessonId}
        onSelectLesson={setActiveLessonId}
        onToggleLessonComplete={toggleLessonComplete}
      />

      {/* Main Content Area with Fixed Lower Input Bar */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Minimalist Top Bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpenMobile(true)}
              className="p-1.5 md:hidden text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={handleNewCourse}
              className="text-xs sm:text-sm font-semibold text-black dark:text-white hover:opacity-75 transition-opacity truncate max-w-xs sm:max-w-md font-display cursor-pointer"
            >
              {selectedCourse ? selectedCourse.title : 'Lenscop'}
            </button>
          </div>

          {selectedCourse && (
            <button
              onClick={handleNewCourse}
              className="text-xs px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              Browse All
            </button>
          )}
        </header>

        {/* Scrollable Center Stage */}
        <main className="flex-1 overflow-y-auto">
          {!selectedCourse ? (
            <ChatGptHomeView
              courses={courses}
              onSelectCourse={handleSelectCourse}
              onSelectTopic={handleGenerateOrSearchCourse}
            />
          ) : (
            <CourseReaderView
              course={selectedCourse}
              completedLessonIds={progress.completedLessonIds}
              onToggleComplete={toggleLessonComplete}
              tutorMessages={tutorMessages}
              activeLessonId={activeLessonId || undefined}
              onSelectLesson={setActiveLessonId}
            />
          )}
        </main>

        {/* Lower Dashboard & Input Bar (Pinned at Bottom like ChatGPT) */}
        <ChatGptInputBar
          onSend={handleSendFromInput}
          isLoading={isLoading}
          isInCourse={Boolean(selectedCourse)}
          activeLessonTitle={selectedCourse?.title}
          onSelectSuggestion={(suggestionText) => {
            if (!selectedCourse) {
              handleGenerateOrSearchCourse(suggestionText);
            } else {
              handleAskTutor(suggestionText);
            }
          }}
        />

      </div>
    </div>
  );
}
