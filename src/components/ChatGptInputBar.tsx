import { useState } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';

interface ChatGptInputBarProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  isInCourse: boolean;
  activeLessonTitle?: string;
  onSelectSuggestion: (text: string) => void;
}

export function ChatGptInputBar({
  onSend,
  isLoading,
  isInCourse,
  activeLessonTitle,
  onSelectSuggestion
}: ChatGptInputBarProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  const homeSuggestions = [
    '🎸 Beginner Guitar',
    '🤖 How AI Works',
    '📸 Phone Photography',
    '💰 Personal Finance',
    '🍳 Cooking Basics',
    '🧠 Faster Learning'
  ];

  const courseSuggestions = [
    'Explain this simpler',
    'Give an everyday analogy',
    'Quiz me on this lesson',
    'What is the common mistake?'
  ];

  const suggestions = isInCourse ? courseSuggestions : homeSuggestions;

  return (
    <div className="sticky bottom-0 z-30 w-full bg-gradient-to-t from-white via-white/95 to-transparent dark:from-black dark:via-black/95 dark:to-transparent pt-6 pb-4 px-4">
      <div className="max-w-2xl mx-auto space-y-2.5">
        
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {suggestions.map((sugg, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => onSelectSuggestion(sugg.replace(/^[^\w\s]+/, '').trim())}
              className="text-[11px] font-medium px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
            >
              {sugg}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-within:border-black dark:focus-within:border-white transition-colors"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={
              isInCourse
                ? `Ask anything about ${activeLessonTitle ? `"${activeLessonTitle}"` : 'this lesson'}...`
                : 'What do you want to learn? (e.g. Guitar, Python, Investing)...'
            }
            className="w-full h-12 pl-4 pr-12 text-xs sm:text-sm bg-transparent text-black dark:text-white placeholder:text-neutral-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            aria-label="Send"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Micro Footer Notice */}
        <div className="text-center text-[10px] text-neutral-400 dark:text-neutral-600">
          Lenscop · Learn anything step-by-step in plain English.
        </div>
      </div>
    </div>
  );
}
