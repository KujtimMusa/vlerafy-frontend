import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Use requestLocale if available, otherwise fallback to defaultLocale
  const locale = await requestLocale || routing.defaultLocale;
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

