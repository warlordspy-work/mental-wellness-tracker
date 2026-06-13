/**
 * App.tsx
 * 
 * Central controller of the ExamEase AI application.
 * Manages reactive state updates for check-in logs, calculated statistics,
 * and current navigation layouts. Implements keyboard skip-links and tabpanels.
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CheckInForm } from './components/CheckInForm';
import { WellnessResult } from './components/WellnessResult';
import { TrendDashboard } from './components/TrendDashboard';
import { ChatCompanion } from './components/ChatCompanion';
import { PrivacyControls } from './components/PrivacyControls';
import { CheckIn, WellnessInsights, WellnessStats } from './lib/types';
import { loadCheckIns, saveCheckIn, clearAllData, calculateStats } from './lib/storage';
import { analyzeCheckIn } from './lib/wellnessEngine';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('checkin');
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [stats, setStats] = useState<WellnessStats>({
    totalCheckIns: 0,
    averageMood: 0,
    averageStress: 0,
    averageSleep: 0,
    averageStudy: 0,
    mostCommonTrigger: 'None',
    latestRiskLevel: 'N/A',
    latestRecommendation: 'No check-in data available.'
  });
  const [latestInsights, setLatestInsights] = useState<WellnessInsights | null>(null);

  // Sync state from localStorage on component mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const loadedLogs = loadCheckIns();
    setCheckIns(loadedLogs);
    
    const calculatedStats = calculateStats();
    setStats(calculatedStats);

    if (loadedLogs.length > 0) {
      // Index 0 represents the newest entry
      const analysis = analyzeCheckIn(loadedLogs[0]);
      setLatestInsights(analysis);
    } else {
      setLatestInsights(null);
    }
  };

  const handleCheckInSubmit = (newEntry: Omit<CheckIn, 'id' | 'timestamp'>) => {
    const fullEntry: CheckIn = {
      ...newEntry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    saveCheckIn(fullEntry);
    refreshData();
  };

  const handleDataPurge = () => {
    clearAllData();
    refreshData();
  };

  return (
    <div className="app-container">
      {/* Keyboard Accessibility: Skip link to bypass header and nav */}
      <a href="#main-content" className="skip-link">Skip to Main Content</a>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content body with landmark container */}
      <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
        
        {/* Check-in Tab Panel */}
        {activeTab === 'checkin' && (
          <div 
            id="panel-checkin"
            role="tabpanel"
            aria-labelledby="tab-checkin"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}
          >
            <CheckInForm onCheckInSubmit={handleCheckInSubmit} />
            <WellnessResult insights={latestInsights} />
          </div>
        )}

        {/* Trends Tab Panel */}
        {activeTab === 'trends' && (
          <div 
            id="panel-trends"
            role="tabpanel"
            aria-labelledby="tab-trends"
          >
            <TrendDashboard checkIns={checkIns} stats={stats} />
          </div>
        )}

        {/* Chat Tab Panel */}
        {activeTab === 'chat' && (
          <div 
            id="panel-chat"
            role="tabpanel"
            aria-labelledby="tab-chat"
          >
            <ChatCompanion examType={checkIns.length > 0 ? checkIns[0].examType : 'NEET'} />
          </div>
        )}

        {/* Privacy Tab Panel */}
        {activeTab === 'privacy' && (
          <div 
            id="panel-privacy"
            role="tabpanel"
            aria-labelledby="tab-privacy"
          >
            <PrivacyControls onDataPurge={handleDataPurge} />
          </div>
        )}

      </main>

      <footer style={{ marginTop: 'var(--spacing-xxl)', padding: 'var(--spacing-md) 0', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)' }}>
        <p>© {new Date().getFullYear()} ExamEase AI. Dedicated to supporting student wellness during high-stakes exam prep.</p>
      </footer>
    </div>
  );
};
