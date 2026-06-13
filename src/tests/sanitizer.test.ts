/**
 * sanitizer.test.ts
 * 
 * Tests text sanitization rules: control character purging,
 * whitespace trimming, and string truncations.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeTextInput } from '../lib/sanitizer';

describe('sanitizer - Input Sanitization', () => {

  it('should trim surrounding whitespace', () => {
    const raw = '   Need to study physics   ';
    const clean = sanitizeTextInput(raw, 50);
    expect(clean).toBe('Need to study physics');
  });

  it('should remove invisible control characters but keep standard printables', () => {
    // \x00 is binary null, \x07 is bell sound. \n (newline \x0A) should be preserved.
    const raw = 'Hello\x00World\x07!\nToday is mock test day.';
    const clean = sanitizeTextInput(raw, 100);
    expect(clean).toBe('HelloWorld!\nToday is mock test day.');
  });

  it('should truncate strings exceeding the maximum allowed length', () => {
    const raw = 'This is a very long journal entry that goes past the allowed cap.';
    // Cap at 15 characters
    const clean = sanitizeTextInput(raw, 15);
    expect(clean).toHaveLength(15);
    expect(clean).toBe('This is a very ');
  });

  it('should return empty string when null or undefined is passed', () => {
    expect(sanitizeTextInput(null, 10)).toBe('');
    expect(sanitizeTextInput(undefined, 10)).toBe('');
  });

});
