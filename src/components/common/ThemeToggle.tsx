import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showText?: boolean;
  showLabels?: boolean;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showText = false,
  showLabels = false,
}) => {
  const { toggleTheme, isDarkMode } = useApp();
  const shouldDisplayLabel = showText || showLabels;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {shouldDisplayLabel && (
        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 select-none">
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
      )}

      {/* Sliding Switch Track */}
      <button
        type="button"
        role="switch"
        aria-checked={isDarkMode}
        onClick={toggleTheme}
        title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-none shadow-xs ${
          isDarkMode
            ? 'bg-[#1E2228] border-orange-500/50 hover:border-orange-500'
            : 'bg-amber-100/80 border-amber-300 hover:border-amber-400'
        }`}
      >
        {/* Background Icons in track */}
        <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none select-none">
          <Sun className={`w-3.5 h-3.5 text-amber-500 transition-opacity duration-200 ${isDarkMode ? 'opacity-30' : 'opacity-100 fill-amber-400'}`} />
          <Moon className={`w-3 h-3 text-orange-400 transition-opacity duration-200 ${isDarkMode ? 'opacity-100 fill-orange-400' : 'opacity-30'}`} />
        </span>

        {/* Sliding Thumb Knob */}
        <span
          className={`pointer-events-none relative inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center top-[1px] ${
            isDarkMode
              ? 'translate-x-7 bg-gradient-to-br from-[#FF6B00] to-[#E55500] text-white'
              : 'translate-x-0.5 bg-white text-amber-500'
          }`}
        >
          {isDarkMode ? (
            <Moon className="w-3 h-3 fill-white text-white" />
          ) : (
            <Sun className="w-3 h-3 fill-amber-400 text-amber-500" />
          )}
        </span>
      </button>
    </div>
  );
};
