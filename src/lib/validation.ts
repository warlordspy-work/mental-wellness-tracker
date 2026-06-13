/**
 * validation.ts
 * 
 * Validates check-in inputs before submitting to the storage/wellness engine.
 * Ensures the student provides realistic mood, stress, sleep, study, and journal data.
 * 
 * Code Quality Updates: Uses explicit return types, imports bounds and limits from constants,
 * and sanitizes text inputs using sanitizer library.
 */

import { CheckIn } from './types';
import { RATING_BOUNDS, INPUT_LIMITS } from './constants';
import { sanitizeTextInput } from './sanitizer';

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
  } else if (typeof data.mood !== 'number' || data.mood < RATING_BOUNDS.MIN_MOOD || data.mood > RATING_BOUNDS.MAX_MOOD) {
    errors.mood = `Mood score must be a number between ${RATING_BOUNDS.MIN_MOOD} and ${RATING_BOUNDS.MAX_MOOD}.`;
  }

  // Stress Validation: must be between 1 and 10
  if (data.stress === undefined || data.stress === null) {
    errors.stress = 'Stress score is required.';
  } else if (typeof data.stress !== 'number' || data.stress < RATING_BOUNDS.MIN_STRESS || data.stress > RATING_BOUNDS.MAX_STRESS) {
    errors.stress = `Stress score must be a number between ${RATING_BOUNDS.MIN_STRESS} and ${RATING_BOUNDS.MAX_STRESS}.`;
  }

  // Sleep Hours Validation: realistic daily sleep (0 to 24 hours)
  if (data.sleepHours === undefined || data.sleepHours === null) {
    errors.sleepHours = 'Sleep hours are required.';
  } else if (typeof data.sleepHours !== 'number' || data.sleepHours < 0 || data.sleepHours > RATING_BOUNDS.MAX_SLEEP_HOURS) {
    errors.sleepHours = `Sleep hours must be a number between 0 and ${RATING_BOUNDS.MAX_SLEEP_HOURS}.`;
  } else if (data.sleepHours > RATING_BOUNDS.WARNING_SLEEP_HOURS) {
    errors.sleepHours = `Please enter a realistic sleep duration (under ${RATING_BOUNDS.WARNING_SLEEP_HOURS} hours).`;
  }

  // Study Hours Validation: realistic daily study (0 to 24 hours)
  if (data.studyHours === undefined || data.studyHours === null) {
    errors.studyHours = 'Study hours are required.';
  } else if (typeof data.studyHours !== 'number' || data.studyHours < 0 || data.studyHours > RATING_BOUNDS.MAX_STUDY_HOURS) {
    errors.studyHours = `Study hours must be a number between 0 and ${RATING_BOUNDS.MAX_STUDY_HOURS}.`;
  } else if (data.studyHours > RATING_BOUNDS.WARNING_STUDY_HOURS) {
    errors.studyHours = `Please enter a realistic study duration (under ${RATING_BOUNDS.WARNING_STUDY_HOURS} hours).`;
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

  // Sanitize journal text and check boundaries
  const sanitizedJournal = sanitizeTextInput(data.journalText, INPUT_LIMITS.JOURNAL_MAX_LENGTH);

  // Journal Text Validation: cannot be empty or only whitespace
  if (!sanitizedJournal) {
    errors.journalText = 'Journal entry cannot be empty. Please share how you are feeling.';
  } else if (sanitizedJournal.length < INPUT_LIMITS.MIN_JOURNAL_LENGTH) {
    errors.journalText = `Please write at least a few words (minimum ${INPUT_LIMITS.MIN_JOURNAL_LENGTH} characters) about your day.`;
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
