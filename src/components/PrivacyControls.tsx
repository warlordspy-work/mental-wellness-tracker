/**
 * PrivacyControls.tsx
 * 
 * Provides features for student data ownership.
 * Implements JSON download utilities, local database purging,
 * and high-contrast alert boxes explaining local browser confinement.
 */

import React, { useState } from 'react';
import { exportCheckInsJSON } from '../lib/storage';

interface PrivacyControlsProps {
  onDataPurge: () => void;
}

export const PrivacyControls: React.FC<PrivacyControlsProps> = ({ onDataPurge }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = () => {
    try {
      const dataStr = exportCheckInsJSON();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `examease_wellness_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export check-ins:', err);
    }
  };

  const handlePurgeClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmPurge = () => {
    onDataPurge();
    setShowConfirm(false);
  };

  const handleCancelPurge = () => {
    setShowConfirm(false);
  };

  return (
    <section 
      className="card" 
      aria-labelledby="privacy-heading"
      style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
    >
      <h2 id="privacy-heading">Data Privacy & Controls</h2>

      {/* Privacy Notice Box */}
      <div 
        className="alert alert-success"
        style={{
          borderLeft: '4px solid var(--color-primary)',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary-hover)'
        }}
      >
        <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          🔒 Your Data Stays In This Browser
        </h3>
        <p style={{ fontSize: '0.9rem', marginTop: 'var(--spacing-xs)', color: 'var(--color-text)' }}>
          ExamEase AI strictly respects student confidentiality. We have no external backend databases, tracker scripts, or cookies. All check-in logs, mood logs, and companion chat histories are saved entirely on your device using local sandboxed storage. No information is ever transmitted to a cloud server.
        </p>
      </div>

      {/* Control panel options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>
            Backup Check-in Records
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            Export all check-in entries, metrics, and journal responses as a clean JSON file. You can save this file locally to retain your records.
          </p>
          <button 
            className="btn btn-secondary" 
            onClick={handleExport}
            aria-label="Export all wellness data to a JSON file"
            style={{ width: '100%' }}
          >
            Export JSON Data
          </button>
        </div>

        <hr style={{ border: 0, borderTop: '1px solid var(--color-border)' }} />

        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-risk-high)', marginBottom: 'var(--spacing-xs)' }}>
            Purge Storage
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            Permanently delete all historical logs, wellness statistics, and entries saved on this computer. <strong>This action is irreversible.</strong>
          </p>
          
          {!showConfirm ? (
            <button 
              className="btn btn-danger" 
              onClick={handlePurgeClick}
              aria-label="Request deletion of all stored wellness records"
              style={{ width: '100%' }}
            >
              Delete All Data
            </button>
          ) : (
            <div 
              className="alert alert-danger" 
              role="alert" 
              aria-live="assertive"
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', padding: 'var(--spacing-md)' }}
            >
              <p style={{ fontWeight: 600, color: 'var(--color-risk-high)', margin: 0 }}>
                Are you absolutely sure you want to delete all records? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button 
                  className="btn btn-danger" 
                  onClick={handleConfirmPurge}
                  style={{ flex: 1 }}
                  aria-label="Confirm permanent deletion of all records"
                >
                  Yes, Purge Everything
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleCancelPurge}
                  style={{ flex: 1, backgroundColor: 'white', color: 'var(--color-text)' }}
                  aria-label="Cancel deletion request"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
