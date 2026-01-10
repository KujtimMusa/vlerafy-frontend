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
    <div className="flex items-center gap-1">
      <button
        onClick={() => switchLanguage('de')}
        disabled={isPending || locale === 'de'}
        className={`
          px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all
          ${locale === 'de' 
            ? 'bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/50' 
            : 'text-gray-500 hover:text-gray-300 hover:bg-slate-800/50'
          }
          ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Sprache auf Deutsch wechseln"
      >
        DE
      </button>
      
      <div className="w-px h-4 bg-gray-700" />
      
      <button
        onClick={() => switchLanguage('en')}
        disabled={isPending || locale === 'en'}
        className={`
          px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all
          ${locale === 'en' 
            ? 'bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/50' 
            : 'text-gray-500 hover:text-gray-300 hover:bg-slate-800/50'
          }
          ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Switch language to English"
      >
        EN
      </button>
    </div>
  );
}

