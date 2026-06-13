/**
 * Header.tsx
 * 
 * Header component for ExamEase AI.
 * Renders the application logo, title, and navigation tabs.
 * Uses strict ARIA roles (tablist, tab) and keyboard/screen reader aids
 * to improve accessibility scores.
 */

import React from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'checkin', label: 'Daily Check-in' },
    { id: 'trends', label: 'Trends Dashboard' },
    { id: 'chat', label: 'AI Companion' },
    { id: 'privacy', label: 'Privacy Control' }
  ];

  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)',
        paddingBottom: 'var(--spacing-sm)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        {/* App Title with inline branding SVG */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="var(--color-primary)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
            <line x1="12" x2="12" y1="19" y2="22"/>
          </svg>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>ExamEase AI</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Your empathetic academic wellness companion
            </p>
          </div>
        </div>

        {/* Disclaimer about Professional Health Care */}
        <div 
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-risk-high)',
            backgroundColor: 'var(--color-risk-high-bg)',
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(153, 27, 27, 0.1)',
            fontWeight: 500
          }}
          role="note"
        >
          ⚠️ Educational Support Tool. Not a replacement for professional clinical care.
        </div>
      </div>

      {/* Accessibility-compliant navigation tab bar */}
      <nav aria-label="Main Navigation">
        <div 
          className="nav-tabs" 
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};
