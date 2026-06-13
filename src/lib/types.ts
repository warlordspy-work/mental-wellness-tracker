/**
 * types.ts
 * 
 * Defines standard data structures and type definitions for the
 * ExamEase AI Mental Wellness Tracker. This ensures strict type safety
 * across form data, wellness analysis, statistics, and chat interfaces.
 */

export interface CheckIn {
  id: string;
  timestamp: string; // ISO string representing the entry date
  examType: string;  // Target exam (e.g., NEET, JEE, UPSC, etc.)
  examDate: string;  // Date of the exam (optional, formatted as YYYY-MM-DD)
  mood: number;      // Value from 1 to 10
  stress: number;    // Value from 1 to 10
  sleepHours: number; // Daily sleep duration in hours
  studyHours: number; // Daily study duration in hours
  journalText: string; // Open-ended reflection text from the student
}

export interface WellnessInsights {
  riskLevel: 'Low' | 'Moderate' | 'High';
  detectedTriggers: string[];
  emotionalPattern: string;
  copingStrategy: string;
  mindfulnessExercise: string;
  motivationalEncouragement: string;
  studyWellnessRecommendation: string;
  hasCrisis: boolean; // Flag to indicate if safety triggers were hit
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string; // ISO string
  isCrisis?: boolean; // True if the message triggered a crisis warning
}

export interface WellnessStats {
  totalCheckIns: number;
  averageMood: number;
  averageStress: number;
  averageSleep: number;
  averageStudy: number;
  mostCommonTrigger: string;
  latestRiskLevel: 'Low' | 'Moderate' | 'High' | 'N/A';
  latestRecommendation: string;
}
