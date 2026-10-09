import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { ArrowRight, MapPin, Globe } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const { currentCity, cities, selectCity, language, setLanguage, isDarkMode, t } = useApp();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Good Food. Closer to You.',
      titleSw: 'Chakula Bora. Karibu Nawe.',
      desc: 'Order fresh hot meals from your favorite local restaurants in Dar es Salaam, Zanzibar & Arusha.',
      descSw: 'Agiza milo moto na safi kutoka migahawa pendwa ya jirani yako Dar es Salaam, Zanzibar na Arusha.',
    },
    {
      title: 'Everyday Essentials & Groceries',
      titleSw: 'Mahitaji ya Kila Siku & Vyakula',
      desc: 'Supermarket items, fresh bakery, pharmaceuticals, and snacks delivered straight to your door.',
      descSw: 'Mahitaji ya dukani, mikate safi, dawa za dharura na vinywaji vinafika hadi mlangoni kwako.',
    },
    {
      title: 'Swift Boda Boda Delivery',
      titleSw: 'Usafirishaji wa Haraka wa Boda Boda',
      desc: 'Real-time rider tracking, transparent TZS prices, and seamless local Mobile Money payments.',
      descSw: 'Fuatilia dereva wako hewani, lipa kwa urahisi kupitia M-Pesa, TigoPesa, Airtel au HaloPesa.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-white dark:bg-[#121417] text-gray-900 dark:text-white transition-colors overflow-hidden">
      {/* Top Utility Controls */}
      <div className="p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {currentCity.name}
          </span>
        </div>

        {/* Top Right Controls: Theme Toggle + Language */}
        <div className="flex items-center gap-2">
          <ThemeToggle showLabels={false} />

          <button
            onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200"
          >
            <Globe className="w-3 h-3 text-[#FF6B00]" />
            <span>{language === 'en' ? 'Kiswahili' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Area matching mockup */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-sm mx-auto z-10">
        <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
          <Logo variant="icon" size="xl" isDark={isDarkMode} />
        </div>

        <div className="mb-3">
          <h1
            className="text-4xl font-black tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            starches
          </h1>
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <span className="h-[2px] w-4 bg-[#FF6B00] rounded-full inline-block"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF6B00]">
              FOOD DELIVERY & MARKETPLACE
            </span>
            <span className="h-[2px] w-4 bg-[#FF6B00] rounded-full inline-block"></span>
          </div>
        </div>

        <p className="text-base font-bold text-gray-700 dark:text-gray-200 mt-2">
          {language === 'sw' ? slides[slide].titleSw : slides[slide].title}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed max-w-xs">
          {language === 'sw' ? slides[slide].descSw : slides[slide].desc}
        </p>

        {/* Carousel indicators */}
        <div className="flex items-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                slide === i ? 'w-7 bg-[#FF6B00]' : 'w-2 bg-gray-300 dark:bg-white/20'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA & Orange Accent Swoosh Curve */}
      <div className="relative pt-6 pb-8 px-6 max-w-md w-full mx-auto z-10">
        <button
          onClick={onDismiss}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-extrabold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-sm transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
        >
          <span>{language === 'sw' ? 'Anza Kutumia Starches' : 'Get Started'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-3 font-medium">
          Tanzania’s Modern Local Food & Essentials Marketplace
        </p>
      </div>

      {/* Decorative Bottom Orange Swoosh Accent Curve from screenshot */}
      <div className="absolute bottom-0 right-0 w-44 h-44 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full opacity-90">
          <path
            d="M 50 200 C 120 180 180 120 200 50 L 200 200 Z"
            fill="#FF6B00"
          />
          <path
            d="M 100 200 C 150 180 180 150 200 100 L 200 200 Z"
            fill="#FFA048"
          />
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full opacity-20">
          <circle cx="20" cy="20" r="120" fill="#FF6B00" />
        </svg>
      </div>
    </div>
  );
};
