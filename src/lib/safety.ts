/**
 * safety.ts
 * 
 * Safety utility to scan user input for crisis/self-harm keywords.
 * If flagged, it returns supportive alerts and critical helplines,
 * ensuring ExamEase AI acts responsibly and never replaces professional mental health care.
 */

export interface SafetyCheckResult {
  isCrisis: boolean;
  message?: string;
  helplines?: Array<{
    name: string;
    contact: string;
    details: string;
  }>;
}

// Case-insensitive crisis keywords and phrases
const CRISIS_KEYWORDS = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'want to die',
  'self-harm',
  'self harm',
  'hurt myself',
  'cutting myself',
  'ending it all',
  'better off dead',
  'don\'t want to live',
  'dont want to live',
  'take my life',
  'overdose'
];

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
    return {
      isCrisis: true,
      message: `It sounds like you're going through an incredibly difficult time, but please know that you are not alone and there is support available right now. Your life is valuable, and there are people who want to listen and help you through this. Please reach out to a professional counselor, a trusted adult, or contact a dedicated helpline immediately. ExamEase AI is a supportive tracker and is not a replacement for professional crisis or emergency care.`,
      helplines: [
        {
          name: 'Vandrevala Foundation Helpline (India)',
          contact: '9999 666 555',
          details: 'Available 24/7, confidential mental health support and crisis counseling.'
        },
        {
          name: 'Kiran Mental Health Helpline (Govt of India)',
          contact: '1800-599-0019',
          details: '24/7 free and confidential mental health support.'
        },
        {
          name: 'AASRA Helpline (India)',
          contact: '91-9820466726',
          details: '24/7 suicide prevention and emotional support lifeline.'
        },
        {
          name: 'National Suicide Prevention Lifeline (US/Global)',
          contact: '988 / 1-800-273-8255',
          details: '24/7 free and confidential support for people in distress.'
        }
      ]
    };
  }

  return { isCrisis: false };
}
