# i18n-Implementation Guide

## ✅ Was wurde implementiert:

### 1. Basis-Setup
- ✅ `next-intl` installiert
- ✅ `i18n.ts` Konfiguration erstellt
- ✅ `middleware.ts` für Routing erstellt
- ✅ `next.config.js` mit next-intl Plugin erweitert
- ✅ `messages/de.json` und `messages/en.json` erstellt
- ✅ `LanguageSwitcher` Komponente erstellt

### 2. Übersetzungstabelle
- ✅ Vollständige Übersetzungstabelle in `TRANSLATION_TABLE.md` erstellt
- ✅ Alle englischen UI-Texte identifiziert und übersetzt

## ⚠️ Wichtiger Hinweis: App-Struktur muss angepasst werden

Die aktuelle App-Struktur verwendet noch kein `[locale]` Routing. Für die vollständige i18n-Integration muss die App-Struktur wie folgt angepasst werden:

### Aktuelle Struktur:
```
app/
├── layout.tsx
├── page.tsx
├── products/
└── recommendations/
```

### Benötigte Struktur:
```
app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/
│   └── recommendations/
└── layout.tsx (Root - nur für Metadata)
```

## Nächste Schritte:

### 1. App-Struktur umbauen (manuell erforderlich):

1. **Erstelle `app/[locale]/` Verzeichnis**
2. **Verschiebe alle Seiten nach `app/[locale]/`**
3. **Erstelle neues `app/[locale]/layout.tsx`:**

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const locales = ['de', 'en'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
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
      </body>
    </html>
  );
}
```

4. **Passe `app/layout.tsx` an (nur Metadata):**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Optimizer',
  description: 'Shopify Pricing Optimization Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

### 2. Komponenten refactoren:

**Beispiel: PriceRecommendationCard.tsx**

```typescript
'use client'

import { useTranslations } from 'next-intl'
// ... andere imports

export function PriceRecommendationCard({ ... }) {
  const t = useTranslations('pricing')
  const tCommon = useTranslations('common')
  const tActions = useTranslations('actions')
  
  // ... existing code ...
  
  return (
    <div>
      {/* Vorher: "Current" */}
      <p>{t('current')}</p>
      
      {/* Vorher: "Recommended" */}
      <p>{t('recommended')}</p>
      
      {/* Vorher: "No change recommended" */}
      {noChange && <span>{t('no_change')}</span>}
      
      {/* Vorher: "Apply {price}" */}
      <button>{t('apply_price', { price: formatCurrency(recommendedPrice) })}</button>
      
      {/* ... etc */}
    </div>
  )
}
```

**Beispiel: KeyInsights.tsx**

```typescript
'use client'

import { useTranslations } from 'next-intl'

export function KeyInsights({ ... }) {
  const t = useTranslations('insights')
  
  return (
    <div>
      {/* Vorher: "Why this price?" */}
      <h3>{t('title')}</h3>
      
      {/* Vorher: "Below Break-Even" */}
      <h4>{t('below_breakeven')}</h4>
      
      {/* ... etc */}
    </div>
  )
}
```

### 3. Integration-Checklist:

**Sofort-Check:**
- [ ] App-Struktur auf `[locale]` Routing umgestellt
- [ ] `app/[locale]/layout.tsx` mit NextIntlClientProvider erstellt
- [ ] LanguageSwitcher im Header integriert
- [ ] Alle Komponenten nutzen `useTranslations()` statt hardcoded Strings
- [ ] Middleware konfiguriert (/de/..., /en/... Routing)

**Vor Go-Live:**
- [ ] Alle Komponenten mit beiden Sprachen getestet
- [ ] Umbruchverhalten bei langen deutschen Texten geprüft (bes. Buttons)
- [ ] Pluralisierung bei dynamischen Countern implementiert
- [ ] Datum/Zeit-Formatierung mit `useFormatter()` ergänzt (falls verwendet)
- [ ] Browser-Sprache als Fallback (navigator.language) optional

**Nice-to-have (später):**
- [ ] Lazy-Loading von translations (bei mehr Sprachen)
- [ ] TypeScript-Typen für translation keys generieren
- [ ] Translation Coverage Tests (alle Keys in beiden Dateien vorhanden)

## Dateien die refactored werden müssen:

1. ✅ `PriceRecommendationCard.tsx` - Beispiel-Refactoring bereit
2. ✅ `KeyInsights.tsx` - Beispiel-Refactoring bereit
3. ⏳ `ActionButtons.tsx`
4. ⏳ `ConfidenceIndicator.tsx`
5. ⏳ `CompetitorPositionSlider.tsx`
6. ⏳ `DetailedBreakdown.tsx`
7. ⏳ `ShopSwitcher.tsx`
8. ⏳ `CostInputModal.tsx` (bereits deutsch, aber für Konsistenz)

## Beispiel-Refactoring:

Siehe `I18N_EXAMPLE_REFACTORING.md` für vollständige Beispiele.


