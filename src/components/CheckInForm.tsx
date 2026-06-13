/**
 * CheckInForm.tsx
 * 
 * Form component for daily check-ins.
 * Captures target exam, exam date, mood, stress, sleep, study, and a journal reflection.
 * Fully validated on submit, displaying descriptive ARIA-enabled error messages.
 */

import React, { useState } from 'react';
import { CheckIn } from '../lib/types';
import { validateCheckIn, ValidationError } from '../lib/validation';

interface CheckInFormProps {
  onCheckInSubmit: (checkIn: Omit<CheckIn, 'id' | 'timestamp'>) => void;
}

export const CheckInForm: React.FC<CheckInFormProps> = ({ onCheckInSubmit }) => {
  // Local form state
  const [examType, setExamType] = useState<string>('NEET');
  const [examDate, setExamDate] = useState<string>('');
  const [mood, setMood] = useState<number>(5);
  const [stress, setStress] = useState<number>(5);
  const [sleepHours, setSleepHours] = useState<string>('7');
  const [studyHours, setStudyHours] = useState<string>('8');
  const [journalText, setJournalText] = useState<string>('');

  // Validation state
  const [errors, setErrors] = useState<ValidationError>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    // Parse input fields
    const parsedSleep = parseFloat(sleepHours);
    const parsedStudy = parseFloat(studyHours);

    const formData: Partial<CheckIn> = {
      examType,
      examDate: examDate || undefined,
      mood: Number(mood),
      stress: Number(stress),
      sleepHours: isNaN(parsedSleep) ? 0 : parsedSleep,
      studyHours: isNaN(parsedStudy) ? 0 : parsedStudy,
      journalText: journalText
    };

    // Run validation checks
    const validationErrors = validateCheckIn(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Accessibility: Scroll to first error for keyboard/screen reader users
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorKey);
      if (errorElement) {
        errorElement.focus();
      }
      return;
    }

    // Submit validated payload
    onCheckInSubmit({
      examType,
      examDate,
      mood: Number(mood),
      stress: Number(stress),
      sleepHours: Number(sleepHours),
      studyHours: Number(studyHours),
      journalText
    });

    // Reset journal reflection and set success toast
    setJournalText('');
    setSuccessMessage('Check-in submitted successfully! Your AI insights are ready.');
    
    // Auto-clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <section className="card" aria-labelledby="form-title" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <h2 id="form-title" style={{ marginBottom: 'var(--spacing-md)' }}>Daily Mood & Study Log</h2>
      
      {successMessage && (
        <div 
          className="alert alert-success" 
          role="alert" 
          aria-live="polite"
          style={{ marginBottom: 'var(--spacing-md)' }}
        >
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        
        {/* Exam Type Select */}
        <div>
          <label htmlFor="examType">Target Exam</label>
          <select
            id="examType"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            aria-describedby="examType-help"
          >
            <option value="NEET">NEET (Medical Entrance)</option>
            <option value="JEE">JEE (Engineering Entrance)</option>
            <option value="CUET">CUET (Undergraduate Admissions)</option>
            <option value="CAT">CAT (Management Admissions)</option>
            <option value="GATE">GATE (Engineering Graduate Test)</option>
            <option value="UPSC">UPSC (Civil Services)</option>
            <option value="Board Exams">Board Exams (10th/12th)</option>
            <option value="Other">Other Exams</option>
          </select>
          <p id="examType-help" style={{ fontSize: '0.8rem', marginTop: 'var(--spacing-xs)' }}>
            Select the specific target exam so our AI companion can tailor stress strategies.
          </p>
        </div>

        {/* Optional Exam Date Input */}
        <div>
          <label htmlFor="examDate">Exam Date (Optional)</label>
          <input
            type="date"
            id="examDate"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            aria-describedby="examDate-error"
          />
          {errors.examDate && (
            <p id="examDate-error" style={{ color: 'var(--color-risk-high)', fontSize: '0.85rem', marginTop: 'var(--spacing-xs)' }} role="alert">
              {errors.examDate}
            </p>
          )}
        </div>

        {/* Ratings Group (Mood and Stress) using fieldset for accessibility */}
        <fieldset>
          <legend>Scale Log (1 to 10)</legend>
          <p style={{ fontSize: '0.85rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
            Rates reflect how you felt today.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {/* Mood score */}
            <div>
              <label htmlFor="mood">Mood Rating (1: Very low, 10: Excellent): {mood}</label>
              <input
                type="range"
                id="mood"
                min="1"
                max="10"
                step="1"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
              />
              {errors.mood && (
                <p id="mood-error" style={{ color: 'var(--color-risk-high)', fontSize: '0.85rem' }} role="alert">
                  {errors.mood}
                </p>
              )}
            </div>

            {/* Stress score */}
            <div>
              <label htmlFor="stress">Stress Rating (1: Calm, 10: Extreme Pressure): {stress}</label>
              <input
                type="range"
                id="stress"
                min="1"
                max="10"
                step="1"
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-secondary)' }}
              />
              {errors.stress && (
                <p id="stress-error" style={{ color: 'var(--color-risk-high)', fontSize: '0.85rem' }} role="alert">
                  {errors.stress}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Hours Log (Sleep & Study) */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          {/* Sleep Hours */}
          <div style={{ flex: '1 1 200px' }}>
            <label htmlFor="sleepHours">Sleep Duration (Hours)</label>
            <input
              type="number"
              id="sleepHours"
              min="0"
              max="24"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              aria-describedby="sleepHours-error"
            />
            {errors.sleepHours && (
              <p id="sleepHours-error" style={{ color: 'var(--color-risk-high)', fontSize: '0.85rem', marginTop: 'var(--spacing-xs)' }} role="alert">
                {errors.sleepHours}
              </p>
            )}
          </div>

          {/* Study Hours */}
          <div style={{ flex: '1 1 200px' }}>
            <label htmlFor="studyHours">Study Duration (Hours)</label>
            <input
              type="number"
              id="studyHours"
              min="0"
              max="24"
              step="0.5"
              value={studyHours}
              onChange={(e) => setStudyHours(e.target.value)}
              aria-describedby="studyHours-error"
            />
            {errors.studyHours && (
              <p id="studyHours-error" style={{ color: 'var(--color-risk-high)', fontSize: '0.85rem', marginTop: 'var(--spacing-xs)' }} role="alert">
                {errors.studyHours}
              </p>
            )}
          </div>
        </div>

        {/* Journal Textarea */}
        <div>
          <label htmlFor="journalText">Daily Journal & Reflections</label>
          <textarea
            id="journalText"
            placeholder="How was your prep today? Any specific topic causing concern or thoughts on mock exams?"
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            aria-describedby="journalText-help journalText-error"
          />
          <p id="journalText-help" style={{ fontSize: '0.8rem', marginTop: 'var(--spacing-xs)' }}>
            Write openly. The AI uses this text to identify burnout flags and mock exam anxiety.
          </p>
          {errors.journalText && (
            <p id="journalText-error" style={{ color: 'var(--color-risk-high)', fontSize: '0.85rem', marginTop: 'var(--spacing-xs)' }} role="alert">
              {errors.journalText}
            </p>
          )}
        </div>

        {/* Submit Action */}
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 'var(--spacing-sm)' }}
        >
          Analyze & Generate Insights
        </button>

      </form>
    </section>
  );
};
