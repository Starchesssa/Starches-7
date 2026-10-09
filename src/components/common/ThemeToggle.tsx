import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  size?: 'sm' | 'md';
  showLabels?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  showLabels = true,
  className = '',
}) => {
  const { setTheme, isDarkMode } = useApp();

  return (
    <div
      className={`inline-flex items-center bg-gray-100 dark:bg-[#1E2228] p-0.5 rounded-full border border-gray-200/90 dark:border-white/10 shadow-xs transition-colors ${className}`}
      role="group"
      aria-label="Theme switcher"
    >
      {/* Light Option */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
          !isDarkMode
            ? 'bg-white text-gray-900 shadow-xs scale-100 ring-1 ring-black/5'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
        title="Switch to Light Theme"
        aria-pressed={!isDarkMode}
      >
        <Sun
          className={`w-3.5 h-3.5 transition-colors ${
            !isDarkMode ? 'text-amber-500 fill-amber-400' : 'text-gray-400'
          }`}
        />
        {showLabels && <span className="text-[11px] font-extrabold leading-none">Light</span>}
      </button>

      {/* Dark Option */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
          isDarkMode
            ? 'bg-[#FF6B00] text-white shadow-xs scale-100 ring-1 ring-orange-400/30'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/60'
        }`}
        title="Switch to Dark Theme"
        aria-pressed={isDarkMode}
      >
        <Moon
          className={`w-3.5 h-3.5 transition-colors ${
            isDarkMode ? 'text-white fill-white' : 'text-gray-500'
          }`}
        />
        {showLabels && <span className="text-[11px] font-extrabold leading-none">Dark</span>}
      </button>
    </div>
  );
};
