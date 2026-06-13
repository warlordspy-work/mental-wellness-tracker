/**
 * TrendDashboard.tsx
 * 
 * Displays aggregate metrics computed over historical check-ins
 * and lists past logs. Avoids bulky external chart dependencies,
 * prioritizing clean semantic grids and full screen reader compatibility.
 * 
 * Code Quality Updates: Added explicit React.ReactElement return type, avoided magic strings.
 */

import React, { useState } from 'react';
import { CheckIn, WellnessStats } from '../lib/types';
import { analyzeCheckIn } from '../lib/wellnessEngine';

interface TrendDashboardProps {
  checkIns: CheckIn[];
  stats: WellnessStats;
}

export const TrendDashboard: React.FC<TrendDashboardProps> = ({ checkIns, stats }): React.ReactElement => {
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  const toggleExpandEntry = (id: string): void => {
    setExpandedEntryId(prev => (prev === id ? null : id));
  };

  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'High': return 'var(--color-risk-high)';
      case 'Moderate': return 'var(--color-risk-moderate)';
      default: return 'var(--color-risk-low)';
    }
  };

  const getRiskBgColor = (level: string): string => {
    switch (level) {
      case 'High': return 'var(--color-risk-high-bg)';
      case 'Moderate': return 'var(--color-risk-moderate-bg)';
      default: return 'var(--color-risk-low-bg)';
    }
  };

  if (checkIns.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>No Logs Found</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          You haven't completed any check-ins yet. Head over to the **Daily Check-in** tab to log your first wellness profile.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      
      {/* Grid of Averages Card */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Aggregate Wellness Metrics</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)'
        }}>
          
          {/* Total Check-ins */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
              Total Logs
            </h3>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {stats.totalCheckIns}
            </span>
          </div>

          {/* Average Mood */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
              Avg Mood (1-10)
            </h3>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {stats.averageMood}
            </span>
          </div>

          {/* Average Stress */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
              Avg Stress (1-10)
            </h3>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
              {stats.averageStress}
            </span>
          </div>

          {/* Sleep & Study Averages */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--spacing-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Avg Sleep:</span>
              <strong style={{ fontSize: '0.95rem' }}>{stats.averageSleep} hrs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Avg Study:</span>
              <strong style={{ fontSize: '0.95rem' }}>{stats.averageStudy} hrs</strong>
            </div>
          </div>

        </div>
      </section>

      {/* Primary stress profile insights */}
      <section className="card" aria-labelledby="status-summary-heading">
        <h3 id="status-summary-heading" style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>
          Stress Profile Summary
        </h3>
        
        <div className="grid-2">
          <div>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
              Most Common Trigger
            </span>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: '2px' }}>
              {stats.mostCommonTrigger}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
              Latest Stress Risk
            </span>
            <span style={{
              display: 'inline-block',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: getRiskColor(stats.latestRiskLevel),
              backgroundColor: getRiskBgColor(stats.latestRiskLevel),
              padding: '2px 10px',
              borderRadius: '12px',
              marginLeft: '8px'
            }}>
              {stats.latestRiskLevel}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
            Latest Study Wellness Suggestion
          </span>
          <p style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.95rem', fontStyle: 'italic' }}>
            "{stats.latestRecommendation}"
          </p>
        </div>
      </section>

      {/* History Log List */}
      <section aria-labelledby="history-heading">
        <h3 id="history-heading" style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
          Check-in Log History ({checkIns.length} Entries)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {checkIns.map((entry) => {
            const entryAnalysis = analyzeCheckIn(entry);
            const isExpanded = expandedEntryId === entry.id;

            return (
              <article 
                key={entry.id} 
                className="card"
                style={{ padding: 'var(--spacing-md)', transition: 'background-color 0.2s' }}
              >
                {/* Header row of past check-in */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--spacing-sm)'
                }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
                      {entry.examType} Prep Log
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {new Date(entry.timestamp).toLocaleDateString(undefined, { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      Mood: <strong>{entry.mood}/10</strong> | Stress: <strong>{entry.stress}/10</strong>
                    </div>

                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: getRiskColor(entryAnalysis.riskLevel),
                      backgroundColor: getRiskBgColor(entryAnalysis.riskLevel),
                      padding: '2px 8px',
                      borderRadius: '8px'
                    }}>
                      {entryAnalysis.riskLevel} Risk
                    </span>

                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => toggleExpandEntry(entry.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`details-${entry.id}`}
                    >
                      {isExpanded ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                </div>

                {/* Collapsible Details section */}
                {isExpanded && (
                  <div 
                    id={`details-${entry.id}`}
                    style={{
                      marginTop: 'var(--spacing-md)',
                      paddingTop: 'var(--spacing-md)',
                      borderTop: '1px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', fontSize: '0.9rem' }}>
                      <div>
                        Sleep duration: <strong>{entry.sleepHours} hrs</strong>
                      </div>
                      <div>
                        Study duration: <strong>{entry.studyHours} hrs</strong>
                      </div>
                      {entry.examDate && (
                        <div>
                          Exam Date: <strong>{entry.examDate}</strong>
                        </div>
                      )}
                    </div>

                    <div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        Journal Narrative:
                      </h5>
                      <blockquote style={{
                        backgroundColor: '#f8faf9',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        borderLeft: '3px solid var(--color-border)',
                        marginTop: '4px',
                        color: 'var(--color-text)'
                      }}>
                        "{entry.journalText}"
                      </blockquote>
                    </div>

                    {entryAnalysis.detectedTriggers.length > 0 && (
                      <div>
                        <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                          Identified Triggers:
                        </h5>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {entryAnalysis.detectedTriggers.map((trig, idx) => (
                            <span 
                              key={idx} 
                              style={{
                                fontSize: '0.75rem',
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text-secondary)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)'
                              }}
                            >
                              {trig}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{
                      backgroundColor: 'var(--color-primary-light)',
                      padding: 'var(--spacing-md)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      color: 'var(--color-primary-hover)'
                    }}>
                      <strong>Coping Recommendation:</strong> {entryAnalysis.copingStrategy}
                    </div>

                  </div>
                )}

              </article>
            );
          })}
        </div>
      </section>

    </div>
  );
};
