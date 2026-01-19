'use client';

import Link from 'next/link';
import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-primary border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-text-primary mb-4 font-serif">Vlerafy</h3>
            <p className="text-text-secondary mb-4 max-w-md font-sans">
              AI-Powered Pricing Optimization für Shopify-Merchants. 
              Maximiere deine Gewinnmargen mit intelligenten Preisempfehlungen.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg glass border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-end/50 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg glass border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-end/50 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@vlerafy.com"
                className="w-10 h-10 flex items-center justify-center rounded-lg glass border-glass-border text-text-secondary hover:text-text-primary hover:border-accent-end/50 transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-text-primary font-semibold mb-4 font-sans">Rechtliches</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-text-primary transition-colors font-sans">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-text-secondary hover:text-text-primary transition-colors font-sans">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-text-primary transition-colors font-sans">
                  AGB
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-semibold mb-4 font-sans">Kontakt</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@vlerafy.com" className="text-text-secondary hover:text-text-primary transition-colors font-sans">
                  contact@vlerafy.com
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-text-primary transition-colors font-sans">
                  Kontaktformular
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-text-muted hover:text-text-secondary transition-colors text-xs font-sans">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-glass-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm font-sans">
            © {currentYear} Vlerafy. Alle Rechte vorbehalten.
          </p>
          <p className="text-text-muted text-sm font-sans">
            Made with ❤️ für Shopify-Merchants
          </p>
        </div>
      </div>
    </footer>
  );
}
