/**
 * validation.ts
 * 
 * Validates check-in inputs before submitting to the storage/wellness engine.
 * Ensures the student provides realistic mood, stress, sleep, study, and journal data.
 */

import { CheckIn } from './types';

export interface ValidationError {
  mood?: string;
  stress?: string;
  sleepHours?: string;
  studyHours?: string;
  journalText?: string;
  examDate?: string;
}

/**
 * Validates a CheckIn input object.
 * Returns an object with error messages for each invalid field.
 * If all fields are valid, the returned object is empty.
 * 
 * @param data Partial check-in data to validate
 * @returns ValidationError object containing validation error messages
 */
export function validateCheckIn(data: Partial<CheckIn>): ValidationError {
  const errors: ValidationError = {};

  // Mood Validation: must be between 1 and 10
  if (data.mood === undefined || data.mood === null) {
    errors.mood = 'Mood score is required.';
  } else if (typeof data.mood !== 'number' || data.mood < 1 || data.mood > 10) {
    errors.mood = 'Mood score must be a number between 1 and 10.';
  }

  // Stress Validation: must be between 1 and 10
  if (data.stress === undefined || data.stress === null) {
    errors.stress = 'Stress score is required.';
  } else if (typeof data.stress !== 'number' || data.stress < 1 || data.stress > 10) {
    errors.stress = 'Stress score must be a number between 1 and 10.';
  }

  // Sleep Hours Validation: realistic daily sleep (0 to 24 hours)
  if (data.sleepHours === undefined || data.sleepHours === null) {
    errors.sleepHours = 'Sleep hours are required.';
  } else if (typeof data.sleepHours !== 'number' || data.sleepHours < 0 || data.sleepHours > 24) {
    errors.sleepHours = 'Sleep hours must be a number between 0 and 24.';
  } else if (data.sleepHours > 16) {
    // Soft validation/warning or upper bound
    errors.sleepHours = 'Please enter a realistic sleep duration (under 16 hours).';
  }

  // Study Hours Validation: realistic daily study (0 to 24 hours)
  if (data.studyHours === undefined || data.studyHours === null) {
    errors.studyHours = 'Study hours are required.';
  } else if (typeof data.studyHours !== 'number' || data.studyHours < 0 || data.studyHours > 24) {
    errors.studyHours = 'Study hours must be a number between 0 and 24.';
  } else if (data.studyHours > 20) {
    errors.studyHours = 'Please enter a realistic study duration (under 20 hours).';
  }

  // Joint Validation: Sleep + Study cannot exceed 24 hours
  if (
    data.sleepHours !== undefined &&
    data.studyHours !== undefined &&
    typeof data.sleepHours === 'number' &&
    typeof data.studyHours === 'number' &&
    data.sleepHours + data.studyHours > 24
  ) {
    const sumError = 'The sum of sleep and study hours cannot exceed 24 hours.';
    errors.sleepHours = errors.sleepHours || sumError;
    errors.studyHours = errors.studyHours || sumError;
  }

  // Journal Text Validation: cannot be empty or only whitespace
  if (!data.journalText || !data.journalText.trim()) {
    errors.journalText = 'Journal entry cannot be empty. Please share how you are feeling.';
  } else if (data.journalText.trim().length < 5) {
    errors.journalText = 'Please write at least a few words (minimum 5 characters) about your day.';
  }

  // Exam Date Validation: optional, but if provided, check if it's a valid date structure
  if (data.examDate) {
    const timestamp = Date.parse(data.examDate);
    if (isNaN(timestamp)) {
      errors.examDate = 'Please enter a valid exam date.';
    }
  }

  return errors;
}
