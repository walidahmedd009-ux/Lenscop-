import { useState, useRef, useEffect } from 'react';
import { Course, TutorChatMessage } from '../types/course';
import {
  Send,
  Copy,
  Check,
  RefreshCw,
  GraduationCap
} from 'lucide-react';

interface TutorLoungeViewProps {
  courses: Course[];
  activeCourseId: string | null;
  onSelectCourse: (course: Course) => void;
}

export function TutorLoungeView({ courses, activeCourseId }: TutorLoungeViewProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(activeCourseId || courses[0]?.id || '');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: 'lounge-welcome',
      role: 'assistant',
      content: `Welcome to the AI Tutor Lounge! 
You can ask me anything about your courses, ask for a simple real-world analogy, or ask me to explain a tricky concept in plain English.

What would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'How does AI learn from photos?',
        'Give me an easy analogy for machine learning',
        'How do I build a habit that sticks?',
        'How does window light make photos look better?'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: TutorChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
          context: {
            courseTitle: selectedCourse?.title || 'General Topics',
            lessonTitle: 'Lounge Discussion',
            lessonContent: selectedCourse?.description || '',
            tutorMode: 'eli5'
          }
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get tutor reply');
      }

      const botMsg: TutorChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: data.suggestedFollowUps || []
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: TutorChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I had trouble connecting with the tutoring system. Please try asking again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-5rem)] flex flex-col space-y-3">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              AI Tutor Lounge
            </h2>
            <div className="text-xs text-slate-500">
              Ask anything in plain, comfortable words.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Topic:</span>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="h-9 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="text-[11px] text-slate-400 px-1">
                {isUser ? 'You' : 'Friendly AI Tutor'} · {msg.timestamp}
              </div>

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                {msg.content}
              </div>

              {!isUser && (
                <div className="flex items-center gap-2 px-1 text-xs">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-1.5 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs max-w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>AI Tutor is writing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask anything about ${selectedCourse?.title || 'your studies'} in plain words...`}
          disabled={loading}
          className="flex-1 h-11 px-4 text-xs sm:text-sm rounded-xl bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>

    </div>
  );
}
