'use client';

import { useRouter, usePathname } from '@/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (newLocale: 'de' | 'en') => {
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
    
    startTransition(() => {
      // Replace locale in current path
      // pathname is like /de/products, so we replace /de with /en
      const segments = pathname.split('/');
      if (segments[1] === locale) {
        segments[1] = newLocale;
        router.replace(segments.join('/'));
      } else {
        // Fallback: just go to root with new locale
        router.replace(`/${newLocale}`);
      }
    });
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-slate-800 p-1 shadow-sm">
      <button
        onClick={() => switchLanguage('de')}
        disabled={isPending || locale === 'de'}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
          locale === 'de' 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
        aria-label="Sprache auf Deutsch wechseln"
      >
        🇩🇪 DE
      </button>
      <button
        onClick={() => switchLanguage('en')}
        disabled={isPending || locale === 'en'}
        className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
          locale === 'en' 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-400 hover:text-gray-200 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
        aria-label="Switch language to English"
      >
        🇬🇧 EN
      </button>
    </div>
  );
}

