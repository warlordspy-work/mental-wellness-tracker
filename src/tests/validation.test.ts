/**
 * validation.test.ts
 * 
 * Tests boundary constraints for student check-in data.
 * Validates range limits on scores, sleep/study configurations,
 * journal lengths, and dates.
 */

import { describe, it, expect } from 'vitest';
import { validateCheckIn } from '../lib/validation';
import { CheckIn } from '../lib/types';

describe('validation - Form Validation Constraints', () => {

  const validData: Partial<CheckIn> = {
    examType: 'NEET',
    examDate: '2026-06-30',
    mood: 6,
    stress: 4,
    sleepHours: 8,
    studyHours: 8,
    journalText: 'Everything was fine today.'
  };

  it('should pass on complete, valid check-in inputs', () => {
    const errors = validateCheckIn(validData);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should enforce mood and stress limits (1 to 10)', () => {
    const invalidMood = { ...validData, mood: 12 };
    const errorsMood = validateCheckIn(invalidMood);
    expect(errorsMood.mood).toBeDefined();

    const invalidStress = { ...validData, stress: -1 };
    const errorsStress = validateCheckIn(invalidStress);
    expect(errorsStress.stress).toBeDefined();
  });

  it('should enforce realistic sleep and study hours bounds (0 to 24)', () => {
    const overStudy = { ...validData, studyHours: 25 };
    const errorsStudy = validateCheckIn(overStudy);
    expect(errorsStudy.studyHours).toBeDefined();
  });

  it('should fail if sleep + study hours sum exceeds 24 hours', () => {
    const impossibleHours = { ...validData, sleepHours: 12, studyHours: 14 }; // 26 hours total
    const errors = validateCheckIn(impossibleHours);
    expect(errors.sleepHours).toContain('cannot exceed 24 hours');
    expect(errors.studyHours).toContain('cannot exceed 24 hours');
  });

  it('should fail on empty or whitespace-only journal text', () => {
    const emptyText = { ...validData, journalText: '   ' };
    const errors = validateCheckIn(emptyText);
    expect(errors.journalText).toContain('cannot be empty');
  });

  it('should accept missing examDate as valid', () => {
    const noDate = { ...validData };
    delete noDate.examDate;
    const errors = validateCheckIn(noDate);
    expect(errors.examDate).toBeUndefined();
  });

  it('should fail on invalid exam date strings', () => {
    const badDate = { ...validData, examDate: 'not-a-date' };
    const errors = validateCheckIn(badDate);
    expect(errors.examDate).toContain('valid exam date');
  });

  it('should strip control characters and fail if remaining journal is too short', () => {
    const controlOnly = { ...validData, journalText: 'Hi\x00\x07' }; // Strips to "Hi" which is < 5 characters
    const errors = validateCheckIn(controlOnly);
    expect(errors.journalText).toContain('minimum 5 characters');
  });

});

