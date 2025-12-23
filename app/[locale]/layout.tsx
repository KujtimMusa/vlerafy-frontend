import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
    <NextIntlClientProvider messages={messages}>
      {/* Header/Navbar */}
      <nav className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">PriceOptimizer</h1>
        </div>
        <LanguageSwitcher />
      </nav>
      
      {/* Main Content */}
      <main>{children}</main>
    </NextIntlClientProvider>
  );
}

