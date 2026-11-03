import { useState, useRef, useEffect } from 'react';
import { TutorChatMessage } from '../types/course';
import {
  Bot,
  Send,
  X,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    courseTitle: string;
    moduleTitle: string;
    lessonTitle: string;
    lessonContent: string;
    initialMessage?: string;
  };
}

export function AiTutorDrawer({ isOpen, onClose, context }: AiTutorDrawerProps) {
  const [messages, setMessages] = useState<TutorChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hi there! I am your friendly AI Study Buddy.
Whenever something sounds confusing or you want a simple real-world analogy, just ask me! I am here to make learning easy and fun.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'Explain this lesson in simple words',
        'Give me an everyday analogy',
        'Quiz me with 1 quick question'
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (context.initialMessage && isOpen) {
      handleSendMessage(context.initialMessage);
    }
  }, [context.initialMessage, isOpen]);

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
            courseTitle: context.courseTitle,
            moduleTitle: context.moduleTitle,
            lessonTitle: context.lessonTitle,
            lessonContent: context.lessonContent,
            tutorMode: 'eli5'
          }
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get tutor response');
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
        content: `I had a quick hiccup connecting to the server. Please try asking once more!`,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white font-display">
              Friendly AI Tutor
            </div>
            <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
              {context.lessonTitle || 'Study Session'}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                }`}
              >
                {msg.content}
              </div>

              <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {!isUser && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:text-slate-600"
                    title="Copy"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-1.5 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-xs text-left px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
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
            <span>AI Tutor is writing a simple answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a question in plain English..."
            disabled={loading}
            className="flex-1 h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            aria-label="Send"
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-50 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
