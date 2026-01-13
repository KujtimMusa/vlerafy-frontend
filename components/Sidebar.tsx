/**
 * Modern Sidebar Component
 * Inspired by Linear, Notion, Vercel
 * State-of-the-art design with inline styles
 */
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useShop } from '@/hooks/useShop';
import { 
  LayoutDashboard, 
  Package, 
  Lightbulb, 
  Settings
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      emoji: '📊'
    },
    { 
      href: '/products', 
      label: 'Produkte', 
      icon: Package,
      emoji: '📦'
    },
    { 
      href: '/recommendations', 
      label: 'Empfehlungen', 
      icon: Lightbulb,
      emoji: '💡'
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  // Sidebar Container Styles
  const sidebarStyle: React.CSSProperties = {
    width: '280px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#0f172a',
    borderRight: '1px solid #1e293b',
    padding: 0,
    margin: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    zIndex: 1000,
  };

  // Scrollbar Styles (via CSS-in-JS)
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      aside::-webkit-scrollbar {
        width: 6px;
      }
      aside::-webkit-scrollbar-track {
        background: transparent;
      }
      aside::-webkit-scrollbar-thumb {
        background: #334155;
        border-radius: 3px;
      }
      aside::-webkit-scrollbar-thumb:hover {
        background: #475569;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <aside style={sidebarStyle} className={className}>
      {/* A) LOGO SECTION */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #1e293b',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 700,
        }}>
          P
        </div>
        <span style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#f1f5f9',
          background: 'transparent',
          border: 'none',
          margin: 0,
          padding: 0,
        }}>
          PriceIQ
        </span>
      </div>

      {/* C) NAVIGATION */}
      <nav style={{
        padding: '8px 12px',
        background: 'transparent',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        flex: 1,
      }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: 'none',
                borderLeft: `2px solid ${active ? '#3b82f6' : 'transparent'}`,
                borderRadius: '8px',
                color: active ? '#60a5fa' : '#94a3b8',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                margin: 0,
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#1e293b';
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.borderLeftColor = '#3b82f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderLeftColor = 'transparent';
                }
              }}
            >
              <Icon 
                size={20} 
                color={active ? '#60a5fa' : '#94a3b8'}
                style={{ flexShrink: 0 }}
              />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* D) FOOTER */}
      <div style={{
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
        padding: '16px 12px',
        background: 'transparent',
      }}>
        <a
          href="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            background: 'transparent',
            border: 'none',
            borderLeft: '2px solid transparent',
            borderRadius: '8px',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            margin: 0,
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1e293b';
            e.currentTarget.style.color = '#cbd5e1';
            e.currentTarget.style.borderLeftColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderLeftColor = 'transparent';
          }}
        >
          <Settings size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
          <span>Einstellungen</span>
        </a>
      </div>
    </aside>
  );
}

