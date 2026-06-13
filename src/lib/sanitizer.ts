/**
 * sanitizer.ts
 * 
 * Provides safe text normalization and sanitization helpers for student inputs.
 * Strips hidden control characters and caps string lengths to secure the application
 * against payload injection or memory overhead issues.
 */

/**
 * Normalizes, strips control characters, and truncates a string to a safe maximum length.
 * Preserves standard whitespace characters (spaces, tabs, newlines).
 * 
 * @param text The raw input string
 * @param maxLength The maximum allowed character count
 * @returns Clean, truncated string
 */
export function sanitizeTextInput(text: string | null | undefined, maxLength: number): string {
  if (text === null || text === undefined) {
    return '';
  }

  // 1. Remove binary control characters and non-printable elements
  // Retains space, tab (\x09), newline (\x0A), carriage return (\x0D)
  const cleanText = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

  // 2. Trim surrounding whitespace
  const trimmed = cleanText.trim();

  // 3. Cap string length safely
  if (trimmed.length > maxLength) {
    return trimmed.slice(0, maxLength);
  }

  return trimmed;
}
