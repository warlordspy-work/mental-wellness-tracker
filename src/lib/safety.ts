/**
 * safety.ts
 * 
 * Safety utility to scan user input for crisis/self-harm keywords.
 * If flagged, it returns supportive alerts and critical helplines,
 * ensuring ExamEase AI acts responsibly and never replaces professional mental health care.
 * 
 * Code Quality Updates: Uses explicit return types, imports keywords and helpline configurations
 * from constants, and avoids magic strings.
 */

import { CRISIS_KEYWORDS, CRISIS_RESPONSE } from './constants';

export interface SafetyCheckResult {
  isCrisis: boolean;
  message?: string;
  helplines?: Array<{
    name: string;
    contact: string;
    details: string;
  }>;
}

/**
 * Checks a text string for crisis or self-harm related keywords.
 * 
 * @param text The text to scan (e.g. journal entry or chat input)
 * @returns SafetyCheckResult indicating if a crisis was detected and providing resources
 */
export function scanForCrisis(text: string): SafetyCheckResult {
  if (!text) {
    return { isCrisis: false };
  }

  const cleanText = text.toLowerCase();
  
  // Check if any keyword matches
  const containsCrisisKeyword = CRISIS_KEYWORDS.some(keyword => cleanText.includes(keyword));

  if (containsCrisisKeyword) {
    return CRISIS_RESPONSE;
  }

  return { isCrisis: false };
}
