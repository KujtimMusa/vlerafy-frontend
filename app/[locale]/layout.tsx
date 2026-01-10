import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundaryWrapper';
import '../globals.css'

const locales = ['de', 'en'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // Handle both Promise and direct params (Next.js 15 vs 14)
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams?.locale || 'de';
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <ErrorBoundaryWrapper>
      <NextIntlClientProvider messages={messages}>
        {/* Header/Navbar */}
        <nav 
          className="flex items-center justify-between px-8 py-3 border-b border-gray-800"
          style={{ backgroundColor: '#1e293b' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400">
              {/* Optional: Seitentitel oder Breadcrumb */}
            </span>
          </div>
          
          <LanguageSwitcher />
        </nav>
        
        {/* Main Content */}
        <main style={{ backgroundColor: 'transparent' }}>{children}</main>
      </NextIntlClientProvider>
    </ErrorBoundaryWrapper>
  );
}

