'use client';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const params = useParams();
  const currentLang = params?.lng as string || 'en';
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Language options with their labels
  const languages = {
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    it: 'Italiano',
    lt: 'Lietuvių'
  };

  // Get the path without the language prefix
  const getPathWithoutLang = () => {
    const pathParts = pathname.split('/');
    // Remove first element (empty string) and language part
    pathParts.splice(0, 2);
    return '/' + pathParts.join('/');
  };

  const switchLanguage = (newLang: string) => {
    const newPath = `/${newLang}${getPathWithoutLang()}`;
    router.push(newPath);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-4 right-16 z-50" ref={dropdownRef}>
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 bg-indigo-600 dark:bg-gray-800 text-white rounded-md text-sm font-medium"
        >
          {languages[currentLang as keyof typeof languages]}
          <svg 
            className="ml-2 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => switchLanguage(code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentLang === code 
                    ? 'bg-indigo-100 text-indigo-900 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}